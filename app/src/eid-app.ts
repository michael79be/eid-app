/// <reference types="quickjs-native" />

import { alert, confirm } from 'quickjs-ui';
import { CKR_OK, findPKCS11Libraries, PKCS11 } from 'quickjs-pkcs11';

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
    : 'Initialize the PKCS#11 library to read information from the card reader?';

if (confirm(confirmationMessage, 'eID')) {
    try {
        const libraryPaths = findPKCS11Libraries();
        const pkcs11 = new PKCS11(libraryPaths);

        try {
            const initResult = pkcs11.C_Initialize();
            if (initResult !== CKR_OK) {
                throw new Error(`C_Initialize failed (CK_RV ${initResult}).`);
            }

            const { result, info } = pkcs11.getInfo();
            if (result !== CKR_OK || info === null) {
                throw new Error(`C_GetInfo failed (CK_RV ${result}).`);
            }

            alert(
                `${info.libraryDescription}\n${info.manufacturerID}\nCryptoki ${info.cryptokiVersion.major}.${info.cryptokiVersion.minor}`,
                'PKCS#11 Information'
            );
        } finally {
            pkcs11.destroy();
        }
    } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        alert(
            `The eID app couldn't communicate with its PKCS#11 library. Please check that the correct eID middleware is installed and try again.\n\nDetails: ${details}`,
            'eID Error'
        );
    }
}
