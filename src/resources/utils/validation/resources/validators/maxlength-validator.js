/**
 * Created by istrauss on 4/13/2016.
 */

import BaseValidator from './base-validator';

/**
 * Responsible for validating if an input is shorter than a maxLength
 * @class MaxlengthValidator
 */
export default class MaxlengthValidator extends BaseValidator {

    constructor(maxLength) {
        super();
        this.message = '@title is longer than the ' + maxLength + ' allowed character length';
        this.maxLength = parseInt(maxLength, 10);
    }

    /**
     * Validates a value
     * @method validate
     * @param {any} input The value to validated
     * @return {Boolean} True if input shorter or equal to the maxLength.
     */
    validate(input) {
        return input.toString().length <= this.maxLength;
    }
}