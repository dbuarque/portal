
export class AnalyticsService {

    get trackingId() {
        switch(window.lupoex.env) {
            case 'production':
                return 'UA-107386084-1';
            case 'test':
                return 'UA-107386084-2';
            default:
                throw new Error('Could not init AnalyticsService. Unrecognized environment.');
        }
    }

    constructor() {
        window.dataLayer = window.dataLayer || [];
        this.gtag('js', new Date());
    }

    setPage(path) {
        this.gtag('config', this.trackingId, {
            'document_location': window.location.hostname,
            'page_path': path,
            'anonymize_ip': true
        });
    }

    gtag() {
        window.dataLayer.push(arguments);
    }
}
