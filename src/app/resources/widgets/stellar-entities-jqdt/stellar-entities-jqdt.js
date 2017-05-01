/**
 * Created by istrauss on 5/1/2017.
 */
    
import {inject, bindable} from 'aurelia-framework';

export class StellarEntitiesJqdt {
    @bindable config;
    @bindable callBuilder;

    bind() {
        this.config.ajax = this.getPage.bind(this);
    }

    async getPage(data, settings) {
        if (this.page) {
            this.callBuilder = this.callBuilder.cursor(this.page.records[this.page.records.length - 1].paging_token);
        }

        this.callBuilder.limit(data.length);

        this.page = await this.callBuilder.call();

        return {
            draw: data.draw,
            data: page.records
        };
    }
}
