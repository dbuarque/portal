/**
 * Created by istrauss on 4/13/2016.
 */

export default class ValidatorBase {
    constructor() {}
    validate() {
        throw new Error(this.constructor + ' has not implemented validate');
    }
}
