/**
 * Created by istrauss on 5/13/2016.
 */

import BaseValidator from './base-validator';

export default class EmailValidator extends BaseValidator {

    constructor() {
        super();
        this.message = '@title is not a valid email address';
    }

    validate(input) {
        if (!input) {
            return true;
        }

        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(input);
    }
}
