// Import JSON Web Token support.
const jwt = require("jsonwebtoken");

// Require a valid JWT stored in the HTTP-only cookie.
function authenticateUser(req, res, next) {
    // Read the authentication cookie.
    const token = req.cookies.token;

    // Reject requests that do not contain a token.
    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        // Verify the token with the server-only secret.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach the authenticated user's claims to the request.
        req.user = decoded;

        // Continue to the protected route.
        next();
    } catch (error) {
        // Reject invalid or expired tokens.
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// Export the authentication middleware.
module.exports = authenticateUser;
