import React from 'react';
import { Box, Grid, Typography, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from "@material-ui/styles";
import TextField from "~/components/Forms/TextField";
import AutoComplete from "~/components/AutoComplete";
import styles from "./styles";

const MasterCardPMTX = (props) => {
    const { classes } = props;

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Box my={2} mx={1} display="flex">
                    <Typography>Program Details / Settings (Optional - Can be entered later)</Typography>
                </Box>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>Company Details</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Company / Program Name"
                            placeholder="Program Name"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Currency"
                            placeholder="Currency"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Currency Code"
                            placeholder="Currency Code"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Common Name / Company Number"
                            placeholder="Common Name / Company Number"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Company / Program Name"
                            placeholder="Company / Program Name"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Bank Country ISO"
                            placeholder="Bank Country ISO"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>Real Card Settings</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="VCardAlias"
                            placeholder="VCardAlias"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="VCardAlias"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Real Card Number"
                            placeholder="Real Card Number"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>Purchase Template Settings</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Purchase Type"
                            placeholder="purchase Type"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="VCardAlias"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <AutoComplete
                            label="Merchant Category Code(s)"
                            name="mccGrouping"
                        //value={item.mccGrouping}
                        //onHandleChange={onMccChange}
                        //parentIndex={index}
                        //childIndex={ind}
                        //isError={errorIndex.mccGrouping[index] && errorIndex.mccGrouping[index].includes(ind)}
                        // helperText={errorIndex.mccGrouping[index] && errorIndex.mccGrouping[index].includes(ind) ?
                        //     error.mccGrouping : ''}
                        />
                        {/* <Typography className={classes.mccBtnInfoText}>
                                        You can add upto {GroupLimit.MCCGROUPLIMIT} Merchant Category Code(s)
                                    </Typography> */}
                    </Box>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>Control Parameters (As Applicabel)</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box mx={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            //checked={state.checkedB}
                                            //onChange={handleChange}
                                            name="checkedB"
                                        //color="primary"
                                        />
                                    }
                                    label="Enable Spend Velocity Control"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="max Auth"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="Cumulative Spend Limit"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="Period Type"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="Reset Day"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box mx={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            //checked={state.checkedB}
                                            //onChange={handleChange}
                                            name="checkedB"
                                        //color="primary"
                                        />
                                    }
                                    label="Enable Time of Day Control"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="Start Time"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="End Time"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mx={1} my={1}>
                                <TextField
                                    color="secondary"
                                    inputProps={{
                                        maxLength: 70,
                                        minLength: 1
                                    }}
                                    label="Week day effective"
                                    placeholder="max Auth"
                                    //error={Boolean(error.programName)}
                                    //helperText={error.programName}
                                    fullWidth={true}
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                    variant="outlined"
                                    //value={element.programName || ""}
                                    name="VCardAlias"
                                //onChange={e => handleChange(index, e)}
                                //onBlur={handleChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>Custom Fields (As Applicable)</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box mx={1} my={1}>
                        <TextField
                            color="secondary"
                            inputProps={{
                                maxLength: 70,
                                minLength: 1
                            }}
                            label="Custom Field 1"
                            placeholder="Custom Field 1"
                            //error={Boolean(error.programName)}
                            //helperText={error.programName}
                            fullWidth={true}
                            autoComplete="off"
                            InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                            variant="outlined"
                            //value={element.programName || ""}
                            name="programName"
                        //onChange={e => handleChange(index, e)}
                        //onBlur={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Grid container item xs={12} justify="center" className={classes.saveButton}>
                {/* {saveProcessing ? (
                    <CircularProgress color="primary" />
                ) : ( */}
                <Button
                    variant="contained"
                    color="primary"
                    //onClick={() => onSubmit()}
                    style={{ color: "white" }}
                >
                    Save
                </Button>
                {/* )} */}
            </Grid>

        </Grid>
    )
}
export default withStyles(styles)(MasterCardPMTX);
