/**
 * Created by istrauss on 3/16/2016.
 */

export class EventHelper {
    static emitEvent(element, name, args) {
        let event;

        if (window.CustomEvent) {
            event = new window.CustomEvent(name, args);
        }
        else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(name, true, true, args);
        }
        element.dispatchEvent(event);
    }
}
