import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300 // limit each IP to 300 requests per windowMs
});


// content security policy options
export const cspOptions = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        childSrc: ["'none'"],
        formAction: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
    } 
}