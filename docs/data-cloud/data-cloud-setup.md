# Data Cloud Setup and Einstein Search Configuration

This guide provides detailed instructions for setting up Data Cloud, configuring Einstein Search, and creating Flex Templates for your Agentforce Service Agent.

## 📋 Prerequisites

- Salesforce org with Data Cloud license
- System Administrator permissions
- Agentforce Service Agent already configured
- Basic understanding of data modeling concepts

## 🎯 Step 1: Enable Data Cloud

### 1.1 Activate Data Cloud
1. Go to **Setup** → **Data Cloud Setup**
2. Click **Get Started** on the Data Cloud Setup page
3. Accept the Data Cloud Terms of Service
4. Click **Enable Data Cloud**

> ⚠️ **Important**: This process may take 15-30 minutes to complete. You'll receive an email notification when ready.

### 1.2 Verify Data Cloud Activation
1. Navigate to **App Launcher** → **Data Cloud**
2. Verify you can access the Data Cloud interface
3. Check that **Einstein Trust Layer** is enabled in Setup

### 1.3 Configure Data Cloud Permissions
1. Go to **Setup** → **Permission Sets**
2. Create a new Permission Set: `Data Cloud Agent User`
3. Add the following permissions:
   - **Data Cloud Admin**: For setup tasks
   - **Einstein Search**: For search functionality
   - **View Setup and Configuration**: For troubleshooting

## 🎯 Step 2: Set Up Data Streams

### 2.1 Configure Salesforce Connector
1. In **Data Cloud**, go to **Data Streams**
2. Click **New** → **Salesforce Connector**
3. Configure the connector:
   - **Name**: `EcoRise Customer Data`
   - **Objects to sync**:
     - Account (Customer information)
     - Contact (Customer contacts)
     - Case (Service history)
     - Custom Objects (if any energy-specific objects exist)

### 2.2 Configure Data Mapping
```yaml
Data Mapping Configuration:
Account Object:
  - Name → Customer_Name
  - BillingAddress → Service_Address
  - Phone → Primary_Phone
  - Industry → Customer_Type
  - Custom Fields:
    - Energy_Tariff__c → Current_Tariff
    - Account_Number__c → Energy_Account_Number
    - Monthly_Usage__c → Latest_Usage_kWh

Contact Object:
  - Name → Contact_Name
  - Email → Email_Address
  - Phone → Contact_Phone
  - Account → Related_Account

Case Object:
  - Subject → Case_Subject
  - Description → Case_Description
  - Status → Case_Status
  - CreatedDate → Case_Created
  - Type → Issue_Category
```

### 2.3 Create Custom Data Stream for Energy Data
1. Click **New** → **External Connector**
2. Configure for weather and usage data:
   - **Name**: `Energy Usage and Weather Data`
   - **Source**: External API (to be configured with weather API)
   - **Refresh Frequency**: Daily

## 🎯 Step 3: Configure Einstein Search

### 3.1 Enable Einstein Search
1. Go to **Setup** → **Einstein Search**
2. Click **Enable Einstein Search**
3. Configure search settings:
   - **Search Analytics**: ✅ Enable
   - **Search Suggestions**: ✅ Enable
   - **Natural Language Processing**: ✅ Enable

### 3.2 Configure Search Objects
1. In **Einstein Search Setup**, click **Search Objects**
2. Add the following objects for search:
   - **Knowledge Articles**: ✅ Enable
   - **Cases**: ✅ Enable (for historical issue resolution)
   - **Accounts**: ✅ Enable (for customer lookup)
   - **Custom Energy Objects**: ✅ Enable (if applicable)

### 3.3 Set Up Search Indexes
```yaml
Search Index Configuration:

Knowledge Articles:
  - Title → High Priority
  - Summary → High Priority
  - Content → Medium Priority
  - Data Categories → High Priority
  - Keywords → High Priority

Cases:
  - Subject → High Priority
  - Description → Medium Priority
  - Resolution → High Priority
  - Type → High Priority

Energy Data:
  - Usage_Period → High Priority
  - Issue_Type → High Priority
  - Resolution_Steps → High Priority
```

## 🎯 Step 4: Create Flex Templates

### 4.1 Understanding Flex Templates
Flex Templates allow you to create custom search experiences that can be embedded in your Agentforce responses. For energy companies, this enables dynamic content delivery based on customer context.

### 4.2 Create Energy Bill Analysis Template

1. Go to **Data Cloud** → **Einstein Search** → **Flex Templates**
2. Click **New Flex Template**
3. Configure the template:

```json
{
  "templateName": "EnergyBillAnalysis",
  "description": "Analyzes customer energy bills with usage patterns and weather correlation",
  "parameters": [
    {
      "name": "accountNumber",
      "type": "text",
      "required": true,
      "description": "Customer energy account number"
    },
    {
      "name": "billingPeriod",
      "type": "date",
      "required": false,
      "description": "Specific billing period to analyze"
    }
  ],
  "searchQuery": {
    "query": "Account_Number:{accountNumber} AND Billing_Period:{billingPeriod}",
    "objects": ["Energy_Usage__c", "Weather_Data__c", "Customer_Tariff__c"]
  },
  "responseTemplate": {
    "title": "Your Energy Bill Analysis",
    "sections": [
      {
        "type": "usage_summary",
        "title": "Usage Summary",
        "fields": ["current_usage", "previous_usage", "usage_change"]
      },
      {
        "type": "weather_impact",
        "title": "Weather Impact",
        "fields": ["avg_temperature", "heating_days", "cooling_days"]
      },
      {
        "type": "cost_breakdown",
        "title": "Cost Breakdown",
        "fields": ["energy_cost", "standing_charge", "total_cost"]
      }
    ]
  }
}
```

### 4.3 Create Weather-Energy Correlation Template

1. Create another Flex Template: `WeatherEnergyCorrelation`

```json
{
  "templateName": "WeatherEnergyCorrelation",
  "description": "Shows correlation between weather patterns and energy usage",
  "parameters": [
    {
      "name": "location",
      "type": "text",
      "required": true,
      "description": "Customer location for weather data"
    },
    {
      "name": "dateRange",
      "type": "daterange",
      "required": true,
      "description": "Date range for analysis"
    }
  ],
  "searchQuery": {
    "query": "Location:{location} AND Date_Range:{dateRange}",
    "objects": ["Weather_Data__c", "Energy_Usage__c"]
  },
  "responseTemplate": {
    "title": "Weather Impact on Your Energy Usage",
    "sections": [
      {
        "type": "temperature_analysis",
        "title": "Temperature Trends",
        "visualization": "line_chart",
        "fields": ["date", "temperature", "usage_kwh"]
      },
      {
        "type": "correlation_summary",
        "title": "Key Insights",
        "fields": ["correlation_strength", "peak_usage_days", "recommendations"]
      }
    ]
  }
}
```

## 🎯 Step 5: Configure Flex Template Actions

### 5.1 Create Agentforce Actions for Flex Templates

1. Go to **Setup** → **Agentforce** → **Actions**
2. Create new action: `Analyze Energy Bill`

```yaml
Action Configuration:
Name: Analyze Energy Bill
Type: Flex Template Action
Description: Provides detailed analysis of customer energy bills
Template: EnergyBillAnalysis

Input Parameters:
- Account Number (required)
- Billing Period (optional)

Output Format:
- Structured response with usage, weather, and cost data
- User-friendly formatting for chat display
```

### 5.2 Create Weather Correlation Action

1. Create another action: `Show Weather Impact`

```yaml
Action Configuration:
Name: Show Weather Impact
Type: Flex Template Action  
Description: Shows how weather affected energy usage
Template: WeatherEnergyCorrelation

Input Parameters:
- Customer Location (required)
- Date Range (required)

Output Format:
- Visual correlation data
- Actionable insights and recommendations
```

## 🎯 Step 6: Integrate with Agentforce Agent

### 6.1 Add Actions to Agent Configuration

1. Go to **Setup** → **Agentforce** → **Agents**
2. Select your `EcoRise Energy Assistant` agent
3. In **Actions** section, add:
   - `Analyze Energy Bill`
   - `Show Weather Impact`

### 6.2 Configure Action Triggers

Update your agent instructions to include action usage:

```text
Enhanced Agent Instructions:

When customers ask about high bills or energy usage:
1. Use the "Analyze Energy Bill" action with their account number
2. If weather seems relevant, use "Show Weather Impact" action
3. Present the data in a user-friendly format with clear explanations

For weather-related questions:
1. Use "Show Weather Impact" action for the relevant time period
2. Explain the correlation in simple terms
3. Provide actionable recommendations

Always format responses with:
- Clear headings and bullet points
- Specific data points
- Actionable next steps
- Empathetic language
```

## 🎯 Step 7: Testing and Validation

### 7.1 Test Flex Template Functionality

1. Go to **Data Cloud** → **Einstein Search** → **Test Console**
2. Test each template with sample data:
   - Verify parameters are correctly passed
   - Check response formatting
   - Validate data accuracy

### 7.2 Test Agent Integration

1. Open your agent chat interface
2. Test scenarios that should trigger Flex Template actions:
   - "Why is my bill higher this month?"
   - "How did the cold weather affect my usage?"
   - "Show me my energy usage pattern"

### 7.3 Validate User Experience

- Ensure responses are properly formatted
- Check that visualizations display correctly
- Verify actionable insights are provided

## 🔧 Troubleshooting

### Common Data Cloud Issues:

**Data not syncing:**
- Check connector status in Data Streams
- Verify object permissions
- Review sync logs for errors

**Einstein Search not returning results:**
- Verify search indexes are built
- Check object visibility settings
- Review search query syntax

**Flex Templates not executing:**
- Validate template JSON syntax
- Check parameter mapping
- Verify agent action configuration

## 📈 Performance Optimization

### 7.1 Query Optimization
- Use specific filters in search queries
- Limit result sets to relevant time periods
- Index frequently searched fields

### 7.2 Template Caching
- Configure template caching for frequently used templates
- Set appropriate cache expiration times
- Monitor template performance metrics

## 💡 Best Practices

1. **Data Quality**: Ensure clean, consistent data in your streams
2. **Template Testing**: Thoroughly test templates before deployment
3. **Performance Monitoring**: Regular review of query performance
4. **User Feedback**: Collect feedback on search result relevance
5. **Security**: Follow data governance and privacy guidelines

## 📚 Next Steps

After completing Data Cloud setup:
1. Create comprehensive knowledge articles (see [Knowledge Base Guide](../knowledge/))
2. Build flows for complex scenarios (see [Flow Configuration Guide](../flows/))
3. Implement weather API integration (see [Apex Integration Guide](../apex/))
4. Configure energy-specific use cases (see [Use Cases Guide](../use-cases/))