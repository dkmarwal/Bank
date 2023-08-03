import React, { useState } from "react";
import { Grid, Typography, Box, Button, makeStyles } from "@material-ui/core";
import CustomDivider from "./CustomDivider";
import CustomInputTextField from "../../components/form/CustomInputTextField";

const useStyles = makeStyles((theme) => ({
  button: {
    color: "#4bb8b0",
    backgroundColor: "white",
    "&:hover": {
      color: "#FFFFFF",
      border: "1px solid #4bb8b0",
      backgroundColor: "#4bb8b0",
    },
  },
}));

const InfoCardContent = ({ info, handleChange, onSave }) => {
  const [editMode, setEditMode] = useState(false);  
  const onEditHandler =() =>{
    setEditMode(!editMode);
  }

  const classes = useStyles();

  return (
    <>
      <CustomDivider />
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={9}>
          <Typography variant="subtitle1">
            <Box fontWeight={400} fontSize={20} my={1}>
              {info.subTitle}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"            
            className={`${classes.button} ${editMode ? "edit" : ""}`}
          >
            {editMode ? "SAVE" : "EDIT"}{" "}
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={1}>
        {Object.keys(info).map((key) => (
          <Grid item xs={6}>
            <CustomInputTextField
              label={key}
              value={info[key]}
              onChangeHandler={handleChange}
              editMode={editMode}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default InfoCardContent;
