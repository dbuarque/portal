/**
 * Created by istrauss on 4/22/2016.
 */

import {transient} from 'aurelia-framework';

@transient()
export class AccountConfig {

    constructor() {
        return {
            routes: [
                {
                    route: '',
                    redirect: 'profile'
                },
                {
                    route: ['profile'],
                    name: 'profile',
                    moduleId: './routes/profile/profile',
                    title: 'Profile',
                    auth: true,
                    breadcrumb: true
                }
            ]
        };
    }
}
