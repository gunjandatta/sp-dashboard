import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DashboardWebPart.module.scss';
import * as strings from 'DashboardWebPartStrings';

import "../../../../dist/sp-dashboard.min.js";
declare var SPDashboard;

export interface IDashboardWebPartProps {
  description: string;
}

export default class DashboardWebPart extends BaseClientSideWebPart<IDashboardWebPartProps> {

  public render(): void {
    // Render the dashboard
    SPDashboard.render(this.domElement, this.context);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
