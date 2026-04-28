import {AuthConfirmSmsProvider} from './AuthConfirmSmsProvider';
import {AuthConfirmCallProvider} from './AuthConfirmCallProvider';
import {AuthConfirmVoiceProvider} from './AuthConfirmVoiceProvider';
import {AuthConfirmEmailProvider} from './AuthConfirmEmailProvider';

export const authConfirmProviders = [
    AuthConfirmSmsProvider,
    AuthConfirmCallProvider,
    AuthConfirmVoiceProvider,
    AuthConfirmEmailProvider
];
