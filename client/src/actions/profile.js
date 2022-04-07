import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  GET_RECORD,
  GET_TAX_INFO,
  UPDATE_PLAYER_REVIEWS,
} from './types';

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const updatePlayerReviews = () => async (dispatch)=>{
try{
  const res = await axios.post('/api/profile/playerReviews');
}catch (err) {
  dispatch({
    type: PROFILE_ERROR,
    payload: { msg: err.response.statusText, status: err.response.status },
  });
}
}
// Create or update profile

//formdata that sumbitted

//redirect after submiting passing in history object which has method called push
//that will redirect to a client side route(withRouter in CreateProfile component)

//edit set to false and will change if it there has been a change
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  // dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanantly deleted'));
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
       errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

export const changeAvatar = (data) => async (dispatch) => {

  try{
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post('/api/profile/uploadAvatar', data, config);
    dispatch(setAlert('Avatar Change'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}
export const sumbitTaxInfo = (taxInfo) => async (dispatch) => {
  console.log(taxInfo,'fd');

  try{
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/api/users/updateTaxInfo', taxInfo, config);
    dispatch(setAlert('Info Sent'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}


export const getTaxInfo = () => async (dispatch) => {
  try{
    const res = await axios.get('/api/users/getTaxInfo');
    dispatch({
      type: GET_TAX_INFO,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}
