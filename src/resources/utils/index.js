/**
 * Created by istrauss on 3/9/2016.
 */

import domControls from './dom-controls/index';
import widgets from './widgets/index';
import valueConverters from './value-converters/index';

let otherResources = [
    'resources/utils/validation/tt-validate/tt-validate',

    'resources/utils/custom-attributes/collapsible-card/collapsible-card',

    'resources/utils/custom-attributes/focus-input/focus-input',

    'resources/utils/modals/modal/modal-anchor',

    'resources/utils/display-elements/alert/alert'
];

let resources = [domControls, widgets, valueConverters, otherResources]
    .reduce((resourceArr, subResources) => resourceArr.concat(subResources), []);

export function configure(config) {
    config.globalResources(resources);
}
