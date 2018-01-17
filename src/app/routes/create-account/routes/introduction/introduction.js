import {inject} from 'aurelia-framework';
import {UpdateCanProceedActionCreator} from '../../action-creators';

@inject(UpdateCanProceedActionCreator)
export class Introduction {
    constructor(updateCanProceed) {
        this.updateCanProceed = updateCanProceed;
    }

    activate() {
        this.updateCanProceed.dispatch(true);
    }
}
