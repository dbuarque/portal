/**
 * Created by istrauss on 3/22/2017.
 */
import {PLATFORM} from 'aurelia-pal';

export * from './auth/auth';
export * from './crud/crud';
export * from './value-converters';

export function configure(config) {
    config.globalResources(
        PLATFORM.moduleName('./value-converters')
    );
}
