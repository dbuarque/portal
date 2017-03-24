/**
 * Created by istrauss on 4/4/2016.
 */

import {customElement, bindable, inject, bindingMode} from 'aurelia-framework';

const defaultConfig = {
    searching: true,
    dom: 'rtlip',
    stripeClasses: [],
    orderClasses: false,
    autoWidth: true
};

const responsiveConfig = {
    details: {
        renderer: function( api, rowIdx, columns ) {
            let data = $.map( columns, function( col, i ) {
                return col.hidden ?
                '<tr class="corresponding-col-' + col.columnIndex + '">' +
                '<td class="title-cell">' + (col.title ? col.title + ':' : '') + '</td> ' +
                '<td class="data-cell">' + col.data + '</td>' +
                '</tr>' :
                    '';
            } ).join('');

            return data ?
                $('<table/>').append( data ) :
                false;
        }
    }
};

@customElement('jquery-data-table')
@inject(Element)
export class JqueryDataTableCustomElement {
    @bindable config = {};
    @bindable({defaultBindingMode: bindingMode.twoWay}) list = [];
    @bindable({defaultBindingMode: bindingMode.twoWay}) processing;

    constructor(element) {
        this.element = element;
    }

    bind() {
        this.config = Object.assign({}, defaultConfig, this.config);

        this.tableElement = $(this.element).find('table');
    }

    attached() {
        if (this.config.serverSide) {
            this.createTable();
        }
        else if (this.list) {
            this.listChanged();
        }
    }

    detached() {
        if (this.dataTable) {
            this.dataTable.api().destroy();
        }
    }

    listChanged() {
        if (!this.tableElement) {
            return;
        }

        if (this.config.serverSide) {
            throw new Error('A jquery datatable using serverSide should not be using local list.');
        }

        if (!this.dataTable) {
            this.createTable();
        }
        else {
            this.dataTable
                .api()
                .clear()
                .rows.add(this.list)
                .draw();
        }
    }

    createTable() {
        const self = this;

        //modify table config
        if (!self.config.serverSide) {
            self.config.data = self.list;
        }
        self.embedCellCallbacksInRowCallback();

        //save for later
        self.rowId = self.config.rowId;

        //create table
        self.dataTable = self.tableElement.dataTable(self.config);
        
        self.tableElement
            .on( 'processing.dt', function ( e, settings, processing ) {
                self.processing = processing;
            });

        //ensure search boxes are displayed appropriately
        self.toggleSearchCellVisibility();
        self.dataTable.api().on( 'responsive-resize', self.toggleSearchCellVisibility.bind(self));

        //make sure cellcallbacks are called on expanded child cells (for responsive display)
        self.embedCellCallbacksInResponsiveDisplay();

        if (self.config.responsive !== false) {
            return new $.fn.dataTable.Responsive( self.dataTable, responsiveConfig );
        }
    }

    embedCellCallbacksInRowCallback() {
        let config = this.config;
        let userDefinedRowCallback = config.rowCallback;

        config.rowCallback = function(row, rowData, rowIndex) {
            config.columns.forEach((column, colIndex) => {
                if (!column.cellCallback) {
                    return;
                }

                let cell = $('td:eq(' + colIndex + ')', row);
                column.cellCallback.call(this, cell, rowData);
            });

            if (userDefinedRowCallback) {
                userDefinedRowCallback.call(this, row, rowData, rowIndex);
            }
        };
    }

    embedCellCallbacksInResponsiveDisplay() {
        let config = this.config;
        this.dataTable.api().on( 'responsive-display', function( e, datatable, row, showHide, update ) {
            if (!showHide) {
                return;
            }

            let childRow = row.child();

            if (!childRow) {
                return;
            }

            config.columns.forEach((column, colIndex) => {
                if (!column.cellCallback) {
                    return;
                }

                let cell = $('.corresponding-col-' + colIndex + ' .data-cell', childRow[0]);
                column.cellCallback.call(this, cell, row.data());
            });
        });
    }

    toggleSearchCellVisibility(e, dataTable, columns) {
        if (!this.searchRow) {
            this.addColumnFilters();
            this.dataTable.api().columns.adjust(); //trigger responsive resize
        }
        else {
            this.searchRow.children().each((index, cell) => {
                cell.style.display = columns[index] ? 'table-cell' : 'none';
            });
        }
    }

    upsertRow(newRowData) {
        if (!this.rowId) {
            throw new Error('You must set a rowId in the table to use upsertRow.');
        }
        let api = this.dataTable.api();
        let row = api.row('#' + newRowData[this.rowId]);
        let table = row.length > 0 ? row.data(newRowData) : api.row.add(newRowData);
        table.draw();
    }

    removeRow(id) {
        if (!this.rowId) {
            throw new Error('You must set a rowId in the table to use removeRow.');
        }

        let row = this.dataTable.api().row('#' + id);
        if (row) {
            let table = row.remove();
            table.draw();
        }
    }

    addColumnFilters() {
        if (!this.config.searching) {
            return;
        }

        let tableHeader = this.tableElement.find('thead');
        let secondHeaderRow = $('<tr role="row"></tr>');
        let dataTableApi = this.dataTable.api();
        let columnDefs = dataTableApi.settings().init().columns;
        let atLeastOneSearchableColumn = false;

        dataTableApi.columns().every(function(index) {
            let column = this;
            let searchCell = $('<th></th>');
            let headerCell = this.header();

            if (columnDefs[index].searchable === true) {
                atLeastOneSearchableColumn = true;

                let title = $(headerCell).html();
                let searchBox = $('<input type="text" class="form-control" placeholder="Search ' + title + '" />' );

                searchBox
                    .on( 'keyup change', function() {
                        if ( column.search() !== this.value ) {
                            column
                                .search( this.value )
                                .draw();
                        }
                    })
                    .on('click', (event) => event.stopPropagation());

                searchCell.append(searchBox);
            }

            secondHeaderRow.append(searchCell);
        });

        if (atLeastOneSearchableColumn) {
            this.searchRow = secondHeaderRow;
            tableHeader.append(secondHeaderRow);
        }
    }
}
