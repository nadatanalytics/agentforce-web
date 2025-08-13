# EcoRise Energy - Salesforce Agentforce Integration

This repository contains the website for EcoRise Energy with an integrated Salesforce Agentforce Service Agent designed specifically for energy companies like British Gas.

## 🎯 Overview

The Agentforce Service Agent is configured to handle customer inquiries related to energy usage, billing, and weather-related questions. This documentation provides comprehensive guidance for Salesforce Consultants to build and enhance similar agents.

## 📁 Documentation Structure

- [`docs/salesforce-setup/`](docs/salesforce-setup/) - Complete Salesforce configuration guides
- [`docs/data-cloud/`](docs/data-cloud/) - Data Cloud setup and Einstein Search configuration
- [`docs/flows/`](docs/flows/) - Flow configurations for customer query handling
- [`docs/knowledge/`](docs/knowledge/) - Knowledge Article templates and structures
- [`docs/apex/`](docs/apex/) - Apex code examples including weather API integration
- [`docs/use-cases/`](docs/use-cases/) - Energy company specific use cases and examples

## 🚀 Quick Start

1. **Website Integration**: The Agentforce widget is already embedded in `index.html`
2. **Salesforce Configuration**: Follow the guides in [`docs/salesforce-setup/`](docs/salesforce-setup/)
3. **Data Cloud Setup**: Configure Data Cloud using [`docs/data-cloud/`](docs/data-cloud/)
4. **Deploy Flows**: Import and configure flows from [`docs/flows/`](docs/flows/)
5. **Create Knowledge Base**: Use templates from [`docs/knowledge/`](docs/knowledge/)

## 🎨 Demo Features

- **Persistent Customer Queries**: Handle follow-up questions and maintain context
- **Weather Integration**: Real-time weather data for energy usage analysis
- **Bill Analysis**: Detailed explanations for energy cost variations
- **User-Friendly Responses**: Professional, helpful, and visually appealing outputs

## 🏢 Energy Company Use Cases

- High bill explanations with weather correlation
- Energy usage pattern analysis
- Tariff recommendations
- Seasonal energy saving tips
- Outage information and updates

## 📊 Current Implementation

The agent currently handles the use case: *"Why is my bill high this month?"* by analyzing:
- Previous two months' energy usage
- Customer's current tariff
- Weather data correlation
- Usage pattern identification

## 🔗 Live Demo

Visit the website at: [Your GitHub Pages URL]

The Agentforce widget appears in the bottom-right corner for customer interactions.