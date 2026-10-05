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
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearCart } from '../../features/cart/cartSlice'

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector((state) => state.cart.items)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pickupMode, setPickupMode] = useState<'takeaway' | 'onsite'>('takeaway')

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const delivery = items.length === 0 ? 0 : 2.5
  const total = subtotal + delivery

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (items.length === 0) {
      return
    }

    const orderNumber = `YT-${Date.now().toString().slice(-6)}`

    const order = {
      order_number: orderNumber,
      restaurant_id: items[0].product.restaurant_id,
      created_at: new Date().toISOString(),
      items: items.map((line) => ({
        product_id: line.product.id,
        quantity: line.quantity,
      })),
      total_price: total,
      status: 'pending',
      pickup_mode: pickupMode,
      customer: {
        name,
        email,
      },
    }

    localStorage.setItem('ytasty_last_order', JSON.stringify(order))
    dispatch(clearCart())
    navigate(`/confirmation/${orderNumber}`)
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

              <Button type="submit" variant="contained" size="large">
                Valider la commande
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