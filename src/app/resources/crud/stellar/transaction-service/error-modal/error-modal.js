/**
 * Created by istrauss on 5/18/2017.
 */

export class ErrorModal {

    activate(params) {
        this.modalVM = params.modalVM;
        this.message = params.passedInfo.message;
    }
}
