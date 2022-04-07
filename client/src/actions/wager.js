import axios from 'axios';
import { setAlert } from './alert';

import {
  WAGER_ERROR,
  SEARCH_USER,
  CREATE_WAGER,
  GET_WAGERS,
  GET_CURRENTWAGER,
  GET_COMPLETEDWAGER,
  GET_DISPUTEDWAGER,
  GET_PUBLICWAGERS,
  DELETE_WAGER,
  DELETE_FINSHEDWAGER,
  GET_DISPUTEFORMWAGER,
  CANCEL_WAGER,
  ACCEPT_PUBLICWAGER,
  ALLOW_WAGERCHAT,
  ACCEPT_WAGER,
  SET_DISPUTEFORM,
  GET_GAMES,
} from './types';


// accept wager
export const accept = (id) => async (dispatch) => {
  try {
    console.log(id,'id');
    const res = await axios.post('/api/wager/accept', id);

    dispatch({
      type: ACCEPT_WAGER,
      payload: res.data,
    });
  dispatch(setAlert('Wager Accepted'));
    setTimeout(() =>{
      window.location.reload();
     },750);
  } catch (err) {
  console.log(err)
  }
};
//decline wager
export const decline = (id) => async (dispatch) => {
  try {
    const res = await axios.post('/api/wager/decline', id);
    dispatch({
      type: DELETE_WAGER,
      payload: res.data,
    });
    dispatch(setAlert('Wager Declined'));
    setTimeout(() =>{
      window.location.reload();
     },750);
  } catch (error) {
    console.log(error);
  }
};
//won current wager
export const won = (id) => async (dispatch) => {
  try {
    const res = await axios.post('/api/wager/won', id);
//save openent team in local storage before deleting wager on dashboard clear it 

    dispatch({
      type: DELETE_FINSHEDWAGER,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};
//lost current wager
export const lost = (id) => async (dispatch) => {
  try {
    const res = await axios.post('/api/wager/lost', id);

    dispatch({
      type: DELETE_FINSHEDWAGER,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};
//cancel private current wager
export const cancel = (id) => async (dispatch) => {
  try {
    const res = await axios.post('/api/wager/cancelWager', id);

    dispatch({
      type: CANCEL_WAGER,
      payload: res.data,
    });
    dispatch(setAlert('Wager Cancelled'));
    setTimeout(() =>{
      window.location.reload();
     },750);
  } catch (error) {
    console.log(error);
  }
};

//create public wager
export const createPublicWager = (wagerInfo) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/wager/public', wagerInfo, config);

    dispatch({
      type: CREATE_WAGER,
      payload: res.data,
    });

    dispatch(setAlert('wager created'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
export const createTeamWager = (wagerInfo) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/wager/teamWagers', wagerInfo, config);

    dispatch({
      type: CREATE_WAGER,
      payload: res.data,
    });

    dispatch(setAlert('wager created'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//get all wagers user is apart of
export const getWagers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/getWagers');

    dispatch({
      type: GET_WAGERS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//decline wager
export const deleteWager = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/deleteWager');

    dispatch({
      type: DELETE_WAGER,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//get current wagers(user created, or user accepted)
export const getCurrentWager = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/getOngoingWager');

    dispatch({
      type: GET_CURRENTWAGER,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//search user for wager
export const userLookUp = (newUserSearch) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(newUserSearch);

    const res = await axios.post('/api/wager/getUserByUsername', body, config);

    dispatch({
      type: SEARCH_USER,
      payload: res.data,
    });
    dispatch(setAlert('Player Added'));
  
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//getting previous wager user was apart of 
export const getCompletedWagers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/getCompletedWagers');

    dispatch({
      type: GET_COMPLETEDWAGER,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//get disputed wagers user was apart of
export const getDisputedWagers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/getDisputedWagers');

    dispatch({
      type: GET_DISPUTEDWAGER,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//get all public wagers
export const getAllTheWagers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/wager/getPublicWagers');

    dispatch({
      type: GET_PUBLICWAGERS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//setting disputed wager to the current disputed wager clicked on 
export const getDisputedFormWager = (wager) => async (dispatch) => {
  try {
    dispatch({
      type: GET_DISPUTEFORMWAGER,
      payload: wager,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const setDisputeFormWager = (data) => async (dispatch) => {
  console.log(data,'data')
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post('/api/wager/disputeForm', data, config);
    dispatch({
      type: SET_DISPUTEFORM,
      payload: res.data,
    });
    dispatch(setAlert('Form Sent'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};


//accepting public wager
export const acceptPublic = (wagerInfo) => async (dispatch) => {

  try {
  
    const res = await axios.post('/api/wager/acceptPublic', wagerInfo);

    dispatch({
      type: ACCEPT_PUBLICWAGER,
      payload: res.data,
    });
    dispatch(setAlert('Wager Accepted'));
    // setTimeout(() =>{
    //  history.push('/dashboard');
    //  },750);

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

//allow wager for wagers user accepted or created
export const allowWagerChat = (wg) => async (dispatch) => {
  try {
    dispatch({
      type: ALLOW_WAGERCHAT,
      payload: wg,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
export const getGames = () => async (dispatch) =>{
  try {
    const res = await axios.get('/api/wager/getGames');

    dispatch({
      type: GET_GAMES,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: WAGER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
