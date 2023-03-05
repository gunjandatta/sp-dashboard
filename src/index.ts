import { ContextInfo } from "gd-sprest-bs";
import { InstallationRequired } from "dattatable";
import { App } from "./app";
import { Configuration } from "./cfg";
import { DataSource } from "./ds";
import Strings, { setContext } from "./strings";

// Styling
import "./styles.scss";

// Create the global variable for this solution
const GlobalVariable = {
    Configuration,
    render: (el, context?, sourceUrl?: string) => {
        // See if the page context exists
        if (context) {
            // Set the context
            setContext(context, sourceUrl);

            // Update the configuration
            Configuration.setWebUrl(sourceUrl || ContextInfo.webServerRelativeUrl);
        }

        // Initialize the application
        DataSource.init().then(
            // Success
            () => {
                // Create the application
                new App(el);
            },

            // Error
            () => {
                // See if an installation is required
                InstallationRequired.requiresInstall({ cfg: Configuration }).then(installFl => {
                    // See if an install is required
                    if (installFl) {
                        // Show the dialog
                        InstallationRequired.showDialog();
                    } else {
                        // Log
                        console.error("[" + Strings.ProjectName + "] Error initializing the solution.");
                    }
                });
            }
        );
    }
};

// Make is available in the DOM
window[Strings.GlobalVariable] = GlobalVariable;

// Get the element and render the app if it is found
let elApp = document.querySelector("#" + Strings.AppElementId) as HTMLElement;
if (elApp) {
    // Render the application
    GlobalVariable.render(elApp);
}