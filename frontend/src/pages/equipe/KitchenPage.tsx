import {
  Alert,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

const orders = [
  {
    id: 'YT-123456',
    customer: 'Alice',
    status: 'pending',
    items: ['Burger classique', 'Frites maison'],
  },
  {
    id: 'YT-123457',
    customer: 'Sophie',
    status: 'preparing',
    items: ['Pizza Margherita'],
  },
  {
    id: 'YT-123458',
    customer: 'Nicolas',
    status: 'ready',
    items: ['Wrap poulet'],
  },
]

export function KitchenPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cuisine
      </Typography>

      <Stack spacing={2}>
        {orders.map((order) => (
          <Paper key={order.id} sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography variant="h6">{order.id}</Typography>
                <Typography>Client : {order.customer}</Typography>
              </Box>

              <Chip
                label={order.status}
                color={
                  order.status === 'ready'
                    ? 'success'
                    : order.status === 'preparing'
                      ? 'warning'
                      : 'default'
                }
              />
            </Stack>

            <Box sx={{ mt: 2 }}>
              {order.items.map((item) => (
                <Typography key={item}>- {item}</Typography>
              ))}
            </Box>
          </Paper>
        ))}
      </Stack>

      {orders.length === 0 && (
        <Alert severity="info">Aucune commande en cours.</Alert>
      )}
    </Box>
  )
}