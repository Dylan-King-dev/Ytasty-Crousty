import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import { createProduct, deleteProduct, getProducts, updateProduct, updateProductAvailability } from '../../api/products.api'
import { getRestaurants, updateRestaurantAvailability } from '../../api/restaurants.api'
import { createUser } from '../../api/users.api'
import type { Product, ProductPayload, Restaurant, Role, UserCreate } from '../../types/api'

interface ProductForm {
  name: string
  image: string
  description: string
  category: string
  price: string
  ingredients: string
  is_available: boolean
}

const emptyProductForm: ProductForm = {
  name: '',
  image: '',
  description: '',
  category: '',
  price: '',
  ingredients: '',
  is_available: true,
}

export function AdministrationPage() {
  const role = useAppSelector((state) => state.auth.role)
  const selectedRestaurantId = useAppSelector((state) => state.restaurant.selectedId)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm)
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    role: 'staff' as Role,
    restaurant_id: selectedRestaurantId,
  })

  useEffect(() => {
    Promise.all([getRestaurants(), getProducts()])
      .then(([restaurantResponse, productResponse]) => {
        setRestaurants(restaurantResponse.data)
        setProducts(productResponse.data)
      })
      .catch(() => setError('Impossible de charger les données de gestion.'))
      .finally(() => setLoading(false))
  }, [])

  const selectedProducts = products.filter(
    (product) => product.restaurant_id === selectedRestaurantId,
  )
  const isAdmin = role === 'admin'

  const changeProductAvailability = async (product: Product) => {
    try {
      const response = await updateProductAvailability(product.id, !product.is_available)
      setProducts((current) => current.map((item) => item.id === product.id ? response.data : item))
      setMessage('Disponibilité du produit mise à jour.')
      setError('')
    } catch {
      setError('Impossible de modifier la disponibilité du produit.')
    }
  }

  const changeRestaurantAvailability = async (restaurant: Restaurant) => {
    try {
      const response = await updateRestaurantAvailability(restaurant.id, !restaurant.is_open)
      setRestaurants((current) => current.map((item) => item.id === restaurant.id ? response.data : item))
      setMessage('État du restaurant mis à jour.')
      setError('')
    } catch {
      setError('Seul un administrateur peut modifier l’ouverture des restaurants.')
    }
  }

  const editProduct = (product: Product) => {
    setEditingProductId(product.id)
    setProductForm({
      name: product.name,
      image: product.image,
      description: product.description,
      category: product.category,
      price: String(product.price),
      ingredients: product.ingredients.join(', '),
      is_available: product.is_available,
    })
  }

  const resetProductForm = () => {
    setEditingProductId(null)
    setProductForm(emptyProductForm)
  }

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault()
    const payload: ProductPayload = {
      name: productForm.name.trim(),
      image: productForm.image.trim(),
      description: productForm.description.trim(),
      category: productForm.category.trim(),
      price: Number(productForm.price),
      is_available: productForm.is_available,
      restaurant_id: selectedRestaurantId,
      ingredients: productForm.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
    }

    try {
      if (editingProductId === null) {
        const response = await createProduct(payload)
        setProducts((current) => [...current, response.data])
        setMessage('Produit créé.')
      } else {
        const response = await updateProduct(editingProductId, payload)
        setProducts((current) => current.map((item) => item.id === editingProductId ? response.data : item))
        setMessage('Produit modifié.')
      }
      setError('')
      resetProductForm()
    } catch {
      setError('Impossible d’enregistrer le produit. Vérifie les champs et tes droits.')
    }
  }

  const removeProduct = async (product: Product) => {
    if (!window.confirm(`Supprimer ${product.name} ?`)) {
      return
    }
    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      setMessage('Produit supprimé.')
      setError('')
    } catch {
      setError('Impossible de supprimer le produit. Vérifie tes droits.')
    }
  }

  const addUser = async (event: React.FormEvent) => {
    event.preventDefault()
    const user: UserCreate = {
      ...userForm,
      first_name: userForm.first_name.trim(),
      last_name: userForm.last_name.trim(),
      username: userForm.username.trim(),
      restaurant_id: userForm.role === 'staff' ? Number(userForm.restaurant_id) : null,
    }
    try {
      await createUser(user)
      setMessage(`Compte ${user.username} créé.`)
      setError('')
      setUserForm({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        role: 'staff',
        restaurant_id: selectedRestaurantId,
      })
    } catch {
      setError('Impossible de créer le compte. Vérifie le nom (8 à 12 lettres/chiffres) et le mot de passe (12 caractères minimum).')
    }
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Box sx={{ p: { xs: 0, md: 2 } }}>
      <Typography variant="h4" gutterBottom>Gestion du restaurant</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      {isAdmin && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Ouverture des restaurants</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {restaurants.map((restaurant) => (
              <FormControlLabel
                key={restaurant.id}
                control={<Switch checked={restaurant.is_open} onChange={() => changeRestaurantAvailability(restaurant)} />}
                label={`${restaurant.city} : ${restaurant.is_open ? 'ouvert' : 'fermé'}`}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Carte du restaurant sélectionné</Typography>
        {isAdmin && (
          <Box component="form" onSubmit={saveProduct} sx={{ mb: 3 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">{editingProductId === null ? 'Ajouter un produit' : 'Modifier un produit'}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Nom" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Catégorie" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Prix (€)" type="number" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="URL de l’image" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Description" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} required fullWidth multiline minRows={2} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Ingrédients séparés par des virgules" value={productForm.ingredients} onChange={(event) => setProductForm({ ...productForm, ingredients: event.target.value })} required fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={<Switch checked={productForm.is_available} onChange={(event) => setProductForm({ ...productForm, is_available: event.target.checked })} />}
                    label={productForm.is_available ? 'Disponible à la vente' : 'En rupture'}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained">{editingProductId === null ? 'Créer le produit' : 'Enregistrer'}</Button>
                {editingProductId !== null && <Button onClick={resetProductForm}>Annuler</Button>}
              </Stack>
            </Stack>
          </Box>
        )}

        {selectedProducts.length === 0 ? (
          <Typography>Aucun produit pour ce restaurant.</Typography>
        ) : (
          <Grid container spacing={2}>
            {selectedProducts.map((product) => (
              <Grid key={product.id} size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{product.name}</Typography>
                        <Typography color="text.secondary">{product.category} · {product.price.toFixed(2)} €</Typography>
                      </Box>
                      <FormControlLabel
                        control={<Switch checked={product.is_available} onChange={() => changeProductAvailability(product)} />}
                        label={product.is_available ? 'Disponible' : 'Rupture'}
                      />
                    </Stack>
                    {isAdmin && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button size="small" onClick={() => editProduct(product)}>Modifier</Button>
                        <Button size="small" color="error" onClick={() => removeProduct(product)}>Supprimer</Button>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {isAdmin && (
        <Paper component="form" onSubmit={addUser} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Créer un compte équipe</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Prénom" value={userForm.first_name} onChange={(event) => setUserForm({ ...userForm, first_name: event.target.value })} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Nom" value={userForm.last_name} onChange={(event) => setUserForm({ ...userForm, last_name: event.target.value })} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Identifiant (8 à 12 lettres ou chiffres)" value={userForm.username} onChange={(event) => setUserForm({ ...userForm, username: event.target.value })} inputProps={{ pattern: '[a-zA-Z0-9]{8,12}', maxLength: 12 }} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Mot de passe (12 caractères min.)" type="password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} inputProps={{ minLength: 12 }} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Rôle" value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value as Role })} fullWidth>
                <MenuItem value="staff">Employé</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="direction">Direction</MenuItem>
              </TextField>
            </Grid>
            {userForm.role === 'staff' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <Select value={userForm.restaurant_id} onChange={(event) => setUserForm({ ...userForm, restaurant_id: Number(event.target.value) })}>
                    {restaurants.map((restaurant) => <MenuItem key={restaurant.id} value={restaurant.id}>{restaurant.city}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Créer le compte</Button>
        </Paper>
      )}
    </Box>
  )
}