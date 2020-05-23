// constants
import {
  ADD_ALL_FRAC,
  ADD_TRANSACTION,
  SET_TRANSACTION_CONFIRMED,
  STATUS_CONFIRMED,
  SET_WAITING_FOR_TRANSACTION_SUBMIT,
  RESET_FRACTIONATE_TRANSACTION,
  TRANSACTION_TYPE,
  SET_FRACS_FETCHING,
} from '../constants/transactionConstants';

// utils
import { isCaseInsensitiveEqual } from '../utils';


const initialState = {
  data: [],
  waitingForSubmit: false,
  fracsFetching: false,
  allFrac: [],
};

const collectiblesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ALL_FRAC:
      return { ...state, allFrac: action.payload, fracsFetching: false };
    case SET_FRACS_FETCHING:
      return { ...state, fracsFetching: true };
    case SET_WAITING_FOR_TRANSACTION_SUBMIT:
      return { ...state, waitingForSubmit: true };
    case ADD_TRANSACTION:
      return { ...state, data: [...state.data, action.payload], waitingForSubmit: false };
    case SET_TRANSACTION_CONFIRMED:
      const updatedData = state.data.reduce((data, transaction, index) => {
        if (isCaseInsensitiveEqual(transaction.hash, action.payload)) {
          data[index] = { ...transaction, status: STATUS_CONFIRMED };
        }
        return data;
      }, [...state.data])
      return { ...state, data: updatedData };
    case RESET_FRACTIONATE_TRANSACTION:
      return {
        ...state,
        data: [...state.data.filter((transaction) => transaction.type !== TRANSACTION_TYPE.FRACTIONATE)],
        waitingForSubmit: false,
      };
    default:
      return state;
  }
};

export default collectiblesReducer;
