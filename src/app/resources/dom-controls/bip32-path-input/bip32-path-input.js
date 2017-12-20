/**
 * Created by istrauss on 6/22/2017.
 */

import {bindable, bindingMode, inject} from 'aurelia-framework';
import {LedgerHwService} from 'app-resources';

@inject(LedgerHwService)
export class Bip32PathInputCustomElement {
    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    bip32Path;

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    publicKey;

    isValidBip32Path = true;

    get inputValue() {
        return this._inputValue || this.bip32Path;
    }
    set inputValue(newValue) {
        this._inputValue = newValue;
        this.checkBip32Path(newValue);
        if (this.isValidBip32Path) {
            this.bip32Path = newValue;
            this.getPublicKey(this.bip32Path);
        }
    }

    constructor(ledgerHwService) {
        this.ledgerHwService = ledgerHwService;
    }

    bind() {
        if (this.bip32Path) {
            this.getPublicKey(this.bip32Path);
        }
    }

    getPublicKey(bip32Path) {
        this.ledgerHwService.getPublicKeyFromLedger(this.bip32Path)
            .then(publicKey => {
                if (this.bip32Path === bip32Path) {
                    this.publicKey = publicKey;
                }
            });
    }

    checkBip32Path(path) {
        this.isValidBip32Path = true;
        if (!path.startsWith("44'/148'")) {
            this.isValidBip32Path = false;
            return;
        }
        path.split('/').forEach((element) => {
            if (!element.toString().endsWith('\'')) {
                this.isValidBip32Path = false;
            }
        });
    }
}
