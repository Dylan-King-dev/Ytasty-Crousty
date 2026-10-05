import { Button, Stack, Typography } from '@mui/material'
import { useAppDispatch } from '../../app/hooks'
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from '../../features/cart/cartSlice'
import type { CartLine } from '../../features/cart/cartTypes'

interface CartItemProps {
  line: CartLine
}

export function CartItem({ line }: CartItemProps) {
  const dispatch = useAppDispatch()
  const { product, quantity } = line
  const lineTotal = product.price * quantity

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ py: 2, borderBottom: '1px solid #ddd' }}
    >
      <Stack sx={{ flexGrow: 1 }}>
        <Typography fontWeight="bold">{product.name}</Typography>
        <Typography>
          {lineTotal.toFixed(2)} €
        </Typography>
      </Stack>

      <Button
        aria-label={`Diminuer ${product.name}`}
        onClick={() => dispatch(decreaseQuantity(product.id))}
      >
        -
      </Button>

      <Typography>{quantity}</Typography>

      <Button
        aria-label={`Augmenter ${product.name}`}
        onClick={() => dispatch(increaseQuantity(product.id))}
      >
        +
      </Button>

      <Button
        color="error"
        onClick={() => dispatch(removeItem(product.id))}
      >
        Supprimer
      </Button>
    </Stack>
  )
}