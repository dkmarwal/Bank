import { Divider, withStyles } from "@material-ui/core";

const CustomDivider = withStyles({
  root: {
    height: 3,
    margin: 20,
    backgroundColor: "#f5f5f5",
  },
})(Divider);

export default CustomDivider;
