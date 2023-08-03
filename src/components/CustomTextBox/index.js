import React from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format';

export function NumberFormatCustom(props) {
    const { inputRef, onChange, ...inputProps} = props;
  return (
    <NumberFormat
        format="+1 (####) ###-###"
        mask="_"
        decimalScale={0}
        type="tel"
        {...inputProps}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
