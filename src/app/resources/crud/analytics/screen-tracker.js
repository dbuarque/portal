
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AnalyticsService} from "./analytics-service";

@inject(EventAggregator, AnalyticsService)
export class ScreenTracker {
    constructor(ea, analyticsService) {
        this.ea = ea;
        this.analyticsService = analyticsService;
    }

    init() {
        this.analyticsService.init();

        this.ea.subscribe('router:navigation:success', response => {
            this.analyticsService.gtag('event', 'screen_view', {
                'screen_name': response.instruction.fragment
            });
        });
    }
}
