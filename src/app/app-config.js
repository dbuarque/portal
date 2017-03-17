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
                    redirect: 'public'
                },
                {
                    route: ['public'],
                    name: 'public',
                    moduleId: './routes/public/public',
                    title: 'Home',
                    breadcrumb: true
                },
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
