const dotenv    = require('dotenv');
const path      = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
    PORT: process.env.PORT || 3000,
    // JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    // JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    // JWT_ACCESS_EXPIRE: 20,
    // JWT_REFRESH_EXPIRE: 20,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    COOKIE_NAME: process.env.COOKIE_NAME,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    MONGO_URL: process.env.MONGO_URL,
    MONGO_CONFIG: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    COOKIE_CONFIG: {
        signed: true,
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        overwrite: true
    }
};
