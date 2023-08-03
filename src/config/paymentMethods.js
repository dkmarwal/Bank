export const paymentMethods = {
    "Zelle":"CXC",
    "PushToCard":"MSC",
    "PayPal":"PPL",
    "ACH": "ACH",
    "CHK": "CHK",
    "VirtualCard": "VCA",
    "EFT": "EFT",
    "USBankZelle":"ZEL", // Zelle Code for US Bank
    "USBankACH": "ACH",
    "USBankCHK": "CHK",
    "USBankRTP":"RTP",
    "USBankDepositToDebitcard":"DDC",
    "USBankPrepaidCard":"PPD",
    "PrepaidFocusNonPayroll":"PFB",
    "PrepaidReliaCard":"PRC",
    "PrepaidCorporateReward":"PCR",
    "PlasticCorporateCard":"CRP",
    "DigitalCorporateCard":"CRD"
}

export const paymentMethodsCode = {
    USBankPrepaidCard:512,
    PrepaidCorporateReward:1024,
    PlasticCorporateCard:8192,
    DigitalCorporateCard:16384,
    PrepaidFocusNonPayroll:2048,
    PrepaidReliaCard:4096
}
export const paymentFileFormatId = {
    "USBankZelle":256, // Zelle Code for US Bank
    "USBankACH": 1,
    "USBankCHK": 2,
    "USBankRTP":512,
    "USBankDepositToDebitcard":1024,
    "USBankPrepaidCard":2048,
}