import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { theme } from 'rimble-ui';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

// assets
import './assets/css/react-select-search-default.css';
import 'react-dropdown/style.css';

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
  body, input, textarea {
    font-family: 'Baloo Tamma 2';
  }
  
  * {
    margin: 0;
    padding: 0;
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
