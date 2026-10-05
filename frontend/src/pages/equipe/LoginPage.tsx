import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth.api'
import { useAppDispatch } from '../../app/hooks'
import { setCredentials } from '../../features/auth/authSlice'
import { selectRestaurant } from '../../features/restaurant/restaurantSlice'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      const response = await login(username, password)
      localStorage.setItem('ytasty_access_token', response.data.access_token)
      localStorage.setItem('ytasty_username', username)
      localStorage.setItem('ytasty_role', response.data.role)
      dispatch(setCredentials({
        token: response.data.access_token,
        username,
        role: response.data.role,
      }))
      if (response.data.restaurant_id !== null) {
        dispatch(selectRestaurant(response.data.restaurant_id))
      }
      navigate('/cuisine')
    } catch {
      setError('Identifiants incorrects.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" gutterBottom>
          Connexion équipe
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              inputProps={{ maxLength: 12 }}
              fullWidth
              required
            />

            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button type="submit" variant="contained" size="large">
              Se connecter
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}