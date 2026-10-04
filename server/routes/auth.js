// Import JWT.
const jwt = require("jsonwebtoken");

// Authentication middleware.
function authenticate(req, res, next) {
    // Read the authentication cookie.
    const token = req.cookies.token;

    // TEMPORARY diagnostic log.
    // This tells us whether Express receives the cookie.
    console.log(
        "AUTH DEBUG - token received:",
        Boolean(token)
    );

    // Reject requests without a token.
    if (!token) {
        console.log(
            "AUTH DEBUG - no token received"
        );

        return res.status(401).json({
            message: "Authentication required",
        });
    }

    try {
        // Verify the JWT using the production secret.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach the authenticated user to the request.
        req.user = decoded;

        // Continue to the protected route.
        next();

    } catch (error) {
        // TEMPORARY diagnostic log.
        // Do not log the actual JWT.
        console.error(
            "AUTH DEBUG - JWT verification failed:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

// Export the middleware.
module.exports = authenticate;
