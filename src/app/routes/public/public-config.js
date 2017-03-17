/**
 * Created by istrauss on 4/22/2016.
 */
import {transient} from 'aurelia-framework';

@transient()
export class PublicConfig {

    constructor() {
        return {
            routes: [
                {
                    route: '',
                    redirect: 'exchange'
                },
                {
                    route: ['login'],
                    name: 'login',
                    moduleId: './routes/login/login',
                    title: 'Login',
                    breadcrumb: true
                },
                {
                    route: ['exchange'],
                    name: 'exchange',
                    moduleId: './routes/exchange/exchange',
                    title: 'Exchange'
                }
            ]
        };
    }
}
