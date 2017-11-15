/**
 * Created by istrauss on 4/25/2017.
 */
import {PLATFORM} from 'aurelia-pal';

export * from './helpers';
export * from './workers';
export * from './modals';
export * from './validation';
export * from './value-converters';
export * from './stellar';
export * from './decorators';

export function configure(config) {
    config.globalResources(
        PLATFORM.moduleName('./binding-behaviors/reflect-model'),
        PLATFORM.moduleName('./dom-controls/vendor/select2/select2'),
        PLATFORM.moduleName('./widgets/spinner-overlay/spinner-overlay'),
        PLATFORM.moduleName('./widgets/jquery-data-table/jquery-data-table'),
        PLATFORM.moduleName('./value-converters/object'),
        PLATFORM.moduleName('./value-converters/string'),
        PLATFORM.moduleName('./value-converters/date-time'),
        PLATFORM.moduleName('./validation/tt-validate/tt-validate'),
        PLATFORM.moduleName('./custom-attributes/collapsible-card/collapsible-card'),
        PLATFORM.moduleName('./modals/modal/modal-anchor'),
        PLATFORM.moduleName('./display-elements/alert/alert'),
        PLATFORM.moduleName('./display-elements/alert-card/alert-card')
    );
}
