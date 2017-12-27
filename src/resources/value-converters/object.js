/**
 * Created by istrauss on 3/31/2016.
 */

import {inject} from 'aurelia-framework';

export class ObjectValuesValueConverter {
    toView(obj = {}) {
        return Object.keys(obj).map(key => {
            return obj[key];
        });
    }
}


export class ObjectKeysValueConverter {
    toView(obj = {}) {
        return obj ? Object.keys(obj) : [];
    }
}

//returns an object as [{key, value}]
export class ObjectToArrayValueConverter {
    toView(obj = {}) {
        return obj ?  Object.keys(obj).map(key => {
            return {key, value: obj[key]};
        }) : [];
    }
}

export class ObjectIsEmptyValueConverter {
    toView(obj = {}) {
        return obj ? Object.keys(obj).length === 0 : [];
    }
}

@inject(ObjectIsEmptyValueConverter)
export class ObjectIsNotEmptyValueConverter {
    constructor(objectIsEmpty) {
        this.objectIsEmpty = objectIsEmpty;
    }

    toView(obj = {}) {
        return !this.objectIsEmpty.toView(obj);
    }
}
