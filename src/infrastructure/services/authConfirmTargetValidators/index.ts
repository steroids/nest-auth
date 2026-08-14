import {EmailAuthConfirmTargetValidator} from './EmailAuthConfirmTargetValidator';
import {PhoneAuthConfirmTargetValidator} from './PhoneAuthConfirmTargetValidator';

export const authConfirmTargetValidators = [
    EmailAuthConfirmTargetValidator,
    PhoneAuthConfirmTargetValidator,
];
