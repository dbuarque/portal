/**
 * Created by istrauss on 8/11/2017.
 */

import {inject} from 'aurelia-framework';
import moment from 'moment';
import {LastBarTracker} from './last-bar-tracker';

@inject(LastBarTracker)
export class TradingviewBarsRealtimeUpdater {

    started = false;

    constructor(lastBarTracker) {
        this.lastBarTracker = lastBarTracker;
    }

    restart(resolution, onFetchCallback) {
        this.onFetchCallback = onFetchCallback;

        this.interval = setInterval(this.manualUpdate.bind(this), 5000);
        this.lastBarTracker.reconfigure({resolution});
        this.unsubscribeFromStream = this.lastBarTracker.subscribe(this._updateWithNewBar.bind(this));
        this.started = true;
    }

    stop() {
        if (this.started) {
            clearInterval(this.interval);
            this.unsubscribeFromStream();
            this.lastBarTracker.reconfigure();
            this.started = false;
        }
    }

    async manualUpdate() {
        this._updateWithEmptyBarIfNeeded();
    }

    _updateWithNewBar(newBar) {
        this.onFetchCallback(newBar);
    }

    async _updateWithEmptyBarIfNeeded() {
        const values = await Promise.all([
            this.lastBarTracker.get(),
            this.lastBarTracker.timeToBarTime(new Date())
        ]);

        if (!values[0]) {
            this.stop();
        }

        if (moment(values[0].time).diff(moment(values[1]), 'minutes') !== 0) {
            const emptyBar = await this.lastBarTracker.getEmptyBar();
            const newBar = {
                ...emptyBar,
                time: values[1]
            };

            this.onFetchCallback(newBar);
        }
    }
}
