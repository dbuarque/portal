/**
 * Created by istrauss on 4/25/2017.
 */

import {PLATFORM} from 'aurelia-pal';

export * from './auth/auth';
export * from './crud/crud';
export * from './value-converters';

export function configure(config) {
    config.globalResources(
        PLATFORM.moduleName('./value-converters'),
        PLATFORM.moduleName('./widgets/stellar-entities-jqdt/stellar-entities-jqdt'),
        PLATFORM.moduleName('./widgets/lupoex-jqdt/lupoex-jqdt')
    );
}

