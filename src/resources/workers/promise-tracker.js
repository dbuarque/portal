/**
 * Created by istrauss on 5/5/2016.
 */

import {transient} from 'aurelia-framework';

@transient()
export default class PromiseTracker {

    constructor() {
        this.promisesPending = 0;
        this.promises = {};
    }

    trackPromise(promise, id) {
        this.promisesPending++;
        let pendingPromise = promise
            .then((result) => {
                this.promisesPending--;
                return result;
            })
            .catch((err) => {
                this.promisesPending--;
                throw err;
            });

        if (id) {
            this.promises[id] = pendingPromise;
        }

        return promise;
    }

    getPromise(id) {
        return this.promises[id];
    }
}
