// import React, { useState, useEffect } from "react";
// import {
//     Grid,
//     makeStyles,
//     Paper,
// } from "@material-ui/core";
// import MultiCheckBoxGroup from "../../components/Forms/MultiCheckBoxGroup";
// import { getTransactionType } from "../../redux/actions/payments";

// const useStyles = makeStyles({
//     paper: {
//         width: '100%'
//     },
// });

// const AccountTraxType = ({ selectedTranxType, onChangeSelection }) => {

//     const [transactionType, setTransactionTypes] = useState([]);
//     const [transactionTypeOptions, setOptions] = useState({});

//     useEffect(() => {
//         fetchTransactionType();
//     }, []);

//     const classes = useStyles();

//     const fetchTransactionType = async () => {
//         const transactionTypeData = await getTransactionType();
//         const { data, error, message } = await transactionTypeData;
//         console.log("transactionTypeData +++++ -------", data, error, message);
//         const ACHTransactionTypes = data && data.rows.filter(({ paymentCode }) => {
//             return (paymentCode === paymentType)
//         });
//         if (!error) {
//             setTransactionTypes(ACHTransactionTypes);
//         } else {
//             // report Error Message here for not getting grouplist;
//             setTransactionTypes({ ...transactionType, error: message })
//         }
//     };

//     const getTransactionTypeOptions = (type) => {
//         const filterTypes = transactionType.filter(({ paymentCode }) => {
//             return (paymentCode === type)
//         });
//         const options = filterTypes.map(({ currency, transactionTypeId }) => ({ name: currency, value: transactionTypeId, label: currency }));
//         return options;
//     }

//     const onChange = () => {

//     }

//     const selectedTransactions = [];

//     const { ACHoptions = [], EFToptions = [], VCAoptions = [], chkoptions = [] } = transactionTypeOptions;

//     return (
//         <Paper elevation={3} className={classes.paper}>
//             **************** AccountTraxType ***********
//             <Grid container direction="row">
//                 <MultiCheckBoxGroup key={"Bank Account"} label={"Bank Account"} options={getTransactionTypeOptions("ACH")} onChangeCheckBox={onChange}
//                     selectedCheckbox={selectedTransactions} />
//                 <MultiCheckBoxGroup key={"EFT Account"} label={"EFT Account"} options={getTransactionTypeOptions("EFT")} onChangeCheckBox={onChange}
//                     selectedCheckbox={selectedTransactions} />
//                 <MultiCheckBoxGroup key={"Virtual Card"} label={"Virtual Card"} options={getTransactionTypeOptions("VCA")} onChangeCheckBox={onChange}
//                     selectedCheckbox={selectedTransactions} />
//                 <MultiCheckBoxGroup key={"Check"} label={"Check"} options={getTransactionTypeOptions("CHK")} onChangeCheckBox={onChange}
//                     selectedCheckbox={selectedTransactions} />
//             </Grid>
//         </Paper>
//     )
// };

// export default AccountTraxType;
