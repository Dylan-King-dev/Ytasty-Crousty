import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'

const restaurants = [
  {
    id: 1,
    name: 'Ytasty Burger',
    city: 'Paris',
    address: '12 rue de la Pizza',
    opening_hours: '12:00 - 22:00',
    contact: '01 23 45 67 89',
    is_open: true,
  },
  {
    id: 2,
    name: 'Crousty Grill',
    city: 'Lyon',
    address: '8 avenue du Pain',
    opening_hours: '11:30 - 21:30',
    contact: '04 56 78 90 12',
    is_open: true,
  },
]

export function RestaurantDetailPage() {
  const { id } = useParams()
  const restaurant = restaurants.find((item) => item.id === Number(id))

  if (!restaurant) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Restaurant introuvable</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        {restaurant.name}
      </Typography>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography>Ville : {restaurant.city}</Typography>
        <Typography>Adresse : {restaurant.address}</Typography>
        <Typography>Horaires : {restaurant.opening_hours}</Typography>
        <Typography>Contact : {restaurant.contact}</Typography>

        <Chip
          label={restaurant.is_open ? 'Ouvert' : 'Fermé'}
          color={restaurant.is_open ? 'success' : 'error'}
          sx={{ width: 'fit-content' }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/menu" variant="contained">
          Voir le menu
        </Button>

        <Button component={Link} to="/restaurants" variant="outlined">
          Retour
        </Button>
      </Stack>
    </Box>
  )
}