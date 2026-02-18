import {random as _random, padStart as _padStart} from 'lodash';

export const generateCode = (length = 6) => {
    length = Math.min(32, Math.max(1, length));
    return _padStart(_random(0, (10 ** length) - 1).toString(), length, '0');
};
