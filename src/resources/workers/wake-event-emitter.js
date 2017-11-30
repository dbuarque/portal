
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class WakeEventEmitter {
    TIMEOUT = 30000;

    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }

    init() {
        this.lastTime = (new Date()).getTime();

        setInterval(this.checkIfAwoken.bind(this), this.TIMEOUT);
    }

    checkIfAwoken() {
        let currentTime = (new Date()).getTime();
        if (currentTime > (this.lastTime + this.TIMEOUT + 2000)) {
            this.eventAggregator.publish('wake');
        }
        this.lastTime = currentTime;
    }
}
