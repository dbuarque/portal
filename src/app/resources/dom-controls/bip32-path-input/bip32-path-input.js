/**
 * Created by istrauss on 6/22/2017.
 */

import {bindable, bindingMode} from 'aurelia-framework';

export class Bip32PathInputCustomElement {
    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    bip32Path;

    isValidBip32Path = true;

    get inputValue() {
        return this._inputValue || this.bip32Path;
    }
    set inputValue(newValue) {
        this._inputValue = newValue;
        this.checkBip32Path(newValue);
        if (this.isValidBip32Path) {
            this.bip32Path = newValue;
        }
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
