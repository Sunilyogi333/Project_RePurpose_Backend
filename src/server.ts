import express from 'express';
import 'reflect-metadata';
import connectDb from './db/mongoose.connection';
import { EnvironmentConfiguration } from './config/env.config';
import middleware from './middlewares';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
export const io = new SocketServer(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity. You can restrict this based on your needs.
  },
});

let users: { [key: string]: string } = {}; // Mapping of userId to socketId
let stores: { [key: string]: string[] } = {}; // Mapping of store role to socketIds

async function bootStrap() {
  try {
    await connectDb();
    await middleware(app);

    // Set up Socket.IO connection
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Register the user with their userId and role
      socket.on('register', (userId: string, role: string) => {
        users[userId] = socket.id; // Store userId and socketId mapping

        if (role === 'store') {
          // If the user is a store, add them to the stores list
          if (!stores[role]) {
            stores[role] = [];
          }
          stores[role].push(socket.id); // Store the socketId for the store
          console.log(`Store ${userId} registered with socket ID ${socket.id}`);
        }
      });

      // Handle sending a private message
      socket.on('sendMessage', (data: { productId: string, senderId: string, receiverId: string, message: string }) => {
        console.log('Sending private message:', data);

        const receiverSocketId = users[data.receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', {
            productId: data.productId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            createdAt: new Date(),
          });
          console.log('Private message sent to:', data.receiverId);
        } else {
          console.log('Receiver not connected:', data.receiverId);
        }
      });

      // Handle broadcasting notification to all stores when a seller adds a new product
      socket.on('productAdded', (productData: { sellerId: string, productId: string, productName: string }) => {
        console.log('New product added:', productData);

        // Emit to all store sockets
        if (stores['store']) {
          stores['store'].forEach((storeSocketId) => {
            io.to(storeSocketId).emit('receiveNotification', {
              message: `New product added by Seller ${productData.sellerId}: ${productData.productName}`,
              productId: productData.productId,
            });
          });
        }
      });

      // Handle disconnect event
      socket.on('disconnect', () => {
        // Remove user from the mapping on disconnect
        for (let userId in users) {
          if (users[userId] === socket.id) {
            delete users[userId];
            console.log(`User ${userId} disconnected`);
            break;
          }
        }

        // Remove store from the stores list on disconnect
        for (let role in stores) {
          const index = stores[role].indexOf(socket.id);
          if (index > -1) {
            stores[role].splice(index, 1);
            console.log(`Store disconnected, removed socket ID: ${socket.id}`);
            break;
          }
        }
      });
    });

    server.listen(EnvironmentConfiguration.PORT, () => {
      console.info(`Server started at http://localhost:${EnvironmentConfiguration.PORT}`);
    });
  } catch (error) {
    console.error('Error during server setup:', error);
    process.exit(1);
  }
}

bootStrap();
