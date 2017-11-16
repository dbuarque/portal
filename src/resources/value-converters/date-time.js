/**
 * Created by istrauss on 11/24/2016.
 */

import moment from 'moment';

export class FormatDateTimeValueConverter {
    toView(dateTime) {
        return moment(dateTime).format('MMMM Do YYYY, h:mm a');
    }
}

export class FormatDateValueConverter {
    toView(dateTime) {
        return moment(dateTime).format('MMMM Do YYYY');
    }
}

export class FormatTimeValueConverter {
    toView(dateTime) {
        return moment(dateTime).format('h:mm:ss a');
    }
}

export class TimeAgoValueConverter {
    toView(dateTime, noAgo) {
        return moment(dateTime).fromNow(noAgo);
    }
}
