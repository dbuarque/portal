import {transient} from 'aurelia-framework';

@transient()
export class LoginConfig {
    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'public-key'
                },
                {
                    route: ['public-key'],
                    name: 'publicKey',
                    moduleId: PLATFORM.moduleName('./routes/public-key/public-key'),
                    title: 'Public Key'
                },
                {
                    route: ['secret-key'],
                    name: 'secretKey',
                    moduleId: PLATFORM.moduleName('./routes/secret-key/secret-key'),
                    title: 'Secret Key'
                },
                {
                    route: ['ledger-nano'],
                    name: 'ledgerNano',
                    moduleId: PLATFORM.moduleName('./routes/ledger-nano/ledger-nano'),
                    title: 'Ledger Nano'
                }
            ]
        };
    }
}
