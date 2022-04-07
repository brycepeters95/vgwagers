import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import bank from './bank';
import wager from './wager';
import tax from './tax';
import leaderboard from './leaderboard';
export default combineReducers({
  alert,
  auth,
  profile,
  bank,
  wager,
  tax,
  leaderboard
});
