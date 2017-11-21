/**
 * Created by istrauss on 5/11/2016.
 */

import BaseResource from './base-resource';

export class TransactionResource extends BaseResource {
    constructor() {
        super('/Transaction');
    }

    submitTransaction(transaction) {
        return this.post('', {}, {
            transaction: transaction.toEnvelope().toXDR('base64')
        });
    }
}
