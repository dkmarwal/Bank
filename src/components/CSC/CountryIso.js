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

class CountryIso extends React.Component {
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
    const { onChange, required = false,error, helperText, label, name, value,isoCode3 } = this.props;
    const { countries, isLoading } = this.state;
    const countryCodeKey = isoCode3 ? 'isoCode3' : 'isoCode'
    return (
      <span>
        <TextField
          required={required}
          select
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name={name}
          label={label}
          variant="outlined"
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            countries &&
            countries.map((c) => (
              <MenuItem key={c["isoCode"]} value={c[countryCodeKey]}>{c["isoCode"]}</MenuItem>
            ))
          )}
        </TextField>
      </span>
    );
  }
}

export default connect((state) => ({
  ...state.csc,
}))(withStyles(styles)(CountryIso));
