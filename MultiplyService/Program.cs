using FeatureHubSDK;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient("HistoryClient", client =>
{
    client.BaseAddress = new Uri("http://nginx-proxy:8084/History");
});

// FeatureHub configuration
var featureHubHost = builder.Configuration["FeatureHub:Host"]; 
var featureHubApiKey = builder.Configuration["FeatureHub:ApiKey"];

var featureHubConfig = new EdgeFeatureHubConfig(featureHubHost, featureHubApiKey);
builder.Services.AddSingleton<IFeatureHubConfig>(featureHubConfig);

// Initiate the FeatureHub configuration
featureHubConfig.Init();

_ = Monitoring.Monitoring.ActivitySource;

var app = builder.Build();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());


app.UseSwagger();
app.UseSwaggerUI();


app.UseAuthorization();

app.MapControllers();

app.Run();
