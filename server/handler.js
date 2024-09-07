const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortener = require('./shortener');
const Url = require("./urlSchema");

// Express middleware setup
const app = express();

// Utility function to create a JSON response
function createJSON(response) {
    return JSON.stringify(response);
}

// Utility function to send response
function sendResponse(res, statusCode, jsonResp) {
    res.status(statusCode).json(JSON.parse(jsonResp));
}

// Utility function to send error response
function sendErrorResponse(res, statusCode, error) {
    console.error(error);
    const errorResp = createJSON({ error: error.message });
    sendResponse(res, statusCode, errorResp);
}

// Index handler for the root path
app.get('/', (req, res) => {
    const jsonResp = createJSON({ message: "Welcome to url-shortener" });
    sendResponse(res, 200, jsonResp);
});

// Redirect handler for /redirect
app.get('/redirect', (req, res) => {
    res.redirect('/');
});

// RedirectURL handler for /redirect/:short_url
function redirectURL() {
    return async (req, res) => {
        const shortURL = req.params.short_url;
        try {
            // const longURL = await database.getEntryDB(db, shortURL);
            const longURL = await Url.findOne({shortenUrl: shortURL});
            if (!longURL) {
                const msg = `URL ${shortURL} Not Found`;
                const jsonResp = createJSON({ message: msg });
                return sendResponse(res, 404, jsonResp);
            }
            res.redirect(301, longURL.originalUrl);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    };
}

// ShortenURL handler for /shorten
function shortenURL() {
    return async (req, res) => {
        console.log("body ", req.body);
        const { long_url: longURL } = req.body;
        if (!longURL) {
            const errorResp = createJSON({ error: "long_url parameter is required" });
            return sendResponse(res, 400, errorResp);
        }
        try {
            // Convert long_url to short_url
            const { longURL: originalURL, shortURL } = await shortener.encode(longURL);

            // Check if there's a collision in the database
            // const existingURL = await database.getEntryDB(db, shortURL);
            const existingURL = await Url.findOne({shortenUrl: shortURL});
            if(existingURL !== null && existingURL.originalUrl === longURL) {
                const jsonResp = createJSON({
                  long_url: originalURL,
                  short_url: shortURL,
                });
                sendResponse(res, 200, jsonResp);
            }
            if (existingURL && existingURL !== originalURL) {
                const msg = `URL Collision: Found two values for ${shortURL}: ${existingURL} and ${originalURL}`;
                console.log(msg);
                const jsonResp = createJSON({ message: msg });
                return sendResponse(res, 500, jsonResp);
            }

            // Save to the database
            await Url.create({originalUrl: longURL,
                shortenUrl: shortURL,
            });
            // await database.putEntryDB(db, shortURL, originalURL);

            // Respond with short URL
            const jsonResp = createJSON({ long_url: originalURL, short_url: shortURL });
            sendResponse(res, 200, jsonResp);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    };
};
// Function to set up routes with the database instance
function newRouter() {
    const router = express.Router();
    router.get('/', (req, res) => {
        const jsonResp = createJSON({ message: 'Welcome to url-shortener' });
        sendResponse(res, 200, jsonResp);
    });
    router.get('/redirect', (req, res) => res.redirect('/'));
    router.get('/redirect/:short_url', redirectURL());
    router.post('/shorten', shortenURL());
    return router;
}

module.exports = { newRouter };
