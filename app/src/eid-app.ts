import { alert, confirm } from 'quickjs-ui';
import { CKR_OK, findPKCS11Libraries, PKCS11 } from 'quickjs-pkcs11';

if (confirm('Initialize the PKCS#11 library to read information from the card reader?', 'eID')) {
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
}
