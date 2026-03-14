export const getProfile = (req, res) => {
  // 1. Debug: See what the middleware actually sent
  console.log("Middleware User Data:", req.user);

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user data found in request" });
  }

  // Return the user data
  res.json({ 
    message: "User profile fetched from token", 
    user: req.user 
  });
};