import express from 'express';
import 'reflect-metadata';
import connectDb from './db/mongoose.connection';
import { EnvironmentConfiguration } from './config/env.config';
import middleware from './middlewares';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import Chat from './models/chat.model'; // Import Chat model

const app = express();
const server = http.createServer(app);
export const io = new SocketServer(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity.
  },
});

export let users: { [key: string]: string } = {}; // UserId to socketId mapping
export let stores: { [key: string]: string[] } = {}; // Store role to socketIds
export let sellers: { [key: string]: string[] } = {}; // Seller role to socketIds

async function bootStrap() {
  try {
    await connectDb();
    await middleware(app);

    // Socket.IO connection logic
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Register user
      socket.on('register', (userId: string, role: string) => {
        users[userId] = socket.id;

        if (role === 'store') {
          if (!stores[role]) stores[role] = [];
          stores[role].push(socket.id);
          console.log(`Store ${userId} registered with socket ID ${socket.id}`);
        }

        if (role === 'seller') {
          if (!sellers[role]) sellers[role] = [];
          sellers[role].push(socket.id);
          console.log(`Seller ${userId} registered with socket ID ${socket.id}`);
        }
      });

      // Handle product notification
      socket.on('productAdded', (productData: { sellerId: string; productId: string; productName: string }) => {
        console.log('New product added:', productData);

        // Notify all stores
        if (stores['store']) {
          stores['store'].forEach((storeSocketId) => {
            io.to(storeSocketId).emit('receiveNotification', {
              message: `New product added by Seller ${productData.sellerId}: ${productData.productName}`,
              productId: productData.productId,
            });
          });
        }
      });
    
      // Handle user disconnection
      socket.on('disconnect', () => {
        let disconnectedUser: string | null = null;

        // Remove from user mapping
        for (const userId in users) {
          if (users[userId] === socket.id) {
            disconnectedUser = userId;
            delete users[userId];
            console.log(`User ${userId} disconnected`);
            break;
          }
        }

        // Remove from stores or sellers
        const removeFromRole = (roleMap: { [key: string]: string[] }, roleName: string) => {
          const index = roleMap[roleName]?.indexOf(socket.id);
          if (index > -1) roleMap[roleName].splice(index, 1);
        };

        if (disconnectedUser) {
          removeFromRole(stores, 'store');
          removeFromRole(sellers, 'seller');
        }
      });

      // socket.on("setup", (userData) => {
      //   socket.join(userData._id);
      //   console.log(userData._id);
      //   socket.emit("connected");
      // });
    
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
        socket.emit("connected");
      });
    
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
      socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
      
        if (!chat.users) return console.log("chat.users not defined");
      
        chat.users.forEach((user:any) => {
          if (user._id === newMessageRecieved.sender._id) return; // Don't send to sender
      
          io.to(users[user._id]).emit("message recieved", newMessageRecieved);
        });
      });
      
    
      // socket.off("setup", () => {
      //   console.log("USER DISCONNECTED");
      //   socket.leave(userData._id);
      // });
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
