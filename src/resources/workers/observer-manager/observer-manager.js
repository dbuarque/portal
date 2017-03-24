/**
 * Created by istrauss on 5/11/2016.
 */

import {inject, ObserverLocator, transient} from 'aurelia-framework';
import ObservationProcess from './observation-process';
export {default as ObservationInstruction} from './observation-instruction';

@transient()
@inject(ObserverLocator)
export class ObserverManager {

    constructor(observerLocator) {
        this.observerLocator = observerLocator;
        this.observationProcesses = [];
    }

    subscribe(instructions) {
        instructions.forEach(instruction => {
            this.observationProcesses.push(new ObservationProcess(this.observerLocator, instruction));
        });
    }

    unsubscribe() {
        this.observationProcesses.forEach(process => {
            process.stop();
        });
        this.observationProcesses = [];
    }
}


