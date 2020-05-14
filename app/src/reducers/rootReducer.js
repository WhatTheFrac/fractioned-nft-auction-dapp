import { combineReducers } from 'redux';

// reducers
import walletReducer from './walletReducer';
import transactionReducer from './transactionReducer';


const rootReducer = combineReducers({
  wallet: walletReducer,
  transactions: transactionReducer,
});

export default rootReducer;
