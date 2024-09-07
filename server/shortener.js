const crypto = require('crypto');
const url = require('url');

// Encode function takes a long URL, hashes it using MD5, and returns a shortened version (7 characters).
//
// Returns the absolute long URL and the shortened URL.
function encode(longURL) {
    // Parse the URL
    const parsedURL = new URL(longURL);
    // Ensure the URL has a scheme (http/https)
    if (!parsedURL.protocol) {
        parsedURL.protocol = 'https:';
    }
    
    // Convert URL to string
    const longURLAbs = parsedURL.toString();
    console.log(`Shortener, long_url = ${longURLAbs}`);

    // Generate MD5 Hash of the URL
    const hash = crypto.createHash('md5');
    hash.update(longURLAbs);
    const longURLHashBytes = hash.digest();
    console.log(`Shortener, long_url (Hash) = ${longURLHashBytes.toString('hex')}`);

    // Encode the hash as Base64 (URL-safe)
    const longURLHashBytesB64Safe = longURLHashBytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    console.log(`Shortener, long_url (Hash+Base64) = ${longURLHashBytesB64Safe}`);

    // Return the first 7 characters of the Base64 string as the short URL
    const shortURLB64Safe = longURLHashBytesB64Safe.slice(0, 7);
    console.log(`Shortener, short_url = ${shortURLB64Safe}`);

    return { longURL: longURLAbs, shortURL: shortURLB64Safe };
}

// Decode function takes a short URL (7-character Base64) and decodes it back to the original hash in bytes.
function decode(shortURL) {
    // Decode the Base64 (URL-safe) encoded string
    const buffer = Buffer.from(shortURL, 'base64');
    return buffer;
}

module.exports = { encode, decode };
