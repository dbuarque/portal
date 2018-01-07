/**
 * Created by istrauss on 6/7/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class FooterCustomElement {
    constructor(router) {
        this.router = router;
    }

    donate() {
        this.router.navigateToRoute('send-payment', {
            type: 'Native',
            code: window.stellarport.stellar.nativeAssetCode,
            issuer: 'Stellar',
            destination: window.stellarport.publicKey
        });
    }
}
