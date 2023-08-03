import React from 'react';
import config from '~/config';
import CitiLogo from '~/assets/images/citi-color-logo.svg';
import USBankLogo from '~/assets/images/USBANK 1.svg';
import IncedoLogo from "~/assets/images/incedopay_logo.png";
import { BankType,BankLabel } from '~/config/bankTypes';

export function PortalBankLabel() {
  const renderName = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return BankLabel.USBANK;
      case BankType.CITIBANK:
      default:
        return BankLabel.CITIBANK;
    }
  };
  return renderName(config.bankTypeId);
}

export function PortalLogo() {
  const renderBankLogo = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return <img src={USBankLogo} alt='Citi Logo' height='34' width='116' />;
      case BankType.CITIBANK:
      default:
        return <img src={CitiLogo} alt='Citi Logo' height='34' width='58' />;
    }
  };

  return renderBankLogo(config.bankTypeId);
}

/**
 * Forget Password screen
 */
export function PortalName() {
  const renderPortalName = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return BankLabel.USBANK;
      case BankType.CITIBANK:
      default:
        return <img src={IncedoLogo} alt="Citi Logo" height="18" width="120" />
    }
  };
  return renderPortalName(config.bankTypeId)
}
