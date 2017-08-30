/**
 * Created by istrauss on 1/7/2017.
 */

import {createNamespace} from 'au-redux';
import {namespace as detailNamespace} from '../detail-action-types';

export const namespace = detailNamespace + '_TRADINGVIEW_PRICE_CHART';

export const tradingviewPriceChartActionTypes = createNamespace(
    [
        'UPDATE_BARS',
        'UPDATE_BAR',
        'INCREMENT_LOADING',
        'DECREMENT_LOADING'
    ],
    namespace
);

