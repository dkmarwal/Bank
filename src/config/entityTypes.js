export const EntityType = {
    "B2B": 1,
    "B2C": 2,
    "ALL": 3,
	"CARDS": 4
}

export const CardType = {
    MSC1: 1,
    MSC2: 2,
    VISA1: 3,
    VISA2: 4
}

export const PayerTypes ={
    PMTX: 1,
    CARDS: 2,
    OTHERS: 3
}

export const GroupLimit = {
    PROGRAMLIMIT: 30,
    MCCGROUPLIMIT: 30,
    PURCHASETYPELIMIT: 30
}

export const validForOptions = [
	{id:1, title:"1M"},
	{id:2, title:"2M"},
	{id:3, title:"3M"},
	{id:4, title:"4M"},
	{id:5, title:"5M"},
	{id:6, title:"6M"},
	{id:7, title:"7M"},
	{id:8, title:"8M"},
	{id:9, title:"9M"},
	{id:10, title:"10M"},
	{id:11, title:"11M"},
	{id:12, title:"12M"},
	{id:13, title:"13M"},
	{id:14, title:"14M"},
	{id:15, title:"15M"},
	{id:16, title:"16M"},
	{id:17, title:"17M"},
	{id:18, title:"18M"},
	{id:19, title:"19M"},
	{id:20, title:"20M"},
	{id:21, title:"21M"},
	{id:22, title:"22M"},
	{id:23, title:"23M"},
	{id:24, title:"24M"},
];

export const USBANK_TRANSACTION_TYPE="dboctdisbursement";
	
export const declinedPercentageOptions = [
	{key:"1", value:"USD", label:"Declined / All payees annual spend (USD)"},
	{key:"2", value:"CAD", label:"Declined / All payees annual spend (CAD)"},
];
export const pendingPercentageOptions = [
	{key:"1", value:"USD", label:"USD Potential spend vs All payees annual spend of all time"},
	{key:"2", value:"CAD", label:"CAD Potential spend vs All payees annual spend of all time"},
];

export const FILE_SETTING_CUSTOM_FIELD_LIMIT = 5;

export const FILE_SETTING_MIN_ITEM_LIMIT = 3;

export const FILE_SETTING_PAYEE_ID_FIELD_ID = 1;

export const USBankDynamicReport = "Dynamic Reports";
