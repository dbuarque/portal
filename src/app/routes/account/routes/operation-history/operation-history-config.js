/**
 * Created by Ishai on 5/2/2017.
 */

import {transient} from 'aurelia-framework';

@transient()
export default class OperationHistoryConfig {

    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'list'
                },
                {
                    route: ['list'],
                    name: 'list',
                    moduleId: PLATFORM.moduleName('./routes/list/list'),
                    title: 'List'
                },
                {
                    route: [':operationId'],
                    name: 'detail',
                    moduleId: PLATFORM.moduleName('./routes/detail/detail'),
                    title: 'Effects',
                    breadcrumb: true
                }
            ]
        };
    }
}