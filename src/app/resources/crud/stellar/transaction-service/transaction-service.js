/**
 * Created by istrauss on 5/18/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {ModalService} from 'global-resources';
import {SecretStore} from '../../../auth/secret-store/secret-store';

@inject(ModalService, SecretStore)
export class TransactionService {

    constructor(modalService, secretStore) {
        this.modalService = modalService;
        this.secretStore = secretStore;
    }

    async submit(transaction, info) {
        await this.secretStore.sign(transaction);

        return this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/transaction-service/submit-transaction-modal/submit-transaction-modal'), {
            transaction,
            ...info
        }, {modalClass: 'sm submit-transaction'});
    }
}
