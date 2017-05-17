/**
 * Created by istrauss on 4/11/2016.
 */

import {transient} from 'aurelia-framework';
import ValidationInstruction from './resources/validation-instruction';

/**
 * Manages a view-model's validation
 * @class ValidationManager
 * @uses transient
 */
@transient()
export default class ValidationManager {

    instructionMap = {};

    /**
     * Adds an instruction to the validation manager's managed instructions
     * @method addInstruction
     * @param {Object} instruction The validation instruction to add.
     * @param {String} instruction.key The validation instruction's key. The key is used to reference this instruction (internally as well as from the outside).
     * @param {String} [instruction.title] The validation instruction's title is injected into the invalid message that is displayed to the user.
     * @param {Array} [instruction.validators] The result of calling validate on the instruction is the cumulative result of calling validate on all its validators. If the instruction already exists, these validators will be added to its validators collection.
     * @return {ValidationInstruction} The instruction which is now managed by the manager.
     */
    addInstruction(instruction) {
        let storedInstruction = this.instructionMap[instruction.key];
        if (!storedInstruction) {
            storedInstruction = this.instructionMap[instruction.key] = new ValidationInstruction(instruction.key);
        }

        storedInstruction.addValidators(instruction.validators);
        storedInstruction.title = instruction.title || storedInstruction.title;

        return storedInstruction;
    }

    /**
     * Gets an instruction from the validation manager's managed instructions. If the instruction does not exist in the manager's manged instructions, it will first be added (with just the key) and then returned.
     * @method getInstruction
     * @param {String} key The validation instruction's key. The key is used to reference this instruction (internally as well as from the outside).
     * @return {ValidationInstruction} The requested instruction.
     */
    getInstruction(key) {
        let instruction = this.instructionMap[key];

        if (!instruction) {
            instruction = this.addInstruction({key});
        }

        return instruction;
    }

    /**
     * Add multiple instructions to be managed by the manager.
     * @method addInstructions
     * @param {Object[]} instructions An array of instructions to be added. addInstruction() is called on each one.
     */
    addInstructions(instructions) {
        instructions.forEach(this.addInstruction.bind(this));
    }

    /**
     * Remove an instruction from the manager's set of managed instructions.
     * @method removeInstruction
     * @param {String} key The key by which to search for the instruction to be removed.
     */
    removeInstruction(key) {
        delete this.instructionMap[key];
    }

    /**
     * Validate the manager. Calls validate on all the appropriate keys.
     * @method validate
     * @param {String} [specificKey] If the specificKey is provided, the manager will only validate that key, otherwise all keys will be validated.
     * @return {Boolean} The cumulative result of calling validate() on all the keys which were validated.
     */
    validate(specificKey) {
        return Object.keys(this.instructionMap)
            .filter(key => specificKey === undefined || specificKey === key)
            .reduce((instructionsResult, key) => {
                return this.instructionMap[key].validate() && instructionsResult;
            }, true);
    }

    clear() {
        Object.values(this.instructionMap).forEach(i => {
            i.clear();
        });
    }
}
