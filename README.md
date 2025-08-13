# Salesforce Agentforce Weather API Integration

This repository contains both the EcoRise Energy website and Salesforce metadata to integrate weather API functionality with Agentforce agents.

## Project Structure

- **Web Assets**: `index.html`, `script.js`, `styles.css` - EcoRise Energy website with Agentforce integration
- **Salesforce Metadata**: `force-app/` - Contains Apex classes, flows, and configurations for weather API functionality

## Weather API Integration

### Step 1: Apex Class ✅
Created `WeatherApiService.cls` that:
- Calls the Open-Meteo Weather API (https://api.open-meteo.com/v1/forecast)
- Accepts latitude, longitude, and optional hourly parameters
- Returns formatted weather responses suitable for agent interactions
- Includes proper error handling and parameter validation

### Step 2: Action Configuration ✅
Created flow `Get_Weather_Forecast.flow-meta.xml` that:
- Exposes the weather functionality as an invocable action
- Provides proper input/output parameter descriptions
- Can be used by Agentforce agents to get weather data

### Step 3: Agent Integration
To add this action to your Agentforce agent:

1. **Deploy the metadata** to your Salesforce org
2. **Configure Remote Site Settings** for API access
3. **Add the action** to your agent's available actions in Agent Builder

## Deployment Instructions

### Prerequisites
- Salesforce CLI (sfdx) installed
- Authenticated connection to your Salesforce org

### Deploy to Salesforce
```bash
# Deploy all metadata
sfdx force:source:deploy -p force-app/ -u your-org-alias

# Or deploy specific components
sfdx force:source:deploy -m ApexClass:WeatherApiService -u your-org-alias
sfdx force:source:deploy -m Flow:Get_Weather_Forecast -u your-org-alias
sfdx force:source:deploy -m RemoteSiteSetting:Open_Meteo_API -u your-org-alias
```

### Testing
Run the included test class:
```bash
sfdx force:apex:test:run -c WeatherApiServiceTest -u your-org-alias
```

## Usage Examples

The weather action accepts these parameters:
- **Latitude** (required): Location latitude (e.g., 51.5072 for London)
- **Longitude** (required): Location longitude (e.g., -0.1276 for London)
- **Hourly Parameters** (optional): Comma-separated parameters like "temperature_2m,humidity,precipitation"

### Sample API Call
```
https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&hourly=temperature_2m
```

### Agent Configuration
1. Go to **Setup > Agent Builder**
2. Select your Agentforce agent
3. Add **Get Weather Forecast** action
4. Configure parameter mappings as needed
5. Test the integration

## Security Considerations
- Remote Site Setting configured for https://api.open-meteo.com
- API calls include proper timeout handling (10 seconds)
- Input validation for required parameters
- Error handling for API failures

## Support
For questions about this integration, refer to the Salesforce Agentforce documentation or contact your Salesforce administrator.