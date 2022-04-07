import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  EMAIL_VERIFY,
  GET_NOTIFICATIONS,

} from './types';

import setAuthToken from '../utils/setAuthToken';
//email verify
export const emailVerify = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/auth/email');
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
 

  } catch (err) {
   
    const errors = err.response.data.errors;
    console.log(errors,'userloaded')
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      // setTimeout(() =>{
      //   window.location.reload();
      //  },1000);
    }
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ username, name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);


    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });


     dispatch(loadUser());
     dispatch(emailVerify());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors)
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      // setTimeout(() =>{
      //   window.location.reload();
      //  },1000);
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
//      setTimeout(() =>{
//       window.location.reload();
//      },1000);
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};


// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });


};


export const emailCheckForPW = (email) => async (dispatch) =>{
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({email})
  try{
    const res= await axios.post('api/users/forgotpassword', body, config);
    dispatch(setAlert(res.data));
  }catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Get profile by ID
export const emailValidateById = (userId) => async (dispatch) => {
  
  try {
    const res = await axios.get(`/api/users/changepassword/${userId}`);
    dispatch({
      type: EMAIL_VERIFY,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const changePassword = (body) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(`/api/users/changepassword`, body, config);
    dispatch(setAlert(res.data));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// export const getNotifications = () => async (dispatch) => {
//   try {
//     const res = await axios.get('/api/notifications');

//     dispatch({
//       type: GET_NOTIFICATIONS,
//       payload: res.data,
//     });
//   } catch (err) {
 
//     // dispatch({
//     //   type: AUTH_ERROR,
//     //   payload: { msg: err.response.statusText, status: err.response.status },
//     // });
//   }
// };


