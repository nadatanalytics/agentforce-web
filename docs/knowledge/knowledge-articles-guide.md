# Knowledge Articles for Energy Company Agentforce

This guide provides comprehensive templates and structures for creating Knowledge Articles that will enhance your Agentforce Service Agent's ability to help energy customers.

## 📋 Overview

Knowledge Articles serve as the foundation for your agent's knowledge base, providing:
- **Instant Answers**: Pre-written responses to common questions
- **Consistent Information**: Standardized explanations across all interactions
- **Expert Knowledge**: Detailed technical information presented in user-friendly format
- **Agent Training**: Continuous learning material for AI improvement

## 🎯 Step 1: Knowledge Base Setup

### 1.1 Enable Knowledge in Salesforce

1. Go to **Setup** → **Knowledge Settings**
2. Enable Knowledge:
   - ✅ **Enable Knowledge**
   - ✅ **Enable Article Public URLs**
   - ✅ **Enable Lightning Knowledge**
   - ✅ **Enable Article Summaries**

### 1.2 Create Data Categories

Set up data categories for energy-specific content:

```yaml
Data Category Structure:

Energy Topics:
  - Billing & Charges
    - Understanding Your Bill
    - Payment Methods
    - Direct Debit
    - Bill Disputes
  
  - Energy Usage  
    - Usage Patterns
    - Seasonal Variations
    - Appliance Consumption
    - Energy Efficiency
  
  - Weather & Environment
    - Weather Impact
    - Seasonal Changes
    - Climate Considerations
    - Environmental Tips
  
  - Tariffs & Pricing
    - Tariff Types
    - Rate Changes
    - Fixed vs Variable
    - Economy 7/10
  
  - Technical Support
    - Meter Readings
    - Smart Meters
    - Connection Issues
    - Service Interruptions

Customer Types:
  - Residential
    - Homeowners
    - Renters
    - First-time Customers
  
  - Business
    - Small Business
    - Medium Enterprise
    - Industrial
```

### 1.3 Create Article Types

Create specific article types for energy content:

**Article Type: Energy FAQ**
- Purpose: Quick answers to common questions
- Fields: Question, Answer, Related Topics, Seasonal Relevance

**Article Type: Detailed Guide**  
- Purpose: Comprehensive explanations
- Fields: Title, Summary, Step-by-Step Instructions, Tips, Warnings

**Article Type: Troubleshooting**
- Purpose: Problem resolution guides
- Fields: Problem Description, Symptoms, Solution Steps, Prevention

## 🎯 Step 2: Energy Bill Analysis Articles

### 2.1 Article: Understanding High Energy Bills

```yaml
Article Details:
Title: "Why Is My Energy Bill Higher Than Expected?"
Article Type: Detailed Guide
Data Categories: Billing & Charges > Understanding Your Bill
Summary: "Comprehensive guide to understanding factors that increase energy bills"

Content Structure:

# Why Is My Energy Bill Higher Than Expected?

## 📊 Quick Bill Check

If your energy bill seems higher than usual, here are the most common reasons:

### 🌡️ Weather Impact (60% of bill increases)
**Cold Weather:**
- Heating systems work harder in temperatures below 5°C
- Every 1°C drop can increase heating costs by 8-10%
- Poor insulation amplifies weather impact

**Hot Weather:**
- Air conditioning usage increases significantly above 25°C
- Fans and cooling systems run longer
- Higher electricity consumption during peak summer

### 📈 Usage Pattern Changes (25% of bill increases)
**Lifestyle Changes:**
- Working from home increases daytime usage
- New appliances or electronics
- More people in the household
- Changes in daily routines

**Appliance Issues:**
- Inefficient or aging appliances
- Heating/cooling systems needing maintenance
- Appliances left on standby mode

### 💰 Tariff and Rate Changes (15% of bill increases)
**Rate Adjustments:**
- Energy supplier price increases
- Moving from fixed to variable rates
- End of promotional pricing periods
- Government policy changes

## 🔍 How to Analyze Your Bill

### Step 1: Compare Usage (kWh)
```
Current Month: _____ kWh
Same Month Last Year: _____ kWh
Difference: _____ kWh
Percentage Change: _____%
```

### Step 2: Check Weather Correlation
- Average temperature this month vs last year
- Number of very cold days (below 5°C)
- Number of very hot days (above 25°C)

### Step 3: Identify Changes
- [ ] New appliances purchased
- [ ] Home improvements completed
- [ ] Changes in occupancy
- [ ] Different daily routines

## 💡 What You Can Do

### Immediate Actions:
1. **Check thermostat settings** - Even 1°C lower saves 8% on heating
2. **Review recent purchases** - New appliances impact usage
3. **Look for drafts** - Seal gaps around windows and doors
4. **Check appliance efficiency** - Replace old, energy-hungry devices

### Long-term Solutions:
1. **Improve insulation** - Reduces weather impact by 30-50%
2. **Upgrade heating system** - Modern systems are 20-30% more efficient
3. **Install smart controls** - Programmable thermostats save 10-15%
4. **Consider renewable energy** - Solar panels reduce grid dependency

## 🎯 When to Contact Us

Contact our energy advisors if:
- Usage increased >30% without explanation
- Bill seems incorrect despite normal usage
- You need help with energy efficiency improvements
- You want to discuss tariff options

## 📞 Next Steps

1. **Free Energy Audit**: Book a home energy assessment
2. **Usage Monitoring**: Set up smart meter alerts
3. **Efficiency Advice**: Speak with our energy specialists
4. **Financial Support**: Check if you qualify for assistance programs

---
*Last Updated: [Current Date]*
*Related Articles: [Smart Meter Guide] [Energy Efficiency Tips] [Tariff Comparison]*
```

### 2.2 Article: Seasonal Energy Usage Patterns

```yaml
Article Details:
Title: "Understanding Seasonal Energy Usage Patterns"
Article Type: Detailed Guide  
Data Categories: Energy Usage > Seasonal Variations
Summary: "Learn how seasons affect your energy consumption and bill"

Content:

# Understanding Seasonal Energy Usage Patterns

## 📅 Typical Seasonal Usage

### 🌨️ Winter (December - February)
**Highest Usage Period**
- **Average increase**: 40-60% above spring/fall
- **Peak usage times**: 6-9 AM and 5-8 PM
- **Main drivers**: Space heating, water heating, lighting

**Winter Usage Breakdown:**
- Heating: 60-70% of total usage
- Water heating: 20-25%
- Lighting: 10-15% (longer darkness)
- Other appliances: 5-10%

### ☀️ Summer (June - August)  
**Variable Usage Period**
- **Average change**: 20-40% above spring/fall (with AC)
- **Peak usage times**: 2-6 PM (hottest part of day)
- **Main drivers**: Air conditioning, fans, refrigeration

**Summer Usage Breakdown:**
- Cooling: 45-55% of total usage
- Water heating: 15-20% (less hot water needed)
- Lighting: 5-8% (shorter darkness)
- Other appliances: 20-25%

### 🌸 Spring/Fall (March-May, September-November)
**Lowest Usage Period**
- **Baseline usage**: Typical for your home size
- **Mild weather impact**: Minimal heating/cooling needed
- **Best time for**: Energy efficiency improvements

## 📊 Your Personal Usage Pattern

Use this framework to understand your specific patterns:

### Monthly Comparison Template:
```
Month | Usage (kWh) | vs Baseline | Weather Factor | Notes
Jan   | _________   | +____%      | Very Cold      | ________
Feb   | _________   | +____%      | Cold           | ________
Mar   | _________   | +____%      | Mild           | ________
[Continue for all months]
```

### Weather Correlation Factors:
- **Heating Degree Days**: Days when average temp < 18°C
- **Cooling Degree Days**: Days when average temp > 22°C
- **Your home's response**: How much usage changes per degree

## 🎯 Optimization Strategies

### Winter Optimization:
1. **Programmable Heating**:
   - Lower temperatures when away (16°C)
   - Comfortable when home (20-21°C)
   - Night setback saves 10-15%

2. **Insulation Priority**:
   - Loft insulation: 25-30% savings
   - Wall insulation: 15-20% savings
   - Floor insulation: 10-15% savings

### Summer Optimization:
1. **Cooling Efficiency**:
   - Use fans with AC (feels 3°C cooler)
   - Close blinds during hottest part of day
   - Set AC to 24-25°C for comfort

2. **Natural Cooling**:
   - Open windows at night for cross-ventilation
   - Use thermal curtains or blinds
   - Minimize heat-generating activities during day

## 📈 Benchmarking Your Usage

### Typical Annual Usage by Home Type:

**1-2 Bedroom Flat:**
- Low usage: 2,000-2,800 kWh/year
- Average usage: 2,800-3,300 kWh/year  
- High usage: 3,300+ kWh/year

**3 Bedroom House:**
- Low usage: 2,900-3,300 kWh/year
- Average usage: 3,300-4,100 kWh/year
- High usage: 4,100+ kWh/year

**4+ Bedroom House:**
- Low usage: 4,100-4,600 kWh/year
- Average usage: 4,600-5,800 kWh/year
- High usage: 5,800+ kWh/year

## 🔍 Red Flags to Watch For

Contact us if you notice:
- **Sudden spikes**: >50% increase without explanation
- **Gradually increasing**: Steady increases over several months
- **Unusual patterns**: High usage during mild weather
- **Meter concerns**: Readings don't match expectations

---
*Related Articles: [Weather Impact Guide] [Home Energy Audit] [Appliance Efficiency]*
```

## 🎯 Step 3: Weather Impact Articles

### 3.1 Article: How Weather Affects Your Energy Bill

```yaml
Article Details:
Title: "How Weather Affects Your Energy Bill"
Article Type: Energy FAQ
Data Categories: Weather & Environment > Weather Impact
Summary: "Understanding the relationship between weather and energy consumption"

Content:

# How Weather Affects Your Energy Bill

## 🌡️ Temperature Impact

### The 18°C Rule
Your home naturally wants to be the same temperature as outside. The further outdoor temperature is from your desired indoor temperature (typically 20-21°C), the more energy needed.

**Heating Season (Outdoor temp below 18°C):**
- Each 1°C drop = 8-10% increase in heating costs
- At 0°C: Heating costs are ~180% higher than mild weather
- At -5°C: Heating costs are ~230% higher than mild weather

**Cooling Season (Outdoor temp above 22°C):**
- Each 1°C rise = 6-8% increase in cooling costs  
- At 30°C: Cooling costs are ~160% higher than mild weather
- At 35°C: Cooling costs are ~200% higher than mild weather

## 📊 Weather-to-Bill Calculator

### Quick Estimation:
```
Base Monthly Bill (mild weather): £_____
Temperature Difference: _____ °C from 20°C
Expected Increase: _____ % 
Weather-Adjusted Bill: £_____
```

### Example Calculation:
- Base bill: £80
- Average outdoor temp: 2°C (18°C difference from ideal)
- Expected increase: 18°C × 8% = 144%
- Weather-adjusted bill: £80 × 2.44 = £195

## 🏠 Home-Specific Factors

### High Weather Sensitivity:
- **Poor insulation**: 2-3x more weather impact
- **Old heating system**: 20-30% less efficient
- **Large windows**: Extra heat loss/gain
- **High ceilings**: Harder to heat/cool
- **Corner/exposed homes**: More external walls

### Low Weather Sensitivity:  
- **Well insulated**: 50% less weather impact
- **Modern heating**: High efficiency systems
- **Good windows**: Double/triple glazed
- **Compact layout**: Less surface area exposed
- **Sheltered location**: Protection from wind

## 🌬️ Other Weather Factors

### Wind Impact:
- **High winds**: Increase heat loss by 10-20%
- **Wind chill**: Makes heating work harder
- **Drafts**: Cold air infiltration

### Humidity Impact:
- **High humidity**: Air conditioning works harder
- **Low humidity**: May feel colder, increase heating
- **Indoor humidity**: Affects comfort and efficiency

### Sunshine Impact:
- **Solar gain**: Free heating through south-facing windows
- **Cloud cover**: Reduces natural warming
- **Day length**: Affects lighting needs

## 💡 Weather-Smart Energy Tips

### Cold Weather Strategies:
1. **Maximize solar gain**: Open south-facing curtains during day
2. **Minimize heat loss**: Close curtains at sunset
3. **Zone heating**: Heat only occupied rooms
4. **Dress warmly**: Reduce thermostat 1-2°C

### Hot Weather Strategies:
1. **Block sun**: Close blinds on sunny sides
2. **Use fans**: Create comfort at higher temperatures  
3. **Cool at night**: Open windows when temperature drops
4. **Minimize heat sources**: Avoid using ovens during hottest hours

### Year-Round Strategies:
1. **Improve insulation**: Biggest impact on weather sensitivity
2. **Seal drafts**: Weatherstrip windows and doors
3. **Upgrade heating/cooling**: Modern systems more efficient
4. **Smart controls**: Programmable thermostats optimize usage

## 📞 When Weather Isn't the Answer

If your high bill can't be explained by weather:
- Usage increased >50% despite normal weather
- Bill high during mild weather periods
- Neighbors report normal bills during same weather

**Next Steps:**
1. Check for faulty appliances
2. Review meter readings
3. Consider professional energy audit
4. Contact our customer service team

---
*Related Articles: [High Bill Troubleshooting] [Home Insulation Guide] [Heating System Efficiency]*
```

## 🎯 Step 4: Appliance and Energy Efficiency Articles

### 4.1 Article: Appliance Energy Usage Guide

```yaml
Article Details:
Title: "Which Appliances Use the Most Energy?"
Article Type: Detailed Guide
Data Categories: Energy Usage > Appliance Consumption
Summary: "Comprehensive breakdown of household appliance energy consumption"

Content:

# Which Appliances Use the Most Energy?

## 🏆 Top Energy Users

### 1. 🌡️ Heating & Cooling (50-70% of total bill)
**Central Heating:**
- Average: 8,000-12,000 kWh/year
- Cost: £2,400-3,600/year
- Peak usage: Winter mornings and evenings

**Air Conditioning:**
- Average: 2,000-5,000 kWh/year
- Cost: £600-1,500/year  
- Peak usage: Summer afternoons

**Efficiency Tips:**
- Use programmable thermostats
- Maintain 20-21°C in winter, 24-25°C in summer
- Service systems annually
- Improve insulation

### 2. 🚿 Water Heating (15-20% of total bill)
**Electric Water Heater:**
- Average: 2,500-4,000 kWh/year
- Cost: £750-1,200/year
- Usage: Continuous or timed heating

**Efficiency Tips:**
- Set to 60°C (no higher needed)
- Insulate hot water cylinder
- Fix leaks promptly
- Use timer controls

### 3. 🍳 Kitchen Appliances (10-15% of total bill)

**Electric Oven:**
- Usage: 2-3 kWh per hour
- Annual cost: £150-300
- Most energy-intensive cooking method

**Refrigerator/Freezer:**
- Usage: 400-600 kWh/year per unit
- Annual cost: £120-180
- Runs 24/7

**Dishwasher:**
- Usage: 1.5-2 kWh per cycle
- Annual cost: £80-150
- Most efficient when fully loaded

**Efficiency Tips:**
- Use eco modes on dishwashers
- Keep fridges full but not overcrowded
- Defrost freezers regularly
- Use microwave for reheating

### 4. 📺 Electronics & Entertainment (5-10% of total bill)

**Television (LED 50"):**
- Usage: 100-200W when on
- Annual cost: £30-80
- Standby power: 1-5W

**Gaming Console:**
- Usage: 150-200W active, 10-15W standby
- Annual cost: £50-120
- Often left in standby mode

**Computers:**
- Desktop: 200-500W
- Laptop: 50-100W
- Annual cost: £60-200

**Efficiency Tips:**
- Turn off devices completely
- Use power strips to eliminate standby
- Choose energy-efficient models
- Enable power saving modes

### 5. 💡 Lighting (5-10% of total bill)

**LED Bulbs (10W equivalent to 60W incandescent):**
- Usage: 85% less energy than incandescent
- Lifespan: 25 times longer
- Annual savings: £40-80 per household

**Halogen Bulbs:**
- Usage: 20% less than incandescent
- Being phased out
- Should be replaced with LED

**Efficiency Tips:**
- Replace all bulbs with LED
- Use motion sensors for outdoor lighting
- Install dimmer switches
- Make use of natural light

## 📊 Annual Usage Breakdown by Category

### Typical 3-Bedroom House (3,500 kWh/year):

```
Heating/Cooling:    2,100 kWh (60%)  |  £630/year
Water Heating:        525 kWh (15%)  |  £158/year  
Kitchen Appliances:   350 kWh (10%)  |  £105/year
Electronics:          280 kWh (8%)   |  £84/year
Lighting:             175 kWh (5%)   |  £53/year
Other:                70 kWh (2%)    |  £21/year
```

## 🔍 Identifying Energy Vampires

### Hidden Energy Users:

**Standby Power (Average 5-10% of bill):**
- TVs, set-top boxes, game consoles
- Chargers left plugged in
- Appliances with digital displays
- **Solution**: Use smart power strips

**Inefficient Old Appliances:**
- Fridges >10 years old use 40% more energy
- Old washing machines use 50% more hot water
- Incandescent bulbs use 85% more than LED
- **Solution**: Upgrade to energy-efficient models

## 💰 Cost-Benefit Analysis of Upgrades

### High-Impact Upgrades:

**LED Lighting:**
- Cost: £3-15 per bulb
- Savings: £8-12 per bulb per year
- Payback: 3-12 months

**A+++ Rated Fridge:**
- Cost: £300-800
- Savings: £40-80 per year vs old fridge
- Payback: 4-10 years

**Smart Thermostat:**
- Cost: £200-300
- Savings: £150-300 per year
- Payback: 1-2 years

### Medium-Impact Upgrades:

**Energy-Efficient Washing Machine:**
- Cost: £300-600
- Savings: £30-60 per year
- Payback: 5-10 years

**Efficient Dishwasher:**
- Cost: £300-700
- Savings: £20-40 per year
- Payback: 8-15 years

## 🎯 Action Plan

### Week 1: Quick Wins
- [ ] Replace 5 most-used bulbs with LED
- [ ] Adjust thermostat settings
- [ ] Turn off standby devices
- [ ] Check water heater temperature

### Month 1: Medium Changes
- [ ] Install programmable thermostat
- [ ] Weatherstrip doors and windows
- [ ] Service heating system
- [ ] Upgrade to smart power strips

### Year 1: Major Investments
- [ ] Replace oldest appliances with A+++ rated
- [ ] Improve insulation
- [ ] Consider renewable energy options
- [ ] Professional energy audit

---
*Related Articles: [Energy Labels Guide] [Smart Home Technology] [Appliance Buying Guide]*
```

## 🎯 Step 5: Agent Integration and Article Optimization

### 5.1 Article Metadata for Agent Training

```yaml
Article Optimization for Agentforce:

SEO Keywords:
- Primary: "energy bill", "high usage", "appliance consumption"
- Secondary: "weather impact", "seasonal usage", "energy efficiency"
- Long-tail: "why is my energy bill high in winter"

Agent Training Tags:
- billing_analysis
- usage_patterns  
- weather_correlation
- appliance_breakdown
- energy_efficiency
- cost_optimization

Question Triggers:
- "Why is my bill high?"
- "What uses the most energy?"
- "How does weather affect my bill?"
- "Which appliances cost the most?"
- "How can I reduce my energy usage?"

Response Context:
- Include specific calculations when possible
- Reference customer's actual usage data
- Provide actionable next steps
- Offer to connect with specialists
```

### 5.2 Article Performance Tracking

```yaml
Knowledge Analytics to Monitor:

Article Usage Metrics:
- View count by article
- Agent recommendation frequency
- Customer satisfaction ratings
- Follow-up question patterns

Optimization Indicators:
- Articles with high bounce rates
- Questions not answered by existing content
- Frequent manual agent interventions
- Customer feedback themes

Update Triggers:
- Seasonal content refresh (quarterly)
- New energy regulations or tariffs
- Customer feedback patterns
- Technology updates (smart meters, etc.)
```

## 💡 Best Practices for Energy Knowledge Articles

1. **User-Friendly Language**: Avoid technical jargon, explain concepts clearly
2. **Visual Elements**: Use charts, graphs, and icons for better comprehension
3. **Actionable Content**: Always provide specific steps customers can take
4. **Seasonal Relevance**: Update content for seasonal energy patterns
5. **Local Context**: Include region-specific information and regulations
6. **Mobile Optimization**: Ensure articles display well on all devices
7. **Regular Updates**: Keep information current with market changes
8. **Cross-References**: Link related articles for comprehensive coverage

This knowledge base provides your Agentforce Service Agent with comprehensive, accurate information to help energy customers understand their usage patterns, bills, and optimization opportunities.