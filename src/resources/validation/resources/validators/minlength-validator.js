/**
 * Created by istrauss on 4/13/2016.
 */

import BaseValidator from './base-validator';

/**
 * Responsible for validating if a input is shorter than minimum number of characters
 * @class MinlengthValidator
 */
export default class MinlengthValidator extends BaseValidator {

    constructor(minLength) {
        super();
        this.message = '@title is shorter than the ' + maxLength + ' required character length';
        this.minLength = parseInt(minLength, 10);
    }

    /**
     * Validates a value
     * @method validate
     * @param {any} input The value to validated
     * @return {Boolean} True if input longer or equal to the minLength.
     */
    validate(input) {
        return input.toString().length >= this.minLength;
    }
}