import { Injectable } from '@angular/core';
import { EdgeFeatureHubConfig, ClientContext } from 'featurehub-javascript-client-sdk';

@Injectable({
  providedIn: 'root'
})
export class FeaturehubService {
  private fhConfig: EdgeFeatureHubConfig;
  private fhContext!: ClientContext;

  constructor() {
    const edgeUrl = 'http://localhost:8081/featurehub';
    const apiKey = 'd545eaa0-adac-4d7a-a2f2-24916863b2b0/CKT6H8XCmWmyB0kFxdaKjD4ZsxvL4mhrDAnLrqpg';

    this.fhConfig = new EdgeFeatureHubConfig(edgeUrl, apiKey);
    
    this.fhConfig.newContext().build().then(context => {
      this.fhContext = context;
    });
  }

  getFeatureFlag(key: string): Promise<boolean> {
    return this.fhConfig.newContext().build().then(context => {
      const featureState = context.feature(key);
      return featureState.getBoolean() ?? false; // If undefined or not found, defaults to `false`
    });
  }
}
