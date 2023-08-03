import React from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,TextField,
} from "@material-ui/core";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  fetchCCEnrollPayersList,
  fetchCCEnrollCampaignsList,
} from "~/redux/helpers/dashboard";

class PayeesFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      hasBothDateSelected: true,
      dateToggleOpen:false,
      filters:{
        name:this.props.name,
        id:this.props.id,
        payer:this.props.payer,
        payersList: [],
        campaign:this.props.campaign,
        campaignsList:[],
        startDate:this.props.startDate,
        endDate:this.props.endDate,
        selectedDuration:this.props.timeRange,
        onboardDuringList:[
          {key:"curMonth",label:"This Month"},
          {key:"prevMonth",label:"Last Month"},
          {key:"curYear",label:"This Year"},
          {key:"prevYear",label:"Last Year"},
          {key:"custom",label:"Custom"},
        ],
        selectedCurrency:this.props.selectedCurrency,
      }
    };
  }
  

  componentDidMount() {
    // this.setDateOnDatePicker();
    this.getPayersList(); 
  }

getPayersList=()=>{
    const allPayers = {
        clientId: 0,
        clientName: "All Payers"
    }     
    const {source}= this.props;  
    const {filters}= this.state;
    fetchCCEnrollPayersList(source === "" ? 0 : source).then((res) => {            
        if(res.error || res.isError){
            this.setState({
                alertMsg: res.message || res.title,
                alertType: "error"
            })
            return false
        }      
        this.setState({
          filters:{
            ...filters,
            // payer: 0,
            payersList: [allPayers, ...res?.result?.payersList]
          }
        }, ()=> this.getCampaignsList())
    })         
} 

getCampaignsList=()=>{
    const allCampaigns = {
        ccCampaignId: 0,
        ccCampaignName: "All Campaigns"
    }        
    const {payer,filters} = this.state;  
    const {source}= this.props;         
    fetchCCEnrollCampaignsList(source === "" ? 0 : source, payer ?? 0).then((res) => {            
        if(res.error || res.isError){
            this.setState({
                alertMsg: res.message || res.title,
                alertType: "error"
            })
            return false
        }                  
        this.setState({
          filters:{
            ...filters,
            // campaign: 0,
            campaignsList: [allCampaigns, ...res?.result?.ccCampaignList]
          }
        })
    })        
}
  closeDatePickerPopup = () => {
    const {filters}= this.state;
    const {startDate, endDate} = filters;
    if (Boolean(startDate) && Boolean(endDate)) {
      this.setState({
        dateToggleOpen: false,
        hasBothDateSelected: true,
      });
    } else {
      this.setState({
        hasBothDateSelected: false,
      });
    }
  };
  handleChangeInput =(e) =>{
    const {filters} = this.state;
    const {name,value}= e.target;
    this.setState({filters: {...filters,[name]: value}});
  }
  handleSelectionChange =(e)=>{
    const [name , value] = e.currentTarget;
    const {filters} = this.state;
    this.setState({filters: {...filters,[name]:value}});
  }
  applyFilters = ()=>{
    const {filters} = this.state;
    this.props.applyMoreFilters(filters);
  }

  setDateOnDatePicker=(e)=>{
    const {filters}= this.state;
    const {startDate, endDate, selectedDuration} = filters;
    let fDate = null;
    let lDate= null;

    const date = new Date();
    const y = date.getFullYear(); 
    const m = date.getMonth();        

      
    if(selectedDuration === 'curMonth'){            
        fDate = new Date(y, m, 1);
        lDate = new Date(y, m, date.getDate());
    }
    else if(selectedDuration === 'prevMonth'){            
        fDate = new Date(y, m-1, 1);
        lDate = new Date(y, m, 0);
    }
    else if(selectedDuration === 'curYear'){            
        fDate = new Date(y, 0, 1);
        lDate = new Date(y, m, date.getDate());
    }
    else if(selectedDuration === 'prevYear'){            
        fDate = new Date(y-1, 0, 1);
        lDate = new Date(y-1, 11, 31);
    }
    else{
        fDate = Boolean(startDate) && !Boolean(e) ? startDate : new Date(y, m, date.getDate()-1);
        lDate = Boolean(endDate) && !Boolean(e) ? endDate : new Date(y, m, date.getDate());
    } 

    this.setState({
      filters:{
        ...filters,
        startDate: fDate,
        endDate: lDate
      }
    }, ()=> this.addActiveClassOnBtn())
  }

  handleDateOnChange = (dates) =>{
    const [start, end] = dates;
    const {filters} = this.state;
    this.setState({
      filters:{
        ...filters,
        startDate: start,
        endDate: end,
        selectedDuration: 'custom',
      }
    }, ()=>this.addActiveClassOnBtn());
  }

  addActiveClassOnBtn=()=>{
    const {filters}= this.state;
    const {selectedDuration} = filters;
    const currentClass = document.getElementsByClassName("btn");
    for(let i = 0; i < currentClass.length; i++) {
        currentClass[i].classList.remove("active");
        const val = currentClass[i].getAttribute('value');
        if(val === selectedDuration){
            currentClass[i].classList.add("active");
        }
    }        
  } 

  resetFilters=()=>{
    const {filters} = this.state;
    this.setState({
      filters:{
        ...filters,
        name:"",
        id:"",
        payer:"",
        campaign:"",
        startDate:"",
        endDate:"",
        selectedDuration:"",
        onboardDuringList:"",
        selectedCurrency: "ALL",
      }
    });
    this.props.resetMoreFilters();
  }
  render() {
    const {
      processing,
      dateToggleOpen,
      hasBothDateSelected,filters,
    } = this.state;
    const { selectedDuration,name,id,startDate,endDate,
      payer,payersList,campaign,campaignsList,
      selectedCurrency,onboardDuringList} = filters;
    const {classes} = this.props;
    return (
      <Grid className="vendorInfo overflowAuto">
        <Grid item xs={12}>
          <Box my={2}>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="name"
              label="Payee Name"
              variant="outlined"
              value={name}
              onChange={(e)=>this.handleChangeInput(e)}
              inputProps={{
                maxLength: 100
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box my={2}>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="id"
              label="Payee ID"
              variant="outlined"
              value={id}
              onChange={(e)=>this.handleChangeInput(e)}
              inputProps={{
                maxLength: 100
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={2}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label="Payer"
              variant="outlined"
              value={payer}
              name="payer"
              onChange={this.handleChangeInput}
            >
              {payersList &&
                payersList.map((option) => (
                  <MenuItem
                    id={`payer_${option.clientId}`}
                    key={`payer_${option.clientId}`}
                    value={option.clientId}
                  >
                    {option.clientName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={2}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label="Campaign"
              variant="outlined"
              value={campaign}
              name="campaign"
              onChange={this.handleChangeInput}
            >
              {campaignsList &&
                campaignsList.map((option) => (
                  <MenuItem
                    id={`campaign_${option.ccCampaignId}`}
                    key={`campaign_${option.ccCampaignId}`}
                    value={option.ccCampaignId}
                  >
                    {option.ccCampaignName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={2}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label="Onboarding Time Range"
              variant="outlined"
              value={selectedDuration}
              onChange={(e) => this.setState({
                filters:{
                  ...filters,
                  selectedDuration : e.target.value
                }
              }, ()=> this.setDateOnDatePicker(e))}
            >
              {onboardDuringList &&
                onboardDuringList.map((option) => (
                  <MenuItem
                    id={`onboarded_${option.key}`}
                    key={`onboarded_${option.key}`}
                    value={option.key}
                  >
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box className={classes.enrollMidSec}>
            <Box className="DateBox">
              <Box className="DateBoxTop">
                <TextField
                  id="dateRangeBox"
                  variant="outlined"
                  label="Date Range"
                  fullWidth={true}
                  autoComplete="off"
                  value={
                    startDate &&
                    endDate &&
                    `${moment(startDate).format("DD/MM/YYYY")} - ${moment(
                      endDate
                    ).format("DD/MM/YYYY")}`
                  }
                  onFocus={() => this.setState({ dateToggleOpen: true })}
                  InputLabelProps={{ shrink: startDate ? true : false }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment>
                        <IconButton className="dateIcon">
                          <ArrowDropDownIcon
                            size="small"
                            onClick={() =>
                              this.setState({ dateToggleOpen: true })
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {Boolean(dateToggleOpen) && (
                <Box className={"datePickerBox"}>
                  <div class="arrowUp">
                    <ArrowDropUpIcon />
                  </div>
                  <Box component={"div"} className="datePicker">
                    <DatePicker
                      selected={startDate}
                      onChange={(dates) => this.handleDateOnChange(dates)}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                    />
                  </Box>

                  <Box
                    component={"div"}
                    style={{
                      float: "left",
                      width: "100%",
                    }}
                  >
                    {!Boolean(hasBothDateSelected) && (
                      <Typography
                        variant="h2"
                        className={classes.error}
                        style={{
                          float: "left",
                          margin: "17px 0 0 20px",
                          fontSize: "14px",
                          color: "#E03617",
                          fontWeight: "300",
                        }}
                      >
                        Please select both dates.
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        float: "right",
                        margin: "10px 6px 0 0",
                        width: "110px",
                      }}
                      onClick={() => this.closeDatePickerPopup()}
                    >
                     DONE
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={2} style={{"float":"left"}}>
            <FormLabel id="demo-controlled-radio-buttons-group">Currency</FormLabel>
            <RadioGroup row aria-label="currency" name="selectedCurrency" value={selectedCurrency} 
            onChange={(e) => this.handleChangeInput(e)}
            >
                <FormControlLabel value="ALL" control={<Radio />} label="Both" />
                <FormControlLabel value="USD" control={<Radio />} label="USD" />
                <FormControlLabel value="CAD" control={<Radio />} label="CAD" />
            </RadioGroup>
          </Box>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              type="submit"
              size="large"
              fullWidth={true}
              variant="outlined"
              color="primary"
              onClick={()=>this.resetFilters()}
            >
             RESET
            </Button>
          </Grid>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Grid item xs={6}>
              <Button
                disableElevation
                size="large"
                type="submit"
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={()=>this.applyFilters()}
              >
                APPLY
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PayeesFilters);
