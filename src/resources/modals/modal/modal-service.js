/**
 * Created by istrauss on 4/7/2016.
 */

import _uniqueId from 'lodash/uniqueId';
import {subscriptionService} from '../../decorators';

const defaultModalOptions = {
    keyboard: false,
    backdrop: 'static',
    dismissible: true
};

@subscriptionService()
export class ModalService {
    modalInstructions = {};

    addListeners() {
        this.eventAggregator.subscribe('modal.destroy', (modalId) => {
        });
    }

    open(path, passedInfo, options = {}) {
        return new Promise((resolve, reject) => {
            options = Object.assign({}, defaultModalOptions, options);

            let modalId = _uniqueId();

            this.modalInstructions[modalId] = {path, passedInfo, resolve, options, modalId};

            this._notifySubscribers({
                event: 'opened',
                modalId
            });
        });
    }

    close(modalId) {
        delete this.modalInstructions[modalId];

        this._notifySubscribers({
            event: 'closed',
            modalId
        });
    }

    getInstruction(modalId) {
        return this.modalInstructions[modalId];
    }
}
