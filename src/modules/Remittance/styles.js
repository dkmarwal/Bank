export default theme => ({
    paperBg: {
        backgroundColor: '#F7F7F7',
        padding: 32,
        boxShadow: 'none'
    },
    genralTitleBold: {
        fontSize: '16px',
        lineHeight: '22px',
        color: '#000000',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    required: {
        fontSize: '16px',
        lineHeight: '22px',
        color: '#0b1941',
        fontWeight: 'bold',
    },
    formatHeader: {
        fontSize: '16px',
        lineHeight: '22px',
        marginBottom: '29px',
        fontWeight: 'bold',
    },
    stepperWraper: {
        padding: '20px 10px',
        paddingTop: '36px',
    },
    gridBox: {
        backgroundColor: '#fff',
        width: 'auto',
    },
    NextButton: {
        fontSize: '14px',
        lineHeight: '22px',
        border: '1px solid #0b1941',
        margin: '3px 18px',
        textTransform: 'Capitalize',
        color: '#fff',
        backgroundColor: '#0b1941',
        padding: '0.60rem 2.15rem'
    },
    BackButton: {
        fontSize: '14px',
        lineHeight: '22px',
        border: '1px solid #0b1941',
        margin: '3px 18px',
        textTransform: 'Capitalize',
        color: '#4C4C4C',
        padding: '0.60rem 2.15rem'
    },
    ButtonGrouop: {
        textAlign: 'center',
        paddingBottom: '24px'
    },
    finishButton: {
        display: 'flex',
        margin: '32px auto',
        borderRadius: '6px',
        background: '#0B1941',
        color: '#ffffff',
        letterSpacing: '0.5px',
        height: '36px',
        minWidth: '139px',
        '&:hover': {
            background: '#0B1941'
        }
    },
    remitModeBox: {
        '& .boxWrap:hover': {
            boxShadow: '2px 2px 2px 2px red'
        }
    },
    remittanceBtnGroup: {
        border: 'solid 1px #cccccc',
        height: 42,
        '& .MuiToggleButton-root': {
            width: 100,
            color: theme.palette.primary.main,
            border: 'none'
        },
        '& .Mui-selected': {
            background: theme.palette.primary.main,
            color: '#fff',
            margin: '2px',
            borderRadius: '4px'
        },
        '& .Mui-selected:hover': {
            background: theme.palette.primary.main,
            color: '#fff'
        }
    },
    checkedIcon: {
        paddingRight: '8px'
    },
    genralTitle: {
        fontSize: '14px',
        lineHeight: '22px',
        color: '#000000',
        marginTop: '10px'
    }
});
