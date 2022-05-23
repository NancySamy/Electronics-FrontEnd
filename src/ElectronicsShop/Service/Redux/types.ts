import { AxiosResponse } from 'axios';


export interface ApiErrorConfiguration{
    allowHttpCodes: number[];
    excludePath?: string[] | undefined;
}
export interface ErrorJavascript{
    event: Event | string;
    source?: string;
    lineno?: number; 
    colno?: number;
    error?: Error;
}
export interface ErrorsState{
    errorApi: AxiosResponse | undefined;
    errorJS: ErrorJavascript | undefined;
    reportImmediatly: boolean;
    configuration: ApiErrorConfiguration;
}
export const NOTIFY_API_ERROR = 'NOTIFY_API_ERROR';
export const NOTIFY_ERROR = 'NOTIFY_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const SET_CONFIGURATION = 'SET_CONFIGURATION';

export interface NotifyApiErrorAction {
    type: typeof NOTIFY_API_ERROR;
    payload: {errorApi: AxiosResponse|undefined; byPassAllowedCode: boolean;reportImmediatly: boolean};
}
export interface NotifyErrorAction {
    type: typeof NOTIFY_ERROR;
    payload: {errorJS: ErrorJavascript | undefined;reportImmediatly: boolean};
}
export interface SetConfigurationAction {
    type: typeof SET_CONFIGURATION;
    payload: ApiErrorConfiguration;
}
export interface ClearErrorAction {
    type: typeof CLEAR_ERROR;
}
  
 export type ErrorApiActions = NotifyErrorAction | NotifyApiErrorAction | SetConfigurationAction | ClearErrorAction;
  