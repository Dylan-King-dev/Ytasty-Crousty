import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { CartItem } from '../../components/cart/CartItem'
import { CartSummary } from '../../components/cart/CartSummary'

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items)

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Panier
        </Typography>

        <Stack spacing={2}>
          <Typography>Votre panier est vide pour le moment.</Typography>
          <Button component={Link} to="/menu" variant="contained">
            Voir le menu
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panier
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Stack>
          {items.map((line) => (
            <CartItem key={line.product.id} line={line} />
          ))}
        </Stack>

        <CartSummary />
      </Box>
    </Box>
  )
}