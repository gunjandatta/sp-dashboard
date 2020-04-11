import { Components } from "gd-sprest-bs";

// Filter Properties
export interface IFilterProps {
    el: HTMLElement;
    onChange: (value: string) => void;
}

/**
 * Filter
 */
export class Filter {
    private _props: IFilterProps = null;

    // Constructor
    constructor(props: IFilterProps) {
        // Save the parameters
        this._props = props;

        // Render the filter
        this.render();
    }

    // Render the filter
    private render() {
        // Render a card
        Components.Card({
            el: this._props.el,
            body: [
                {
                    onRender: (el) => {
                        // Render checkboxes
                        Components.CheckboxGroup({
                            el,
                            isInline: true,
                            type: Components.CheckboxGroupTypes.Switch,
                            items: [
                                { label: "Draft" },
                                { label: "Submitted" },
                                { label: "Rejected" },
                                { label: "Pending Approval" },
                                { label: "Approved" },
                                { label: "Archived" }
                            ],
                            onChange: (item: Components.ICheckboxGroupItem) => {
                                // Call the change event
                                this._props.onChange(item ? item.label : "");
                            }
                        });
                    }
                }
            ]
        });
    }
}