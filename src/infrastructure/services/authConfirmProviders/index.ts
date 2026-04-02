import {AuthConfirmSmsProvider} from './AuthConfirmSmsProvider';
import {AuthConfirmCallProvider} from './AuthConfirmCallProvider';
import {AuthConfirmVoiceProvider} from './AuthConfirmVoiceProvider';

export const authConfirmProviders = [
    AuthConfirmSmsProvider,
    AuthConfirmCallProvider,
    AuthConfirmVoiceProvider,
];
