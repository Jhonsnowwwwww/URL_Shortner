const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const fs = require("fs");
const mongoose = require("mongoose");
const handler = require('./handler');
const { DB_NAME } = require('./constants');

// Load environment variables
dotenv.config();

const port = process.env.PORT || DEFAULT_PORT;


// Setup database
mongoose.connect(process.env.MONGO_DB + DB_NAME)
    .then((dbInstance) => {
        // Create Express app and set up routes
        console.log("DB Connected to ", dbInstance.connection.host);
    
        const app = express();
        app.use(express.json({limit: "16kb"}));
        app.use(cors({
            origin: process.env.CORS_ORIGIN,
            allowedHeaders: 'Content-Type,Authorization',
        }));
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", `${process.env.CORS_ORIGIN}`);
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept"
            );
            next();
          });
        app.use('/', handler.newRouter());

        // Start the server
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Starting the server on port ${port}`);
        });

        // Close database on process exit
        process.on('exit', () => {
            dbInstance.disconnect();
            logStream.end();
        });
    })
    .catch((err) => {
        console.error('Failed to set up database', err);
        process.exit(1);
    });
