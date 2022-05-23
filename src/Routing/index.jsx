import { isNothing } from '../helpers/Utils';
import history from './History';

export const RedirectTO = (URL, params) => {
    if (isNothing(params)) {
        history.push(`${URL}`);
    } else {
        history.push(`${URL}${params}`);
    }
};
export const RedirectTOWithProps = (URL, props) => {
    history.push({
        pathname: URL,
        state: props,
    });
};
