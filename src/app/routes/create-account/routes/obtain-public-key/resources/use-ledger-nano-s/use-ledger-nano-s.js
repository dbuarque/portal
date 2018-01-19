import {bindable, bindingMode, inject} from 'aurelia-framework';
import {LedgerHwService} from 'app-resources';

@inject(LedgerHwService)
export class UseLedgerNanoSCustomElement {
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

    constructor(ledgerHwService) {
        this.ledgerHwService = ledgerHwService;
    }

    async connectLedger() {
        this.loading++;
        this.ledgerConnected = await this.ledgerHwService.connectLedger();
        this.loading--;
    }
}
