import React from "react";
import { TextField, makeStyles } from "@material-ui/core";

const styles =makeStyles({
	root: {
		// height:'3rem'
	},
  });

const CustomTextField = (props) => {
	const {
		id,
		label,
		placeholder,
		helperText,
		fullWidth = true,
		InputLabelProps = {
			shrink: true,
		},
		...restProps
	} = props;
	const classes = styles();
	return (
		<TextField
			className={classes.root}
			id={id}
			label={label}
			placeholder={placeholder}
			helperText={helperText}
			fullWidth={fullWidth}
			InputLabelProps={InputLabelProps}
			variant="outlined"
            {...restProps}
		/>
	);
};

export default CustomTextField;
