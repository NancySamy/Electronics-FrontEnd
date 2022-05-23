import axios, { AxiosInstance } from 'axios';
import { getStore } from '../Redux/reducer';
import { notifyApiErrorAction } from '../Redux/Action';


export function CreateAxiosInstance(trackError: boolean): AxiosInstance{
    const instance = axios.create();
    instance.interceptors.response.use((response) => {
   
        return response;
    }, (error) => {
        const {response} = error;
        if (trackError){
            const reduxStore = getStore();
            if (reduxStore){
              reduxStore.dispatch(notifyApiErrorAction(response,false,false));
              localStorage.setItem('lastApiError',JSON.stringify(response));
            }else{
              // eslint-disable-next-line no-console
              console.log('cannot catch api Error, redux store is not attach to component eta. Use attachReducer(store) just after the store creation.');
            }
          }
        return Promise.reject(error);
    });
    return (instance);
}
