import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function HomePage() {
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
      </Stack>
    </Box>
  )
}