/**
 * Created by istrauss on 5/18/2017.
 */

export class ErrorModal {
    get errorMessage() {
        if (!this.error || !this.error.data || !this.error.data.extras || !this.error.data.extras.result_codes) {
            return this.error.message ||
                'An unknown error occurred in submitting your transaction to the stellar network. The transaction was not executed.';
        }

        if (this.error.data.extras.result_codes[0] === 'timeout') {
            return 'The network took too long in processing your transaction. ' +
                '<span class="error-text"><strong>Please Note: Your transaction may gone through</strong></span>. ' +
                'Please check your account history before trying again.';
        }

        return 'There was an error in submitting the transaction to the stellar network. ' +
            'The transaction failed with the following code(s):<br><br>' +
            Object.values(this.error.data.extras.result_codes).map(c => '<strong>' + c + '</strong>').join(', ');
    }

    constructor(router) {
        this.router = router;
    }

    activate(params) {
        this.modalVM = params.modalVM;
        this.error = params.passedInfo.error;
    }
}
