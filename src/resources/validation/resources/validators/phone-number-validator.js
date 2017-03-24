/**
 * Created by istrauss on 5/13/2016.
 */

import BaseValidator from './base-validator';

export default class PhoneNumberValidator extends BaseValidator {

    constructor() {
        super();
        this.message = '@title is not a valid phone number';
    }

    validate(input) {
        if (!input) {
            return true;
        }
        let justNumbers = input.toString().replace(/\D/g, '');
        return (justNumbers.length === 10 && justNumbers[0] !== '1') || (justNumbers.length === 11 && justNumbers[0] === 1);
    }
}
