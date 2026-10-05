import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useAppSelector((state) => state.cart.items)

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: 320, sm: 360 },
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Mon panier
          </Typography>

          <Button onClick={onClose}>Fermer</Button>
        </Stack>

        <Divider />

        {items.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <Typography>Votre panier est vide.</Typography>
          </Box>
        ) : (
          <Stack sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
            {items.map((line) => (
              <CartItem key={line.product.id} line={line} />
            ))}
          </Stack>
        )}

        <Box sx={{ mt: 2 }}>
          <CartSummary />
        </Box>
      </Box>
    </Drawer>
  )
}