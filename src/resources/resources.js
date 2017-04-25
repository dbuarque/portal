/**
 * Created by istrauss on 3/22/2016.
 */

export * from './helpers/helpers';
export * from './workers/workers';
export * from './modals/modals';
export * from './validation/validation';
export * from './value-converters/value-converters';
export * from './redux/redux';

import {PLATFORM} from 'aurelia-pal';
import domControls from './dom-controls/dom-controls';
import widgets from './widgets/widgets';
import valueConverters from './value-converters/value-converters';
import validation from './validation/validation';
//import {CollapsibleCardCustomAttribute} from './custom-attributes/collapsible-card/collapsible-card';
//import {ModalAnchorCustomElement} from './modals/modal/modal-anchor';
//import {AlertCustomElement} from './display-elements/alert/alert';

//let otherResources = [
//    './custom-attributes/collapsible-card/collapsible-card',
//
//    './modals/modal/modal-anchor',
//
//    './display-elements/alert/alert'
//];

let resources = domControls
    .concat(widgets)
    .concat(valueConverters)
    .concat(validation)
    .map(r => PLATFORM.moduleName(r));

export function configure(config) {
    config.globalResources.apply(config, resources);
}
