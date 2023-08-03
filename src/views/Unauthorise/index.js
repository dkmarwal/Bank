import React from 'react'
import { Box, Button, Typography,  makeStyles, } from "@material-ui/core";
import Access_Denied from '~/assets/icons/access_denied.svg';
const useStyles = makeStyles((theme) => ({
    root: {
     padding:"10%",
     background:theme.palette.background.header,
    display:"flex",
    justifyContent:"center"

    },
  heading:{
    fontSize: 24,
    textAlign: "center",
    color:  theme.palette.primary.main,
    fontWeight: "normal"
  },

  subHeading:{
    fontSize: 24,
    textAlign: "center",
    color: "#565656",
    fontWeight: "normal",
    width:"60%"
  }
    
}));
  
const Unauthorise = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Box pb={5}>   <img src={Access_Denied } alt="Access Denied" width="392" /></Box>
          <Box pb={5}>  <Typography  variant="h1" className={classes.heading}>  ACCESS DENIED !</Typography></Box>
            <Typography  variant="h4" className={classes.subHeading}>  You could have been trying to access the part of the site reserved for authorised users only. Kindly contact customer support team. </Typography>
            <Box pt={5}>  
                <Button variant="contained" color="primary"> Okay</Button>
            </Box>
        </Box>
        </div>
    )
}   

export default Unauthorise;