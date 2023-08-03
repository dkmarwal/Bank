import React, { Component } from 'react'
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { amber, green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	}
}))


const NotificationWrapper = (props) => {
	const { message } = props
	const classes = useStyles()
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={props.open}
			onClose={props.handleClose}
			// onExited={props.handleClose} onExited is deprecated
			TransitionProps={{onExited:props.handleClose}}
			autoHideDuration={props.autoHideDuration || 3000}
			ContentProps={{
				'aria-describedby': 'client-snackbar',
			}}
		>
			<SnackbarContent
				className={clsx(classes[props.variant])}
				aria-describedby="client-snackbar"
				message={
					<span id="client-snackbar">{message}</span>
				}
				action={[
					<IconButton
						key="close"
						aria-label="close"
						color="inherit"
						onClick={props.handleClose}
					>
						<CloseIcon />
					</IconButton>,
				]}
			/>
		</Snackbar>
	)
}

export default class Notification extends Component {
	state = {
		open: true
	}
	handleClose = () => {
		this.setState({
			open: false
		})
	}
	render() {
		const { open } = this.state;
		const { handleClose } = this.props;

		return <NotificationWrapper open={open} handleClose={handleClose} {...this.props} />
	}
}
