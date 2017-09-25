/**
 * Created by istrauss on 4/25/2017.
 */

import {PLATFORM} from 'aurelia-pal';

export * from './auth';
export * from './crud';
export * from './value-converters';
export * from './helpers';

export function configure(config) {
    config.globalResources(
        PLATFORM.moduleName('./value-converters'),
        PLATFORM.moduleName('./widgets/stellar-entities-jqdt/stellar-entities-jqdt'),
        PLATFORM.moduleName('./widgets/lupoex-jqdt/lupoex-jqdt'),
        PLATFORM.moduleName('./custom-attributes/stellar-compliant-float'),
        PLATFORM.moduleName('./dom-controls/stellar-address-input/stellar-address-input')
    );
}

