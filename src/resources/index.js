/**
 * Created by istrauss on 3/9/2016.
 */

import domControls from './dom-controls/index';
import widgets from './widgets/index';
import valueConverters from './value-converters/index';

let otherResources = [
    'resources/validation/tt-validate/tt-validate',

    'resources/custom-attributes/collapsible-card/collapsible-card',

    'resources/custom-attributes/focus-input/focus-input',

    'resources/modals/modal/modal-anchor',

    'resources/display-elements/alert/alert'
];

let resources = [domControls, widgets, valueConverters, otherResources]
    .reduce((resourceArr, subResources) => resourceArr.concat(subResources), []);

export function configure(config) {
    config.globalResources(resources);
}
