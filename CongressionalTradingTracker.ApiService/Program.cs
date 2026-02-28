using CongressionalTradingTracker.ApiService;
using CongressionalTradingTracker.Infrastructure;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<TradeDbContext>("CongressTradingDb");
builder.Services.AddInfrastructure(builder.Configuration);
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

builder.Services.AddAuthorization();

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddKeycloakJwtBearer(
        serviceName: "keycloak",
        realm: "api",
        options =>
        {
            options.Audience = "api-service";
            options.Authority = "http://localhost:8080/realms/api";
            // For development only - disable HTTPS metadata validation
            if (builder.Environment.IsDevelopment())
            {
                options.RequireHttpsMetadata = false;
            }
        }
    );

// Transform Keycloak realm_access.roles into ASP.NET Core role claims for FastEndpoints authorization
builder.Services.AddTransient<IClaimsTransformation, ClaimsTransformation>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthentication();
app.UseAuthorization();
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
    .AllowAnonymous()
    .WithName("HealthCheck");

app.MapDefaultEndpoints();

await app.RunAsync();
