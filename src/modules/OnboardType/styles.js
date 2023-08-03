const styles = (theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  selectionContainer: {
    margin: "1rem 1.312rem",
    boxSizing: "border-box",
    width: "30.625rem",
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.active,
    boxShadow: "0 2px 5px 2px rgba(96, 148, 177, 0.36)",
    display: "block",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    padding: "1.531rem 3.188rem",
  },
  onboartTypeTitle: {
    color: theme.palette.primary.main,
    letterSpacing: 0,
    margin: "0 0 32px 0",
    lineHeight: "32px",
    textAlign: "center",
    fontWeight: "500",
  },
  onboartTypeDescription: {
    margin: "40px 0",
    color: theme.palette.text.primary,
    letterSpacing: 0,
    lineHeight: "22px",
    fontSize: 16,
    fontWeight: 500,
  },
  primaryButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0.25rem 4.15rem",
  },
});

export default styles;
