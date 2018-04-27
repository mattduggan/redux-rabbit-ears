import { browser } from "./browser";
import { CHANNEL } from './channel';

export default function createExtensionBackgroundProxy() {
    const ports = [];

    browser.runtime.onConnect.addListener((port) => {
        if (port.name !== CHANNEL) { return; }

        ports.push(port);

        port.onDisconnect.addListener(() => {
            const index = ports.indexOf(port);
            ports.splice(index, 1);
        });

        port.onMessage.addListener((message) => {
            ports.forEach((_port) => {
                if (_port !== port) {
                    _port.postMessage(message);
                }
            });
        });
    });
}
