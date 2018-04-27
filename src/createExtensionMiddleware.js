import { browser } from "./browser";
import { CHANNEL } from './channel';

const BROADCAST = '@@redux-rabbit-ears/BROADCAST';

export default function createExtensionMiddleware(extensionId, getPort) {
    if (!browser || !browser.runtime) {
        console.error('Expected {browser, chrome}.runtime to exist');
        return () => next => action => next(action);
    }

    if (typeof extensionId !== 'string') {
        console.error('Expected extensionId');
        return () => next => action => next(action);
    }

    return (store) => {
        const port = browser.runtime.connect(extensionId, { name: CHANNEL });
        let isConnected = true;

        port.onMessage.addListener((message) => {
            if (message.meta && message.meta.type === BROADCAST) {
                store.dispatch(message);
            }
        });

        port.onDisconnect.addListener(() => {
            isConnected = false;
            console.warn('redux-rabbit-ears has disconnected from chrome-extension://' + extensionId);
        });

        if (getPort) { getPort(port); }

        return (next) => {
            return (action) => {
                const isBroadcast = (action.meta && action.meta.type === BROADCAST);
                if (isConnected && !isBroadcast) {
                    port.postMessage({ ...action, meta: { type: BROADCAST } });
                }
                return next(action);
            };
        };
    };
}
