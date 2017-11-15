
import BigNumber from 'bignumber.js';
import moment from 'moment';
import {resolutionToSeconds, timeFrameToAmountScale} from './resources';

export class DisableTimeframeValueConverter {
    toView(timeframe, currentResolution) {
        if (!currentResolution) {
            return true;
        }

        const timeFrameAmountScale = timeFrameToAmountScale(timeframe);
        const timeFrameSeconds = moment.duration(timeFrameAmountScale.amount, timeFrameAmountScale.scale).asSeconds();

        return (new BigNumber(timeFrameSeconds))
            .dividedBy(resolutionToSeconds(currentResolution))
            .lessThan(10) ||
        (new BigNumber(timeFrameSeconds))
            .dividedBy(resolutionToSeconds(currentResolution))
            .greaterThan(500);
    }
}
