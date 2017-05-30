/**
 * Created by istrauss on 1/7/2017.
 */

import {ActionTypeHelper} from 'global-resources';
import {namespace as detailNamespace} from '../detail-action-types';

export const namespace = detailNamespace + '_ORDERBOOK_CHART';

export const orderbookChartActionTypes = ActionTypeHelper.createNamespace(
    [
        'UPDATE_RANGE'
    ],
    namespace
);

