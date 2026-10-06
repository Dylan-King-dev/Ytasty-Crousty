import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addItem } from '../../features/cart/cartSlice'
import { getProducts } from '../../api/products.api'
import { getRestaurants } from '../../api/restaurants.api'
import type { Product, Restaurant } from '../../types/api'

export function ProductListPage() {
  const dispatch = useAppDispatch()
  const selectedRestaurantId = useAppSelector((state) => state.restaurant.selectedId)

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  useEffect(() => {
    getRestaurants()
      .then((response) => setRestaurants(response.data))
      .catch(() => setRestaurants([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    setProducts([])

    getProducts({ restaurant_id: selectedRestaurantId })
      .then((response) => setProducts(response.data))
      .catch(() => {
        setProducts([])
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [selectedRestaurantId])

  useEffect(() => {
    let active = true
    const timeout = window.setTimeout(() => {
      setLoading(true)
      setError(false)

      getProducts({
        restaurant_id: selectedRestaurantId,
        q: search.trim() || undefined,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        is_available: showAvailableOnly ? true : undefined,
      })
        .then((response) => {
          if (active) {
            setVisibleProducts(response.data)
          }
        })
        .catch(() => {
          if (active) {
            setVisibleProducts([])
            setError(true)
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false)
          }
        })
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [selectedRestaurantId, search, selectedCategory, showAvailableOnly])

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId,
  )

  const categories = useMemo(
    () => ['all', ...new Set(products.map((product) => product.category))],
    [products],
  )

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Menu{selectedRestaurant ? ` - ${selectedRestaurant.name}` : ''}
      </Typography>

      {selectedRestaurant && !selectedRestaurant.is_open && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Ce restaurant est fermé. La commande est actuellement désactivée.
        </Alert>
      )}

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Rechercher un produit"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {categories.map((category) => (
            <Chip
              key={category}
              label={
                category === 'all'
                  ? 'Tous'
                  : category.charAt(0).toUpperCase() + category.slice(1)
              }
              color={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(category)}
              clickable
            />
          ))}
        </Stack>

        <Button
          variant={showAvailableOnly ? 'contained' : 'outlined'}
          onClick={() => setShowAvailableOnly((value) => !value)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {showAvailableOnly ? 'Afficher tous' : 'Produits disponibles'}
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">Impossible de charger les produits.</Alert>
      ) : visibleProducts.length === 0 ? (
        <Typography>Aucun produit ne correspond à votre recherche.</Typography>
      ) : (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          useFlexGap
          flexWrap="wrap"
        >
          {visibleProducts.map((product) => {
            const isDisabled =
              !selectedRestaurant?.is_open || !product.is_available

            return (
              <Card
                key={product.id}
                sx={{
                  width: { xs: '100%', sm: 260 },
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>

                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      <Chip label={product.category} color="primary" size="small" />
                      <Chip
                        label={product.is_available ? 'Disponible' : 'Indisponible'}
                        color={product.is_available ? 'success' : 'error'}
                        size="small"
                      />
                    </Stack>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>

                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {product.ingredients.map((ingredient) => (
                      <Chip key={ingredient} label={ingredient} size="small" variant="outlined" />
                    ))}
                  </Stack>

                  <Typography variant="subtitle1" fontWeight="bold">
                    {product.price.toFixed(2)} €
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      component={Link}
                      to={`/produit/${product.id}`}
                      variant="outlined"
                      fullWidth
                    >
                      Voir
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      disabled={isDisabled}
                      onClick={() => dispatch(addItem(product))}
                    >
                      Ajouter
                    </Button>
                  </Stack>
                </Box>
              </Card>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}