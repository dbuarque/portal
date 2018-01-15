import {bindable, bindingMode} from 'aurelia-framework';

export class ProvidePublicKeyCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    publicKey;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    canProceed;

    get _publicKey() {
        return this.publicKey;
    }
    set _publicKey(newKey) {
        this.publicKey = newKey;
        this.canProceed = !!newKey;
    }
}
