/**
 * Created by Ishai on 12/21/2016.
 */

import {createStore} from 'redux';
import {Container, inject} from 'aurelia-framework';

@inject(Container)
export class StoreFactory {
    constructor(container) {
        this.container = container;
    }
    create(rootReducer, enhancer){
        return createStore(rootReducer, enhancer);
    }
}
