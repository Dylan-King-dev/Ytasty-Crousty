import { Button, Divider, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

export function CartSummary() {
  const items = useAppSelector((state) => state.cart.items)

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const quantity = items.reduce((total, item) => total + item.quantity, 0)
  const delivery = items.length === 0 ? 0 : 2.5
  const total = subtotal + delivery

  return (
    <Stack
      spacing={2}
      sx={{
        p: 3,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Résumé
      </Typography>

      <Stack direction="row" justifyContent="space-between">
        <Typography>Articles</Typography>
        <Typography>{quantity}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography>Sous-total</Typography>
        <Typography>{subtotal.toFixed(2)} €</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography>Livraison</Typography>
        <Typography>
          {delivery === 0 ? 'Gratuit' : `${delivery.toFixed(2)} €`}
        </Typography>
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight="bold">
          Total
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {total.toFixed(2)} €
        </Typography>
      </Stack>

      <Button
        component={RouterLink}
        to="/commande"
        variant="contained"
        disabled={items.length === 0}
        sx={{ mt: 1 }}
      >
        Commander
      </Button>
    </Stack>
  )
}