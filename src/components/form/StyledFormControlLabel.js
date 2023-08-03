import { FormControlLabel, withStyles } from "@material-ui/core";

const StyledFormControlLabel = withStyles({
    root: {
        height: '3rem',
    },
    label: {
        textAlign: 'left',
        fontSize: '.9rem',
        marginRight:'10px',
    }
})(FormControlLabel);
export default StyledFormControlLabel;
