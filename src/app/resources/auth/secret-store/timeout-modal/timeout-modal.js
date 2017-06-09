/**
 * Created by Ishai on 4/23/2017.
 */

export class TimeoutModal {

    activate(data) {
        this.modalVM = data.modalVM;
        this.initTimer();
    }

    initTimer() {
        this.counter = 60;
        this.intervalId = window.setInterval(() => {
            this.counter--;
            if (this.counter === 0) {
                this.tooLate();
            }
        }, 1000);
    }

    tooLate() {
        window.clearInterval(this.intervalId);
        this.modalVM.dismiss();
    }

    thatsFine() {
        window.clearInterval(this.intervalId);
        this.modalVM.dismiss();
    }

    noDontDoThat() {
        window.clearInterval(this.intervalId);
        this.modalVM.close();
    }
}
