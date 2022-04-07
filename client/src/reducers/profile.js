import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_PROFILES
   
  } from '../actions/types';
  
  const initialState = {
    profile: null,
    profiles: [],
   loading: true,
    error: {}
  };
  
  // destruction action so instead typing action.payload or action.type can just pass in payload
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_PROFILE:
      case UPDATE_PROFILE:
        return {
          ...state,
          profile: payload,
          loading: false
        };
        case GET_PROFILES:
          return {
            ...state,
            profiles: payload,
            loading: false
          };
      case PROFILE_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
        };
      case CLEAR_PROFILE:
        return {
          ...state,
          profile: null,
          profiles:[],
          loading: false
        };
      
      default:
        return state;
    }
  }