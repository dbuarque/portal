/**
 * Created by istrauss on 9/27/2016.
 */

import {bindable, customElement, inject} from 'aurelia-framework';
import _findIndex from 'lodash/findIndex';

@customElement('md-routed-sidenav')
@inject(Element)
export class MdRoutedSideNavCustomElement {
    @bindable router;

    menuItems = [];

    constructor(element) {
        this.element = element;
        this.$element = $(element);
    }

    bind() {
        this.routerChanged();
    }

    attached() {
        //this.this.$element.find('ul.top-ul');
    }

    createMenuItems() {
        let vm = this;

        vm.router.navigation.forEach((navModel) => {
            if (!navModel.settings.parent || _findIndex(vm.menuItems, {label: navModel.settings.parent.label}) === -1) {
                let menuItem = navModel.settings.parent || navModel;
                if (navModel.settings.parent) {
                    menuItem.navModels = vm.router.navigation.filter(navModelMatch =>
                        navModelMatch.settings && navModelMatch.settings.parent && navModelMatch.settings.parent.label === navModel.settings.parent.label
                    );
                }
                vm.menuItems.push(menuItem);
            }
        }, []);
    }

    routerChanged() {
        if (this.router) {
            this.createMenuItems();
        }
    }

    show() {

    }
}