# Flow Configuration for Persistent Customer Queries

This guide provides comprehensive Flow configurations to enable your Agentforce Service Agent to handle persistent customer queries and follow-up questions effectively.

## 📋 Overview

The Flow configurations enable:
- **Context Retention**: Remember previous conversation details
- **Deep Dive Analysis**: Provide detailed explanations for energy usage patterns
- **Progressive Disclosure**: Offer more information as customers ask follow-up questions
- **Persistent Session Management**: Maintain conversation state across interactions

## 🎯 Step 1: Create Energy Usage Analysis Flow

### 1.1 Flow: Enhanced Energy Usage Analysis

**Flow Details:**
- **Flow Name**: `Enhanced_Energy_Usage_Analysis`
- **Flow Type**: `Autolaunched Flow`
- **Description**: `Provides detailed energy usage analysis with persistent context tracking`

### 1.2 Flow Variables

```yaml
Flow Variables:

# Input Variables
accountNumber (Text):
  Description: Customer energy account number
  Available for Input: Yes
  Available for Output: No

billingPeriod (Date):
  Description: Billing period to analyze
  Available for Input: Yes
  Available for Output: No

conversationId (Text):
  Description: Unique conversation identifier
  Available for Input: Yes
  Available for Output: No

previousQuestions (Text Collection):
  Description: Array of previous questions in conversation
  Available for Input: Yes
  Available for Output: No

# Output Variables
analysisResult (Text):
  Description: Formatted analysis result
  Available for Input: No
  Available for Output: Yes

contextData (Text):
  Description: JSON string with context for follow-up questions
  Available for Input: No
  Available for Output: Yes

recommendedActions (Text Collection):
  Description: List of recommended actions for customer
  Available for Input: No
  Available for Output: Yes

followUpQuestions (Text Collection):
  Description: Suggested follow-up questions
  Available for Input: No
  Available for Output: Yes

# Working Variables
currentUsageKWh (Number):
  Description: Current period usage in kWh

previousUsageKWh (Number):
  Description: Previous period usage in kWh

averageTemperature (Number):
  Description: Average temperature for billing period

tariffRate (Number):
  Description: Customer's current tariff rate

usageVariance (Number):
  Description: Percentage change in usage

weatherImpact (Text):
  Description: Weather impact analysis

applanceBreakdown (Text):
  Description: Estimated appliance usage breakdown
```

### 1.3 Flow Elements Configuration

```yaml
Flow Elements:

1. Get Customer Data (Get Records):
   Object: Account
   Filter: Energy_Account_Number__c = {accountNumber}
   Store: customerRecord
   
2. Get Usage History (Get Records):
   Object: Energy_Usage__c
   Filter: 
     - Account__c = {customerRecord.Id}
     - Billing_Period__c <= {billingPeriod}
   Sort: Billing_Period__c DESC
   Limit: 3
   Store: usageHistory

3. Calculate Usage Variance (Assignment):
   currentUsageKWh = {usageHistory[0].Usage_KWh__c}
   previousUsageKWh = {usageHistory[1].Usage_KWh__c}
   usageVariance = ((currentUsageKWh - previousUsageKWh) / previousUsageKWh) * 100

4. Get Weather Data (Subflow):
   Flow: Get_Weather_Analysis_Subflow
   Input:
     - latitude: {customerRecord.Service_Address_Latitude__c}
     - longitude: {customerRecord.Service_Address_Longitude__c}
     - startDate: {billingPeriod - 30}
     - endDate: {billingPeriod}
   Output:
     - averageTemperature
     - weatherImpact

5. Analyze Usage Pattern (Decision):
   Outcome: High Usage Increase
   Condition: {usageVariance} > 20
   
   Outcome: Moderate Usage Increase  
   Condition: {usageVariance} > 10 AND {usageVariance} <= 20
   
   Outcome: Normal Usage
   Condition: {usageVariance} <= 10 AND {usageVariance} >= -10
   
   Default: Usage Decrease

6. Generate Detailed Analysis (Assignment):
   Based on decision outcome, set:
   - analysisResult
   - recommendedActions
   - followUpQuestions
   - contextData
```

### 1.4 Analysis Logic for Different Scenarios

**High Usage Increase (>20%):**
```yaml
Analysis Content:
  analysisResult: |
    📈 **Significant Usage Increase Detected**
    
    Your energy usage increased by {usageVariance}% compared to last month.
    
    **Usage Breakdown:**
    • Current month: {currentUsageKWh} kWh
    • Previous month: {previousUsageKWh} kWh
    • Increase: {currentUsageKWh - previousUsageKWh} kWh
    
    **Primary Contributing Factors:**
    {weatherImpact}
    
    **Estimated Cost Impact:**
    • Additional usage cost: £{(currentUsageKWh - previousUsageKWh) * tariffRate}
    • Percentage of total bill: {((currentUsageKWh - previousUsageKWh) * tariffRate / totalBill) * 100}%

  recommendedActions:
    - Check heating/cooling settings and schedules
    - Inspect for new appliances or increased usage patterns
    - Consider energy efficiency improvements
    - Schedule a free energy audit

  followUpQuestions:
    - "What specific appliances caused the increase?"
    - "How can I reduce my heating costs?"
    - "Show me my hourly usage pattern"
    - "Compare this to the same month last year"
```

**Moderate Usage Increase (10-20%):**
```yaml
Analysis Content:
  analysisResult: |
    📊 **Moderate Usage Increase**
    
    Your usage increased by {usageVariance}%, which is within normal seasonal variation.
    
    **Key Factors:**
    {weatherImpact}
    
    **Usage Details:**
    • Current: {currentUsageKWh} kWh
    • Previous: {previousUsageKWh} kWh
    • This is typical for this time of year

  recommendedActions:
    - Monitor usage over next month
    - Implement basic energy saving measures
    - Consider programmable thermostat

  followUpQuestions:
    - "What are typical seasonal usage patterns?"
    - "How does my usage compare to similar homes?"
    - "What energy saving tips do you recommend?"
```

## 🎯 Step 2: Create Persistent Context Management Flow

### 2.1 Flow: Conversation Context Manager

**Flow Details:**
- **Flow Name**: `Conversation_Context_Manager`
- **Flow Type**: `Autolaunched Flow`
- **Description**: `Manages conversation state and context for persistent queries`

### 2.2 Context Data Structure

```yaml
Context Data JSON Structure:

{
  "conversationId": "unique-session-id",
  "customerId": "customer-account-id", 
  "conversationStartTime": "2024-01-15T10:30:00Z",
  "lastInteractionTime": "2024-01-15T10:35:00Z",
  "topicContext": {
    "primaryTopic": "high_energy_bill",
    "subTopics": ["usage_analysis", "weather_impact"],
    "billingPeriod": "2024-01",
    "analysisCompleted": true
  },
  "customerData": {
    "accountNumber": "ENG123456",
    "serviceAddress": "123 Main St, London",
    "currentTariff": "Standard_Variable",
    "currentUsage": 450,
    "previousUsage": 320,
    "usageVariance": 40.6
  },
  "previousQuestions": [
    "Why is my bill high this month?",
    "What caused the usage increase?"
  ],
  "providedRecommendations": [
    "heating_optimization",
    "energy_audit_suggestion"
  ],
  "availableFollowUps": [
    "appliance_breakdown",
    "seasonal_comparison",
    "energy_saving_tips"
  ]
}
```

### 2.3 Context Management Elements

```yaml
Context Management Flow Elements:

1. Get Existing Context (Get Records):
   Object: Conversation_Context__c
   Filter: Conversation_ID__c = {conversationId}
   Store: existingContext

2. Update Context Decision:
   If existingContext exists:
     - Update existing record
     - Merge new data with existing
   Else:
     - Create new context record
     - Initialize conversation state

3. Analyze Question Intent (Assignment):
   Uses text analysis to determine:
   - Is this a follow-up question?
   - What specific aspect are they asking about?
   - What context is relevant?

4. Generate Contextual Response (Decision):
   Based on question intent and existing context:
   
   Outcome: Appliance Breakdown Question
   Condition: Question contains "appliance", "device", "what used"
   
   Outcome: Seasonal Comparison Question  
   Condition: Question contains "last year", "same time", "seasonal"
   
   Outcome: Energy Saving Question
   Condition: Question contains "save", "reduce", "lower", "tips"
   
   Default: General Follow-up
```

## 🎯 Step 3: Create Appliance Breakdown Analysis Flow

### 3.1 Flow: Detailed Appliance Analysis

```yaml
Flow: Appliance_Usage_Breakdown

Purpose: Provides detailed breakdown of energy usage by appliance category

Input Variables:
  - totalUsageKWh (Number)
  - homeType (Text)
  - numberOfOccupants (Number)
  - hasElectricHeating (Boolean)
  - hasAirConditioning (Boolean)

Output Variables:
  - applianceBreakdown (Text)
  - topEnergyUsers (Text Collection)
  - recommendations (Text Collection)

Calculation Logic:
  Based on industry averages and customer-specific factors:
  
  Heating/Cooling: 40-60% of total usage
  Water Heating: 15-20% of total usage  
  Lighting: 8-12% of total usage
  Kitchen Appliances: 10-15% of total usage
  Electronics: 5-10% of total usage
  Other: 5-10% of total usage

Response Format:
  🏠 **Your Energy Usage Breakdown**
  
  **Estimated Usage by Category:**
  • 🌡️ Heating/Cooling: {heatingUsage} kWh ({heatingPercentage}%)
  • 🚿 Water Heating: {waterUsage} kWh ({waterPercentage}%)
  • 💡 Lighting: {lightingUsage} kWh ({lightingPercentage}%)
  • 🍳 Kitchen Appliances: {kitchenUsage} kWh ({kitchenPercentage}%)
  • 📺 Electronics: {electronicsUsage} kWh ({electronicsPercentage}%)
  
  **Top Energy Users This Month:**
  {topEnergyUsers}
  
  **Targeted Recommendations:**
  {recommendations}
```

## 🎯 Step 4: Create Seasonal Comparison Flow

### 4.1 Flow: Seasonal Usage Comparison

```yaml
Flow: Seasonal_Usage_Comparison

Purpose: Compares current usage to historical data and seasonal patterns

Input Variables:
  - accountNumber (Text)
  - currentBillingPeriod (Date)
  - comparisonType (Text): "last_year", "seasonal_average", "similar_homes"

Output Variables:
  - comparisonResult (Text)
  - seasonalInsights (Text)
  - benchmarkData (Text)

Elements:

1. Get Historical Data (Get Records):
   Object: Energy_Usage__c
   Filter: Account number and date ranges based on comparison type
   
2. Calculate Seasonal Averages (Loop):
   Iterate through historical data to calculate:
   - Same month last year
   - 3-year average for same month
   - Seasonal patterns (winter/summer peaks)

3. Generate Comparison Report (Assignment):
   comparisonResult = |
     📅 **Seasonal Usage Comparison**
     
     **Current Month vs Last Year:**
     • This {currentMonth}: {currentUsage} kWh
     • Same month last year: {lastYearUsage} kWh
     • Difference: {difference} kWh ({percentageChange}%)
     
     **Seasonal Context:**
     • Typical {season} usage: {seasonalAverage} kWh
     • Your usage vs seasonal average: {varianceFromAverage}%
     
     **Weather Adjustment:**
     • Last year's weather: {lastYearWeather}
     • This year's weather: {currentWeather}
     • Weather-adjusted comparison: {weatherAdjustedComparison}
```

## 🎯 Step 5: Create Follow-up Question Handler Flow

### 5.1 Flow: Intelligent Follow-up Handler

```yaml
Flow: Intelligent_Followup_Handler

Purpose: Dynamically handles follow-up questions based on conversation context

Input Variables:
  - conversationId (Text)
  - currentQuestion (Text)
  - previousContext (Text)

Decision Tree:

Question Category: Appliance Details
Triggers: "what appliance", "which device", "breakdown by"
Action: Call Appliance_Usage_Breakdown flow
Context Update: Add "appliance_analysis_provided"

Question Category: Cost Breakdown  
Triggers: "cost breakdown", "price increase", "bill calculation"
Action: Call Detailed_Cost_Analysis flow
Context Update: Add "cost_analysis_provided"

Question Category: Weather Impact
Triggers: "weather", "temperature", "cold", "hot"
Action: Call Weather_Impact_Analysis flow  
Context Update: Add "weather_analysis_provided"

Question Category: Saving Recommendations
Triggers: "save money", "reduce bill", "lower usage", "tips"
Action: Call Energy_Saving_Recommendations flow
Context Update: Add "recommendations_provided"

Question Category: Historical Comparison
Triggers: "last year", "compare", "historical", "trend"
Action: Call Seasonal_Usage_Comparison flow
Context Update: Add "historical_analysis_provided"

Default Action:
- Analyze question using Einstein NLP
- Provide general response with context
- Suggest specific follow-up options
```

## 🎯 Step 6: Integration with Agentforce

### 6.1 Create Agentforce Actions for Flows

**Action 1: Enhanced Energy Analysis**
```yaml
Action Configuration:
Name: Enhanced Energy Usage Analysis
Type: Flow Action
Flow: Enhanced_Energy_Usage_Analysis
Description: Provides comprehensive energy usage analysis with context

Input Mapping:
- accountNumber → Account Number (from conversation)
- billingPeriod → Billing Period (from conversation)  
- conversationId → Session ID (auto-generated)
- previousQuestions → Conversation History

Output Mapping:
- analysisResult → Formatted response for chat
- contextData → Store for follow-up questions
- recommendedActions → Action suggestions
- followUpQuestions → Suggested next questions
```

**Action 2: Follow-up Question Handler**
```yaml
Action Configuration:
Name: Handle Follow-up Questions
Type: Flow Action
Flow: Intelligent_Followup_Handler
Description: Handles persistent customer queries with context

Input Mapping:
- conversationId → Session ID
- currentQuestion → Customer's question
- previousContext → Retrieved from previous interaction

Output Mapping:
- detailedResponse → Context-aware response
- additionalRecommendations → New recommendations
- conversationContinuation → Options for further questions
```

### 6.2 Enhanced Agent Instructions

```text
Enhanced Agent Instructions for Persistent Queries:

PRIMARY DIRECTIVE:
You are a persistent, context-aware energy consultant. Always remember the conversation history and build upon previous interactions.

CONVERSATION FLOW:

1. **Initial Query Handling:**
   - Use "Enhanced Energy Usage Analysis" action
   - Store conversation context for follow-ups
   - Present comprehensive initial analysis
   - Offer specific follow-up options

2. **Follow-up Question Detection:**
   - Check if customer is asking about previously discussed topics
   - Use "Handle Follow-up Questions" action with context
   - Provide deeper analysis based on their specific interest
   - Continue building conversation context

3. **Persistent Context Examples:**

   Customer: "Why is my bill high this month?"
   Response: [Use Enhanced Energy Analysis action]
   Context Stored: Initial bill analysis, usage increase identified, weather impact noted

   Customer: "What specifically caused the usage to go up?"
   Response: [Use Follow-up Handler with appliance breakdown]
   "Based on our previous analysis showing a 40% usage increase, let me break down which appliances likely contributed..."

   Customer: "How does this compare to last year?"
   Response: [Use Follow-up Handler with seasonal comparison]
   "Looking at your usage pattern from our earlier discussion, let me compare this to the same period last year..."

4. **Context Retention Rules:**
   - Always reference previous analysis when relevant
   - Build upon previously provided information
   - Avoid repeating basic information already covered
   - Offer progressively deeper insights

5. **Response Formatting:**
   - Use clear headers and bullet points
   - Reference previous conversation points: "As we discussed earlier..."
   - Provide specific, actionable next steps
   - Always offer to explore related topics

6. **Escalation with Context:**
   When escalating to human agents, provide:
   - Complete conversation summary
   - Analysis already completed
   - Customer's specific areas of interest
   - Recommended next steps for agent
```

## 🎯 Step 7: Testing Persistent Query Scenarios

### 7.1 Test Scenario: Multi-Turn Bill Analysis

```yaml
Test Conversation Flow:

Turn 1:
Customer: "Why is my energy bill so high this month?"
Expected: Full energy analysis with usage breakdown, weather impact, context stored

Turn 2:  
Customer: "What appliances are using the most energy?"
Expected: Detailed appliance breakdown referencing previous analysis

Turn 3:
Customer: "How can I reduce my heating costs specifically?"
Expected: Targeted heating recommendations based on previous appliance analysis

Turn 4:
Customer: "Show me how this compares to last winter"
Expected: Seasonal comparison using previously identified high heating usage
```

### 7.2 Context Validation Points

1. **Information Continuity**: Each response builds on previous analysis
2. **No Repetition**: Avoid re-explaining basic concepts already covered
3. **Progressive Detail**: Each follow-up provides deeper insights
4. **Context Accuracy**: References to previous discussion are accurate
5. **Conversation Flow**: Natural progression through related topics

## 💡 Best Practices for Persistent Queries

1. **Context Storage**: Always store conversation state after each interaction
2. **Question Intent**: Use NLP to understand what aspect customer wants to explore
3. **Progressive Disclosure**: Start broad, get specific with follow-ups
4. **Reference Previous Work**: Always acknowledge what was discussed before
5. **Smart Suggestions**: Offer relevant follow-up questions based on context
6. **Session Management**: Handle session timeouts gracefully
7. **Human Handoff**: Pass complete context when escalating

This Flow configuration enables your Agentforce Service Agent to handle complex, multi-turn conversations while maintaining context and providing increasingly detailed insights to customers.