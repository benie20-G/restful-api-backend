import winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'restful-ne' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),//for outputting errors
        new winston.transports.File({ filename: 'combined.log' }), // for storing normal logs
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger;