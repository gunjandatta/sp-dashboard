import { Components, Helper, jQuery, List, SPTypes, Types } from "gd-sprest-bs";
import Strings from "../strings";

/**
 * Table
 */
export class Table {
    private _el: HTMLElement = null;
    private _datatable = null;
    private _formUrl: string = null;
    private _search: string = null;
    private _table: Components.ITable = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Save the parameters
        this._el = el;

        // Load the data
        this.load().then(() => {
            // Render the table
            this.render();
        });
    }

    // Clears the component
    private clear() {
        // Clear the elements
        while (this._el.firstChild) { this._el.firstChild.remove(); }
    }

    // Load the form url
    private load() {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the form for the list
            List(Strings.Lists.Main).Forms().query({
                Filter: "FormType eq " + SPTypes.PageType.DisplayForm
            }).execute(forms => {
                // Save the form url
                this._formUrl = forms.results[0].ServerRelativeUrl;

                // Resolve the promise
                resolve();
            }, reject);
        });
    }

    // Load the items
    private loadItems(filter: string): PromiseLike<Array<any>> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the list items
            List(Strings.Lists.Main).Items().query({
                Filter: filter ? "Status eq '" + filter + "'" : null
            }).execute(items => {
                // Resolve the promise
                resolve(items.results);
            });
        });
    }

    // Render the table
    private render(filter?: string) {
        // Clear the component
        this.clear();

        // Render a table
        this._table = Components.Table({
            el: this._el,
            columns: [
                {
                    name: "",
                    title: "Title",
                    onRenderCell: (el, column, item: Types.SP.ListItem) => {
                        // Render a button
                        Components.Button({
                            el,
                            text: item.Title,
                            onClick: () => {
                                // Show the display form
                                Helper.SP.ModalDialog.showModalDialog({
                                    title: "View Item",
                                    url: this._formUrl + "?ID=" + item.Id,
                                    dialogReturnValueCallback: result => {
                                        // See if the item was updated
                                        if (result == SPTypes.ModalDialogResult.OK) {
                                            // Refresh the page
                                            document.location.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                },
                {
                    name: "ItemType",
                    title: "Item Type"
                },
                {
                    name: "Status",
                    title: "Status"
                }
            ]
        });

        // Load the items
        this.loadItems(filter).then(items => {
            // Add the table rows
            this._table.addRows(items);

            // Apply the datatable
            this._datatable = jQuery(this._table.el).DataTable();

            // See if there is a search value set
            if (this._search) {
                // Search the table
                this._datatable.search(this._search).draw();
            }
        });
    }

    /**
     * Public Interface
     */

    // Applies a filter to the table
    applyFilter(filter: string) {
        // Render the table
        this.render(filter);
    }

    // Search the table
    search(search: string) {
        // Set the search value
        this._search = search;

        // Search the table
        this._datatable.search(search).draw();
    }
}