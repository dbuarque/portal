import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class Finished {
    constructor(router) {
        this.router = router;
    }

    goToLogin() {
        this.router.navigateToRoute('login');
    }
}
