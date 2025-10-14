import React from 'react';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import SideMenu from './components/shared/SideMenu';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import SnackBar from './components/shared/SnackBar';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SideMenu />
        <AppRoutes />
        <SnackBar/>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
