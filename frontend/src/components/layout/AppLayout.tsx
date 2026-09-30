import type { ReactNode } from 'react'
import { AppBar, Container, Toolbar, Typography } from '@mui/material'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ytasty Crousty</Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ py: 4 }}>
        {children}
      </Container>
    </>
  )
}