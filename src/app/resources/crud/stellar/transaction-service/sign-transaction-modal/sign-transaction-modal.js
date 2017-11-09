export class SignTransactionModal {
    activate(params) {
        this.modalVM = params.modalVM;
        this.transaction = params.transaction;
    }

    transactionSigned(signedTransaction) {
        this.modalVM.close(signedTransaction);
    }
}
