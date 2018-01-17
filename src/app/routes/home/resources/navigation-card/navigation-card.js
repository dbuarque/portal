import {bindable, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class NavigationCardCustomElement {
    @bindable() route;

    showDetails = false;

    constructor(router) {
        this.router = router;
    }

    goToRoute() {
        this.router.navigateToRoute(this.route.name, this.route.href);
    }
}
