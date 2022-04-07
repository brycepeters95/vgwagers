import axios from 'axios';
import { setAlert } from './alert';

import {
    OVERALL_WINS,
    WL_PERCENTAGE,
    OVERALL_EARNINGS,
    YEARLY_EARNINGS,
    BY_GAME,
    LEADERBOARD_ERROR
  } from '../actions/types';

  export const getOverallWinsLeaderboard= () => async (dispatch) => {
    try {
      const res = await axios.get('/api/leaderboard/mostWins');
  
      dispatch({
        type: OVERALL_WINS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LEADERBOARD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

  export const getWLPercentageLeaderboard= () => async (dispatch) => {
    try {
      const res = await axios.get('/api/leaderboard/WLPercentage');
  
      dispatch({
        type: WL_PERCENTAGE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LEADERBOARD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

  export const getOverallEarningsLeaderboard = () => async (dispatch) => {
    try {
      const res = await axios.get('/api/leaderboard/overallEarning');
  
      dispatch({
        type: OVERALL_EARNINGS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LEADERBOARD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

  export const getYearlyEarningsLeaderboard= () => async (dispatch) => {
    try {
      const res = await axios.get('/api/leaderboard/yearlyEarning');
  
      dispatch({
        type: YEARLY_EARNINGS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LEADERBOARD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

  export const getLeaderboardByGameAndType = (data) => async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post('/api/leaderboard/byGame', data, config);
  console.log(res.data)
      dispatch({
        type: BY_GAME,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: LEADERBOARD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };