/**
 * Created by istrauss on 5/8/2017.
 */

export class IdentifyUserModal {

    activate(params) {
        this.modalVM = params.modalVM;
        this.action = params.passedInfo.action;
    }

    secretCollected(event) {
        this.modalVM.close(event.detail);
    }
}
