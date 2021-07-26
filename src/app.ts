import { Dashboard, ItemForm } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource, IItem } from "./ds";
import Strings from "./strings";

/**
 * Main Application
 */
export class App {
    // Constructor
    constructor(el: HTMLElement) {
        // Set the list name
        ItemForm.ListName = Strings.Lists.Main;

        // Load the data
        DataSource.load().then(items => {
            // Load the filters
            DataSource.loadStatusFilters().then(() => {
                // Render the dashboard
                this.render(el, items);
            });
        });
    }

    // Renders the dashboard
    private render(el: HTMLElement, items: any[]) {
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
                            // Create an item
                            ItemForm.create({
                                onUpdate: () => {
                                    // Load the data
                                    DataSource.load().then(items => {
                                        // Refresh the table
                                        dashboard.refresh(items);
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
                rows: items,
                dtProps: {
                    dom: 'rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',
                    "columnDefs": [
                        {
                            "targets": 0,
                            "orderable": false,
                            "searchable": false
                        }
                    ]
                },
                columns: [
                    {
                        name: "",
                        title: "Title",
                        onRenderCell: (el, column, item: IItem) => {
                            // Render a buttons
                            Components.ButtonGroup({
                                el,
                                buttons: [
                                    {
                                        text: item.Title,
                                        type: Components.ButtonTypes.OutlinePrimary,
                                        onClick: () => {
                                            // Show the display form
                                            ItemForm.view({
                                                itemId: item.Id
                                            });
                                        }
                                    },
                                    {
                                        text: "Edit",
                                        type: Components.ButtonTypes.OutlineSuccess,
                                        onClick: () => {
                                            // Show the display form
                                            ItemForm.edit({
                                                itemId: item.Id,
                                                onUpdate: () => {
                                                    // Refresh the data
                                                    DataSource.load().then(items => {
                                                        // Update the data
                                                        dashboard.refresh(items);
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