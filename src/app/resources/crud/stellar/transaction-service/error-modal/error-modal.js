/**
 * Created by istrauss on 5/18/2017.
 */

export class ErrorModal {
    get errorMessage() {
        if (!this.error || !this.error.extras || !this.error.extras.result_codes) {
            return this.error.message ||
                'An unknown error occurred in submitting your transaction to the stellar network. The transaction was not executed.';
        }

        if (this.error.extras.result_codes[0] === 'timeout') {
            return 'The network took too long in processing your transaction. ' +
                '<span class="error-text"><strong>Please Note: Your transaction may gone through</strong></span>. ' +
                'Please check your account history before trying again.';
        }

        return 'There was an error in submitting the transaction to the stellar network. ' +
            'The transaction failed with the following code(s):<br>' +
            Object.values(this.error.extras.result_codes).join(', ');
    }

    constructor(router) {
        this.router = router;
    }

    activate(params) {
        this.modalVM = params.modalVM;
        this.error = params.passedInfo.error;
    }
}
