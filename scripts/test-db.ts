import { connectToDatabase } from '../database/mongoose';
import mongoose from 'mongoose';

async function test() {
    try {
        console.log('Testing database connection...');
        await connectToDatabase();
        console.log('Successfully connected to the database!');
        
        // Check connection state
        if (mongoose.connection.readyState === 1) {
            console.log('Mongoose connection readyState is 1 (Connected)');
        } else {
            console.log('Mongoose connection readyState is:', mongoose.connection.readyState);
        }

        await mongoose.disconnect();
        console.log('Disconnected from the database.');
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:');
        console.error(error);
        process.exit(1);
    }
}

test();
