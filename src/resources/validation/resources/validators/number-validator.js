/**
 * Created by istrauss on 5/2/2016.
 */

import BaseValidator from './base-validator';

/**
 * Responsible for validating if a value is a valid number
 * @class NumberValidator
 */
export default class NumberValidator extends BaseValidator {

    /**
     * Constructs a NumberValidator instance
     * @method constructor
     */
    constructor() {
        super();
        this.message = '@title is not a valid number';
    }

    /**
     * Validates a value
     * @method validate
     * @param {any} input The value to validated
     * @return {Boolean} True if input is a valid number.
     */
    validate(input) {
        return !isNaN(input);
    }
}
