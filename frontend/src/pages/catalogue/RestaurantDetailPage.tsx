import { useEffect, useState } from 'react'
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { getRestaurant } from '../../api/restaurants.api'
import { useAppDispatch } from '../../app/hooks'
import { selectRestaurant } from '../../features/restaurant/restaurantSlice'
import type { Restaurant } from '../../types/api'

export function RestaurantDetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || Number.isNaN(Number(id))) {
      setLoading(false)
      return
    }

    getRestaurant(Number(id))
      .then((response) => setRestaurant(response.data))
      .catch(() => setRestaurant(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <CircularProgress />
  }

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
        <Button component={Link} to="/menu" variant="contained" onClick={() => dispatch(selectRestaurant(restaurant.id))} disabled={!restaurant.is_open}>
          {restaurant.is_open ? 'Choisir et voir le menu' : 'Restaurant fermé'}
        </Button>

        <Button component={Link} to="/restaurants" variant="outlined">
          Retour
        </Button>
      </Stack>
    </Box>
  )
}