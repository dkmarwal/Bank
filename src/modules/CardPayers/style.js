const styles = (theme) =>({
    cardPayersDiv:{
        float: "left",
        width: "92%",
        background: "#fff",
        padding: 0,
        color: 'rgba(0,0,0,0.87)',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        boxSizing: "border-box",
        borderRadius: "4px",
        margin: "0 4% 2%"
    },

    downloadSec:{
        float: 'right',
        textAlign: 'right',
        padding: '6px 15px 0',
        "& .exportArea":{
            float: 'left',
            "& h6":{
                fontSize: 15,
                fontWeight: 400
            }
        },

        "& .divider":{
            float: 'left',
            width: '1px',
            height: '25px',
            background: '#8F9EC3',
            margin: '13px 0px 0 0',
        },

        "& .payeesList":{
            float: 'left',
            margin: '11px 0 0 20px',
            "& select":{
                width: "90px",
                fontSize: 14,
                paddingTop: 6,
                paddingBottom: 6
            }
        }
    },

    tableArea:{
        float: 'left',
        width: "100%",
        "& thead":{
            background: "#CCE4FF",
            "& h4":{
                color: "#2B2D30",
                fontSize: 14,
                padding: '0 0 5px 3px',
                fontWeight: 600
            },
            "& .MuiOutlinedInput-root":{
                background: '#fff',
                width: '130px',
                fontSize: '14px',
                fontWeight: '400',
            },
            "& th":{
                padding: "6px 10px",
                position: 'relative',
                "& input":{
                    padding: 8
                },
                "& select":{
                    padding: 8
                }
            },
            "& .resetBtn":{
                "& svg":{
                    cursor: 'pointer',
                    margin: '30px 0 0 -10px',
                    fontSize: '20px',
                    color: '#959595',
                }
            },
            "& .IdentificationNumber .MuiOutlinedInput-root":{
                width: 160
            },
            "& .enrollSpendBox .MuiOutlinedInput-root":{
                width: '100%'
            }
        },
        "& tbody":{
            "& td":{
                padding: "16px 10px",
                color: "#2B2D30",
                fontSize: 14,
                fontWeight: 400,
                "& span":{
                    background: '#B2DFFF',
                    padding: '5px 10px',
                    borderRadius: '20px',
                },
                "& img":{
                    height:22,
                    width: 22,
                    borderRadius: '50%',
                    margin: '0px 10px 0 0',
                    float: 'left',
                },
                "& h5":{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: 13,
                    fontWeight: 400,
                    display: 'inline-block',
                    color: "#fff",
                    "&.red":{
                        background: '#FF5776',
                        color: "#fff"
                    },
                    "&.lightBlue":{
                        background: '#21A2FF',
                        color: "#fff"
                    },
                    "&.darkBlue":{
                        background: '#008CE6',
                        color: "#fff"
                    }
                },
                "& label":{
                    color: '#0B1941',
                    float: 'left',
                    width: '35px',
                    height: '35px',
                    marginRight: '8px',
                    fontSize: '14px',
                    background: '#F0F6FB',
                    textAlign: 'center',
                    lineHeight: '35px',
                    borderRadius: '50%',
                }
            }
        }
    },

    onboardButton:{
        color: '#ffffff',
        padding: '12px 20px',
        background: '#008ce6 !important',
        borderRadius: '50px',
        margin: '-8px 4% 0 0 '
    },

    annualPopup:{
        position: "absolute",
        width: "290px",
        height: "298px",
        background:"#FFFFFF",
        boxShadow: "0px 6px 10px rgb(0 0 0 / 14%), 0px 1px 18px rgb(0 0 0 / 12%), 0px 3px 5px -1px rgb(0 0 0 / 20%)",
        borderRadius: "8px",
        zIndex: "2",
        left: '-40px',
        "& button":{
            fontSize: 12,
            padding: '6px 24px'
        }
    },

    cursorPointer: {
        cursor: "pointer",
        fontSize: "14px",
    }
})

export default styles;
