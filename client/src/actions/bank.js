import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_BANK,
  BANK_ERROR,
  GET_EARNINGS,
  //  ADD_FUNDS,
  // WITHDRAWL_FUNDS
  // UPDATE_CASHBALANCE,
  // WITHDRAWL_FUNDS,
  // TRANSACTION,
} from './types';

export const getCurrentBank = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/bank');

    dispatch({
      type: GET_BANK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BANK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getEarnings = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/earnings');

    dispatch({
       type: GET_EARNINGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BANK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const withdrawlingFunds = (withdrawlAmount) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(
      '/api/bank/requestPayout',
      withdrawlAmount,
      config
    );

    dispatch({
      type: GET_BANK,
      payload: res.data,
    });
    dispatch(setAlert('withdrawl complete'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: BANK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// export const addFunds = (funds) => async (dispatch) => {
//   try {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//     const res = await axios.post('/api/bank/addFunds', funds, config);

//     dispatch({
//       type: ADD_FUNDS,
//        payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: BANK_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status },
//     });
//   }
// };
