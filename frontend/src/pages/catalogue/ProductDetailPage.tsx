import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../../api/products.api'
import { getRestaurant } from '../../api/restaurants.api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addItem } from '../../features/cart/cartSlice'
import type { Product } from '../../types/api'

export function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const selectedRestaurantId = useAppSelector((state) => state.restaurant.selectedId)

  const [product, setProduct] = useState<Product | null>(null)
  const [restaurantOpen, setRestaurantOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const productId = Number(id)

    if (!id || Number.isNaN(productId)) {
      setError('Produit introuvable.')
      setLoading(false)
      return
    }

    getProduct(productId)
      .then(async (response) => {
        setProduct(response.data)
        const restaurantResponse = await getRestaurant(response.data.restaurant_id)
        setRestaurantOpen(restaurantResponse.data.is_open)
      })
      .catch(() => {
        setError('Impossible de charger ce produit.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">{error ?? 'Produit introuvable'}</Typography>
      </Box>
    )
  }

  const canOrder = product.is_available
    && restaurantOpen
    && product.restaurant_id === selectedRestaurantId

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

          {!product.is_available && (
            <Chip label="Indisponible" color="error" sx={{ mb: 2 }} />
          )}
          {!restaurantOpen && (
            <Chip label="Restaurant fermé" color="error" sx={{ mb: 2 }} />
          )}
          {product.restaurant_id !== selectedRestaurantId && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Ce produit appartient à un autre restaurant. Change le restaurant sélectionné avant de l’ajouter.
            </Alert>
          )}

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
            disabled={!canOrder}
          >
            {canOrder ? 'Ajouter au panier' : 'Commande indisponible'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}