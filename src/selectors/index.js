export const getAccountSelector = state => state.account.account;
export const getPassPhraseSelector = state => state.account.passPhrase;
export const getMessagesSelector = state => state.messages.messages;
export const getDecimalsSelector = state => state.account.decimals;
export const getTickerSelector = state => state.account.ticker;
export const getSettingsSelector = state => state.accountSettings;
export const get2FASelector = state => state.account.is2FA;
export const getIsLocalhostSelector = state => state.account.isLocalhost;