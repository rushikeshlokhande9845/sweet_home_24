// Simple Node.js server for handling orders and chat messages
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Helper function to read JSON file
async function readJSONFile(filename) {
    try {
        const data = await fs.readFile(path.join(__dirname, filename), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

// Helper function to write JSON file
async function writeJSONFile(filename, data) {
    try {
        await fs.writeFile(path.join(__dirname, filename), JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// Routes for orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await readJSONFile('orders.json');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const order = req.body;
        const orders = await readJSONFile('orders.json');
        orders.push(order);
        const success = await writeJSONFile('orders.json', orders);
        
        if (success) {
            res.json({ success: true, orderId: order.orderID });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save order' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await readJSONFile('orders.json');
        const orderIndex = orders.findIndex(order => order.orderID === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            const success = await writeJSONFile('orders.json', orders);
            
            if (success) {
                res.json({ success: true });
            } else {
                res.status(500).json({ success: false, error: 'Failed to update order' });
            }
        } else {
            res.status(404).json({ success: false, error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Routes for chat messages
app.get('/api/chat-messages', async (req, res) => {
    try {
        const messages = await readJSONFile('chat-messages.json');
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/chat-messages', async (req, res) => {
    try {
        const message = req.body;
        const messages = await readJSONFile('chat-messages.json');
        messages.push(message);
        const success = await writeJSONFile('chat-messages.json', messages);
        
        if (success) {
            res.json({ success: true, messageId: message.id });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save message' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});