import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'

const stats = [
  { label: 'Commandes aujourd’hui', value: '128' },
  { label: 'Commandes en attente', value: '18' },
  { label: 'Chiffre d’affaires', value: '2 340 €' },
  { label: 'Restaurants ouverts', value: '4' },
]

export function AdministrationPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administration
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{stat.value}</Typography>
                <Typography color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}