import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import './global.scss';
import 'dayjs/locale/vi';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { DatesProvider } from '@mantine/dates';
import { theme } from './theme';
import { Layout } from '@/components/Layout/Layout';
import store, { persistor } from '@/store';
import appConfig from './configs/app.config';
import { mockServer } from './mock/mock';

export default function App() {
  /**
   * Set enableMock(Default true) to true at configs/app.config.js
   * If you wish to enable mock api
   */
  if (appConfig.enableMock) {
    mockServer();
  }

  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <DatesProvider settings={{ locale: 'vi' }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </DatesProvider>
    </MantineProvider>
  );
}
