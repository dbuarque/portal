/**
 * Created by istrauss on 4/24/2017.
 */

import {inject} from 'aurelia-framework';
import {ModalService, StellarServer} from 'global-resources';
import {InactivityTracker} from '../inactivity-tracker';

@inject(ModalService, StellarServer, InactivityTracker)
export class SecretStore {

    constructor(modalService, stellarServer, inactivityTracker) {
        this.modalService = modalService;
        this.stellarServer = stellarServer;
        this.inactivityTracker = inactivityTracker;
    }

    async sign(transaction) {
        let keypair;
        if (!this._keypair) {
            try {
                const result = await this.modalService.open('app/resources/auth/identify-user/identify-user');
                keypair = result.remember ? this.remember(result.secret) : this.stellarServer.sdk.Keypair.fromSecret(result.secret);
            }
        }

        transaction.sign(keypair);

        return transaction;
    }

    remember(secret) {
        this._keypair = this.stellarServer.sdk.Keypair.fromSecret(secret);

        this.unsubscribeFromInactivityTracker = this.inactivityTracker.subscribe(this.forget.bind(this));

        return this._keypair;
    }

    async forget(pastDue) {
        if (!pastDue) {
            try {
                await this.modalService.open('app/resources/auth/secret-store/timeout-modal/timeout-modal');
                //If the modal does not throw then that means the user selected not to forget the secret.
                return;
            }
        }
        this._secret = undefined;
        this.unsubscribeFromInactivityTracker();
    }
}
