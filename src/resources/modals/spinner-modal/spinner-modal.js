/**
 * Created by istrauss on 4/14/2016.
 */

export class SpinnerModal {
    activate(data) {
        this.message = data.passedInfo.message;
        this.modalVM = data.modalVM;

        data.passedInfo.promise
            .then(() => {
                this.modalVM.close();
            })
            .catch(() => {
                this.modalVM.dismiss();
            });
    }
}
