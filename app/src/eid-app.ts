/// <reference types="quickjs-native" />

import * as os from 'os';
import { alert, confirm, activeWindow } from 'quickjs-ui';
import { PKCS11 } from 'quickjs-pkcs11';

const win = activeWindow();

const argsFlagIndex = scriptArgs.indexOf('--args');
let requestUrl: string | undefined;
if (argsFlagIndex >= 0) {
    requestUrl = scriptArgs[argsFlagIndex + 1];
} else {
    for (let i = 0; i < scriptArgs.length; i++) {
        if (scriptArgs[i].toLowerCase().indexOf('eid-app:') === 0) {
            requestUrl = scriptArgs[i];
            break;
        }
    }
}

let callbackUrl = requestUrl;
const customScheme = 'eid-app://';
if (callbackUrl && callbackUrl.toLowerCase().indexOf(customScheme) === 0) {
    callbackUrl = `https://${callbackUrl.substring(customScheme.length)}`;
}
const confirmationMessage = callbackUrl
    ? `${callbackUrl} wants to read information from the card reader. Do you agree?`
    : 'Read data from the eID card?';

if (confirm(confirmationMessage, 'eID')) {
    try {
        const pkcs11 = new PKCS11();

        try {
            const slots = pkcs11.getSlots(true);
            if (!slots || slots.length === 0) {
                throw new Error('No card reader with a token found.');
            }

            const slotId = slots[0].id;
            if (slotId === undefined) {
                throw new Error('Token has no slot ID.');
            }

            const session = pkcs11.openSession(slotId);
            if (session === null) {
                throw new Error('Failed to open a session with the card.');
            }

            try {
                const data = pkcs11.getData(session);
                const filtered: Record<string, string | number> = {};
                for (const [label, value] of Object.entries(data ?? {})) {
                    const lower = label.toLowerCase();
                    if (-1 !== lower.indexOf('data') || -1 !== lower.indexOf('photo') || -1 !== lower.indexOf('file')) {
                        continue;
                    }
                    filtered[label] = value;
                }

                if (callbackUrl) {
                    const target = `${callbackUrl}#${JSON.stringify(filtered)}`;
                    if (win) {
                        if ('darwin' === os.platform) {
                            os.exec(['open', win.path, target]);
                        } else {
                            os.exec([win.path, target]);
                        }
                    } else {
                        alert(JSON.stringify(filtered), 'eID Card Data');
                    }
                } else if (Object.keys(filtered).length > 0) {
                    const lines = Object.entries(filtered).map(([label, value]) => `${label}: ${value}`);
                    alert(lines.join('\n'), 'eID Card Data');
                } else {
                    alert('No data objects found on the card.', 'eID Card Data');
                }
            } finally {
                pkcs11.closeSession(session);
            }
        } finally {
            pkcs11.destroy();
        }
    } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        alert(
            `The eID app couldn't read data from the card. Please check that the correct eID middleware is installed and a card is inserted.\n\nDetails: ${details}`,
            'eID Error'
        );
    }
}
