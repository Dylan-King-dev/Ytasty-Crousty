import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../api/orders.api'
import { getRestaurant } from '../../api/restaurants.api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearCart } from '../../features/cart/cartSlice'

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector((state) => state.cart.items)
  const restaurantId = items[0]?.product.restaurant_id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pickupMode, setPickupMode] = useState<'takeaway' | 'onsite'>('takeaway')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [restaurantOpen, setRestaurantOpen] = useState<boolean | null>(null)

  useEffect(() => {
    if (!restaurantId) {
      setRestaurantOpen(null)
      return
    }

    getRestaurant(restaurantId)
      .then((response) => setRestaurantOpen(response.data.is_open))
      .catch(() => setRestaurantOpen(false))
  }, [restaurantId])

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const total = subtotal

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (items.length === 0) {
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Merci de remplir le nom et l’email.')
      return
    }

    if (!restaurantOpen) {
      setError('Ce restaurant est fermé. La commande est désactivée.')
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
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              {restaurantOpen === false && (
                <Alert severity="warning">Le restaurant est fermé. La commande est indisponible.</Alert>
              )}

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

              <FormControl>
                <Typography component="legend">Mode de retrait</Typography>
                <RadioGroup
                  value={pickupMode}
                  onChange={(event) => setPickupMode(event.target.value as 'takeaway' | 'onsite')}
                >
                  <FormControlLabel value="takeaway" control={<Radio />} label="À emporter" />
                  <FormControlLabel value="onsite" control={<Radio />} label="Sur place" />
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting || restaurantOpen !== true}
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
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">{total.toFixed(2)} €</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}