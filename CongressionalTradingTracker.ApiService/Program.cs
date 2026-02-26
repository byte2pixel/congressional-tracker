using CongressionalTradingTracker.Infrastructure;
using DotNetEnv;
using DotNetEnv.Configuration;
using FastEndpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddDotNetEnv(".env", LoadOptions.TraversePath());

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<TradeDbContext>("CongressTradingDb");
builder.Services.AddInfrastructure();
builder.Services.AddProblemDetails();

// Add Redis client
builder.AddRedisOutputCache("cache");

// Add FastEndpoints
builder.Services.AddFastEndpoints();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// add policy to allow cors from all origins (for frontend development)
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "Frontend",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();
app.UseCors("Frontend");
app.UseFastEndpoints();
app.UseOutputCache();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => "API service is running.");

app.MapGet(
        "/health",
        async (TradeDbContext db) =>
        {
            // Simple query to check database connectivity
            var canConnect = await db.Database.CanConnectAsync();
            return canConnect ? Results.Ok(new { status = "Healthy" }) : Results.StatusCode(503);
        }
    )
    .WithName("HealthCheck");

app.MapDefaultEndpoints();

await app.RunAsync();
