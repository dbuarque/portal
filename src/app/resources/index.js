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
        PLATFORM.moduleName('./value-converters/misc'),
        PLATFORM.moduleName('./value-converters/number'),
        PLATFORM.moduleName('./value-converters/order'),
        PLATFORM.moduleName('./dom-controls/stellar-address-input/stellar-address-input'),
        PLATFORM.moduleName('./dom-controls/bip32-path-input/bip32-path-input'),
        PLATFORM.moduleName('./display-elements/shortened-address/shortened-address'),
        PLATFORM.moduleName('./display-elements/asset-card/asset-card'),
        PLATFORM.moduleName('./display-elements/asset-pair-cards/asset-pair-cards'),
        PLATFORM.moduleName('./crud/stellar/asset-selection-sidebar/asset-selection-sidebar')
    );
}
