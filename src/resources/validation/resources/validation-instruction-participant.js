/**
 * Created by istrauss on 5/12/2016.
 */

import _findIndex from 'lodash.findindex';

/**
 * Participates in an instruction's validation set. Usually, one participant is created for each dom control that is to be validated.
 * @class ValidationInstructionParticipant
 */
export default class ValidationInstructionParticipant {

    subscribers = [];

    constructor(instruction, valueGetterFn) {
        this.instruction = instruction;
        this.valueGetterFn = valueGetterFn;
        this.valid = true;
    }

    destroy() {
        this.instruction.removeParticipant(this);
    }

    clear() {
        this.notify('cleared');
    }

    validate(manuallyTriggered) {
        let value = this.valueGetterFn();

        for (let i = 0; i < this.instruction.validators.length; i++) {
            let validator = this.instruction.validators[i];
            this.valid = validator.validate(value);

            if (!this.valid) {
                let message = validator.message && this.instruction.title ? validator.message.replace('@title', this.instruction.title) : undefined;
                this.notify('validated', {
                    result: false,
                    message,
                    manuallyTriggered,
                    participant: this
                });

                return false;
            }
        }

        this.notify('validated', {
            result: true,
            message: null,
            manuallyTriggered,
            participant: this
        });

        return true;
    }

    subscribe(callback) {
        this.subscribers.push(callback);

        return this.unsubscribe.bind(this, callback);
    }

    unsubscribe(callback) {
        const index = _findIndex(this.subscribers, s => s === callback);

        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }

    notify(eventName, eventArgs) {
        this.subscribers.forEach(callback => {
            callback(eventName, eventArgs);
        });
    }
}
