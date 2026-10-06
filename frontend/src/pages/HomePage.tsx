import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { getRestaurants } from '../api/restaurants.api'
import type { Restaurant } from '../types/api'

export function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getRestaurants()
      .then((response) => setRestaurants(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Ytasty Crousty
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Découvrez nos meilleurs produits, ajoutez-les au panier et passez votre commande.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component={Link} to="/menu" variant="contained" size="large">
          Voir le menu
        </Button>

        <Button component={Link} to="/panier" variant="outlined" size="large">
          Voir le panier
        </Button>

        <Button component={Link} to="/suivi" variant="outlined" size="large">
          Suivre une commande
        </Button>
      </Stack>

      <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Nos restaurants</Typography>
      {loading ? <CircularProgress /> : error ? (
        <Alert severity="error">Impossible de charger les restaurants.</Alert>
      ) : (
        <Grid container spacing={2}>
          {restaurants.map((restaurant) => (
            <Grid key={restaurant.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{restaurant.city}</Typography>
                  <Typography>{restaurant.address}</Typography>
                  <Typography>{restaurant.opening_hours}</Typography>
                  <Typography>{restaurant.contact}</Typography>
                  <Typography color={restaurant.is_open ? 'success.main' : 'error.main'} sx={{ mt: 1 }}>
                    {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                  </Typography>
                  <Button component={Link} to={`/restaurants/${restaurant.id}`} sx={{ mt: 1 }}>
                    Détails
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}