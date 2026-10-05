import { useEffect, useState, type ReactNode } from 'react'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectRestaurant } from '../../features/restaurant/restaurantSlice'
import { getRestaurants } from '../../api/restaurants.api'
import type { Restaurant } from '../../types/api'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch()
  const selectedId = useAppSelector((state) => state.restaurant.selectedId)
  const cartItems = useAppSelector((state) => state.cart.items)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    getRestaurants()
      .then((response) => setRestaurants(response.data))
      .catch(() => setRestaurants([]))
  }, [])

  useEffect(() => {
    if (restaurants.length > 0 && !restaurants.some((restaurant) => restaurant.id === selectedId)) {
      dispatch(selectRestaurant(restaurants[0].id))
    }
  }, [dispatch, restaurants, selectedId])

  const activeRestaurant = restaurants.find((restaurant) => restaurant.id === selectedId)

  const handleRestaurantChange = (event: SelectChangeEvent<number>) => {
    dispatch(selectRestaurant(Number(event.target.value)))
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f8f8' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            Ytasty Crousty
          </Typography>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="restaurant-select-label">Restaurant</InputLabel>
            <Select
              labelId="restaurant-select-label"
              value={restaurants.some((restaurant) => restaurant.id === selectedId) ? selectedId : ''}
              label="Restaurant"
              onChange={handleRestaurantChange}
              disabled={restaurants.length === 0}
            >
              {restaurants.map((restaurant) => (
                <MenuItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {activeRestaurant && (
            <Chip
              label={activeRestaurant.is_open ? 'Ouvert' : 'Fermé'}
              color={activeRestaurant.is_open ? 'success' : 'error'}
              size="small"
            />
          )}

          <Button color="inherit" component={Link} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={Link} to="/restaurants">
            Restaurants
          </Button>
          <Button color="inherit" component={Link} to="/menu">
            Menu
          </Button>
          <Button color="inherit" component={Link} to="/panier">
            Panier {cartCount > 0 ? `(${cartCount})` : ''}
          </Button>

          <Button color="inherit" component={Link} to="/login">
            Équipe
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}