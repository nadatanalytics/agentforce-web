/**
 * Test class for WeatherApiService
 */
@IsTest
private class WeatherApiServiceTest {
    
    /**
     * Test successful weather API call
     */
    @IsTest
    static void testGetWeatherForecastSuccess() {
        // Create test request
        WeatherApiService.WeatherRequest request = new WeatherApiService.WeatherRequest();
        request.latitude = 51.5072;
        request.longitude = -0.1276;
        request.hourly = 'temperature_2m';
        
        List<WeatherApiService.WeatherRequest> requests = new List<WeatherApiService.WeatherRequest>{request};
        
        // Mock successful HTTP response
        Test.setMock(HttpCalloutMock.class, new WeatherApiMockSuccess());
        
        Test.startTest();
        List<WeatherApiService.WeatherResponse> responses = WeatherApiService.getWeatherForecast(requests);
        Test.stopTest();
        
        // Verify response
        System.assertEquals(1, responses.size(), 'Should return one response');
        WeatherApiService.WeatherResponse response = responses[0];
        System.assertEquals(true, response.success, 'Response should be successful');
        System.assertNotEquals(null, response.formattedResponse, 'Should have formatted response');
        System.assert(response.formattedResponse.contains('Weather Forecast'), 'Should contain weather forecast text');
    }
    
    /**
     * Test API call with missing required parameters
     */
    @IsTest
    static void testGetWeatherForecastMissingParams() {
        // Create test request without required parameters
        WeatherApiService.WeatherRequest request = new WeatherApiService.WeatherRequest();
        // latitude and longitude are null
        
        List<WeatherApiService.WeatherRequest> requests = new List<WeatherApiService.WeatherRequest>{request};
        
        Test.startTest();
        List<WeatherApiService.WeatherResponse> responses = WeatherApiService.getWeatherForecast(requests);
        Test.stopTest();
        
        // Verify error response
        System.assertEquals(1, responses.size(), 'Should return one response');
        WeatherApiService.WeatherResponse response = responses[0];
        System.assertEquals(false, response.success, 'Response should indicate failure');
        System.assert(response.errorMessage.contains('required'), 'Should indicate required parameters missing');
    }
    
    /**
     * Test API call failure
     */
    @IsTest
    static void testGetWeatherForecastApiFailure() {
        // Create test request
        WeatherApiService.WeatherRequest request = new WeatherApiService.WeatherRequest();
        request.latitude = 51.5072;
        request.longitude = -0.1276;
        
        List<WeatherApiService.WeatherRequest> requests = new List<WeatherApiService.WeatherRequest>{request};
        
        // Mock failed HTTP response
        Test.setMock(HttpCalloutMock.class, new WeatherApiMockFailure());
        
        Test.startTest();
        List<WeatherApiService.WeatherResponse> responses = WeatherApiService.getWeatherForecast(requests);
        Test.stopTest();
        
        // Verify error response
        System.assertEquals(1, responses.size(), 'Should return one response');
        WeatherApiService.WeatherResponse response = responses[0];
        System.assertEquals(false, response.success, 'Response should indicate failure');
        System.assert(response.errorMessage.contains('API call failed'), 'Should indicate API failure');
    }
    
    /**
     * Test multiple requests
     */
    @IsTest
    static void testMultipleRequests() {
        // Create multiple test requests
        List<WeatherApiService.WeatherRequest> requests = new List<WeatherApiService.WeatherRequest>();
        
        WeatherApiService.WeatherRequest request1 = new WeatherApiService.WeatherRequest();
        request1.latitude = 51.5072;
        request1.longitude = -0.1276;
        requests.add(request1);
        
        WeatherApiService.WeatherRequest request2 = new WeatherApiService.WeatherRequest();
        request2.latitude = 40.7128;
        request2.longitude = -74.0060;
        requests.add(request2);
        
        // Mock successful HTTP response
        Test.setMock(HttpCalloutMock.class, new WeatherApiMockSuccess());
        
        Test.startTest();
        List<WeatherApiService.WeatherResponse> responses = WeatherApiService.getWeatherForecast(requests);
        Test.stopTest();
        
        // Verify responses
        System.assertEquals(2, responses.size(), 'Should return two responses');
        for (WeatherApiService.WeatherResponse response : responses) {
            System.assertEquals(true, response.success, 'All responses should be successful');
        }
    }
    
    /**
     * Mock class for successful HTTP callout
     */
    private class WeatherApiMockSuccess implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setStatusCode(200);
            response.setStatus('OK');
            
            // Mock weather API response
            String mockResponse = '{' +
                '"latitude": 51.5,' +
                '"longitude": -0.12,' +
                '"timezone": "GMT",' +
                '"elevation": 25.0,' +
                '"hourly": {' +
                    '"time": ["2024-01-01T00:00", "2024-01-01T01:00", "2024-01-01T02:00"],' +
                    '"temperature_2m": [15.2, 14.8, 14.5]' +
                '}' +
            '}';
            
            response.setBody(mockResponse);
            return response;
        }
    }
    
    /**
     * Mock class for failed HTTP callout
     */
    private class WeatherApiMockFailure implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setStatusCode(500);
            response.setStatus('Internal Server Error');
            response.setBody('{"error": "API temporarily unavailable"}');
            return response;
        }
    }
}