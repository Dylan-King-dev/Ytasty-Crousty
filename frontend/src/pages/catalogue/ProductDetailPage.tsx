import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { addItem } from '../../features/cart/cartSlice'
import type { Product } from '../../types/api'

const products: Product[] = [
  {
    id: 1,
    name: 'Burger classique',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Burger avec fromage, salade et sauce maison.',
    category: 'burger',
    price: 12.5,
    is_available: true,
    restaurant_id: 1,
    ingredients: ['pain', 'steak', 'fromage', 'salade'],
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Pizza tomate, mozzarella et basilic.',
    category: 'pizza',
    price: 14.0,
    is_available: true,
    restaurant_id: 1,
    ingredients: ['tomate', 'mozzarella', 'basilic'],
  },
  {
    id: 3,
    name: 'Wrap poulet',
    image:
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    description: 'Wrap léger avec poulet, légumes et sauce.',
    category: 'wrap',
    price: 10.5,
    is_available: true,
    restaurant_id: 1,
    ingredients: ['poulet', 'salad', 'wrap'],
  },
  {
    id: 4,
    name: 'Frites maison',
    image:
      'https://images.unsplash.com/photo-1576106678348-9c0d5b41f2c1?auto=format&fit=crop&w=800&q=80',
    description: 'Frites croustillantes servies chaudes.',
    category: 'accompagnement',
    price: 4.5,
    is_available: true,
    restaurant_id: 1,
    ingredients: ['pommes de terre', 'sel'],
  },
]

export function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Produit introuvable</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        alignItems="center"
      >
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: { xs: '100%', md: 420 },
            height: 320,
            objectFit: 'cover',
            borderRadius: 2,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h6" sx={{ mb: 2 }}>
            {product.price.toFixed(2)} €
          </Typography>

          <Typography sx={{ mb: 2 }}>{product.description}</Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
            {product.ingredients.map((ingredient) => (
              <Chip key={ingredient} label={ingredient} />
            ))}
          </Stack>

          <Button
            variant="contained"
            size="large"
            onClick={() => dispatch(addItem(product))}
          >
            Ajouter au panier
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}