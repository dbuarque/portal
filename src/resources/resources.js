/**
 * Created by istrauss on 3/22/2016.
 */

export * from './helpers/helpers';
export * from './workers/workers';
export * from './modals/modals';
export * from './validation/validation';
export * from './value-converters/value-converters';
export * from './redux/redux';

import domControls from './dom-controls/dom-controls';
import widgets from './widgets/widgets';
import valueConverters from './value-converters/value-converters';

let otherResources = [
    'resources/validation/tt-validate/tt-validate',

    'resources/custom-attributes/collapsible-card/collapsible-card',

    'resources/modals/modal/modal-anchor',

    'resources/display-elements/alert/alert'
];

let resources = [domControls, widgets, valueConverters, otherResources]
    .reduce((resourceArr, subResources) => resourceArr.concat(subResources), []);

export function configure(config) {
    config.globalResources(resources);
}
