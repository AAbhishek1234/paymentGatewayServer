import express from 'express';
import dotEnv from 'dotenv';
import Razorpay from 'Razorpay'
dotEnv.config();
import cors from 'cors';
import { configureRoutes } from './configuration/configureRoutes.js';
import { connectDatabase } from './configuration/connectDatabase.js';

const app = express(); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const razorpay = new Razorpay({
    key_id: 'enter your id',
    key_secret: 'enter your key',
  });
  
  app.post('/create-order', async (req, res) => {
    const { amount, currency = 'INR', receipt = 'receipt#2' } = req.body;
    
    // Convert rupees to paise
    const amountInPaise = amount * 100;
  
    try {
      const options = {
        amount: amountInPaise, // Pass amount in paise to Razorpay
        currency,
        receipt,
      };
  
      const order = await razorpay.orders.create(options);
      res.json({
        id: order.id,
        currency: order.currency,
        amount: amount, // Keep the amount in rupees for frontend display
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  });
  

// Connect to the database and start the server only if the connection succeeds
const startServer = async () => {
    try {
        await connectDatabase(); // Wait for database connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1); // Exit the process on failure
    }
};

// Configure your application routes
 configureRoutes(app);

startServer();
