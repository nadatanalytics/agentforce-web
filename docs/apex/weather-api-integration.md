# Apex Integration for Weather API

This guide provides complete Apex code examples for integrating with the Open-Meteo weather API to enhance your Agentforce Service Agent with weather data capabilities.

## 📋 Overview

The weather API integration allows your agent to:
- Correlate weather conditions with energy usage patterns
- Provide explanations for unusual energy consumption
- Offer weather-based energy saving recommendations

## 🎯 Step 1: Create Weather Data Model

### 1.1 Custom Objects Setup

First, create custom objects to store weather data:

**Weather_Data__c Custom Object:**
- **API Name**: `Weather_Data__c`
- **Label**: `Weather Data`
- **Record Name**: `Weather-{00000}`

**Custom Fields:**
```yaml
Location__c:
  Type: Text(100)
  Label: Location
  Required: Yes

Date__c:
  Type: Date
  Label: Date
  Required: Yes

Temperature_Max__c:
  Type: Number(5,2)
  Label: Maximum Temperature (°C)

Temperature_Min__c:
  Type: Number(5,2)
  Label: Minimum Temperature (°C)

Temperature_Average__c:
  Type: Number(5,2)
  Label: Average Temperature (°C)

Latitude__c:
  Type: Number(10,6)
  Label: Latitude

Longitude__c:
  Type: Number(10,6)
  Label: Longitude

External_ID__c:
  Type: Text(255)
  Label: External ID
  Unique: Yes
  External ID: Yes
```

## 🎯 Step 2: Weather API Service Class

### 2.1 WeatherService Apex Class

Create a new Apex class for weather API integration:

```apex
/**
 * WeatherService - Handles integration with Open-Meteo Weather API
 * Used by Agentforce to correlate weather data with energy usage
 */
public with sharing class WeatherService {
    
    // API endpoint base URL
    private static final String API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
    
    // Default parameters for energy analysis
    private static final String DEFAULT_PARAMS = '&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean';
    
    /**
     * Wrapper class for weather API response
     */
    public class WeatherResponse {
        public DailyData daily { get; set; }
        public Double latitude { get; set; }
        public Double longitude { get; set; }
        public String timezone { get; set; }
    }
    
    public class DailyData {
        public List<String> time { get; set; }
        public List<Double> temperature_2m_max { get; set; }
        public List<Double> temperature_2m_min { get; set; }
        public List<Double> temperature_2m_mean { get; set; }
    }
    
    /**
     * Get weather data for a specific location and date range
     * @param latitude Location latitude
     * @param longitude Location longitude  
     * @param startDate Start date for weather data
     * @param endDate End date for weather data
     * @return Formatted weather response for agent
     */
    @InvocableMethod(label='Get Weather Data' description='Retrieves weather data for energy analysis')
    public static List<WeatherResult> getWeatherData(List<WeatherRequest> requests) {
        List<WeatherResult> results = new List<WeatherResult>();
        
        for (WeatherRequest request : requests) {
            try {
                WeatherResult result = processWeatherRequest(request);
                results.add(result);
            } catch (Exception e) {
                WeatherResult errorResult = new WeatherResult();
                errorResult.success = false;
                errorResult.errorMessage = 'Error retrieving weather data: ' + e.getMessage();
                results.add(errorResult);
            }
        }
        
        return results;
    }
    
    /**
     * Process individual weather request
     */
    private static WeatherResult processWeatherRequest(WeatherRequest request) {
        // Build API URL
        String apiUrl = buildApiUrl(request.latitude, request.longitude, 
                                  request.startDate, request.endDate);
        
        // Make HTTP callout
        HttpResponse response = makeHttpCallout(apiUrl);
        
        if (response.getStatusCode() == 200) {
            // Parse response
            WeatherResponse weatherData = (WeatherResponse) JSON.deserialize(
                response.getBody(), WeatherResponse.class);
            
            // Save to Salesforce (optional)
            if (request.saveToSalesforce) {
                saveWeatherData(weatherData, request);
            }
            
            // Format for agent response
            return formatWeatherResult(weatherData, request);
        } else {
            throw new CalloutException('Weather API returned status: ' + 
                                     response.getStatusCode() + ' - ' + response.getBody());
        }
    }
    
    /**
     * Build API URL with parameters
     */
    private static String buildApiUrl(Double latitude, Double longitude, 
                                    Date startDate, Date endDate) {
        String url = API_BASE_URL + 
                    '?latitude=' + latitude + 
                    '&longitude=' + longitude +
                    '&start_date=' + startDate.format() +
                    '&end_date=' + endDate.format() +
                    DEFAULT_PARAMS;
        
        return url;
    }
    
    /**
     * Make HTTP callout to weather API
     */
    private static HttpResponse makeHttpCallout(String url) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setTimeout(10000); // 10 second timeout
        
        return http.send(request);
    }
    
    /**
     * Save weather data to Salesforce objects
     */
    private static void saveWeatherData(WeatherResponse weatherData, WeatherRequest request) {
        List<Weather_Data__c> weatherRecords = new List<Weather_Data__c>();
        
        for (Integer i = 0; i < weatherData.daily.time.size(); i++) {
            Weather_Data__c weatherRecord = new Weather_Data__c();
            weatherRecord.Location__c = request.locationName;
            weatherRecord.Date__c = Date.valueOf(weatherData.daily.time[i]);
            weatherRecord.Temperature_Max__c = weatherData.daily.temperature_2m_max[i];
            weatherRecord.Temperature_Min__c = weatherData.daily.temperature_2m_min[i];
            weatherRecord.Temperature_Average__c = weatherData.daily.temperature_2m_mean[i];
            weatherRecord.Latitude__c = weatherData.latitude;
            weatherRecord.Longitude__c = weatherData.longitude;
            weatherRecord.External_ID__c = request.locationName + '_' + weatherData.daily.time[i];
            
            weatherRecords.add(weatherRecord);
        }
        
        // Upsert based on External ID to avoid duplicates
        Database.upsert(weatherRecords, Weather_Data__c.External_ID__c, false);
    }
    
    /**
     * Format weather result for agent display
     */
    private static WeatherResult formatWeatherResult(WeatherResponse weatherData, 
                                                   WeatherRequest request) {
        WeatherResult result = new WeatherResult();
        result.success = true;
        result.location = request.locationName;
        result.latitude = weatherData.latitude;
        result.longitude = weatherData.longitude;
        
        // Calculate summary statistics
        Double avgTemp = 0;
        Double maxTemp = null;
        Double minTemp = null;
        Integer coldDays = 0;
        Integer hotDays = 0;
        
        for (Integer i = 0; i < weatherData.daily.temperature_2m_mean.size(); i++) {
            Double temp = weatherData.daily.temperature_2m_mean[i];
            avgTemp += temp;
            
            if (maxTemp == null || temp > maxTemp) maxTemp = temp;
            if (minTemp == null || temp < minTemp) minTemp = temp;
            
            if (temp < 5) coldDays++; // Below 5°C considered cold for heating
            if (temp > 25) hotDays++; // Above 25°C considered hot for cooling
        }
        
        avgTemp = avgTemp / weatherData.daily.temperature_2m_mean.size();
        
        // Build formatted response
        result.formattedResponse = buildFormattedResponse(avgTemp, maxTemp, minTemp, 
                                                        coldDays, hotDays, request);
        
        result.averageTemperature = avgTemp;
        result.maximumTemperature = maxTemp;
        result.minimumTemperature = minTemp;
        result.coldDays = coldDays;
        result.hotDays = hotDays;
        
        return result;
    }
    
    /**
     * Build user-friendly formatted response for the agent
     */
    private static String buildFormattedResponse(Double avgTemp, Double maxTemp, Double minTemp,
                                               Integer coldDays, Integer hotDays, 
                                               WeatherRequest request) {
        String response = '🌤️ **Weather Analysis for ' + request.locationName + '**\n\n';
        
        response += '📊 **Temperature Summary:**\n';
        response += '• Average: ' + avgTemp.format() + '°C\n';
        response += '• Maximum: ' + maxTemp.format() + '°C\n';
        response += '• Minimum: ' + minTemp.format() + '°C\n\n';
        
        response += '🏠 **Energy Impact:**\n';
        
        if (coldDays > 0) {
            response += '• **' + coldDays + ' cold days** (below 5°C) likely increased heating usage\n';
        }
        
        if (hotDays > 0) {
            response += '• **' + hotDays + ' hot days** (above 25°C) likely increased cooling usage\n';
        }
        
        if (coldDays == 0 && hotDays == 0) {
            response += '• **Mild weather period** - minimal heating/cooling impact\n';
        }
        
        // Add energy saving recommendations
        response += '\n💡 **Recommendations:**\n';
        if (avgTemp < 10) {
            response += '• Consider upgrading insulation to reduce heating costs\n';
            response += '• Use programmable thermostats to optimize heating schedules\n';
        } else if (avgTemp > 20) {
            response += '• Use fans alongside air conditioning to reduce cooling costs\n';
            response += '• Consider solar shading to reduce heat gain\n';
        } else {
            response += '• Great weather for natural ventilation - reduce HVAC usage\n';
            response += '• Perfect time for energy-efficient appliance maintenance\n';
        }
        
        return response;
    }
    
    /**
     * Input wrapper for invocable method
     */
    public class WeatherRequest {
        @InvocableVariable(required=true)
        public Double latitude;
        
        @InvocableVariable(required=true)
        public Double longitude;
        
        @InvocableVariable(required=true)
        public Date startDate;
        
        @InvocableVariable(required=true)
        public Date endDate;
        
        @InvocableVariable(required=false)
        public String locationName = 'Customer Location';
        
        @InvocableVariable(required=false)
        public Boolean saveToSalesforce = true;
    }
    
    /**
     * Output wrapper for invocable method
     */
    public class WeatherResult {
        @InvocableVariable
        public Boolean success;
        
        @InvocableVariable
        public String errorMessage;
        
        @InvocableVariable
        public String formattedResponse;
        
        @InvocableVariable
        public String location;
        
        @InvocableVariable
        public Double latitude;
        
        @InvocableVariable
        public Double longitude;
        
        @InvocableVariable
        public Double averageTemperature;
        
        @InvocableVariable
        public Double maximumTemperature;
        
        @InvocableVariable
        public Double minimumTemperature;
        
        @InvocableVariable
        public Integer coldDays;
        
        @InvocableVariable
        public Integer hotDays;
    }
}
```

## 🎯 Step 3: Test Class

### 3.1 WeatherService Test Class

Create a test class to validate the weather service:

```apex
/**
 * Test class for WeatherService
 */
@isTest
public class WeatherServiceTest {
    
    @isTest
    static void testGetWeatherDataSuccess() {
        // Create test request
        WeatherService.WeatherRequest request = new WeatherService.WeatherRequest();
        request.latitude = 51.5072;
        request.longitude = -0.1276;
        request.startDate = Date.today().addDays(-7);
        request.endDate = Date.today();
        request.locationName = 'London';
        request.saveToSalesforce = false; // Don't save in test
        
        // Mock HTTP response
        Test.setMock(HttpCalloutMock.class, new WeatherApiMockSuccess());
        
        Test.startTest();
        List<WeatherService.WeatherResult> results = WeatherService.getWeatherData(
            new List<WeatherService.WeatherRequest>{request});
        Test.stopTest();
        
        // Assertions
        System.assertEquals(1, results.size(), 'Should return one result');
        WeatherService.WeatherResult result = results[0];
        System.assertEquals(true, result.success, 'Result should be successful');
        System.assertNotEquals(null, result.formattedResponse, 'Should have formatted response');
        System.assertEquals('London', result.location, 'Location should match');
    }
    
    @isTest
    static void testGetWeatherDataError() {
        // Create test request
        WeatherService.WeatherRequest request = new WeatherService.WeatherRequest();
        request.latitude = 51.5072;
        request.longitude = -0.1276;
        request.startDate = Date.today().addDays(-7);
        request.endDate = Date.today();
        request.locationName = 'London';
        
        // Mock HTTP error response
        Test.setMock(HttpCalloutMock.class, new WeatherApiMockError());
        
        Test.startTest();
        List<WeatherService.WeatherResult> results = WeatherService.getWeatherData(
            new List<WeatherService.WeatherRequest>{request});
        Test.stopTest();
        
        // Assertions
        System.assertEquals(1, results.size(), 'Should return one result');
        WeatherService.WeatherResult result = results[0];
        System.assertEquals(false, result.success, 'Result should indicate failure');
        System.assertNotEquals(null, result.errorMessage, 'Should have error message');
    }
    
    /**
     * Mock class for successful API response
     */
    public class WeatherApiMockSuccess implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"latitude":51.5,"longitude":-0.125,"daily":{"time":["2024-01-01","2024-01-02"],"temperature_2m_max":[8.5,10.2],"temperature_2m_min":[2.1,4.3],"temperature_2m_mean":[5.3,7.2]}}');
            res.setStatusCode(200);
            return res;
        }
    }
    
    /**
     * Mock class for API error response
     */
    public class WeatherApiMockError implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"error":"Invalid coordinates"}');
            res.setStatusCode(400);
            return res;
        }
    }
}
```

## 🎯 Step 4: Remote Site Settings

### 4.1 Configure Remote Site Setting

1. Go to **Setup** → **Remote Site Settings**
2. Click **New Remote Site**
3. Configure:
   - **Remote Site Name**: `OpenMeteoAPI`
   - **Remote Site URL**: `https://api.open-meteo.com`
   - **Active**: ✅ Checked

## 🎯 Step 5: Create Agentforce Action

### 5.1 Create Weather Analysis Action

1. Go to **Setup** → **Agentforce** → **Actions**
2. Click **New Action**
3. Configure:
   - **Name**: `Get Weather Analysis`
   - **Type**: `Apex Action`
   - **Apex Class**: `WeatherService`
   - **Apex Method**: `getWeatherData`

### 5.2 Configure Action Parameters

Map the action parameters for easy agent use:

```yaml
Action Configuration:
Input Parameters:
  - latitude (Number): Customer location latitude
  - longitude (Number): Customer location longitude  
  - startDate (Date): Start of analysis period
  - endDate (Date): End of analysis period
  - locationName (Text): Friendly location name
  - saveToSalesforce (Boolean): Whether to save data

Output Parameters:
  - success (Boolean): Whether the call was successful
  - formattedResponse (Text): User-friendly response for chat
  - averageTemperature (Number): Average temperature for period
  - coldDays (Number): Number of cold days
  - hotDays (Number): Number of hot days
```

## 🎯 Step 6: Enhanced Agent Instructions

Update your agent to use the weather action:

```text
Enhanced Agent Instructions for Weather Integration:

When customers mention high bills or unusual energy usage:

1. **Gather Information:**
   - Ask for their account number and billing period
   - Identify their service address/location

2. **Weather Analysis:**
   - Use "Get Weather Analysis" action with their location coordinates
   - Include the billing period dates for analysis
   - Present the weather correlation data clearly

3. **Response Format:**
   Use the formatted response from the weather service, and add:
   - Clear explanation of weather impact
   - Specific recommendations for their situation
   - Offer to analyze other time periods if needed

4. **Follow-up Questions:**
   Be prepared to answer:
   - "How does temperature affect my bill?"
   - "What can I do to reduce weather-related costs?"
   - "Compare this month to last year same period"

5. **Escalation:**
   Offer human agent assistance for:
   - Complex billing disputes
   - Equipment recommendations
   - Energy efficiency assessments
```

## 🎯 Step 7: Usage Examples

### 7.1 Agent Conversation Flow

**Customer**: "Why is my energy bill so high this month?"

**Agent Response Process**:
1. Ask for account number and billing period
2. Look up customer address/coordinates
3. Call weather action with customer location and billing dates
4. Combine weather data with usage analysis
5. Provide comprehensive explanation

**Sample Agent Response**:
```
I'd be happy to help analyze your energy bill! Let me check the weather conditions for your area during your billing period.

🌤️ **Weather Analysis for Your Location**

📊 **Temperature Summary:**
• Average: 2.3°C
• Maximum: 8.5°C  
• Minimum: -3.1°C

🏠 **Energy Impact:**
• **18 cold days** (below 5°C) likely increased heating usage significantly
• This was 12°C colder than the same period last year

💡 **Why Your Bill Increased:**
The unusually cold weather this month meant your heating system worked much harder than normal. Cold spells like this can increase energy usage by 40-60% compared to mild weather.

**Next Steps:**
• I can show you energy-saving tips for cold weather
• Would you like me to compare this to your usage last winter?
• I can connect you with our energy efficiency specialist for a free consultation

Is there anything specific about your usage you'd like me to explain further?
```

## 🔧 Deployment Instructions

### 7.1 Deploy to Production

1. **Deploy Apex Classes:**
   ```bash
   sfdx force:source:deploy -p force-app/main/default/classes/WeatherService.cls
   sfdx force:source:deploy -p force-app/main/default/classes/WeatherServiceTest.cls
   ```

2. **Create Custom Objects:**
   - Deploy Weather_Data__c custom object
   - Deploy all custom fields

3. **Configure Remote Site Settings:**
   - Add OpenMeteoAPI remote site setting

4. **Create Agentforce Action:**
   - Configure "Get Weather Analysis" action
   - Test action functionality

5. **Update Agent Instructions:**
   - Add weather analysis capabilities
   - Test agent responses

### 7.2 Validation Steps

1. **Test API Integration:**
   - Run WeatherServiceTest class
   - Verify 100% code coverage
   - Test with real coordinates

2. **Test Agent Integration:**
   - Ask agent weather-related questions
   - Verify action triggers correctly
   - Check response formatting

3. **Validate User Experience:**
   - Test with various customer scenarios
   - Ensure responses are user-friendly
   - Verify recommendations are relevant

## 💡 Best Practices

1. **Error Handling**: Always include proper error handling for API failures
2. **Data Storage**: Consider data retention policies for weather data
3. **Performance**: Cache frequently requested weather data
4. **User Experience**: Format responses for easy reading in chat
5. **Privacy**: Don't store customer location data unnecessarily

This weather integration provides your Agentforce Service Agent with powerful capabilities to explain energy usage variations and provide valuable insights to customers.