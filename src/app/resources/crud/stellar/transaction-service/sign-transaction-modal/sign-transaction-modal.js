export class SignTransactionModal {
    methods = {
        signWithProvidedSecret: {
            title: 'Enter Your Secret Key',
            description: 'Enter your account\'s secret key. We will sign the transaction and submit it to the network you your behalf'
        },
        signManually: {
            title: 'Sign Transaction Manually',
            description: 'We will provide you with the raw transaction and an input for the signed transaction. ' +
            'In order to submit your transaction to the network, you must manually sign the transaction with your account\'s secret key. ' +
            'Once you have provided us with the valid signed transaction, we will submit it to the network.'
        }
    };

    activate(params) {
        this.modalVM = params.modalVM;
        this.transaction = params.passedInfo.transaction;
    }

    methodChosen(method) {
        this.method = method;
    }

    transactionSigned(signedTransaction) {
        this.modalVM.close(signedTransaction);
    }
}
