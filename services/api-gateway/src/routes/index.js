// Inside routes/index.js

const forwardTo = (serviceBaseUrl, serviceNamespace) => async (req, res) => {
  try {
    // req.url is just the part AFTER /api/auth or /api/wallet (e.g., /balance)
    // We manually construct the path to avoid double-nesting
    const url = `${serviceBaseUrl}${serviceNamespace}${req.url}`;

    logger.info(`[Gateway] Proxying ${req.method} to: ${url}`);

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      params: req.query,
      headers: {
        Authorization: req.headers.authorization || "",
        "Content-Type": "application/json"
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: "Service Error" });
  }
};

// MOUNTING: Pass the service URL and the EXACT namespace the service expects
router.use("/auth", forwardTo(USER_SERVICE, "/auth"));
router.use("/wallet", authenticate, forwardTo(WALLET_SERVICE, "/wallet"));