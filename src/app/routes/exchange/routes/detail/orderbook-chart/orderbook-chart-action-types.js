/**
 * Created by istrauss on 1/7/2017.
 */

import {createNamespace} from 'au-redux';
import {namespace as detailNamespace} from '../detail-action-types';

export const namespace = detailNamespace + '_ORDERBOOK_CHART';

export const orderbookChartActionTypes = createNamespace(
    [
        'UPDATE_RANGE'
    ],
    namespace
);

