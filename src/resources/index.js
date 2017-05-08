/**
 * Created by istrauss on 4/25/2017.
 */
import {PLATFORM} from 'aurelia-pal';

export * from './helpers/helpers';
export * from './workers/workers';
export * from './modals/modals';
export * from './validation/validation';
export * from './value-converters/value-converters';
export * from './redux/redux';
export * from './stellar/stellar';

export function configure(config) {
    config.globalResources(
        PLATFORM.moduleName('./dom-controls/vanilla/radio-list/radio-list'),
        PLATFORM.moduleName('./dom-controls/vanilla/label-vc/label-vc'),
        PLATFORM.moduleName('./dom-controls/vanilla/checkbox-list/checkbox-list'),
        PLATFORM.moduleName('./dom-controls/vanilla/select-dd/select-dd'),
        PLATFORM.moduleName('./dom-controls/vanilla/state-select/state-select'),
        PLATFORM.moduleName('./dom-controls/vanilla/country-select/country-select'),
        PLATFORM.moduleName('./dom-controls/vendor/select2/select2'),
        PLATFORM.moduleName('./widgets/form-fields/form-fields'),
        PLATFORM.moduleName('./widgets/spinner-overlay/spinner-overlay'),
        PLATFORM.moduleName('./widgets/jquery-data-table/jquery-data-table'),
        PLATFORM.moduleName('./value-converters/object'),
        PLATFORM.moduleName('./value-converters/string'),
        PLATFORM.moduleName('./value-converters/date-time'),
        PLATFORM.moduleName('./validation/tt-validate/tt-validate'),
        PLATFORM.moduleName('./custom-attributes/collapsible-card/collapsible-card'),
        PLATFORM.moduleName('./modals/modal/modal-anchor'),
        PLATFORM.moduleName('./display-elements/alert/alert')
    );
}
