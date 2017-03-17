/**
 * Created by istrauss on 5/12/2016.
 */

/**
 * Participates in an instruction's validation set. Usually, one participant is created for each dom control that is to be validated.
 * @class ValidationInstructionParticipant
 */
export default class ValidationInstructionParticipant {

    constructor(instruction, valueGetterFn, notify) {
        this.instruction = instruction;
        this.valueGetterFn = valueGetterFn;
        this.notify = notify;
        this.valid = true;
    }

    destroy() {
        this.instruction.removeParticipant(this);
    }

    validate(manuallyTriggered) {
        let value = this.valueGetterFn();

        for (let i = 0; i < this.instruction.validators.length; i++) {
            let validator = this.instruction.validators[i];
            this.valid = validator.validate(value);

            if (!this.valid) {
                let message = validator.message.replace('@title', this.instruction.title);
                this.notify(false,  message, manuallyTriggered, this);

                return false;
            }
        }

        this.notify(true, null, manuallyTriggered, this);
        return true;
    }
}
