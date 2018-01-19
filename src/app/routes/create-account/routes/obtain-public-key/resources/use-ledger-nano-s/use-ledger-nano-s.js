import {bindable, bindingMode, inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {LedgerHwService} from 'app-resources';
import {UpdateBip32PathActionCreator} from '../../../../../../action-creators';

@inject(LedgerHwService, UpdateBip32PathActionCreator)
export class UseLedgerNanoSCustomElement {
    @connected('bip32Path')
    get bip32Path() {
        // getter will be set by @connected
    }
    set bip32Path(newValue) {
        this.updateBip32Path.dispatch(newValue);
    }

    @bindable({defaultBindingMode: bindingMode.twoWay})
    publicKey;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    canProceed;

    loading = 0;

    get _publicKey() {
        return this.publicKey;
    }
    set _publicKey(newKey) {
        this.publicKey = newKey;
        this.canProceed = !!newKey;
    }

    constructor(ledgerHwService, updateBip32Path) {
        this.ledgerHwService = ledgerHwService;
        this.updateBip32Path = updateBip32Path;
    }

    async connectLedger() {
        this.loading++;
        this.ledgerConnected = await this.ledgerHwService.connectLedger();
        this.loading--;
    }
}
