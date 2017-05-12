/**
 * Created by Ishai on 3/27/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export class AppConfig {

    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'exchange'
                },
                {
                    route: ['exchange'],
                    name: 'exchange',
                    moduleId: PLATFORM.moduleName('./routes/exchange/exchange'),
                    title: 'Exchange'
                },
                {
                    route: ['login'],
                    name: 'login',
                    moduleId: PLATFORM.moduleName('./routes/login/login'),
                    title: 'Login'
                },
                {
                    route: ['account'],
                    name: 'account',
                    moduleId: PLATFORM.moduleName('./routes/account/account'),
                    title: 'Account',
                    breadcrumb: true
                }
            ]
        };
    }
}
