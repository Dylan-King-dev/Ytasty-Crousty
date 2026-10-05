import { Alert, Step, StepLabel, Stepper } from '@mui/material'
import type { OrderStatus } from '../../types/api'

interface OrderStepperProps {
	status: OrderStatus
}

const steps: { status: OrderStatus; label: string }[] = [
	{ status: 'pending', label: 'En attente' },
	{ status: 'validated', label: 'Validée' },
	{ status: 'preparing', label: 'En préparation' },
	{ status: 'ready', label: 'Prête' },
	{ status: 'collected', label: 'Récupérée' },
]

export function OrderStepper({ status }: OrderStepperProps) {
	if (status === 'cancelled') {
		return <Alert severity="error">Cette commande a été annulée.</Alert>
	}

	const activeStep = steps.findIndex((step) => step.status === status)

	return (
		<Stepper activeStep={activeStep} orientation="vertical">
			{steps.map((step) => (
				<Step key={step.status}>
					<StepLabel>{step.label}</StepLabel>
				</Step>
			))}
		</Stepper>
	)
}