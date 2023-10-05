// // src/app/services/monitoring.service.ts

//This is not working properly. Turned off for now


// import { Injectable } from '@angular/core';
// import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
// import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';

// @Injectable({
//   providedIn: 'root',
// })
// export class MonitoringService {
//   initialize() {
//     const provider = new WebTracerProvider({
//       // You can add plugins here for instrumenting specific parts of web apps (e.g., @opentelemetry/plugin-xml-http-request for instrumenting HTTP requests)
//     });
    
//     provider.addSpanProcessor(
//       new SimpleSpanProcessor(
//         new ZipkinExporter({
//           serviceName: 'angular-frontend',
//           url: 'http://localhost:8081/api/v2/spans',
//         })
//       )
//     );
    
//     provider.register();
//   }
// }
