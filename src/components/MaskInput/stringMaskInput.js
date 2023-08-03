import React, { Component } from "react";
import TextField from "~/components/Forms/TextField";
class StringMaskInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actualField: "",
      maskedField: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
    const prevValue = "";
    const newValue = "";
    let actual = value || "";
    this.mask(prevValue, newValue, actual);
  }

  handleChange(event) {
    const { maskedField, actualField } = this.state;
    const prevValue = maskedField;
    const newValue = event.target.value;
    let actual = actualField;
    this.mask(prevValue, newValue, actual);
  }

  mask = (prevValue, newValue, actual) => {
    if (newValue.length > prevValue.length) {
      let newChar = newValue.split("").pop();
      if(newChar.trim())
      actual = `${actual}${newChar}`;
    }    
    else {
      const charsRemovedCount = prevValue.length - newValue.length;
      if (newValue.length === 1) {
        actual = newValue;
      } else {
        actual =
          (actual &&
            actual.toString().substr(0, actual.length - charsRemovedCount)) ||
          "";
      }
    }
    this.setState({
      actualField: actual,
      maskedField: this.starredMask(actual),
    });
    this.props.getValue(actual);
  };

  starredMask = (ssn) => {
    ssn = ssn && ssn.toString();
    let maskedCharsLength = ssn && ssn.length > 4 ? ssn.length - 4 : 0;
    let str = "";
    str = ssn && "*".repeat(maskedCharsLength) + ssn.slice(maskedCharsLength);
    return str;
  };

  render() {
    const {
      disabled,
      maxLength,
      name,
      value,
      autoFocus,
      label,
      onBlur,
      ...restProps
    } = this.props;
    let masked = this.starredMask(value);

    return (
      <div>
        <div>
          <TextField
              color="secondary"
            name={name}
            type="text"
            className="MaskedField"
            value={masked}
            onChange={this.handleChange}
            disabled={disabled}
            autoFocus={autoFocus}
            label={label}
            fullWidth={true}
            inputProps={{ maxLength: maxLength }}
            {...restProps}
          />
        </div>
      </div>
    );
  }
}

export default StringMaskInput;
