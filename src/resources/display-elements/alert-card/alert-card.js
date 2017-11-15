import {bindable, computedFrom} from 'aurelia-framework';

export class AlertCardCustomElement {
    @bindable() type = 'info';
    @bindable() title = '';
    @bindable() dimissible = false;

    @computedFrom('type')
    get iconClasses() {
        let classes = 'fa';

        switch(this.type) {
            case 'error':
                classes += 'fa-exclamation-circle error-text';
                break;
            default:
                classes += ' fa-info-circle primary-text';
                break;
        }

        return classes;
    }
}
