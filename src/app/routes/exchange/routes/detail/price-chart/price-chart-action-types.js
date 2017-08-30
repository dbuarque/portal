/**
 * Created by istrauss on 1/7/2017.
 */

import {createNamespace} from 'au-redux';
import {namespace as detailNamespace} from '../detail-action-types';

export const namespace = detailNamespace + '_PRICE_CHART';

export const priceChartActionTypes = createNamespace(
    [
        'UPDATE_INTERVAL',
        'UPDATE_RANGE',
        'PRESET_RANGE'
    ],
    namespace
);

