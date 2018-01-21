import {computedFrom, bindable, bindingMode, inject} from 'aurelia-framework';
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
        const ciphertext = nacl.secretbox(newKeypair.secret, randomNonce(), )
    }
}
