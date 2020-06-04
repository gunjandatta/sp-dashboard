import { Filter } from "./filter";
import { Navigation } from "./navigation";
import { Table } from "./table";
import * as HTML from "./index.html";
import "./styles.css";

/**
 * Dashboard
 */
export class Dashboard {
    private _el: HTMLElement = null;

    /**
     * Renders the project.
     * @param el - The element to render the dashboard to.
     */
    constructor(elParent: HTMLElement) {
        // Create the element
        let el = document.createElement("div");
        el.innerHTML = HTML as any;
        this._el = el.firstChild as HTMLElement;

        // Append it to the parent element
        elParent.appendChild(this._el);

        // Render the dashboard
        this.render();
    }

    /**
     * Main render method
     * @param el - The element to render the dashboard to.
     */
    private render() {
        // Render the navigation
        new Navigation({
            el: this._el.querySelector("#navigation"),
            onSearch: value => {
                // Search the table
                table.search(value);
            }
        });

        // Render the filter
        new Filter({
            el: this._el.querySelector("#filter"),
            onFilter: value => {
                // Filter the table data
                table.filter(value);
            }
        });

        // Render the table
        let table = new Table(this._el.querySelector("#table"));
    }
}