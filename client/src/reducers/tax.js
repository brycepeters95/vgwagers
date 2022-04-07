
import {
    GET_TAX_INFO,
  } from '../actions/types';
  
  const initialState = {
    isLoading:true,
    taxMessage:''
   
  };
  
  
  export default function (state = initialState, action) {
    const {
      type,
      payload
    } = action;
  
    switch (type) {
     
  case GET_TAX_INFO:
        return{
          ...state,
        isLoading:false,
         taxMessage:payload
        }

      default:
        return state;
    }
  }