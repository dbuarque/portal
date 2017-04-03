/**
 * Created by Ishai on 3/27/2016.
 */

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
                    moduleId: './routes/exchange/exchange',
                    title: 'Exchange',
                    breadcrumb: true
                },
                //{
                //    route: ['login'],
                //    name: 'login',
                //    moduleId: './routes/login/login',
                //    title: 'Login',
                //    breadcrumb: true
                //},
                {
                    route: ['account'],
                    name: 'account',
                    moduleId: './routes/account/account',
                    title: 'Account',
                    breadcrumb: true
                }
            ]
        };
    }
}
