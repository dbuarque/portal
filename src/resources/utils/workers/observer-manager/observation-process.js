/**
 * Created by istrauss on 5/11/2016.
 */

export default class ObservationProcess {

    constructor(locator, instruction) {
        this.observer = locator.getObserver(instruction.object, instruction.property);

        this.observer.subscribe(instruction.callback);

        this.instruction = instruction;
    }

    stop() {
        this.observer.unsubscribe(this.instruction.callback);
    }
}
