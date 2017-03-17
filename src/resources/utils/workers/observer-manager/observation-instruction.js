/**
 * Created by istrauss on 5/11/2016.
 */

export default class ObservationInstruction {

    constructor(object, property, callback) {
        this.object = object;
        this.property = property;
        this.callback = callback;
    }
}
