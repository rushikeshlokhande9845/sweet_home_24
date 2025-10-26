# SweetHome Delights - Live Chat & Order System

A complete live chat and order management system for a cake shop with real-time functionality.

## Features

1. **Live Chat System** ([chat.html](file:///C:/Users/shubham/Desktop/123/chat.html)):
   - Real-time messaging between customers and admins
   - Automatic order creation from chat messages
   - Pastel-themed, responsive interface
   - Admin response simulation

2. **Order Management** ([orders.html](file:///C:/Users/shubham/Desktop/123/orders.html)):
   - Real-time order board
   - Order history tracking
   - Order status management
   - Cancel and remove orders

3. **Checkout System** ([checkout.html](file:///C:/Users/shubham/Desktop/123/checkout.html)):
   - Complete checkout process
   - Order placement with validation
   - Multiple payment options

## Real-time Data Storage Options

The system supports multiple data storage options:

### 1. Firebase (Recommended for Production)
To use Firebase for real-time functionality:

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database
3. Copy your project configuration
4. Update `firebase-config.js` with your actual Firebase config values

### 2. Local Storage (Default - No Setup Required)
The system automatically falls back to localStorage if Firebase is not configured.

### 3. JSON Files with Node.js Server
For local development without Firebase:

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. The server will run at http://localhost:3000

## How It Works

### Automatic Order Creation from Chat
When customers send messages containing order-related keywords (cake, order, kg, deliver, etc.), the system automatically creates an order entry.

Example message that triggers order creation:
> "Hi, I'd like to order a 1kg Black Forest Cake for tomorrow, please."

The system will:
1. Parse the message for cake type, quantity, and delivery date
2. Create an order with the parsed information
3. Add the order to the live order board
4. Store the order in the selected data storage

### Real-time Updates
All users (customers and admins) see:
- New chat messages instantly
- Order updates in real-time
- Status changes immediately

## File Structure

- `chat.html` - Live chat interface with order board
- `orders.html` - Order history and management
- `checkout.html` - Order placement and payment
- `firebase-config.js` - Firebase configuration
- `api.js` - Client-side API for data operations
- `server.js` - Node.js server for JSON file storage
- `orders.json` - Persistent order storage
- `chat-messages.json` - Persistent chat message storage

## Setup Instructions

### Quick Start (No Backend Required)
1. Open `chat.html` in a web browser
2. Start chatting and placing orders
3. Data is stored in localStorage

### With Node.js Server
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open http://localhost:3000/chat.html in your browser

### With Firebase
1. Create a Firebase project
2. Enable Realtime Database
3. Update `firebase-config.js` with your config
4. Open `chat.html` in a browser

## Customization

### Theme
The system uses a soft pastel theme with:
- Pink accents (#ec4899)
- Cream backgrounds (#fdf2f8)
- Light blue highlights (#f0f9ff)

### Typography
Uses Google Fonts "Poppins" for a modern, clean look.

### Responsive Design
Fully responsive for mobile and desktop devices.

## Support
For issues or questions, please check the browser console for error messages or contact the development team.