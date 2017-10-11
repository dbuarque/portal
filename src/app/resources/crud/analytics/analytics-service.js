
export class AnalyticsService {

    init() {
        window.dataLayer = window.dataLayer || [];

        let trackingId;

        switch(window.lupoex.env) {
            case 'production':
                trackingId = 'UA-107386084-1';
                break;
            case 'test':
                trackingId = 'UA-107386084-2';
                break;
            default:
                throw new Error('Could not init AnalyticsService. Unrecognized enviornment.');
        }

        this.gtag('js', new Date());

        this.gtag('config', trackingId, {
            'send_page_view': false,
            'anonymize_ip': true
        });
    }

    gtag() {
        window.dataLayer.push(arguments);
    }
}
