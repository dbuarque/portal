/**
 * Created by istrauss on 1/7/2017.
 */

import {ActionTypeHelper} from 'global-resources';
import {namespace as detailNamespace} from '../detail-action-types';

export const namespace = detailNamespace + '_PRICE_CHART';

export const priceChartActionTypes = ActionTypeHelper.createNamespace(
    [
        'UPDATE_INTERVAL',
        'UPDATE_RANGE',
        'PRESET_RANGE'
    ],
    namespace
);

