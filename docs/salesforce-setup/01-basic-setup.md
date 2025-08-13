# Salesforce Agentforce Setup Guide for Energy Companies

This comprehensive guide walks you through setting up a Salesforce Agentforce Service Agent specifically designed for energy companies like British Gas.

## 📋 Prerequisites

- Salesforce org with Agentforce license
- Data Cloud license (for Einstein Search)
- System Administrator permissions
- Experience Cloud license (for the service site)

## 🎯 Step 1: Enable Agentforce

### 1.1 Enable Agentforce in Setup
1. Go to **Setup** → **Feature Settings** → **Agentforce**
2. Click **Enable Agentforce**
3. Verify Einstein Features are enabled:
   - Einstein for Service
   - Einstein Case Classification
   - Einstein Article Recommendations

### 1.2 Configure Service Cloud Features
1. Navigate to **Setup** → **Service Settings**
2. Enable the following:
   - **Knowledge**: ✅ Enable Knowledge
   - **Case Management**: ✅ Enable Case Management
   - **Live Agent**: ✅ Enable Live Agent (for escalation)

## 🎯 Step 2: Create the Agentforce Service Agent

### 2.1 Create New Agent
1. Go to **Setup** → **Agentforce** → **Agents**
2. Click **New Agent**
3. Configure basic settings:
   - **Name**: `EcoRise Energy Assistant`
   - **Type**: `Service Agent`
   - **Description**: `AI assistant for energy billing, usage, and weather-related inquiries`

### 2.2 Configure Agent Persona
```yaml
Agent Persona:
Role: You are a helpful energy consultant assistant for EcoRise Energy
Tone: Professional, empathetic, and solution-focused
Expertise: 
  - Energy billing and usage analysis
  - Weather impact on energy consumption
  - Tariff explanations and recommendations
  - Energy saving tips and advice

Response Guidelines:
- Always be polite and understanding
- Provide specific, actionable information
- Use bullet points for clarity
- Include relevant data when available
- Offer to escalate complex issues to human agents
```

### 2.3 Set Agent Instructions
```text
You are an AI assistant for EcoRise Energy, specializing in helping customers understand their energy usage and bills. 

Key Responsibilities:
1. Analyze customer energy bills and usage patterns
2. Explain reasons for bill variations (weather, usage changes, tariff changes)
3. Provide weather-related energy insights
4. Offer energy-saving recommendations
5. Handle follow-up questions to provide complete assistance

When analyzing bills:
- Always look at usage data from previous months
- Consider weather data for the billing period
- Explain technical terms in simple language
- Provide specific reasons rather than generic responses

Always maintain a helpful, professional tone and offer to connect customers with human specialists for complex issues.
```

## 🎯 Step 3: Configure Service Channel

### 3.1 Create Experience Cloud Site
1. Go to **Setup** → **Digital Experiences** → **All Sites**
2. Click **New** → **Customer Service** template
3. Configure site settings:
   - **Name**: `EcoRise Energy Service Portal`
   - **URL**: `ecorise-energy-service`
   - **Template**: Customer Service

### 3.2 Set Up Embedded Service
1. Navigate to **Setup** → **Embedded Service**
2. Click **New Deployment**
3. Configure deployment:
   - **Name**: `EcoRise Energy Chat`
   - **Site**: Select your Experience Cloud site
   - **Embedded Service Chat**: Enable

### 3.3 Configure Chat Settings
```yaml
Chat Configuration:
- Queue: EcoRise Energy Support
- Pre-chat form: Collect Name, Email, Account Number
- Chat window title: "EcoRise Energy Assistant"
- Welcome message: "Hi! I'm here to help with your energy questions. How can I assist you today?"
- Offline message: "Our agents are currently offline. Please leave a message and we'll get back to you."
```

## 🎯 Step 4: Connect Agent to Channel

### 4.1 Create Bot User
1. Go to **Setup** → **Users**
2. Create new user with **Salesforce Integration User** license
3. Assign **Agentforce Service Agent** permission set

### 4.2 Configure Channel Integration
1. Go to **Setup** → **Agentforce** → **Agent Configurations**
2. Select your agent
3. Add channel:
   - **Channel Type**: Embedded Service
   - **Deployment**: Select your embedded service deployment
   - **Bot User**: Select the bot user created above

## 🎯 Step 5: Testing and Validation

### 5.1 Test Basic Functionality
1. Open your website with embedded chat
2. Test basic greetings and responses
3. Verify agent follows persona guidelines

### 5.2 Validate Integration
1. Check that conversations are logged in Salesforce
2. Verify case creation for escalations
3. Test knowledge article suggestions

## 🔧 Troubleshooting

### Common Issues:

**Agent not responding:**
- Check bot user permissions
- Verify channel configuration
- Ensure agent is active

**Knowledge articles not appearing:**
- Check Data Category assignments
- Verify article publication status
- Review topic modeling configuration

**Conversations not logging:**
- Check Service Cloud license
- Verify object permissions for bot user
- Review conversation logging settings

## 📚 Next Steps

After completing this setup:
1. Configure Data Cloud integration (see [Data Cloud Setup Guide](../data-cloud/))
2. Create and train knowledge articles (see [Knowledge Base Guide](../knowledge/))
3. Build custom flows for complex scenarios (see [Flow Configuration Guide](../flows/))
4. Implement weather API integration (see [Apex Integration Guide](../apex/))

## 💡 Best Practices

1. **Regular Training**: Update agent knowledge regularly with new articles
2. **Performance Monitoring**: Review conversation logs and customer feedback
3. **Escalation Paths**: Ensure clear handoff to human agents when needed
4. **Response Templates**: Create consistent formatting for common scenarios
5. **Demo Preparation**: Use specific customer scenarios that showcase value