/**
 * WeatherApiService - Apex class to call Open-Meteo Weather API
 * This class provides weather forecast data for Agentforce agents
 */
public with sharing class WeatherApiService {
    
    /**
     * Get weather forecast for a specific location
     * @param latitude Location latitude (required)
     * @param longitude Location longitude (required)
     * @param hourly Comma-separated list of hourly parameters (optional, defaults to temperature_2m)
     * @return Formatted weather response
     */
    @InvocableMethod(label='Get Weather Forecast' description='Retrieves weather forecast data from Open-Meteo API')
    public static List<WeatherResponse> getWeatherForecast(List<WeatherRequest> requests) {
        List<WeatherResponse> responses = new List<WeatherResponse>();
        
        for (WeatherRequest request : requests) {
            try {
                WeatherResponse response = callWeatherAPI(request);
                responses.add(response);
            } catch (Exception e) {
                WeatherResponse errorResponse = new WeatherResponse();
                errorResponse.success = false;
                errorResponse.errorMessage = 'Error retrieving weather data: ' + e.getMessage();
                responses.add(errorResponse);
            }
        }
        
        return responses;
    }
    
    /**
     * Make the actual API call to Open-Meteo
     */
    private static WeatherResponse callWeatherAPI(WeatherRequest request) {
        WeatherResponse response = new WeatherResponse();
        
        // Validate required parameters
        if (request.latitude == null || request.longitude == null) {
            response.success = false;
            response.errorMessage = 'Latitude and longitude are required parameters';
            return response;
        }
        
        // Build API URL
        String apiUrl = 'https://api.open-meteo.com/v1/forecast';
        apiUrl += '?latitude=' + request.latitude;
        apiUrl += '&longitude=' + request.longitude;
        
        // Default to temperature if no hourly parameters specified
        String hourlyParams = String.isNotBlank(request.hourly) ? request.hourly : 'temperature_2m';
        apiUrl += '&hourly=' + EncodingUtil.urlEncode(hourlyParams, 'UTF-8');
        
        // Make HTTP callout
        Http http = new Http();
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setEndpoint(apiUrl);
        httpRequest.setMethod('GET');
        httpRequest.setTimeout(10000); // 10 second timeout
        
        HttpResponse httpResponse = http.send(httpRequest);
        
        if (httpResponse.getStatusCode() == 200) {
            response.success = true;
            response.rawData = httpResponse.getBody();
            response.formattedResponse = formatWeatherResponse(httpResponse.getBody(), request);
        } else {
            response.success = false;
            response.errorMessage = 'API call failed with status: ' + httpResponse.getStatusCode() + ' - ' + httpResponse.getStatus();
        }
        
        return response;
    }
    
    /**
     * Format the weather API response into a user-friendly format
     */
    private static String formatWeatherResponse(String rawResponse, WeatherRequest request) {
        try {
            Map<String, Object> weatherData = (Map<String, Object>) JSON.deserializeUntyped(rawResponse);
            
            StringBuilder formatted = new StringBuilder();
            formatted.append('🌤️ Weather Forecast for Location (');
            formatted.append(request.latitude + ', ' + request.longitude + '):\n\n');
            
            // Get timezone and elevation if available
            if (weatherData.containsKey('timezone')) {
                formatted.append('📍 Timezone: ' + weatherData.get('timezone') + '\n');
            }
            if (weatherData.containsKey('elevation')) {
                formatted.append('🏔️ Elevation: ' + weatherData.get('elevation') + 'm\n\n');
            }
            
            // Process hourly data
            Map<String, Object> hourlyData = (Map<String, Object>) weatherData.get('hourly');
            if (hourlyData != null && hourlyData.containsKey('time')) {
                List<Object> times = (List<Object>) hourlyData.get('time');
                
                formatted.append('📊 Hourly Forecast (next 24 hours):\n');
                
                // Show first 24 hours of data
                Integer maxHours = Math.min(24, times.size());
                
                for (Integer i = 0; i < maxHours; i++) {
                    String timeStr = (String) times[i];
                    DateTime forecastTime = DateTime.valueOf(timeStr.replace('T', ' '));
                    
                    formatted.append(forecastTime.format('MMM dd HH:mm') + ' - ');
                    
                    // Add temperature data if available
                    if (hourlyData.containsKey('temperature_2m')) {
                        List<Object> temperatures = (List<Object>) hourlyData.get('temperature_2m');
                        if (i < temperatures.size() && temperatures[i] != null) {
                            formatted.append('🌡️ ' + temperatures[i] + '°C ');
                        }
                    }
                    
                    formatted.append('\n');
                }
            }
            
            return formatted.toString();
            
        } catch (Exception e) {
            return 'Raw weather data:\n' + rawResponse;
        }
    }
    
    /**
     * Input class for the invocable method
     */
    public class WeatherRequest {
        @InvocableVariable(label='Latitude' description='Latitude coordinate' required=true)
        public Decimal latitude;
        
        @InvocableVariable(label='Longitude' description='Longitude coordinate' required=true)
        public Decimal longitude;
        
        @InvocableVariable(label='Hourly Parameters' description='Comma-separated hourly parameters (e.g., temperature_2m,humidity,precipitation)')
        public String hourly;
    }
    
    /**
     * Output class for the invocable method
     */
    public class WeatherResponse {
        @InvocableVariable(label='Success' description='Whether the API call was successful')
        public Boolean success;
        
        @InvocableVariable(label='Formatted Response' description='User-friendly formatted weather data')
        public String formattedResponse;
        
        @InvocableVariable(label='Raw Data' description='Raw JSON response from the API')
        public String rawData;
        
        @InvocableVariable(label='Error Message' description='Error message if the call failed')
        public String errorMessage;
    }
}