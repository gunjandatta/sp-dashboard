import { List } from "dattatable";
import { Components, Types, Web } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * List Item
 * Add your custom fields here
 */
export interface IListItem extends Types.SP.ListItem {
    ItemType: string;
    Status: string;
}

/**
 * Data Source
 */
export class DataSource {
    // List
    private static _list: List<IListItem> = null;
    static get List(): List<IListItem> { return this._list; }

    // List Items
    static get ListItems(): IListItem[] { return this.List.Items; }

    // Status Filters
    private static _statusFilters: Components.ICheckboxGroupItem[] = null;
    static get StatusFilters(): Components.ICheckboxGroupItem[] { return this._statusFilters; }
    static loadStatusFilters(): PromiseLike<Components.ICheckboxGroupItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the status field
            Web(Strings.SourceUrl).Lists(Strings.Lists.Main).Fields("Status").execute((fld: Types.SP.FieldChoice) => {
                let items: Components.ICheckboxGroupItem[] = [];

                // Parse the choices
                for (let i = 0; i < fld.Choices.results.length; i++) {
                    // Add an item
                    items.push({
                        label: fld.Choices.results[i],
                        type: Components.CheckboxGroupTypes.Switch
                    });
                }

                // Set the filters and resolve the promise
                this._statusFilters = items;
                resolve(items);
            }, reject);
        });
    }

    // Gets the item id from the query string
    static getItemIdFromQS() {
        // Get the id from the querystring
        let qs = document.location.search.split('?');
        qs = qs.length > 1 ? qs[1].split('&') : [];
        for (let i = 0; i < qs.length; i++) {
            let qsItem = qs[i].split('=');
            let key = qsItem[0];
            let value = qsItem[1];

            // See if this is the "id" key
            if (key == "ID") {
                // Return the item
                return parseInt(value);
            }
        }
    }

    // Initializes the application
    static init(): PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Initialize the list
            this._list = new List<IListItem>({
                listName: Strings.Lists.Main,
                itemQuery: {
                    GetAllItems: true,
                    OrderBy: ["Title"],
                    Top: 5000
                },
                onInitError: reject,
                onInitialized: () => {
                    // Load the status filters
                    this.loadStatusFilters().then(() => {
                        // Resolve the request
                        resolve();
                    }, reject);
                }
            });
        });
    }

    // Refreshes the list data
    static refresh(): PromiseLike<IListItem[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Refresh the data
            DataSource.List.refresh().then(resolve, reject);
        });
    }
}