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
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { clearCart } from '../../features/cart/cartSlice'
import { selectRestaurant } from '../../features/restaurant/restaurantSlice'
import { getRestaurants } from '../../api/restaurants.api'
import type { Restaurant } from '../../types/api'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const selectedId = useAppSelector((state) => state.restaurant.selectedId)
  const { token, username, role } = useAppSelector((state) => state.auth)
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
    const nextRestaurantId = Number(event.target.value)
    const cartRestaurantId = cartItems[0]?.product.restaurant_id

    if (cartRestaurantId && cartRestaurantId !== nextRestaurantId) {
      const confirmed = window.confirm(
        'Changer de restaurant va vider votre panier. Continuer ?',
      )
      if (!confirmed) {
        return
      }
      dispatch(clearCart())
    }

    dispatch(selectRestaurant(nextRestaurantId))
  }

  const handleLogout = () => {
    localStorage.removeItem('ytasty_access_token')
    localStorage.removeItem('ytasty_username')
    localStorage.removeItem('ytasty_role')
    dispatch(logout())
    navigate('/')
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
              disabled={restaurants.length === 0 || role === 'staff'}
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

          {token ? (
            <>
              <Chip label={`${username} · ${role}`} size="small" />
              {role === 'staff' && (
                <Button color="inherit" component={Link} to="/cuisine">
                  Cuisine
                </Button>
              )}
              {role !== null && (
                <Button color="inherit" component={Link} to="/administration">
                  Gestion
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Connexion équipe
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}