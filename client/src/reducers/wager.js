import {
  SEARCH_USER,
  GET_WAGERS,
  DELETE_WAGER,
  WAGER_ERROR,
  DELETE_FINSHEDWAGER,
  GET_COMPLETEDWAGER,
  GET_DISPUTEDWAGER,
  GET_CURRENTWAGER,
  GET_PUBLICWAGERS,
  CANCEL_WAGER,
  GET_DISPUTEFORMWAGER,
  DISPUTEFORM_STATUS,
  ACCEPT_PUBLICWAGER,
  CANCEL_PUBLICWAGER,
  ALLOW_WAGERCHAT,
  ACCEPT_WAGER, 


} from '../actions/types';

const initialState = {
  wagers: [],
  currentwager: [],
  loading: true,
  error: {},
  disputedwagers: [],
  disputedwager: null,
  completedwagers:[],
  wagerchat: [],
  challengee: null,

};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    //getting public and private wager 
    case GET_WAGERS:
    case GET_PUBLICWAGERS:
      return {
        ...state,
        wagers: payload,
        loading: false,
      };
      //accept wager
      case ACCEPT_WAGER:
        return {
          ...state,
          currentwager: [payload],
          wagers:state.wagers.filter((wager) => wager._id !== payload._id),
          loading: false,
        };
        //getting previous wagers 
    case GET_COMPLETEDWAGER:
      return {
        ...state,
        completedwagers: payload,
        loading: false,
      };
      // get request to get disputed wagers
    case GET_DISPUTEDWAGER:
    case DISPUTEFORM_STATUS:
      return {
        ...state,
        disputedwagers: payload,
        loading: false,
      };
    case GET_DISPUTEFORMWAGER:
      return {
        ...state,
        disputedwager: payload,
      };
      //when searching for user for wager
    case SEARCH_USER:
      return {
        ...state,
        challengee: payload,
        loading: false,
      };
      //get all current wagers
    case GET_CURRENTWAGER:
      return {
        ...state,
        currentwager: payload,
        loading: false,
      };
      //delete wager from current wager array
    case CANCEL_WAGER:
      return {
        ...state,
        currentwager: state.currentwager.filter(
          (wager) => wager._id !== payload._id
        ),
        loading: false,
      };
      // delete wager from wager array
    case CANCEL_PUBLICWAGER:
      return {
        ...state,
        wagers: state.wagers.filter((wager) => wager._id !== payload._id),
        loading: false,
      };
      //decline wager delete from wager array
    case DELETE_WAGER:
      return {
        ...state,
        wagers: state.wagers.filter((wager) => wager._id !== payload._id),
        loading: false,
      };
      // delete finshed wager from Current wager array(won,lost)
    case DELETE_FINSHEDWAGER:
      return {
        ...state,
        currentwager: state.currentwager.filter((wager) => wager._id !== payload._id),
        loading: false,
      };
      //deleting from wagers array also,(moving wager to current wager array?)
    case ACCEPT_PUBLICWAGER:
      return {
        ...state,
        wagers: state.wagers.filter((wager) => wager._id !== payload._id),
        loading: false,
      };
      //accept wager puts wager in wagerchat array
    case ALLOW_WAGERCHAT:
      return {
        ...state,
        wagerchat: payload,
        loading: false,
      };
    case WAGER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
