import { Dashboard } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource, IListItem } from "./ds";
import Strings from "./strings";

/**
 * Main Application
 */
export class App {
    // Constructor
    constructor(el: HTMLElement) {
        // Render the dashboard
        this.render(el);
    }

    // Renders the dashboard
    private render(el: HTMLElement) {
        // Create the dashboard
        let dashboard = new Dashboard({
            el,
            hideHeader: true,
            useModal: true,
            filters: {
                items: [{
                    header: "By Status",
                    items: DataSource.StatusFilters,
                    onFilter: (value: string) => {
                        // Filter the table
                        dashboard.filter(2, value);
                    }
                }]
            },
            navigation: {
                title: Strings.ProjectName,
                items: [
                    {
                        className: "btn-outline-light",
                        text: "Create Item",
                        isButton: true,
                        onClick: () => {
                            // Show the new form
                            DataSource.List.newForm({
                                onUpdate: () => {
                                    // Refresh the data
                                    DataSource.refresh().then(() => {
                                        // Refresh the table
                                        dashboard.refresh(DataSource.ListItems);
                                    });
                                }
                            });
                        }
                    }
                ]
            },
            footer: {
                itemsEnd: [
                    {
                        text: "v" + Strings.Version
                    }
                ]
            },
            table: {
                rows: DataSource.ListItems,
                // Update the default datatables.net properties
                onRendering: dtProps => {
                    // Remove the ability to sort and search on the 1st column
                    dtProps.columnDefs = [
                        {
                            "targets": 0,
                            "orderable": false,
                            "searchable": false
                        }
                    ];

                    // Order by the 1st column by default; ascending
                    dtProps.order = [[1, "asc"]];

                    // Return the datatables.net properties
                    return dtProps;
                },
                columns: [
                    {
                        name: "",
                        title: "Title",
                        onRenderCell: (el, column, item: IListItem) => {
                            // Render a buttons
                            Components.ButtonGroup({
                                el,
                                buttons: [
                                    {
                                        text: item.Title,
                                        type: Components.ButtonTypes.OutlinePrimary,
                                        onClick: () => {
                                            // Show the display form
                                            DataSource.List.viewForm({
                                                itemId: item.Id
                                            });
                                        }
                                    },
                                    {
                                        text: "Edit",
                                        type: Components.ButtonTypes.OutlineSuccess,
                                        onClick: () => {
                                            // Show the edit form
                                            DataSource.List.editForm({
                                                itemId: item.Id,
                                                onUpdate: () => {
                                                    // Refresh the data
                                                    DataSource.refresh().then(() => {
                                                        // Refresh the table
                                                        dashboard.refresh(DataSource.ListItems);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                ]
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
            }
        });
    }
}