/**
 * Created by istrauss on 4/13/2016.
 */

import _findIndex from 'lodash.findindex';
import ValidationInstructionParticipant from './validation-instruction-participant';

/**
 * Contains a set of validators (rules) and a set of participants (members interested in participating in validation according to this instruction's rules).
 * @class ValidationInstruction
 */
export default class ValidationInstruction {

    participants = [];

    constructor(key, options = {}) {
        this.key = key;
        this.validators = Array.isArray(options.validators) ?  options.validators : [];
        this.title = options.title;
    }

    addValidators(validatorsArr) {
        validatorsArr.forEach(newValidator => {
            const storedValidatorIndex = _findIndex(this.validators, v => v.constructor == newValidator.constructor);
            if (storedValidatorIndex > -1) {
                this.validators[storedValidatorIndex] = newValidator;
                return;
            }
            this.validators.push(newValidator);
        });
    }

    addParticipant(valueGetterFn, notifyCallback) {
        let participant = new ValidationInstructionParticipant(this, valueGetterFn, notifyCallback);

        this.participants.push(participant);

        return participant;
    }

    removeParticipant(participant) {
        let participantIndex = this.participants.indexOf(participant);
        this.participants.splice(participantIndex, 1);
    }

    clear() {
        this.participants.forEach(p => {
            p.clear();
        });
    }

    validate() {
        if (this.participants.length === 0) {
            return true;
        }

        return this.participants.reduce((valid, participant) => {
            return participant.validate(true) && valid;
        }, true);
    }
}
