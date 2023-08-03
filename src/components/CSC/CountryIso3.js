import {
    CircularProgress,
    MenuItem,
    withStyles,
    TextField,
  } from "@material-ui/core";
  import { getAllCountries } from "~/redux/actions/csc";
  import { connect } from "react-redux";
  import { styles } from "./styles";
  import React from "react";
  
  class CountryIso3 extends React.Component {
    state = {
      countries: [],
      isLoading: false,
    };
  
    componentDidMount() {
      this.getCountriesList();
    }
  
    getCountriesList() {
      this.setState({ isLoading: true }, () => {
        this.props.dispatch(getAllCountries()).then((res) => {
          if (res) {
            const { csc } = this.props;
            this.setState({
              countries: csc && csc["countryList"],
              isLoading: false,
            });
          }
        });
      });
    }
  
    render() {
      const { selectedCountry, onChange, required = false, error, helperText } = this.props;
      const { countries, isLoading } = this.state;
      return (
        <span>
          <TextField
            required={required}
            select
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            name="country"
            label={"Country"}
            variant="outlined"
            value={selectedCountry}
            onChange={onChange}
            error={error}
            helperText={helperText}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              countries &&
              countries.map((c) => (
                <MenuItem value={c["isoCode3"]}>{c["name"]}</MenuItem>
              ))
            )}
          </TextField>
        </span>
      );
    }
  }
  
  export default connect((state) => ({
    ...state.csc,
  }))(withStyles(styles)(CountryIso3));
  