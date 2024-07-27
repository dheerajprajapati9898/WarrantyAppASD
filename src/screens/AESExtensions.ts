// import CryptoJS from 'crypto-js';

// const key = 'CEYO_AES_256_ENCRYPTION_KEY_2024';
// const iv = key.slice(0, 16);

// const getKeyAndIv = (key) => {
//     return {
//         key: CryptoJS.enc.Utf8.parse("CEYO_AES_256_ENCRYPTION_KEY_2024"),
//         iv: CryptoJS.enc.Utf8.parse(iv)
//     };
// };


// export const AESExtensions = {
//     decryptString: (cipherText) => {
//         const { key, iv } = getKeyAndIv(key);
//         const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
//             iv: iv,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7
//         });
//         console.log("decrypted", decrypted.toString(CryptoJS.enc.Utf8));

//         return CryptoJS.enc.Utf8.stringify(decrypted);
//     },

//     encryptString: (plainText) => {
//         const { key, iv } = getKeyAndIv(key);
//         const encrypted = CryptoJS.AES.encrypt(plainText, key, {
//             iv: iv,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7
//         });
//         return encrypted.toString();
//     }
// };
import CryptoJS from 'crypto-js';

const key = 'CEYO_AES_256_ENCRYPTION_KEY_2024';
// const iv = key.slice(0, 16);

const getKeyAndIv = () => {
    return {
        objKey: CryptoJS.enc.Utf8.parse('CEYO_AES_256_ENCRYPTION_KEY_2024'),
        objIv: CryptoJS.enc.Utf8.parse(key.slice(0, 16)),
    };
};

export const AESExtensions = {
    encryptString: plainText => {
        const { objKey, objIv } = getKeyAndIv();
        const helperKey = objKey;
        const helperObjIv = objIv;

        // console.log('helperKey', helperKey);
        // console.log('helperObjIv', helperObjIv);
        // console.log("JSON.stringify(plainText)", JSON.stringify(plainText).replace(/"/g, '\\"'));

        var encryptedCode = CryptoJS.AES.encrypt(
            JSON.stringify(plainText).replace(/"/g, '\\"'),
            helperKey,
            {
                iv: objIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            },
        ).toString();
        console.log("encryptedCode", encryptedCode.toString());

        return encryptedCode;
    },
    encryptS: plainText => {
        const { objKey, objIv } = getKeyAndIv();
        const helperKey = objKey;
        const helperObjIv = objIv;

        // console.log('helperKey', helperKey);
        // console.log('helperObjIv', helperObjIv);
        // console.log("JSON.stringify(plainText)", JSON.stringify(plainText).replace(/"/g, '\\"'));

        var encryptedCode = CryptoJS.AES.encrypt(

            JSON.stringify(plainText),
            helperKey,
            {
                iv: objIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            },
        ).toString();
        console.log("encryptedCode", encryptedCode);

        return encryptedCode;
    },
    encryptSs: plainText => {
        const { objKey, objIv } = getKeyAndIv();
        const helperKey = objKey;
        const helperObjIv = objIv;

        // console.log('helperKey', helperKey);
        // console.log('helperObjIv', helperObjIv);
        // console.log("JSON.stringify(plainText)", JSON.stringify(plainText).replace(/"/g, '\\"'));
        const jsonPlainText = JSON.stringify(plainText);
        var encryptedCode = CryptoJS.AES.encrypt(

            jsonPlainText,
            helperKey,
            {
                iv: objIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            },
        ).toString();
        console.log("encryptedCode", encryptedCode);

        return encryptedCode;
    },
    decryptString: cipherText => {
        const { objKey, objIv } = getKeyAndIv();
        const helperKey = objKey;
        const helperObjIv = objIv;
        var decrepted = CryptoJS.AES.decrypt(cipherText, helperKey, {
            iv: helperObjIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        // console.log("cipherText", cipherText);
        console.log("adsasd", JSON.parse(decrepted.toString(CryptoJS.enc.Utf8)));

        return JSON.parse(decrepted.toString(CryptoJS.enc.Utf8));
    },

};