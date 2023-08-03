import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    Paper,
    Grid,
    MenuItem,
    Box,
    CircularProgress,
} from "@material-ui/core";
import "./styles.scss";
import Button from "~/components/Forms/Button";
import PromptImport from "~/components/Dialogs/PromptImport";
import TextField from "~/components/Forms/TextField";
import { Country, City, State } from "../../components/CSC";
import { fetchLocationsList } from "~/redux/helpers/userProfile";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import Tabs from "~/components/Forms/Tabs";
import { TabPanel } from "~/components/TabPanel/index";
import {
    fetchCompanyData,
    fetchParentCompanyData,
    updateCompanyData,
    createUserInfo,
} from "~/redux/helpers/userProfile";
import Notification from "~/components/Notification";
import "react-notifications/lib/notifications.css";
import trim from 'deep-trim-node';
import MaskInput from "~/components/MaskInput";
import MaskedInput from "../../components/MaskedInput";

function UserProfile({ updateOnboardingStep, dispatch, history }) {
    const [process, setProcess] = useState(false);
    const [onNextLoading, setOnNextLoading] = useState(false);
    const [clientId] = useState(sessionStorage.getItem("clientId"));
    const [isHippa, setIsHippa] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [parentCompanyData, setparentCompanyData] = React.useState({});
    const [value, setValue] = React.useState(0);
    const [location, setlocation] = useState([]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [companyInfoObj, setcompanyInfoObj] = useState({
        data: {
            clientId: null,
            clientName: "",
            taxId: "",
            taxIdIsSSN: 0,
            emailAddress: "",
            groupId: "",
            countryCode: "+1",
            phoneNumber: "",
            phoneExt: "",
            locationTypeId: "",
            address1: "",
            address2: "",
            city: "",
            stateRegion: "",
            zipPostal: "",
            countryIso: null,
            fax: "",
            website: "",
            duns: "",
            bankId: null,
            parentId: null,
            stepId: null,
            isVerified: null,
            isHippa: null,
        },
        error: {
            clientId: null,
            clientName: "",
            taxId: "",
            taxIdIsSSN: 0,
            emailAddress: "",
            groupId: "",
            countryCode: "",
            phoneNumber: "",
            phoneExt: "",
            locationTypeId: "",
            address1: "",
            address2: "",
            city: "",
            stateRegion: "",
            zipPostal: "",
            countryIso: "",
            fax: "",
            website: "",
            duns: "",
            bankId: null,
            parentId: null,
            stepId: null,
            isVerified: null,
        },
    });
    const [userInfoObj, setuserInfoObj] = useState({
        data: {
            title: "Mr",
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            confirm_pass: "",
            // isSSO: parseInt(value) === 1,
            SSOUserId: null, // send if isSSO true;
            phoneCountryCode: "+1",
            phone: "",
            userPhoneExt: "",
            email: "",
            isFirstUser: true,
        },
        error: {
            title: "",
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            confirm_pass: "",
            // isSSO: false,
            SSOUserId: null, // send if isSSO true;
            phoneCountryCode: "",
            phone: "",
            userPhoneExt: "",
            email: "",
            isFirstUser: true,
        },
    });

    useEffect(() => {
        updateOnboardingStep(3);
        getCompanyInfo();
        getlocationType();
    }, []);

    const getlocationType = () => {
        fetchLocationsList()
            .then((response) => {
                if (response.error) {
                    throw response.error;
                }
                const responseData = response.data.rows;
                setlocation(responseData);
            })
            .catch((error) => { });
    };

    const getCompanyInfo = () => {
        fetchCompanyData({ clientId: sessionStorage.getItem("clientId") }).then(
            (response) => {
                if (response.error) {
                    throw response.error;
                }
                if (
                    response.data &&
                    response.data.rows &&
                    response.data.rows.length > 0
                ) {
                    const responseData = response.data.rows[0];
                    if (
                        responseData.parentId !== null ||
                        typeof responseData.parentId !== "undefined"
                    ) {
                        getParentCompanyData();
                        setIsHippa(responseData.isHippa);
                        setParentId(responseData.parentId);
                    }
                    setcompanyInfoObj({
                        ...companyInfoObj,
                        data: { ...companyInfoObj.data, ...responseData },
                    });
                }
            }
        );
    };

    const pwdRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
    const tooltipObj = {
        title: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
        arrow: true,
        placement: "top-end",
    };
    const tabLabels = [
        "Register using Single Sign On (SSO) ID",
        "Register as Stand Alone User",
    ];

    const saveCompanyInfoData = () => {
        const data = {
            countryCode: companyInfoObj.data.countryCode ?? "+1",
            phoneNumber: companyInfoObj.data.phoneNumber ?? null,
            fax: companyInfoObj.data.fax ?? null,
            website: companyInfoObj.data.website ?? null,
            duns: companyInfoObj.data.duns ?? null,
            locationTypeId: companyInfoObj.data.locationTypeId ?? null,
            phoneExt: companyInfoObj.data.phoneExt ? companyInfoObj.data.phoneExt : null,
            address1: companyInfoObj.data.address1 ?? null,
            address2: null,
            countryIso: companyInfoObj.data.countryIso ? companyInfoObj.data.countryIso : null,
            city: companyInfoObj.data.city ?? null,
            stateRegion: companyInfoObj.data.stateRegion ?? null,
            zipPostal: companyInfoObj.data.zipPostal ?? null,
        };

        updateCompanyData({
            clientId: sessionStorage.getItem("clientId"),
            data: trim(data),
        })
            .then((response) => {
                if (response.error) {
                    setOnNextLoading(false);
                    setAlertMessage(response.error.message || "Error");
                    setAlertType("error");
                } else {
                    setOnNextLoading(false);
                    saveAdminCredentials();
                }
            })
            .catch((error) => {
                setAlertMessage(error.message || "Server exception occured");
                setAlertType("error");
            });
    };

    const saveAdminCredentials = async () => {
        const data = {
            title: title,
            firstName: firstName,
            lastName: lastName,
            isSSO: value === 0 ? true : false,
            ...(value === 0 ? { SSOUserId: SSOUserId } : {
                userName: userName,
                password: password,
            }), // send if isSSO true;
            phoneCountryCode: phoneCountryCode,
            phone: phone,
            email: email,
            isFirstUser: isFirstUser,
        };
        // Creating user for client portaltype id 2
        createUserInfo({
            portalTypeId: 2,
            portalProfileId: clientId,
            data: trim(data),
        })
            .then((response) => {
                if (response.error) {
                    setOnNextLoading(false);
                    setAlertMessage(response.message || "Error!");
                    setAlertType("error");
                } else {
                    setOnNextLoading(false);
                    history.push({
                        pathname: "/clientOnboard/payments",
                    });
                }
            })
            .catch((error) => {
                setOnNextLoading(false);
                setAlertMessage(error || "Error!");
                setAlertType("error");
            });
    };
    const goToPaymentInfo = () => {
        if (validateInput()) {
            setOnNextLoading(true);
            saveCompanyInfoData();
        } else {
            setAlertMessage("Validation error! Please fill the required information.");
            setAlertType("error");
        }
    };

    const validateInput = () => {
        let valid = true;
        const isSSO = value === 0 ? true : false;
        // setCompanyError({ [name]: "" });
        // setUserInfoError({ [name]: "" });
        let companyErrorText = {};
        let userInfoErrorText = {};
        let companyData = { ...companyInfoObj.data };
        let userInfoData = { ...userInfoObj.data };
        if (!companyData.clientName || companyData.clientName && companyData.clientName.trim().length === 0) {
            companyErrorText['clientName'] = "Company Name is required";
            valid = false;
        }
        if (
            !companyData.phoneNumber || companyData.phoneNumber && companyData.phoneNumber.length !== 10
        ) {
            companyErrorText['phoneNumber'] = "Phone number should be of 10 digits";
            valid = false;
        }
        if (!companyData.address1 || companyData.address1 && companyData.address1.trim().length === 0) {
            companyErrorText['address1'] = "Address is required";
            valid = false;
        }
        if (!companyData.stateRegion || companyData.stateRegion === "") {
            companyErrorText['stateRegion'] = "State is required";
            valid = false;
        }
        if (!companyData.city || companyData.city === "") {
            companyErrorText['city'] = "City is required";
            valid = false;
        }
        // if (
        //     companyData.phoneExt.length !== 0 &&
        //     companyData.phoneExt.length > 10
        // ) {
        //     companyErrorText['phoneExt'] = "Extension should not be more than 10 digits";
        //     valid = false;
        // }
        if (!companyData.zipPostal || (
            companyData.zipPostal && companyData.zipPostal.trim().length !== 0 &&
            (companyData.zipPostal.trim().length !== 5 && countryIso === 'US') || (companyData.zipPostal.trim().length !== 6 && countryIso === 'CA'))
        ) {
            let zipcode = countryIso === 'CA' ? "postal code" : "zip code"
            companyErrorText["zipPostal"] = `Please enter valid ${zipcode}`;
            valid = false;
        }
        if (!companyData.zipPostal || companyData.zipPostal && companyData.zipPostal.length > 0) {
            let re = /[a-zA-Z0-9]+$/
            let zipcode = countryIso === 'CA' ? "postal code" : "zip code"
            if (!re.test(companyData.zipPostal)) {
                companyErrorText["zipPostal"] = `Please enter valid ${zipcode}`;
                valid = false;
            }
        }

        if (!companyData.countryIso || String(companyData.countryIso).trim().length === 0) {
            companyErrorText["countryIso"] = "Country is required";
            valid = false;
        }

        if (!companyData.locationTypeId && companyData.locationTypeId !== 0) {
            companyErrorText["locationTypeId"] = "Location Type is required";
            valid = false;
        }

        if (companyData.duns &&
            companyData.duns.length !== 0 &&
            companyData.duns.length !== 9
        ) {
            companyErrorText["duns"] = "Duns Number should be of 9 digits";
            valid = false;
        }
        if (companyData.website &&
            companyData.website.length !== 0
        ) {
            const re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            if (!re.test(companyData.website.trim())) {
                companyErrorText["website"] = "Please enter valid Website";
                valid = false;
            }
        }
        if (!userInfoData.firstName || userInfoData.firstName && userInfoData.firstName.trim().length === 0) {
            userInfoErrorText["firstName"] = "First Name is required";
            valid = false;
        }
        if (!userInfoData.lastName || userInfoData.lastName && userInfoData.lastName.trim().length === 0) {
            userInfoErrorText["lastName"] = "Last Name is required";
            valid = false;
        }
        if (isSSO && (!userInfoData.SSOUserId || userInfoData.SSOUserId && userInfoData.SSOUserId.trim().length === 0)) {
            userInfoErrorText["SSOUserId"] = "SSO-ID is required";
            valid = false;
        }
        if (!isSSO && !userInfoData.userName || userInfoData.userName && userInfoData.userName.trim().length === 0) {
            userInfoErrorText["userName"] = "User Name is required";
            valid = false;
        }
        if (!isSSO && userInfoData.password && userInfoData.password.trim().length === 0) {
            userInfoErrorText["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
            valid = false;
        } else if (!isSSO && !userInfoData.password.match(pwdRegex)) {
            userInfoErrorText["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
            valid = false;
        }
        if (
            !isSSO &&
            userInfoData.confirm_pass !== userInfoData.password
        ) {
            userInfoErrorText["confirm_pass"] = "Password does not match";
            valid = false;
        }
        if (
            userInfoData.phone.length !== 0 &&
            userInfoData.phone.length !== 10
        ) {
            userInfoErrorText["phone"] = "Phone number should be of 10 digits";
            valid = false;
        }
        if (!userInfoData.phone || userInfoData.phone.trim().length === 0) {
            userInfoErrorText["phone"] = "Phone number should be of 10 digits";
            valid = false;
        }
        // if (
        //     userInfoData.user_ext.value.length !== 0 &&
        //     userInfoData.user_ext.value.length > 10
        // ) {
        //     userInfoErrorText["userExt"] = "Extension should not be more than 10 digits";
        //     valid = false;
        // }
        if (
            userInfoData.email.length === 0 ||
            !(emailReg.test(userInfoData.email.trim()))
        ) {
            userInfoErrorText["email"] = "Please enter valid Email Address";
            valid = false;
        }
        if (!valid) {
            setCompanyError(companyErrorText);
            setUserInfoError(userInfoErrorText);
        }
        return valid;
    }

    const setCompanyError = (errorData) => {
        setcompanyInfoObj({
            ...companyInfoObj,
            error: { ...errorData },
        });
    };

    const setUserInfoError = (errorData) => {
        setuserInfoObj({
            ...userInfoObj,
            error: { ...userInfoObj.error, ...errorData },
        });
    };

    const onBlurValidate = (event) => {
        const { name } = event.target;
        let { value } = event.target;
        const isSSO = value === 0 ? true : false;
        let valid = true;
        setCompanyError({ [name]: "" });
        setUserInfoError({ [name]: "" });

        switch (name) {
            case "clientName":
                {
                    if (!clientName) {
                        setCompanyError({ [name]: "Company Name is required" });
                    }
                }
                break;
            case "phoneNumber":
                {
                    if (!phoneNumber) {
                        setCompanyError({ [name]: "Phone number should be of 10 digits" });
                    } else if (!!phoneNumber && phoneNumber.length !== 10) {
                        setCompanyError({ [name]: "Phone number should be of 10 digits" });
                    }
                }
                break;
            case "address1":
                {
                    if (!address1) {
                        setCompanyError({ [name]: "Please enter Address" });
                    }
                }
                break;
            case "stateRegion":
                {
                    if (!stateRegion) {
                        setCompanyError({ [name]: "Please choose a State" });
                    }
                }
                break;
            case "city":
                {
                    if (!city && city.length == 0) {
                        setCompanyError({ [name]: "Please choose a City" });
                    }
                }
                break;
            case "phoneExt":
                {
                    if (!!phoneExt && phoneExt.length > 10) {
                        setCompanyError({
                            [name]: "Extension should not be more than 10 digits",
                        });
                    }
                }
                break;
            case "zipPostal":
                {
                    if (!zipPostal) {
                        setCompanyError({ [name]: "Please enter Zip Code" });
                    } else if (!!zipPostal && countryIso === "US") {
                        if (zipPostal.length !== 5)
                            setCompanyError({ [name]: "Please enter valid 5 digit Zip Code" });
                    }
                    else if (!!zipPostal && countryIso === "CA") {
                        if (zipPostal.length !== 6)
                            setCompanyError({ [name]: "Please enter valid 6 digit Zip Code" });
                    }
                }
                break;
            case "duns":
                {
                    if (!!duns && duns.length !== 9) {
                        setCompanyError({ [name]: "Duns Number should be of 9 digits" });
                    }
                }
                break;
            case "website":
                {
                    if (!!website) {
                        const re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
                        if (!re.test(website)) {
                            setCompanyError({ [name]: "Please enter valid Website" });
                        }
                    }
                }
                break;
            case "firstName":
                {
                    if (!firstName) {
                        setUserInfoError({ [name]: "First Name is required" });
                    }
                }
                break;
            case "lastName":
                {
                    if (!lastName) {
                        setUserInfoError({ [name]: "Last Name is required" });
                    }
                }
                break;
            case "phone":
                {
                    if (!phone) {
                        setUserInfoError({ [name]: "Phone number should be of 10 digits" });
                    } else if (phone.length !== 10) {
                        setUserInfoError({ [name]: "Phone number should be of 10 digits" });
                    }
                }
                break;
            case "userName":
                {
                    if (!userName) {
                        setUserInfoError({ [name]: "User Name is required" });
                    }
                }
                break;
            case "password":
                {
                    if (!password) {
                        setUserInfoError({ [name]: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character" });
                    } else if (!!password && !password.match(pwdRegex)) {
                        setUserInfoError({
                            [name]: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                        });
                    }
                }
                break;
            case "confirm_pass":
                {
                    if (confirm_pass !== password) {
                        setUserInfoError({ [name]: "Password does not match" });
                    } else if (!confirm_pass) {
                        setUserInfoError({ [name]: "Please fill confirm Password" });
                    }
                }
                break;
            case "userPhoneExt":
                {
                    if (!!userPhoneExt && userPhoneExt.length > 10) {
                        setUserInfoError({
                            [name]: "Extension should not be more than 10 digits",
                        });
                    }
                }
                break;
            case "email":
                {
                    if (!email) {
                        setUserInfoError({ [name]: "Email is required" });
                    } else if (
                        !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
                            value.toString().trim()
                        )
                    ) {
                        setUserInfoError({ [name]: "Please enter valid Email Address" });
                    }
                }
                break;
            case "locationTypeId":
                {
                    if (!locationTypeId && locationTypeId !== 0) {
                        setCompanyError({ [name]: "Location Type is required" });
                    }
                }
                break;
            default:
                break;
        }
        return valid;
    };


    const getParentCompanyData = () => {
        const clientId = sessionStorage.getItem("clientId");
        fetchParentCompanyData({ clientId })
            .then((response) => {
                if (response.error) {
                    throw response.error;
                }
                const responseData = response.data && response.data.rows && response.data.rows[0] && response.data.rows[0].parentInfo || {};
                setparentCompanyData(responseData);
            })
            .catch((error) => { });
    };

    const getParentData = () => {
        const parentData = parentCompanyData && parentCompanyData.clientLocations && parentCompanyData.clientLocations.length > 0 ? parentCompanyData.clientLocations[0] : {};
        const newData = {
            "locationId": parentData.locationId || "",
            "name": parentData.name || "",
            "description": parentData.description || "",
            "address1": parentData.address1 || "",
            "address2": parentData.address2 || "",
            "countryIso": parentData.countryIso || "US",
            "stateRegion": parentData.stateRegion || null,
            "city": parentData.city || null,
            "countryCode": parentData.countryCode || "+1",
            "zipPostal": parentData.zipPostal || "",
            "locationTypeId": parentData.locationTypeId || null
        }

        const newParentData = { ...companyInfoObj.data, ...parentCompanyData, ...newData };

        setcompanyInfoObj({
            ...companyInfoObj,
            data: {
                ...newParentData,
                clientId,
                clientName,
                phoneNumber,
                phoneExt,
                taxId: companyInfoObj.data.taxId || null,
            },
        });
    };

    const onChangeCompanyInfo = (event) => {
        const { name } = event.target;
        let { value } = event.target;
        if (["zip_code", "phone", "phoneExt", "duns_number"].includes(name)) {
            value = value.replace(/[^0-9]/g, "");
        }
        if (name === 'zipPostal') {
            value = value.replace(/[^a-zA-Z0-9]/g, "")
        }
        if (name === 'fax') {
            value = value.replace(/[^0-9+.]/g, "");
        }
        setcompanyInfoObj({
            ...companyInfoObj,
            data: { ...companyInfoObj.data, [name]: value },
        });
    };

    const onChangeUserInfo = (event) => {
        const { name } = event.target;
        let { value } = event.target;
        if (["userPhoneExt"].includes(name)) {
            value = value.replace(/[^0-9]/g, "");
        }
        if (name === 'SSOUserId') {
            value = value.replace(/[^a-zA-Z0-9]/g, "")
        }
        setuserInfoObj({
            ...userInfoObj,
            data: { ...userInfoObj.data, [name]: value },
        });
    };

    const renderSnackbar = (type, message) => {
        return <Notification variant={type} message={message} handleClose={hideAlertMessage} />
    }

    const hideAlertMessage = () => {
        setAlertMessage(null);
        setAlertType(null);
    }

    const {
        clientName,
        taxId,
        countryCode,
        phoneNumber,
        phoneExt,
        locationTypeId,
        address1,
        city,
        stateRegion,
        zipPostal,
        countryIso,
        fax,
        website,
        duns,
        taxIdIsSSN,
        identificationType
    } = companyInfoObj.data;
    const {
        clientName: clientNameError,
        taxId: taxIdError,
        countryCode: countryCodeError,
        phoneNumber: phoneNumberError,
        phoneExt: phoneExtError,
        locationTypeId: locationTypeIdError,
        address1: address1Error,
        city: cityError,
        stateRegion: stateRegionError,
        zipPostal: zipPostalError,
        countryIso: countryIsoError,
        fax: faxError,
        website: websiteError,
        duns: dunsError,
    } = companyInfoObj.error;

    const {
        title,
        firstName,
        lastName,
        userName,
        password,
        confirm_pass,
        // isSSO,
        userPhoneExt,
        SSOUserId, // send if isSSO true;
        phoneCountryCode,
        phone,
        email,
        isFirstUser,
    } = userInfoObj.data;

    const {
        title: titleError,
        firstName: firstNameError,
        lastName: lastNameError,
        userName: userNameError,
        password: passwordError,
        confirm_pass: confirm_passError,
        // isSSO: isSSOError,
        userPhoneExtError,
        SSOUserId: SSOUserIdError, // send if isSSO true;
        phoneCountryCode: phoneCountryCodeError,
        phone: phoneError,
        email: emailError,
        isFirstUser: isFirstUserError,
    } = userInfoObj.error;

    return (
        <form autoComplete="off" className="companyDetails">
            <Box px={6} pt={1} pb={4}>
                <Grid className="import_text">
                    {parentCompanyData && parentCompanyData.clientName && parentId && (
                        <PromptImport
                            promptText="We noticed that client's parent company is registered with us. Would you like to import the company information?"
                            importCb={getParentData}
                        />
                    )}
                </Grid>
                <Paper className="client_profile" elevation={3}>
                    <Box p={2}>
                        <Grid container item xs={12}>
                            <Grid item container xs={12}>
                                {process ? (
                                    <CircularProgress color="primary" />
                                ) : (
                                    <>
                                        <Box display="flex" width="100%" className="title">Company Details:</Box>
                                        <Grid container spacing={3}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                container
                                                direction="row"
                                                spacing={3}
                                            >
                                                <Grid item xs={6}>
                                                    <TextField
                                                        color="secondary"
                                                        name="clientName"
                                                        label="Company Name"
                                                        type="text"
                                                        value={clientName}
                                                        inputProps={{ maxLength: 100 }}
                                                        onChange={onChangeCompanyInfo}
                                                        onBlur={onBlurValidate}
                                                        error={Boolean(clientNameError)}
                                                        helperText={clientNameError}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid container item xs={6} direction="row">
                                                    <Grid item xs={12} sm={3}>
                                                        <CountryPhoneCode
                                                            name={"countryCode"}
                                                            id={"countryCode"}
                                                            label={"Country"}
                                                            type={"select"}
                                                            value={countryCode}
                                                            onChange={onChangeCompanyInfo}
                                                            onBlur={onBlurValidate}
                                                            inputProps={{ maxLength: 4 }}
                                                            error={Boolean(countryCodeError)}
                                                            helperText={countryCodeError}
                                                            excludeCountryCode={["CA", "UM"]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} className="phoneField">
                                                        <MaskedInput
                                                            style={{ maxWidth: "90%", marginLeft: "5%" }}
                                                            name="phoneNumber"
                                                            id="phoneNumber1"
                                                            label="Phone Number"
                                                            type="text"
                                                            value={phoneNumber}
                                                            onChange={onChangeCompanyInfo}
                                                            onBlur={onBlurValidate}
                                                            inputProps={{ maxLength: 10 }}
                                                            placeholder={"XXX-XXX-XXXX"}
                                                            error={Boolean(phoneNumberError)}
                                                            helperText={phoneNumberError}
                                                            formatterProps={{
                                                                format: "###-###-####",
                                                                isNumericString: true
                                                            }}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <TextField
                                                            color="secondary"
                                                            name="phoneExt"
                                                            id="phoneExt"
                                                            label="Extension"
                                                            type="text"
                                                            value={phoneExt}
                                                            onChange={onChangeCompanyInfo}
                                                            onBlur={onBlurValidate}
                                                            inputProps={{ maxLength: 10 }}
                                                            error={Boolean(phoneExtError)}
                                                            helperText={phoneExtError}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                container
                                                direction="row"
                                                spacing={3}
                                            >
                                                <Grid item xs={12} sm={3}>
                                                    <Country
                                                        required
                                                        selectedCountry={companyInfoObj.data.countryIso || ""}
                                                        error={Boolean(countryIsoError)}
                                                        helperText={countryIsoError}
                                                        name={"countryIso"}
                                                        label={"Country"}
                                                        onChange={(e) => {
                                                            setcompanyInfoObj({
                                                                data: {
                                                                    ...companyInfoObj.data,
                                                                    countryIso: e.target.value,
                                                                    stateRegion: "",
                                                                    city: "",
                                                                    zipPostal: ""
                                                                },
                                                                error: companyInfoObj.error
                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <State
                                                        required
                                                        error={Boolean(stateRegionError)}
                                                        helperText={stateRegionError}
                                                        onChange={(e) => {
                                                            setcompanyInfoObj({
                                                                data: {
                                                                    ...companyInfoObj.data,
                                                                    stateRegion: e.target.value,
                                                                    city: ""
                                                                },
                                                                error: companyInfoObj.error
                                                            })
                                                        }}
                                                        selectedState={companyInfoObj.data.stateRegion || ""}
                                                        selectedCountry={companyInfoObj.data.countryIso || ""}
                                                        label={"State"}
                                                    />
                                                </Grid>
                                                {/*  */}

                                                <Grid item xs={6}>
                                                    <TextField
                                                        color="secondary"
                                                        name="fax"
                                                        id="fax"
                                                        label="Fax"
                                                        type="text"
                                                        value={fax}
                                                        onBlur={onBlurValidate}
                                                        onChange={onChangeCompanyInfo}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                container
                                                direction="row"
                                                spacing={3}
                                            >
                                                <Grid item xs={12} sm={3}>
                                                    <City
                                                        required
                                                        name="city"
                                                        error={Boolean(cityError)}
                                                        helperText={cityError}
                                                        selectedState={companyInfoObj.data.stateRegion || ""}
                                                        selectedCity={companyInfoObj.data.city || ""}
                                                        selectedCountry={companyInfoObj.data.countryIso || ""}
                                                        onChange={(e) => {
                                                            setcompanyInfoObj({
                                                                data: {
                                                                    ...companyInfoObj.data,
                                                                    city: e.target.value
                                                                },
                                                                error: companyInfoObj.error
                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        color="secondary"
                                                        name="zipPostal"
                                                        id="zipPostal"
                                                        label={countryIso === 'CA' ? 'Postal Code' : 'Zip Code'}
                                                        type="text"
                                                        value={zipPostal}
                                                        onChange={onChangeCompanyInfo}
                                                        onBlur={onBlurValidate}
                                                        inputProps={{ maxLength: countryIso === "US" ? 5 : 6 }}
                                                        error={Boolean(zipPostalError)}
                                                        helperText={zipPostalError}
                                                        required
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        color="secondary"
                                                        name="website"
                                                        label="Website"
                                                        type="text"
                                                        value={website}
                                                        onBlur={onBlurValidate}
                                                        error={Boolean(websiteError)}
                                                        helperText={websiteError}
                                                        onChange={onChangeCompanyInfo}
                                                        inputProps={{
                                                            maxLength: 200,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                container
                                                direction="row"
                                                spacing={3}
                                            >
                                                <Grid item xs={6}>
                                                    <TextField
                                                        color="secondary"
                                                        name="address1"
                                                        label="Address"
                                                        rows={2}
                                                        type="text"
                                                        value={address1}
                                                        onBlur={onBlurValidate}
                                                        inputProps={{ maxLength: 100 }}
                                                        onChange={onChangeCompanyInfo}
                                                        error={Boolean(address1Error)}
                                                        helperText={address1Error}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <MaskInput
                                                        name="duns"
                                                        id="duns"
                                                        label="Duns Number"
                                                        type="text"
                                                        value={duns}
                                                        getValue={(val) => {
                                                            setcompanyInfoObj({
                                                                ...companyInfoObj,
                                                                data: { ...companyInfoObj.data, duns: val },
                                                            });
                                                        }}
                                                        onBlur={onBlurValidate}
                                                        inputProps={{ maxLength: 9 }}
                                                        error={Boolean(dunsError)}
                                                        helperText={dunsError}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                container
                                                direction="row"
                                                spacing={3}
                                            >
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        color="secondary"
                                                        name="taxId"
                                                        id="taxId"
                                                        label={taxIdIsSSN != 2 ? "Federal Tax ID/SSN" : identificationType ? identificationType : 'Identification Number'}
                                                        type="text"
                                                        value={taxId}
                                                        onBlur={onBlurValidate}
                                                        disabled
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        color="secondary"
                                                        select
                                                        fullWidth={true}
                                                        autoComplete="off"
                                                        name="locationTypeId"
                                                        label="Location Type"
                                                        variant="outlined"
                                                        onChange={onChangeCompanyInfo}
                                                        onBlur={onBlurValidate}
                                                        value={locationTypeId}
                                                        error={Boolean(locationTypeIdError)}
                                                        helperText={locationTypeIdError}
                                                        required
                                                    >
                                                        <MenuItem id="" value="">
                                                            <em>Select</em>
                                                        </MenuItem>
                                                        {location &&
                                                            location.map(({ locationTypeId, description }) => (
                                                                <MenuItem
                                                                    id={`locationType_${locationTypeId}`}
                                                                    key={`locationType_${locationTypeId}`}
                                                                    value={locationTypeId}
                                                                >
                                                                    {description}
                                                                </MenuItem>
                                                            ))}
                                                    </TextField>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Grid item container xs={12}>
                                <div className="title">System Admin Credentials:</div>
                                <Grid container spacing={3} direction="row">
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        container
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Grid item xs={2} sm={2}>
                                            <TextField
                                                fullWidth={true}
                                                color="secondary"
                                                autoComplete="off"
                                                variant="outlined"
                                                name="title"
                                                select
                                                label="Prefix"
                                                value={title}
                                                onChange={onChangeUserInfo}
                                                error={Boolean(titleError)}
                                                helperText={titleError}
                                                required
                                            >
                                                <MenuItem key="Male" value="Mr">Mr</MenuItem>
                                                <MenuItem key="Female" value="Ms">Ms</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                color="secondary"
                                                name="firstName"
                                                label="First Name"
                                                type="text"
                                                value={firstName}
                                                error={Boolean(firstNameError)}
                                                helperText={firstNameError}
                                                inputProps={{ maxLength: 50 }}
                                                onChange={onChangeUserInfo}
                                                onBlur={onBlurValidate}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                color="secondary"
                                                name="lastName"
                                                label="Last Name"
                                                type="text"
                                                value={lastName}
                                                error={Boolean(lastNameError)}
                                                helperText={lastNameError}
                                                inputProps={{ maxLength: 50 }}
                                                onChange={onChangeUserInfo}
                                                onBlur={onBlurValidate}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                color="secondary"
                                                name="email"
                                                label="Email"
                                                type="text"
                                                value={email}
                                                error={Boolean(emailError)}
                                                helperText={emailError}
                                                onChange={onChangeUserInfo}
                                                onBlur={onBlurValidate}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        container
                                        direction="row"
                                        spacing={2}
                                    >

                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        container
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Grid item xs={12} sm={3}>
                                            <CountryPhoneCode
                                                name={"phoneCountryCode"}
                                                id={"phoneCountryCode"}
                                                label={"Country"}
                                                type={"select"}
                                                value={phoneCountryCode}
                                                onChange={onChangeUserInfo}
                                                onBlur={onBlurValidate}
                                                error={Boolean(phoneCountryCodeError)}
                                                helperText={phoneCountryCodeError}
                                                excludeCountryCode={["CA", "UM"]}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} className="phoneField">
                                            <MaskedInput
                                                name="phone"
                                                id="phone"
                                                label="Phone Number"
                                                type="text"
                                                required
                                                value={phone}
                                                placeholder={"XXX-XXX-XXXX"}
                                                error={Boolean(phoneError)}
                                                helperText={phoneError}
                                                onChange={onChangeUserInfo}
                                                onBlur={onBlurValidate}
                                                inputProps={{ maxLength: 10 }}
                                                formatterProps={{
                                                    format: "###-###-####",
                                                    isNumericString: true
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                color="secondary"
                                                name="userPhoneExt"
                                                id="userPhoneExt"
                                                label="Extension"
                                                type="text"
                                                value={userPhoneExt}
                                                onChange={onChangeUserInfo}
                                                onBlur={onBlurValidate}
                                                inputProps={{ maxLength: 10 }}
                                                error={Boolean(userPhoneExtError)}
                                                helperText={userPhoneExtError}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={9}
                                        container
                                        direction="row"
                                        spacing={2}
                                        justify="center"
                                    >
                                        <Tabs
                                            name={"isSSO"}
                                            value={value}
                                            onChange={handleChange}
                                            // onBlur={onBlurValidate}
                                            variant="fullWidth"
                                            labels={tabLabels}
                                            color="primary"
                                        ></Tabs>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TabPanel value={value} index={0}>
                                            <Grid container direction="row">
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    container
                                                    direction="row"
                                                    spacing={2}
                                                >
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            color="secondary"
                                                            name="SSOUserId"
                                                            id="SSOUserId"
                                                            label="SSO-ID"
                                                            type="text"
                                                            value={SSOUserId}
                                                            error={Boolean(SSOUserIdError)}
                                                            helperText={SSOUserIdError}
                                                            onChange={onChangeUserInfo}
                                                            onBlur={onBlurValidate}
                                                            inputProps={{ maxLength: 20 }}
                                                            required
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TabPanel value={value} index={1}>
                                            <Grid container direction="row" spacing={3}>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    container
                                                    direction="row"
                                                    spacing={2}
                                                >
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            color="secondary"
                                                            name="userName"
                                                            label="User Name"
                                                            type="text"
                                                            value={userName}
                                                            error={Boolean(userNameError)}
                                                            helperText={userNameError}
                                                            inputProps={{ maxLength: 50 }}
                                                            onChange={onChangeUserInfo}
                                                            onBlur={onBlurValidate}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid container item xs={12} spacing={2}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                color="secondary"
                                                                name="password"
                                                                label="Password"
                                                                type="password"
                                                                value={password}
                                                                error={Boolean(passwordError)}
                                                                helperText={passwordError}
                                                                onChange={onChangeUserInfo}
                                                                onBlur={onBlurValidate}
                                                                tooltipProps={tooltipObj}
                                                                required
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                color="secondary"
                                                                name="confirm_pass"
                                                                label="Confirm Password"
                                                                type="password"
                                                                value={confirm_pass}
                                                                onChange={onChangeUserInfo}
                                                                onBlur={onBlurValidate}
                                                                error={Boolean(confirm_passError)}
                                                                helperText={confirm_passError}
                                                                required
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/*<NotificationContainer />*/}
                            {alertMessage && renderSnackbar(alertType, alertMessage)}
                            <Grid container direction="row" alignItems="center" spacing={3}>
                                {/* <Grid container item xs={6} justify="flex-end">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={(e) =>
                          this.props.history.push({
                            pathname: `/clientOnboard/clientPermissions/:clientId`,
                          })
                        }
                        style={{padding: "0.60rem 2.15rem", marginTop: "24px", marginBottom: "24px"}}
                      >
                        Back
                    </Button>
                    </Grid> */}

                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
                <Grid container item xs={12} direction="row" justify="center">
                    {onNextLoading ? (
                        <CircularProgress color="primary" />
                    ) : (
                        <Button
                            color="primary"
                            onClick={goToPaymentInfo}
                            style={{ padding: "0.60rem 2.15rem", marginTop: "24px", marginBottom: "24px", fontSize: 14 }}
                        >
                            NEXT
                        </Button>
                    )}
                </Grid>
            </Box>
        </form>
    );
}
export default connect((state) => ({ ...state.user, ...state.clients }))(UserProfile);