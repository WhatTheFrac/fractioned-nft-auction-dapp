// constants
import {
  ADD_TRANSACTION,
  SET_TRANSACTION_CONFIRMED,
  STATUS_CONFIRMED,
} from '../constants/transactionConstants';

// utils
import { isCaseInsensitiveEqual } from '../utils';


const initialState = {
  data: [],
};

const collectiblesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return { ...state, data: [...state.data, action.payload] };
    case SET_TRANSACTION_CONFIRMED:
      const updatedData = state.data.reduce((data, transaction, index) => {
        if (isCaseInsensitiveEqual(transaction.hash, action.payload)) {
          data[index] = { ...transaction, status: STATUS_CONFIRMED };
        }
        return data;
      }, state.data)
      return { ...state, data: updatedData };
    default:
      return state;
  }
};

export default collectiblesReducer;
