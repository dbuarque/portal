import * as StellarSdk from 'stellar-sdk';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import scrypt from 'scrypt-async';

const version = 'stellarport-1-20-2018';

const scryptOptions = {
    N: 16348,
    r: 8,
    p: 1,
    dkLen: 32,
    encoding: 'hex'
};

export class KeystoreService {
    publicKey(file) {
        return this.fileContents(file).address;
    }

    async secretKey(file, password) {
        const fileData = this.fileContents(file);
        const key = await this.keyFromPassword(password, fileData.crypto.salt);
        return nacl.secretbox.open(fileData.crypto.ciphertext, fileData.crypto.nonce, key);
    }

    async createAndDownload(password, filename) {
        const newKeypair = StellarSdk.Keypair.random();
        const salt = nacl.randomBytes(32);
        const key = await this.keyFromPassword(password, salt);
        const nonce = this.randomNonce();
        const ciphertext = nacl.secretbox(newKeypair.secret(), nonce, key);
        const fileData = {
            version,
            address: newKeypair.publicKey(),
            crypto: {
                ciphertext,
                nonce,
                salt,
                scryptOptions
            }
        };

        this.download(filename, JSON.stringify(fileData));
    }

    download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    fileContents(file) {
        const fileReader = new FileReader();
        const text = fileReader.readAsText(file);
        return JSON.parse(text);
    }

    keyFromPassword(password, salt) {
        return new Promise((resolve, reject) => {
            scrypt(
                password,
                salt,
                scryptOptions,
                resolve
            );
        });
    }

    randomNonce() {
        return naclUtil.encodeBase64(
            nacl.randomBytes(nacl.secretbox.nonceLength)
        );
    }
}
