using CongressionalTradingTracker.ApiService.Data;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<TradeDbContext>("CongressTradingDb");

// Add services to the container.
builder.Services.AddProblemDetails();

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
