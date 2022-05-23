import { AxiosResponse } from 'axios';
import { ApiErrorConfiguration, ClearErrorAction,SetConfigurationAction, CLEAR_ERROR, NotifyErrorAction,NotifyApiErrorAction,NOTIFY_API_ERROR, NOTIFY_ERROR, SET_CONFIGURATION, ErrorJavascript } from './types';

export function notifyApiErrorAction(errorApi: AxiosResponse|undefined, byPassAllowedCode: boolean, reportImmediatly: boolean): NotifyApiErrorAction{
    return {
        type: NOTIFY_API_ERROR,
        payload: {errorApi,byPassAllowedCode,reportImmediatly},
    };
}
export function notifyErrorAction( errorJS: ErrorJavascript | undefined, reportImmediatly: boolean):  NotifyErrorAction{
    return {
        type: NOTIFY_ERROR,
        payload: {errorJS,reportImmediatly},
    };
}

export function clearErrorAction(): ClearErrorAction{
    return {
        type: CLEAR_ERROR
    };
}
export function setConfigurationAction(config: ApiErrorConfiguration): SetConfigurationAction{
    return {
        type: SET_CONFIGURATION,
        payload: config
    };
}