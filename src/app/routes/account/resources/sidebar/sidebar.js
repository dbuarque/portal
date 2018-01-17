/**
 * Created by istrauss on 11/11/2016.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AccountConfig} from '../../account.config';

@inject(Router, AccountConfig)
export class SidebarCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) hidden;

    get routes() {
        return this.accountConfig.routes.filter(route => route.nav);
    }

    constructor(router, accountConfig) {
        this.router = router;
        this.accountConfig = accountConfig;
    }

    goToRoute(route) {
        this.router.navigateToRoute(route.name);
    }
}
