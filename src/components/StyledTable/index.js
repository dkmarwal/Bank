import { withStyles } from "@material-ui/core/styles";
import {
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
} from "@material-ui/core";

export const StyledTableHead = withStyles((theme) => ({
  root: {
    backgroundColor: "#d8ebff",
    color: "rgba(18,18,18,0.87)",
    padding: "8px",
    borderRadius: "1px",
    border: "solid 0 #6094b1",
  },
}))(TableHead);

export const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    color: "#3a3b3f",
    padding: "12px",
    opacity: "0.8",
    borderRadius: "1px",
    border: "solid 0 #6094b1",
  },
}))(TableRow);

export const StyledTableFooter = withStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    color: "rgba(0,0,0,0.87)",
    fontSize: "16px",
    borderRadius: "1px",
    borderBottom: "0px",
  },
}))(TableFooter);

export const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 15,
    fontWeight: 700,
    padding: "5px 16px",
    background: "rgba(204,228,255,0.75) !important",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const StyledTableColRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    color: "rgba(0,0,0,0.87)",
    padding: "12px",
    opacity: "0.8",
    borderRadius: "1px",
    border: "1px solid blue",
  },
}))(TableRow);

export const StyledTableColCell = withStyles((theme) => ({
  head: {
    fontSize: 14,
    border: "1px solid rgba(96, 148, 177, 0.26)",
  },
  body: {
    fontSize: 14,
    border: "1px solid rgba(96, 148, 177, 0.26)",
  },
}))(TableCell);
