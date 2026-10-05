import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { getRestaurants } from '../../api/restaurants.api'
import type { Restaurant } from '../../types/api'

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await getRestaurants()
        setRestaurants(response.data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurants()
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">Impossible de charger les restaurants.</Alert>
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Nos restaurants
      </Typography>

      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid key={restaurant.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{restaurant.name}</Typography>
                <Typography color="text.secondary">{restaurant.city}</Typography>
                <Typography>{restaurant.address}</Typography>

                <Typography
                  sx={{ mt: 1 }}
                  color={restaurant.is_open ? 'success.main' : 'error.main'}
                >
                  {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to="/menu"
                    variant="contained"
                    size="small"
                  >
                    Voir le menu
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}