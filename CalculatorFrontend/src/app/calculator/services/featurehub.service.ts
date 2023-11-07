import { Injectable } from '@angular/core';
import { EdgeFeatureHubConfig, ClientContext } from 'featurehub-javascript-client-sdk';

@Injectable({
  providedIn: 'root'
})
export class FeaturehubService {
  private fhConfig: EdgeFeatureHubConfig;
  private fhContext!: ClientContext;

  constructor() {
    // Your FeatureHub edge server URL and environment API key
    const edgeUrl = 'http://localhost:8081/featurehub';
    const apiKey = 'd545eaa0-adac-4d7a-a2f2-24916863b2b0/CKT6H8XCmWmyB0kFxdaKjD4ZsxvL4mhrDAnLrqpg';

    // Initialize the FeatureHub configuration with the server and API key
    this.fhConfig = new EdgeFeatureHubConfig(edgeUrl, apiKey);
    
    // Build the client context, this should ideally be a synchronous operation but it's not currently supported
    this.fhConfig.newContext().build().then(context => {
      this.fhContext = context;
    });
  }

  // Function to get the boolean value of a feature flag
  getFeatureFlag(key: string): Promise<boolean> {
    // We need to ensure the context is built before we try to access a feature flag
    return this.fhConfig.newContext().build().then(context => {
      const featureState = context.feature(key);
      return featureState.getBoolean() ?? false; // If undefined or not found, defaults to `false`
    });
  }
}
