import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export class CreateAccountConfig {
    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'introduction'
                },
                {
                    route: ['introduction'],
                    name: 'introduction',
                    moduleId: PLATFORM.moduleName('./routes/introduction/introduction'),
                    title: 'Introduction'
                },
                {
                    route: ['choose-public-key-method'],
                    name: 'choose-public-key-method',
                    moduleId: PLATFORM.moduleName('./routes/choose-public-key-method/choose-public-key-method'),
                    title: 'Choose Method'
                },
                //{
                //    route: ['obtain-public-key'],
                //    name: 'obtain-public-key',
                //    moduleId: PLATFORM.moduleName('./routes/obtain-public-key/obtain-public-key'),
                //    title: 'Create Account'
                //}
            ]
        };
    }
}
