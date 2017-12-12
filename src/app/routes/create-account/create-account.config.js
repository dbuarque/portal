import {transient} from 'aurelia-framework';

@transient()
export default class CreateAccountConfig {
    constructor() {
        return {
            routes: []
        };
    }
}
