/**
 * Created by istrauss on 4/13/2016.
 */

import BaseValidator from './base-validator';

/**
 * Responsible for validating if a required value has been filled out
 * @class RequiredValidator
 */
export default class RequiredValidator extends BaseValidator {

    /**
     * Constructs a RequiredValidator instance
     * @method constructor
     * @param {String[]} [allowedValues=[]] Use this array to allow normally disabled values (i.e. if you want this validator to consider false as having been filled out).
     */
    constructor(allowedValues) {
        super();
        this.message = '@title is required';
        this.allowedValues = allowedValues || [];
    }

    /**
     * Validates a value
     * @method validate
     * @param {any} input The value to validated
     * @return {Boolean} True if input is an Array and its length is greater than zero or if input is not falsy or if input is one of the validators allowed validators, otherwise false.
     */
    validate(input) {
        if (input && input.length !== undefined) {
            input = input.length > 0;
        }
        return input || this.allowedValues.indexOf(input) > -1;
    }
}
