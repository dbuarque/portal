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
                this.autoLogout();
            }
        }, 1000);
    }

    autoLogout() {
        window.clearInterval(this.intervalId);
        this.modalVM.dismiss();
    }

    stayLoggedIn() {
        window.clearInterval(this.intervalId);
        this.modalVM.close();
    }
}