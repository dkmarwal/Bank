import { CircularProgress, MenuItem, withStyles, TextField } from "@material-ui/core";
import { getCitiesOfState } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";

export class City extends React.Component {
    state = {
        cities: [],
        isLoading: false
    }
    componentDidMount() {
        const { selectedState } = this.props;
        if (selectedState !== "") {
            this.getCitiesList(selectedState);
        }
    }
    componentDidUpdate(prevProps) {
        //This is called when state field is changed. and REST API is called.
        if (prevProps["selectedState"] !== this.props["selectedState"]) {
            const { selectedState } = this.props;
            this.getCitiesList(selectedState)
        }

        //This is called when country field is changed. and clear the city field.
        if (prevProps["selectedCountry"] !== this.props["selectedCountry"]) {
            this.setState({ cities: [] });
        }
    }

    getCitiesList(selectedState) {
        this.setState({ isLoading: true }, () => {
            this.props.dispatch(getCitiesOfState(selectedState)).then(res => {
                if (res) {
                    const { csc } = this.props;
                    this.setState({ cities: csc && csc["cityList"], isLoading: false })
                }
            })
        })
    }


    render() {
        const { selectedState, selectedCity, required = false, onChange, error, helperText } = this.props;
        const { cities, isLoading } = this.state;
        return (
            <span>
                <TextField
                    required={required}
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="city"
                    label= {"City"}
                    variant="outlined"
                    value={selectedCity}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                >
                    {isLoading ? <CircularProgress /> : selectedState && cities && cities.map(s => <MenuItem key={s["name"]} value={s["name"]}>{s["name"]}</MenuItem>)}
                </TextField>
            </span>
        )
    }
}

export default connect((state) => ({
    ...state.csc,
}))(withStyles(styles)(City))
