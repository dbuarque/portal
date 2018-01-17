import {computedFrom, bindable, bindingMode, inject} from 'aurelia-framework';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';
import * as StellarSdk from 'stellar-sdk';

@inject(ValidationController)
export class GenerateKeyStoreFileCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    publicKey;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    canProceed;

    constructor(validationController) {
        this.validationController = validationController;

        this.configureValidation();
    }

    configureValidation() {
        const self = this;

        self.validationController.validateTrigger = validateTrigger.blur;

        ValidationRules
            .ensure('fileName')
            .required()
            .ensure('password')
            .required()
            .ensure('confirmPassword')
            .required()
            .satisfies(value => value === self.password)
            .withMessage('Passwords do not match')
            .on(self);
    }

    async generateKeystoreFile() {
        const validationResult = await this.validationController.validate();
        if (!validationResult.valid) {
            return;
        }

        const newKeypair = StellarSdk.Keypair.random();
        const encrptedSecret = nacl.secretbox(newKeypair.secret, randomNonce(), )
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

    generateKeyFromPassword() {

    }

    randomNonce() {
        return naclUtil.encodeBase64(
            nacl.randomBytes(nacl.secretbox.nonceLength)
        );
    }
}
