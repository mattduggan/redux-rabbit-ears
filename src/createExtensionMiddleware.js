import { browser } from "./browser";
import { CHANNEL } from './channel';

const BROADCAST = '@@redux-rabbit-ears/BROADCAST';

export default function createExtensionMiddleware(extensionId, getter) {
    if (!browser || !browser.runtime) {
        console.error('Expected {browser, chrome}.runtime to exist');
        return () => next => action => next(action);
    }

    if (typeof extensionId !== 'string') {
        console.error('Expected extensionId');
        return () => next => action => next(action);
    }

    let port;
    let isConnected = false;

    return (store) => {
        function connect() {
            port = browser.runtime.connect(extensionId, { name: CHANNEL });
            isConnected = true;
            console.info('redux-rabbit-ears has connected to chrome-extension://' + extensionId);

            port.onMessage.addListener((message) => {
                if (message.meta && message.meta.type === BROADCAST) {
                    store.dispatch(message);
                }
            });

            port.onDisconnect.addListener(() => {
                isConnected = false;
                console.warn('redux-rabbit-ears has disconnected from chrome-extension://' + extensionId);
                console.info('reconnecting to chrome-extension://' + extensionId);
                connect();
            });
        }

        connect();
        if (getter) { getter(port, connect) }

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
