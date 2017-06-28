/**
 * Created by istrauss on 6/16/2017.
 */

export class PercentGainValueConverter {
    toView(percentGain) {
        return percentGain ? '<span class="' + (percentGain > 0 ? 'success' : 'error') + '-text">' + (percentGain > 0 ? '+' : '') + percentGain.toFixed(2) + '%</span>' : '';
    }
}