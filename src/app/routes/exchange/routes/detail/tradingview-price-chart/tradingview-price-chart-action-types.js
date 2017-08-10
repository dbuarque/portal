/**
 * Created by istrauss on 1/7/2017.
 */

import {ActionTypeHelper} from 'global-resources';
import {namespace as detailNamespace} from '../detail-action-types';

export const namespace = detailNamespace + '_TRADINGVIEW_PRICE_CHART';

export const tradingviewPriceChartActionTypes = ActionTypeHelper.createNamespace(
    [
        'UPDATE_BARS',
        'UPDATE_BAR',
        'INCREMENT_LOADING',
        'DECREMENT_LOADING'
    ],
    namespace
);

