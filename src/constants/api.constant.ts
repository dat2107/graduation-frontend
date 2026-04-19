export const TOKEN_TYPE = 'Bearer ';
export const REQUEST_HEADER_AUTH_KEY = 'Authorization';
export const FUNCTION_NAME = {
  GEN_CAPTCHA: 'genCaptcha',
  LOGIN: 'secureLogin',
  GET_TRANSACTIONS: 'getTransactionHistoryAllSource',
  GET_CURRENCY_LIST: 'savGetListCurrency',
  GET_SAVING_ACCOUNT_LIST: 'savQueryListAccountTD',
  GET_ACCOUNT_MANAGEMENT_WEB: 'getAccountManagementWeb',
  GET_LOAN_ACCOUNT_LIST: 'queryLoanAndOverDrafts',
  GET_CUSTOMER_EDIT_INFO: 'getCustomerEditInfo',
};
export const RESULT_CODE = {
  SUCCESS: '0',
  TOKEN_EXPIRED: 'ESM-9016',
  EXPIRED: 'ESM-9002',
  CAPTCHA_EXPIRED: 'CAPTCHA-0002',
};
