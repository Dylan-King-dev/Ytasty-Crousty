import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../api/orders.api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearCart } from '../../features/cart/cartSlice'

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector((state) => state.cart.items)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pickupMode, setPickupMode] = useState<'takeaway' | 'onsite'>('takeaway')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const delivery = items.length === 0 ? 0 : 2.5
  const total = subtotal + delivery

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (items.length === 0) {
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Merci de remplir le nom et l’email.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await createOrder({
        restaurant_id: items[0].product.restaurant_id,
        items: items.map((line) => ({
          product_id: line.product.id,
          quantity: line.quantity,
        })),
        pickup_mode: pickupMode,
        customer: {
          name: name.trim(),
          email: email.trim(),
        },
      })

      const createdOrder = response.data

      localStorage.setItem('ytasty_last_order', JSON.stringify(createdOrder))
      dispatch(clearCart())
      navigate(`/confirmation/${createdOrder.order_number}`)
    } catch {
      setError(
        'Impossible de créer la commande. Vérifie que le restaurant est ouvert et que tous les produits sont disponibles.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Finaliser la commande
        </Typography>

        <Alert severity="info">
          Votre panier est vide. Ajoutez des produits avant de commander.
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finaliser la commande
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ mt: 3 }}
      >
        <Paper sx={{ flex: 2, p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id="pickup-mode-label">Mode de retrait</InputLabel>
                <Select
                  labelId="pickup-mode-label"
                  value={pickupMode}
                  label="Mode de retrait"
                  onChange={(e) =>
                    setPickupMode(e.target.value as 'takeaway' | 'onsite')
                  }
                >
                  <MenuItem value="takeaway">À emporter</MenuItem>
                  <MenuItem value="onsite">Sur place</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Validation...' : 'Valider la commande'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Résumé
          </Typography>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Sous-total</Typography>
              <Typography>{subtotal.toFixed(2)} €</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography>Livraison</Typography>
              <Typography>{delivery.toFixed(2)} €</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">{total.toFixed(2)} €</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}