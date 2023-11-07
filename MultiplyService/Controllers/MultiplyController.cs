using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;
using System.Text;
using Monitoring;
using MultiplyService.Models;
using OpenTelemetry.Context.Propagation;
using OpenTelemetry;
using OpenTelemetry.Trace;
using FeatureHubSDK;

namespace MultiplyService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MultiplyController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IFeatureHubConfig _featureHub;
        public MultiplyController(IHttpClientFactory clientFactory, IFeatureHubConfig featureHub)
        {
            _clientFactory = clientFactory;
            _featureHub = featureHub;
        }
        [HttpGet]
        public bool IsFeatureAvailable()
        {
            var multiplyFeatureEnabled = _featureHub.Repository.GetFeature("Multiply").IsEnabled;

            if (multiplyFeatureEnabled)
            {
                return true;
            }
            else
            {
                return false;
            }

        }
        [HttpPost]
        public IActionResult Multiply([FromBody] List<int> numbers)
        {
            var multiplyFeatureEnabled = _featureHub.Repository.GetFeature("Multiply").IsEnabled;

            if(!multiplyFeatureEnabled)
            {
                return NotFound("The multiplication feature is turned off");
            }

            int result;

            using (var activity = Monitoring.Monitoring.ActivitySource.StartActivity("POST request at the /Multiply/ endpoint"))
            {
                Monitoring.Monitoring.Log.Debug("Entered Multiply Method In /Multiply/ endpoint");

                // Start a span for the calculation
                using (var calculationSpan = Monitoring.Monitoring.ActivitySource.StartActivity("Making the multiplication calculation", ActivityKind.Internal, activity.Context))
                {
                    result = numbers.Aggregate(1, (acc, val) => acc * val);  // Start with 1 as the identity for multiplication
                    calculationSpan.SetTag("items.count", numbers.Count);
                    calculationSpan.SetTag("result", result);
                }
                var expression = string.Join(" * ", numbers);

                Monitoring.Monitoring.Log.Information($"Expression :{expression} had the following result: {result}");

                var calculationHistory = new CalculationHistory
                {
                    Id = Guid.NewGuid(),
                    Operation = "Multiplication",
                    Expression = expression,
                    Result = result
                };

                var jsonString = JsonSerializer.Serialize(calculationHistory);
                var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                // Start a span for the HTTP call to HistoryService
                using (var clientSpan = Monitoring.Monitoring.ActivitySource.StartActivity("Async HTTP call to HistoryService", ActivityKind.Client, activity.Context))
                {
                    try
                    {
                        _ = LogToHistoryServiceAsync(content);
                    }
                    catch (Exception ex)
                    {
                        Monitoring.Monitoring.Log.Error($"Couldn't insert it into history db, cause of error: {ex}");
                        activity.RecordException(ex);
                        clientSpan.SetTag("status", "Error during HTTP call to HistoryService from PlusService");
                    }
                }

                return Ok(result);
            }

        }

        private async Task LogToHistoryServiceAsync(HttpContent content)
        {
            try
            {
                var client = _clientFactory.CreateClient("HistoryClient");
                Monitoring.Monitoring.Log.Debug("Entered Log To History Service Async In /Multiply/");
                var currentActivity = Activity.Current;
                if (currentActivity != null)
                {
                    var propagationContext = new PropagationContext(currentActivity.Context, Baggage.Current);
                    var propagator = new TraceContextPropagator();
                    propagator.Inject(propagationContext, client.DefaultRequestHeaders, (headers, key, value) =>
                    {
                        headers.Add(key, value);
                    });
                }

                await client.PostAsync("", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Couldn't insert it into history db, cause of error: {ex}");
                Monitoring.Monitoring.Log.Error($"Couldn't insert it into history db, cause of error: {ex}");
            }
        }
    }

}