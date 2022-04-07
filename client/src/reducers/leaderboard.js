import {
    OVERALL_WINS,
    WL_PERCENTAGE,
    OVERALL_EARNINGS,
    YEARLY_EARNINGS,
    LEADERBOARD_ERROR,
    BY_GAME
  } from '../actions/types';
  
  const initialState = {
    overallEarnings:[],
    yearlyEarnings:[],
    wLPercentage:[],
    overallWins:[],
    byGameAndType:[],
    loading:true,
    error:{}
  };
  
  // destruction action so instead typing action.payload or action.type can just pass in payload
  export default function(state = initialState, action) {
    const { type, payload } = action;

    
    switch (type) {
    case OVERALL_WINS:
        return{
            ...state,
            overallWins: payload,
            loading:false
        };
    case WL_PERCENTAGE:
        return{
            ...state,
            wLPercentage: payload,
            loading:false
        };
     case OVERALL_EARNINGS:
        return{
             ...state,
            overallEarnings: payload,
            loading:false
            };
        case YEARLY_EARNINGS:
            return{
                ...state,
                yearlyEarnings: payload,
                loading:false
            };
        case BY_GAME:
            return{
                ...state,
                byGameAndType: payload,
                loading:false
            };
        case LEADERBOARD_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            };
        default:
          return state;
      }
    }