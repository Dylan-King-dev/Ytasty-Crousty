import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../api/orders.api'
import type { Order, OrderStatus } from '../../types/api'

const statuses: OrderStatus[] = [
  'pending',
  'validated',
  'preparing',
  'ready',
  'collected',
  'cancelled',
]

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

  const currentIndex = statuses.indexOf(order.status)

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

          <Stack spacing={1}>
            {statuses.map((status, index) => {
              const active = status === order.status
              const passed = index <= currentIndex

              return (
                <Box
                  key={status}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: active ? '#f5b700' : passed ? '#dff5c4' : '#f2f2f2',
                    color: '#000',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {status}
                </Box>
              )
            })}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}