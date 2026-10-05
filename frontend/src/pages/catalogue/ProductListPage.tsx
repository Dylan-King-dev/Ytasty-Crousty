import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addItem } from '../../features/cart/cartSlice'
import type { Product } from '../../types/api'

const restaurants = [
  { id: 1, name: 'Aix-en-Provence', is_open: true },
  { id: 2, name: 'Lyon', is_open: true },
  { id: 3, name: 'Paris', is_open: false },
]

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
    restaurant_id: 2,
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
    is_available: false,
    restaurant_id: 1,
    ingredients: ['pommes de terre', 'sel'],
  },
  {
    id: 5,
    name: 'Coca-Cola',
    image:
      'https://images.unsplash.com/photo-1622483767028-3f66f2b0d1b1?auto=format&fit=crop&w=800&q=80',
    description: 'Boisson gazeuse fraîche.',
    category: 'boisson',
    price: 3.5,
    is_available: true,
    restaurant_id: 2,
    ingredients: ['coca', 'glace'],
  },
  {
    id: 6,
    name: 'Cookie chocolat',
    image:
      'https://images.unsplash.com/photo-1499636136210-6d4ee9f9a3c8?auto=format&fit=crop&w=800&q=80',
    description: 'Cookie fondant au chocolat.',
    category: 'dessert',
    price: 5.0,
    is_available: true,
    restaurant_id: 2,
    ingredients: ['chocolat', 'beurre', 'farine'],
  },
]

const categories = [
  'all',
  'burger',
  'pizza',
  'wrap',
  'accompagnement',
  'boisson',
  'dessert',
]

export function ProductListPage() {
  const dispatch = useAppDispatch()
  const selectedRestaurantId = useAppSelector((state) => state.restaurant.selectedId)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ??
    restaurants[0]

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesRestaurant = product.restaurant_id === selectedRestaurant.id
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory

      const matchesAvailability =
        !showAvailableOnly || product.is_available

      return (
        matchesRestaurant &&
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      )
    })
  }, [search, selectedCategory, showAvailableOnly, selectedRestaurant])

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Menu - {selectedRestaurant.name}
      </Typography>

      {!selectedRestaurant.is_open && (
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

      {visibleProducts.length === 0 ? (
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
              !selectedRestaurant.is_open || !product.is_available

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

                    {!product.is_available && (
                      <Chip label="Indisponible" color="error" size="small" />
                    )}
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>

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