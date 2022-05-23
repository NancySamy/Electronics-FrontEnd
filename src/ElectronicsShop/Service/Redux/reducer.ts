import { ErrorsState,ErrorApiActions, NOTIFY_ERROR,CLEAR_ERROR, SET_CONFIGURATION, NOTIFY_API_ERROR } from './types';
import { Store } from 'redux';


const initialState: ErrorsState = {
  errorApi: undefined,
  errorJS: undefined,
  reportImmediatly: false,
  configuration: {
    allowHttpCodes: [500,501,502,503,504,505,506,507,508,510,511],
  }
};

export function errorsReducer(
  state = initialState,
  action: ErrorApiActions
) {
  switch (action.type) {
    case NOTIFY_ERROR: {
        return {
          ... state,
          errorJS: action.payload.errorJS,
          reportImmediatly: action.payload.reportImmediatly
        };
    }
    case NOTIFY_API_ERROR: {
      if (state.configuration.allowHttpCodes.findIndex( c=>c === action.payload.errorApi?.status ) !== -1 || action.payload.byPassAllowedCode){
        return {
          ... state,
          errorApi: action.payload.errorApi,
          reportImmediatly: action.payload.reportImmediatly
        };
      }
      return (state);
    
  }
  
    case SET_CONFIGURATION:
      return {...state,configuration: action.payload};

    case CLEAR_ERROR: {
      return {...state,
        errorApi: undefined,
        errorJS: undefined,
        reportImmediatly: false
      };
    }
    default:
      return state;
  }
}
// add a way to get the store of the hosted web application
let applicationStore: Store;
// call attachStore on the web app just after the creation
export const attachStore = ( store: Store) => {
  applicationStore = store;
};

export const getStore = ()=>{
  return (applicationStore);
};