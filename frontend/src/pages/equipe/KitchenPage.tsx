import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { io } from 'socket.io-client'
import { apiBaseUrl } from '../../api/client'
import { cancelOrder, getRestaurantOrders, updateOrderStatus } from '../../api/orders.api'
import { useAppSelector } from '../../app/hooks'
import type { Order, OrderStatus } from '../../types/api'

const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  validated: 'Acceptée',
  preparing: 'En préparation',
  ready: 'Prête',
  collected: 'Récupérée',
  cancelled: 'Annulée',
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'validated',
  validated: 'preparing',
  preparing: 'ready',
  ready: 'collected',
}

const nextStatusLabels: Partial<Record<OrderStatus, string>> = {
  pending: 'Accepter',
  validated: 'Commencer la préparation',
  preparing: 'Marquer comme prête',
  ready: 'Marquer comme récupérée',
}

export function KitchenPage() {
  const restaurantId = useAppSelector((state) => state.restaurant.selectedId)
  const token = useAppSelector((state) => state.auth.token)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingOrder, setUpdatingOrder] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const [statusFilter, setStatusFilter] = useState('active')
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true

    if (!token) {
      setOrders([])
      setError('Connecte-toi pour consulter les commandes.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    getRestaurantOrders(restaurantId, token)
        .then((response) => {
          if (active) {
            setOrders(response.data)
          }
        })
        .catch(() => {
          if (active) {
            setOrders([])
            setError('Impossible de charger les commandes. Vérifie le restaurant et tes droits.')
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false)
          }
        })

    return () => {
      active = false
    }
  }, [restaurantId, token, refresh])

  const orderNumbers = orders.map((order) => order.order_number).join(',')
  const visibleOrders = orders.filter((order) => {
    if (statusFilter === 'active') {
      return ['pending', 'validated', 'preparing', 'ready'].includes(order.status)
    }
    return statusFilter === 'all' || order.status === statusFilter
  })

  useEffect(() => {
    if (!token || !orderNumbers) {
      return
    }

    const socket = io(apiBaseUrl)
    const numbers = orderNumbers.split(',')

    socket.on('connect', () => {
      setRealtimeConnected(true)
      numbers.forEach((orderNumber) => {
        socket.emit('order:join', { order_number: orderNumber })
      })
    })

    socket.on('disconnect', () => setRealtimeConnected(false))
    socket.on(
        'order:status',
        (update: { order_number: string; status: OrderStatus }) => {
          setOrders((currentOrders) =>
              currentOrders.map((order) =>
                  order.order_number === update.order_number
                      ? { ...order, status: update.status }
                      : order,
              ),
          )
        },
    )

    return () => {
      numbers.forEach((orderNumber) => {
        socket.emit('order:leave', { order_number: orderNumber })
      })
      socket.disconnect()
    }
  }, [orderNumbers, token])

  const changeStatus = async (order: Order, status: OrderStatus) => {
    if (!token) {
      return
    }

    setUpdatingOrder(order.order_number)
    setError('')

    try {
      const response = status === 'cancelled'
          ? await cancelOrder(order.order_number, token)
          : await updateOrderStatus(order.order_number, status, token)
      setOrders((currentOrders) =>
          currentOrders.map((currentOrder) =>
              currentOrder.order_number === order.order_number
                  ? response.data
                  : currentOrder,
          ),
      )
    } catch {
      setError('Le statut n’a pas pu être modifié. Vérifie tes droits.')
    } finally {
      setUpdatingOrder('')
    }
  }

  return (
      <Box sx={{ p: 4 }}>
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 3 }}
        >
          <Typography variant="h4">Cuisine</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
                size="small"
                label={realtimeConnected ? 'Temps réel connecté' : 'Temps réel déconnecté'}
                color={realtimeConnected ? 'success' : 'default'}
            />
            <Button variant="outlined" onClick={() => setRefresh((value) => value + 1)}>
              Actualiser
            </Button>
          </Stack>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FormControl size="small" sx={{ mb: 2, minWidth: 220 }}>
          <InputLabel id="order-status-filter">Filtrer les commandes</InputLabel>
          <Select
              labelId="order-status-filter"
              value={statusFilter}
              label="Filtrer les commandes"
              onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="active">Commandes en cours</MenuItem>
            <MenuItem value="all">Toutes les commandes</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="preparing">En préparation</MenuItem>
            <MenuItem value="ready">Prêtes</MenuItem>
            <MenuItem value="collected">Récupérées</MenuItem>
            <MenuItem value="cancelled">Annulées</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
            <CircularProgress />
        ) : visibleOrders.length === 0 ? (
            <Alert severity="info">Aucune commande pour ce restaurant.</Alert>
        ) : (
            <Stack spacing={2}>
              {visibleOrders.map((order) => {
                const followingStatus = nextStatus[order.status]
                const isUpdating = updatingOrder === order.order_number
                const waitingMinutes = Math.floor(
                    // created_at est en UTC sans "Z" : on l'ajoute pour que le navigateur ne le lise pas en heure locale
                    (currentTime - new Date(order.created_at + 'Z').getTime()) / 60000,
                )

                return (
                    <Paper key={order.order_number} sx={{ p: 3 }}>
                      <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          spacing={2}
                      >
                        <Box>
                          <Typography variant="h6">{order.order_number}</Typography>
                          <Typography>Client : {order.customer.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.items.map((item) => `${item.product_name ?? `#${item.product_id}`} × ${item.quantity}`).join(', ')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total : {order.total_price.toFixed(2)} €
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Chip
                              label={statusLabels[order.status]}
                              color={
                                order.status === 'ready' || order.status === 'collected'
                                    ? 'success'
                                    : order.status === 'preparing'
                                        ? 'warning'
                                        : order.status === 'cancelled'
                                            ? 'error'
                                            : 'default'
                              }
                          />
                          {followingStatus && (
                              <Button
                                  variant="contained"
                                  disabled={isUpdating}
                                  onClick={() => changeStatus(order, followingStatus)}
                              >
                                {nextStatusLabels[order.status]}
                              </Button>
                          )}
                          {['pending', 'validated'].includes(order.status) && (
                              <Button
                                  color="error"
                                  disabled={isUpdating}
                                  onClick={() => changeStatus(order, 'cancelled')}
                              >
                                Annuler
                              </Button>
                          )}
                        </Stack>
                      </Stack>
                      {order.status === 'pending' && waitingMinutes >= 10 && (
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            Cette commande attend depuis {waitingMinutes} minutes.
                          </Alert>
                      )}
                    </Paper>
                )
              })}
            </Stack>
        )}
      </Box>
  )
}