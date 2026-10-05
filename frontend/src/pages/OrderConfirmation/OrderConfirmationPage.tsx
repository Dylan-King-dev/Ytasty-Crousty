import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrder } from '../../api/orders.api'
import type { Order } from '../../types/api'

export function OrderConfirmationPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderNumber) {
        const raw = localStorage.getItem('ytasty_last_order')

        if (!raw) {
          setOrder(null)
          return
        }

        setOrder(JSON.parse(raw) as Order)
        return
      }

      try {
        const response = await getOrder(orderNumber)
        const fetchedOrder = response.data

        localStorage.setItem('ytasty_last_order', JSON.stringify(fetchedOrder))
        setOrder(fetchedOrder)
      } catch {
        const raw = localStorage.getItem('ytasty_last_order')

        if (!raw) {
          setOrder(null)
          return
        }

        const fallbackOrder = JSON.parse(raw) as Order

        if (fallbackOrder.order_number === orderNumber) {
          setOrder(fallbackOrder)
        } else {
          setOrder(null)
        }
      }
    }

    loadOrder()
  }, [orderNumber])

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Confirmation de commande
        </Typography>

        <Typography>Aucune commande trouvée.</Typography>

        <Button component={Link} to="/menu" variant="contained" sx={{ mt: 2 }}>
          Voir le menu
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Commande confirmée
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Stack spacing={2}>
          <Typography>
            <strong>Numéro :</strong> {order.order_number}
          </Typography>

          <Typography>
            <strong>Statut :</strong> {order.status}
          </Typography>

          <Typography>
            <strong>Mode :</strong>{' '}
            {order.pickup_mode === 'onsite' ? 'Sur place' : 'À emporter'}
          </Typography>

          <Typography>
            <strong>Client :</strong> {order.customer.name}
          </Typography>

          <Typography>
            <strong>Montant :</strong> {order.total_price.toFixed(2)} €
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button component={Link} to={`/suivi/${order.order_number}`} variant="contained">
              Suivre ma commande
            </Button>

            <Button component={Link} to="/menu" variant="outlined">
              Retour au menu
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}