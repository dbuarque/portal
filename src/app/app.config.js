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
                    route: ['home'],
                    name: 'home',
                    moduleId: PLATFORM.moduleName('./routes/home/home'),
                    title: 'Home'
                },
                {
                    route: ['exchange'],
                    name: 'exchange',
                    moduleId: PLATFORM.moduleName('./routes/exchange/exchange', 'exchange'),
                    title: 'Decentralized Exchange',
                    breadcrumb: true
                },
                {
                    route: ['login'],
                    name: 'login',
                    moduleId: PLATFORM.moduleName('./routes/login/login', 'login'),
                    title: 'Login',
                    breadcrumb: true,
                    anonymousRequired: true
                },
                {
                    route: ['create-account'],
                    name: 'createAccount',
                    moduleId: PLATFORM.moduleName('./routes/create-account/create-account', 'create-account'),
                    title: 'Create Account',
                    breadcrumb: true,
                    anonymousRequired: true
                },
                {
                    route: ['account'],
                    name: 'account',
                    moduleId: PLATFORM.moduleName('./routes/account/account', 'account'),
                    accountRequired: true,
                    title: 'My Account',
                    breadcrumb: true
                },
                {
                    route: ['send-payment/:type/:code/:issuer'],
                    name: 'send-payment',
                    moduleId: PLATFORM.moduleName('./routes/send-payment/send-payment', 'send-payment'),
                    accountRequired: true,
                    title: 'Send Payment',
                    breadcrumb: true
                }
            ]
        };
    }
}
