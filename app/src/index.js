import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { theme } from 'rimble-ui';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

// components
import App from './containers/App';

// reducers
import rootReducer from './reducers/rootReducer';


const store = createStore(rootReducer, applyMiddleware(thunk));
const customTheme = Object.assign({}, theme, {
  fonts: {
    serif: 'Baloo Tamma 2',
    sansSerif: 'Baloo Tamma 2',
    mono: 'Baloo Tamma 2',
  },
});
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Baloo Tamma 2';
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <ThemeProvider theme={customTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
