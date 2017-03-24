/**
 * Created by istrauss on 9/27/2016.
 */

import {bindable, customElement, containerless} from 'aurelia-framework';

@customElement('link-content')
@containerless()
export class LinkContent {

    @bindable router;
    @bindable navModel;
}