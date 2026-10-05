import type { ReactNode } from 'react'
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

const restaurants = [
  { id: 1, name: 'Aix-en-Provence', is_open: true },
  { id: 2, name: 'Lyon', is_open: true },
  { id: 3, name: 'Paris', is_open: false },
]

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch()
  const selectedId = useAppSelector((state) => state.restaurant.selectedId)
  const cartItems = useAppSelector((state) => state.cart.items)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const activeRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedId) ?? restaurants[0]

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
              value={selectedId}
              label="Restaurant"
              onChange={handleRestaurantChange}
            >
              {restaurants.map((restaurant) => (
                <MenuItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Chip
            label={activeRestaurant.is_open ? 'Ouvert' : 'Fermé'}
            color={activeRestaurant.is_open ? 'success' : 'error'}
            size="small"
          />

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