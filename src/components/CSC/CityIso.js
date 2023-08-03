import { CircularProgress, MenuItem, withStyles, TextField } from "@material-ui/core";
import { getCitiesOfStateByISO } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";

export class CityIso extends React.Component {
    state = {
        cities: [],
        isLoading: false
    }
    componentDidMount() {
        const { selectedState } = this.props;
        if (selectedState !== "") {
            this.getCitiesOfStateByIso(selectedState);
        }
    }
    componentDidUpdate(prevProps) {
        //This is called when state field is changed. and REST API is called.
        if (prevProps["selectedState"] !== this.props["selectedState"]) {
            const { selectedState } = this.props;
            this.getCitiesOfStateByIso(selectedState)
        }

        //This is called when country field is changed. and clear the city field.
        if (prevProps["selectedCountry"] !== this.props["selectedCountry"]) {
            this.setState({ cities: [] });
        }
    }

    getCitiesOfStateByIso(selectedState) {
        this.setState({ isLoading: true }, () => {
            this.props.dispatch(getCitiesOfStateByISO(selectedState)).then(res => {
                if (res) {
                    const { csc } = this.props;
                    this.setState({ cities: csc && csc["cityList"], isLoading: false })
                }
            })
        })
    }


    render() {
        const { selectedState, selectedCity, onChange, required = false, error, helperText, name, label } = this.props;
        const { cities, isLoading } = this.state;
        return (
            <span>
                <TextField
                    required={required}
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name={name}
                    label= {label}
                    variant="outlined"
                    value={selectedCity}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    {isLoading ? <CircularProgress /> : selectedState && cities && cities.map(s => <MenuItem key={s["name"]} value={s["name"]}>{s["name"]}</MenuItem>)}
                </TextField>
            </span>
        )
    }
}

export default connect((state) => ({
    ...state.csc,
}))(withStyles(styles)(CityIso))
