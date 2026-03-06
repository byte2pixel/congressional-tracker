# Congressional Trading Tracker

## Developer Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Git installed to clone the repository.
- .NET 10 SDK installed for building the application.
- Node.js 24.13.0 installed for frontend development.
- A code editor like Rider or Visual Studio Code.
- A Google Cloud account for Google OAuth setup.
- An API key for Quiver Quantative for fetching congressional trading data.

### Steps to Set Up the Development Environment

1. Clone the repository.
2. Navigate to the root directory and create a `.env` file based on the provided `.env.example` file.
3. Fill in the required environment variables in the `.env` file.
4. Navigate to the `frontend` directory and create a `.env` file based on the provided `.env.example` file in that directory.
5. Trust the APS.NET Core HTTPS development certificate by running the following command in your terminal:
    ```
    dotnet dev-certs https --trust
    ```
6. Start the aspire orchestration by running the AppHost project.
    ```
    dotnet run --project .\CongressionalTradingTracker.AppHost\
    ```
Example output:
```
Using launch settings from .\CongressionalTradingTracker.AppHost\Properties\launchSettings.json...
Building...
info: Aspire.Hosting.DistributedApplication[0]
      Aspire version: 13.1.2+895a2f0b09d747a052aaaf0273d55ad0e2dc95b0
info: Aspire.Hosting.DistributedApplication[0]
      Distributed application starting.
info: Aspire.Hosting.DistributedApplication[0]
      Application host directory is: C:\Users\meldo\source\repos\congressional-tracker\CongressionalTradingTracker.AppHost
info: Aspire.Hosting.DistributedApplication[0]
      Now listening on: https://localhost:17148
info: Aspire.Hosting.DistributedApplication[0]
      Login to the dashboard at https://localhost:17148/login?t=443dd5eff5190b3333d3fe5fe1d5bcdf
info: Aspire.Hosting.DistributedApplication[0]
      Distributed application started. Press Ctrl+C to shut down.
```
7. Open the dashboard URL provided in the console output (e.g., `https://localhost:17148/login?t=443dd5eff5190b3333d3fe5fe1d5bcdf`) in your web browser.

### Configuring Keycloak for Google OAuth
1. Log in to your Keycloak admin console. (Password is in the aspire dashboard). Click on keycloak and scroll down to the enviornment variables to find the password. `KC_BOOTSTRAP_ADMIN_PASSWORD` and copy the value. The username is `admin`.
2. Login to Keycloak with the admin credentials.
3. Create a new realm for your application for example `api`
4. Create a new client `api-service` using `*` as the valid redirect URI, valid post logout redirect URIs, and web origins. Just for development purposes.
5. Now in the `api-service` client create a role named `api-role`.
6. Go to the realm settings, user profile tab and create a new attribute named `picture` to store the profile picture URL from Google and save the changes. 
7. Then go to the `Identity Providers` section and add a new provider for Google. 
8. Fill in the required fields for the Google Identity Provider, including the Client ID and Client Secret obtained from the Google Cloud Console. 
9. set prompt to `select_account` to ensure you can select different accounts during development. 
10. set scopes to `openid email profile` to ensure you get the necessary information from Google for authentication. 
11. go to the `Mappers` tab and create a new mapper to map the profile picture from Google to a user attribute.
    - Name: `picture`
    - Social Profile JSON Field Path: `picture`
    - User Attribute Name: `picture`
12. Save the mapper and test the Google login flow by accessing the frontend.  Clicking the link in the aspire dashboard.
13. You should see the keycloak login.

Use ctrl + c in the terminal to stop the application when you're done.

## Additional Notes

When first running the application the background worker will fetch the bulk data from Quiver and populate the database.  After this it will only do live updates which are much faster.  If you want to test the bulk data fetching again you can clear the database and restart the application by removing the docker volume associated with that container.
