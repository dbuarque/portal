/**
 * Created by istrauss on 5/1/2017.
 */
    
import {inject, bindable} from 'aurelia-framework';

export class StellarEntitiesJqdt {

    @bindable config;
    @bindable callBuilder;

    pageNum = 1;

    bind() {
        this._config = {
            ...this.config,
            ...{
                ajax: this.getPage.bind(this),
                searching: false,
                dom: 'rtp',
                pagingType: 'simple',
                pageLength: 100
            }
        };

        this.refresh();
    }

    callBuilderChanged() {
        this.refresh();
    }

    async refresh() {
        this.page = undefined;
        this.pageNum = 1;

        if (this.callBuilder) {
            await this.getPage();
        }
    }

    async getPage(data, settings) {
        if (!this.page) {
            this.callBuilder.limit(data.length);
            this.page = await this.callBuilder.call();
        }
        else {
            const newPageNum = data.start / data.length + 1;
            this.page = await this.page[newPageNum > this.pageNum ? 'next' : 'previous']();
        }

        return {
            draw: data.draw,
            data: this.page.records
        };
    }
}
