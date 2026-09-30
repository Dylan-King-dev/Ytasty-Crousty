import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AppLayout } from './components/layout/AppLayout'
import { theme } from './app/theme'
import { HomePage } from './pages/HomePage'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { RestaurantsPage } from './pages/catalogue/RestaurantsPage'
import { ProductListPage } from './pages/catalogue/ProductListPage'
import { ProductDetailPage } from './pages/catalogue/ProductDetailPage'
import { CartPage } from './pages/Cart/CartPage'
import { CheckoutPage } from './pages/Checkout/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmation/OrderConfirmationPage'
import { OrderTrackingPage } from './pages/OrderTracking/OrderTrackingPage'
import { LoginPage } from './pages/equipe/LoginPage'
import { KitchenPage } from './pages/equipe/KitchenPage'
import { AdministrationPage } from './pages/equipe/AdministrationPage'

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/menu" element={<ProductListPage />} />
            <Route path="/produit/:id" element={<ProductDetailPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/commande" element={<CheckoutPage />} />
            <Route path="/confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/suivi/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/suivi" element={<OrderTrackingPage />} />
            <Route path="/cuisine" element={<ProtectedRoute><KitchenPage /></ProtectedRoute>} />
            <Route path="/administration" element={<ProtectedRoute><AdministrationPage /></ProtectedRoute>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}