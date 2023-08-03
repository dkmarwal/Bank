const styles = (theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1.5),
    },
    "& .MuiFormControlLabel-root": {
      margin: theme.spacing(1),
    },
    paper: {
      width: "100%",
    },
    checkBox: {
      "& span": {
        color: "#000000",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: 1.6,
      },
    },
    input: {
      display: "none",
    },
  },
});

export default styles;
