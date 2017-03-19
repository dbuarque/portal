/**
 * Created by istrauss on 3/17/2017.
 */

import {transient} from 'aurelia-framework';

@transient()
export default class AssetConfig {
    constructor() {
        return {
            autocomplete: {
                valueProp: 'code',
                labelProp: 'code'
            }
        };
    }
}
