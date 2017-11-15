import {bindable} from 'aurelia-framework';

export class ChooseSigningMethodCustomElement {

    @bindable() methods;
    @bindable() methodChosen;

    attached() {
        setTimeout(() => {
            Materialize.showStaggeredList($(this.list));
        }, 0);
    }
}
