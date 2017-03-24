/**
 * Created by istrauss on 5/2/2016.
 */

import BaseValidator from './base-validator';

export default class PostalCodeValidator extends BaseValidator {

    constructor() {
        super();
        this.message = '@title is not a valid postal code';
    }

    validate(input) {
        if (!input) {
            return true;
        }

        let justNumbers = input.toString().replace(/\D/g, '');
        return justNumbers.length === 5;
    }
}
