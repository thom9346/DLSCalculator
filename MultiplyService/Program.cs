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

// Add FeatureHub configuration as a singleton service
builder.Services.AddSingleton<EdgeFeatureHubConfig>(sp => {
    var config = new EdgeFeatureHubConfig("http://featurehub:8085", "8eae9be0-5fc0-4d0b-b893-e346523aa43a/bl658Nsx9QswF6DJLKWoUIEAA0ZuO2M5KR8VG5wW");
    config.Init(); //might need to await this if it is async or move it to an async context
    return config;
});

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
