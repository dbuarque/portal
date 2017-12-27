import {bindable, computedFrom} from 'aurelia-framework';

export class AlertCardCustomElement {
    @bindable() type = 'info';
    @bindable() title = '';
    @bindable() dismissible = true;

    @computedFrom('type')
    get iconClasses() {
        let classes = 'fal';

        switch (this.type) {
            case 'error':
                classes += ' fa-times-circle error-text';
                break;
            case 'warning':
                classes += ' fa-exclamation-triangle warning-text';
                break;
            case 'success':
                classes += ' fa-check success-text';
                break;
            default:
                classes += ' fa-info-circle primary-text';
                break;
        }

        return classes;
    }
}
