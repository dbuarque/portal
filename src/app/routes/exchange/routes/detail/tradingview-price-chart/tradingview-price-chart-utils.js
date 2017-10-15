
export function resolutionToSeconds(resolution) {
    let multiplicationFactor = 60;

    if (resolution.indexOf('D') > -1) {
        multiplicationFactor = 60 * 60 * 24;
    }
    else if (resolution.indexOf('W') > -1) {
        multiplicationFactor = 60 * 60 * 24 * 7;
    }

    let result = resolution.replace(/[DW]/, '');

    result = parseInt(result || 1, 10);

    if (isNaN(result)) {
        throw new Error('Could not convert resolution: ' + resolution + ' to seconds.');
    }

    return result * multiplicationFactor;
}

export function timeFrameToAmountScale(timeframe) {
    const scaleMap = {
        hr: 'hours',
        d: 'days',
        mo: 'months',
        y: 'years'
    };

    let scale;
    let amount;

    for (let k = 0; k < Object.keys(scaleMap).length; k++) {
        const key = Object.keys(scaleMap)[k];

        if (timeframe.text.indexOf(key) > -1) {
            scale = scaleMap[key];
            amount = parseInt(timeframe.text.replace(key, ''), 10);
            break;
        }
    }

    return {
        amount,
        scale
    };
}
