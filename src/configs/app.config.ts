import { LayoutTypes } from '@/@types/layout';

export type AppConfig = {
  apiPrefix: string;
  apiURL: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  enableMock: boolean;
  locale: string;
  layoutType: LayoutTypes;
};

const appConfig: AppConfig = {
  layoutType: LayoutTypes.SimpleSideBar,
  apiURL:
    'https://stbsandbox.lpbank.com.vn/adapter/backend-weblv24h-t24-uat3/rest/web/request',
  apiPrefix: '',
  authenticatedEntryPath: '/dashboard',
  unAuthenticatedEntryPath: '/sign-in',
  enableMock: false,
  locale: 'vi',
};

export default appConfig;
