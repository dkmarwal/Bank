const styles = (theme) => ({
    gridItem: {
        margin: 0
    },
    toolTipText: {
        color: '#008ce6',
        paddingLeft: 5,
        cursor: 'pointer'
    },
    addBtnGrid: {
        alignItems: 'flex-start',
        justifyContent: 'end',
        padding: 10
    },
    addBtn: {
        border: '2px solid #0B1941',
        borderRadius: 6
    },
    btnInfoText: {
        fontSize: theme.spacing(1.5),
        fontStyle: 'italic',
        color: '#4C4C4C'
    },
    saveButton: {
        marginLeft: theme.spacing(2)
    },
    nextButtonGrid: {
        background: '#F7F7F7',
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingTop: '30px',
    },
    mainGrid: {
        paddingBottom:'70px',
    },
    divider: {
        height: '0.8px',
        background: '#8F9EC4'
    },
    cardImageIcon: {
        padding: '5px 4px',
        verticalAlign: 'middle'
    },
    cardImageLabel: {
        color: 'rgba(0, 0, 0, 0.26)' //#4C4C4C

    },
    deleteIconBox: {
        textAlign: 'end'
    },
    deleteIcon: {
        color: '#0B1941',
        cursor: 'pointer',
        paddingLeft: theme.spacing(1)
    },
    paper: {
        width: '100%',
        border: '1px dashed #CCCCCC',
        boxShadow: 'none'
    },
    mccBtnInfoText: {
        fontSize: theme.spacing(1.5),
        fontStyle: 'italic',
        color: '#4C4C4C',
        textAlign: 'end'
    },
    programInfoText: {
        fontStyle: 'italic',
        paddingLeft: theme.spacing(2)
    },
    errorAlertText: {
        border: '1px solid #E02020',
        background: '#fff',
        color: '#E02020'
    },
    headItem: {
        fontSize: 24,
        color: '#0B1941',
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2)
    },
    nextButton:{
        padding: "0.60rem 2.15rem",
        fontSize: "14px",
    },
    mccInput:{
        '& .MuiAutocomplete-root':{
            '& .MuiFormControl-root':{
                '& input':{
                    padding: "8.4px 4px"
                }
            },
        }
    },
    p9:{
        padding: '0px 9px'
    },
    countryStyle: {
        '& .MuiSelect-select': {
            fontSize: 14,
            padding: '17.5px 14px'
        }
    }
});
export default styles;
