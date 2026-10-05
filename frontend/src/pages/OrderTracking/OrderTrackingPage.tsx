import {
  Box,
  Button,
  Paper,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../api/orders.api'
import { apiBaseUrl } from '../../api/client'
import type { Order, OrderStatus } from '../../types/api'
import { io } from 'socket.io-client'
import { OrderStepper } from '../../components/orders/OrderStepper'

export function OrderTrackingPage() {
  const { orderNumber } = useParams()
  const navigate = useNavigate()

  const [search, setSearch] = useState(orderNumber ?? '')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  const loadOrder = async (value: string) => {
    const normalized = value.trim()

    if (!normalized) {
      setOrder(null)
      setError('Saisis un numéro de commande.')
      return
    }

    try {
      const response = await getOrder(normalized)
      const fetchedOrder = response.data

      setOrder(fetchedOrder)
      setError('')
      localStorage.setItem('ytasty_last_order', JSON.stringify(fetchedOrder))
      setSearch(normalized)
      navigate(`/suivi/${normalized}`, { replace: true })
    } catch {
      const raw = localStorage.getItem('ytasty_last_order')

      if (!raw) {
        setOrder(null)
        setError('Commande introuvable.')
        return
      }

      const fallbackOrder = JSON.parse(raw) as Order

      if (fallbackOrder.order_number === normalized) {
        setOrder(fallbackOrder)
        setError('')
        setSearch(normalized)
        navigate(`/suivi/${normalized}`, { replace: true })
        return
      }

      setOrder(null)
      setError('Commande introuvable.')
    }
  }

  useEffect(() => {
    if (!orderNumber) {
      const raw = localStorage.getItem('ytasty_last_order')

      if (!raw) {
        setOrder(null)
        return
      }

      const savedOrder = JSON.parse(raw) as Order
      setOrder(savedOrder)
      setSearch(savedOrder.order_number)
      return
    }

    loadOrder(orderNumber)
  }, [orderNumber])

  useEffect(() => {
    if (!order?.order_number) {
      return
    }

    const socket = io(apiBaseUrl)
    const currentOrderNumber = order.order_number

    socket.on('connect', () => {
      socket.emit('order:join', { order_number: currentOrderNumber })
    })

    socket.on(
      'order:status',
      (update: { order_number: string; status: OrderStatus }) => {
        if (update.order_number !== currentOrderNumber) {
          return
        }

        setOrder((currentOrder) =>
          currentOrder
            ? { ...currentOrder, status: update.status }
            : currentOrder,
        )
      },
    )

    return () => {
      socket.emit('order:leave', { order_number: currentOrderNumber })
      socket.disconnect()
    }
  }, [order?.order_number])

  useEffect(() => {
    if (order) {
      localStorage.setItem('ytasty_last_order', JSON.stringify(order))
    }
  }, [order])

  const handleSearch = async () => {
    await loadOrder(search)
  }

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Suivi de commande
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Numéro de commande"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <Button variant="contained" onClick={handleSearch}>
            Rechercher
          </Button>
        </Stack>

        {error && <Typography color="error">{error}</Typography>}

        {!error && <Typography>Aucune commande trouvée.</Typography>}
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Suivi de commande
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Numéro de commande"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleSearch}>
          Rechercher
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography>
            <strong>Commande :</strong> {order.order_number}
          </Typography>

          <Typography>
            <strong>Client :</strong> {order.customer.name}
          </Typography>

          <Typography>
            <strong>Mode :</strong>{' '}
            {order.pickup_mode === 'onsite' ? 'Sur place' : 'À emporter'}
          </Typography>

          <Typography>
            <strong>Statut actuel :</strong> {order.status}
          </Typography>

          <OrderStepper status={order.status} />
          <Divider />
          <Typography variant="h6">Récapitulatif</Typography>
          {order.items.map((item) => (
            <Typography key={item.product_id}>
              {item.product_name ?? `Produit #${item.product_id}`} × {item.quantity}
            </Typography>
          ))}
          <Typography><strong>Total :</strong> {order.total_price.toFixed(2)} €</Typography>
        </Stack>
      </Paper>
    </Box>
  )
}