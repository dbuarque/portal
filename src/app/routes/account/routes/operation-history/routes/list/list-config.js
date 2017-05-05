/**
 * Created by Ishai on 5/5/2017.
 */

import {transient} from 'aurelia-framework';

@transient()
export default class ListConfig {

    constructor() {
        return {
            table: {
                columns: [
                    {
                        title: 'Type',
                        data: 'type',
                        render(cellData, type, rowData) {
                            return rowData.type.split('_').map(w => w.slice(0, 1).toUpperCase() + w.slice(1)).join(' ');
                        }
                    },
                    {
                        title: 'Id',
                        data: 'id'
                    },
                    {
                        title: 'Details',
                        data: 'id',
                        cellCallback: (cell, rowData) => {
                            cell.empty();

                            const table = $('<table></table>');

                            Object.keys(rowData).forEach(key => {
                                if (typeof rowData[key] === 'string' && ['type', 'id', 'paging_token'].indexOf(key) === -1) {
                                    table.append($('<tr><td style="text-align: right; border-top-width: 0;">' + key + ':</td><td style="text-align: left; border-top-width: 0; word-break: break-all;">' + rowData[key] + '</td></tr>'))
                                }
                            });

                            table.appendTo(cell);
                        }
                    },
                    {
                        title: '',
                        defaultContent: '',
                        searchable: false,
                        orderable: false
                    }
                ]
            }
        };
    }
}