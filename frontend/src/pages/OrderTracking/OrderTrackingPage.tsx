import { 
	Box,
	Button,
	Paper,
	Stack,
	TextField,
	Typography,
 } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface OrderFromStorage {
	order_number: string
	total_price: number
	pickup_mode: 'onsite' | 'takeaway'
	status: string
	customer :{
		name: string
		email: string
	}
}

const statuses = [
	'pending',
	'validated',
	'preparing',
	'ready',
	'collected',
]

export function OrderTrackingPage() {
	const { orderNumber } = useParams()
	const navigate = useNavigate()

	const [search, setSearch] = useState(orderNumber ?? '')
	const [order ,setOrder] = useState<OrderFromStorage | null>(null)

	useEffect(() => {
		if (!orderNumber) {
			const raw = localStorage.getItem('ytasty_last_order')

			if (!raw){
				setOrder(null)
				return
			}

			const parsed = JSON.parse(raw) as OrderFromStorage
			setOrder(parsed)
			setSearch(parsed.order_number)
			return
		}

		const raw = localStorage.getItem('ytasty_last_order')

		if (!raw){
				setOrder(null)
				return
			} 

			const parsed = JSON.parse(raw) as OrderFromStorage

			if (parsed.order_number === orderNumber){
			 setOrder(parsed)
			 setSearch(parsed.order_number)
			} else {
				setOrder(null)
			}
		}, [orderNumber])

		const handleSearch = () => {
			const raw = localStorage.getItem('ytasty_last_order')

			if (!raw){
				setOrder(null)
				return
			}

			const parsed = JSON.parse(raw) as OrderFromStorage

			if (parsed.order_number === search){
				setOrder(parsed)
				navigate(`/suivi/${search}`)
				return
			}

			setOrder(null)
		} 

	return (
		<Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Suivi de commande
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Numéro de commande"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleSearch}>
          Rechercher
        </Button>
      </Stack>

      {!order ? (
        <Typography>Aucune commande trouvée.</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography>
              <strong>Commande :</strong> {order.order_number}
            </Typography>

            <Typography>
              <strong>Client :</strong> {order.customer.name}
            </Typography>

            <Typography>
              <strong>Mode :</strong>{' '}
              {order.pickup_mode === 'onsite' ? 'Sur place' : 'À emporter'}
            </Typography>

            <Typography>
              <strong>Statut actuel :</strong> {order.status}
            </Typography>

            <Stack spacing={1}>
              {statuses.map((status) => {
                const active = status === order.status
                return (
                  <Box
                    key={status}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: active ? '#f5b700' : '#f2f2f2',
                      color: active ? '#000' : '#333',
                    }}
                  >
                    {status}
                  </Box>
                )
              })}
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}
