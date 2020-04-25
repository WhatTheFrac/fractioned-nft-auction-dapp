import { combineReducers } from 'redux';

// reducers
import walletReducer from './walletReducer';


const rootReducer = combineReducers({
  wallet: walletReducer,
});

export default rootReducer;
