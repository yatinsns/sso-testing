const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static HTML form
app.use(express.static(path.join(__dirname, '../public')));

// Hardcoded public key (replace with your actual public key)
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqfP13hoYaStZT91JgBW7
q4WF/XTZmJaurnuN6n0T55uaO6b4fKjZKNNJjD5WEX3SjA6UsttN0And+bmubya6
cXFJKZ6IEOEBcQzoqNQEwKCT8BPiSbCtnv9VKptVRIq+oM6aQldRXH2RFbjWDpV/
KcKX3Ps4HuOgUE3CHdcLtTO3p+sU2ldowMTEiWQOit5GJdLYEboZYeXQhcGAN8Tn
/eMHYVAq6OJ6ht+m7Bjk8o3WoM+ksXmxzHhd79lhXtz0iXmDyvu5Ec2tSVpcRenT
WULPcHVy4wIC8VVspei5hGSvQwHIm5EuFJFX7fjIvtVdo9mbWwC5Wu6GApAqjAxM
oQIDAQAB
-----END PUBLIC KEY-----`;

// Endpoint to handle POST requests
app.post('/sso-endpoint', (req, res) => {
  const { email, secret, JWTResponse } = req.body;

  if (!JWTResponse) {
    return res.status(400).json({ error: 'JWT token is required' });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(JWTResponse, PUBLIC_KEY, { algorithms: ['RS256'] });

    // Extract email from the payload
    const { email } = decoded;

    if (!email) {
      return res.status(400).json({ error: 'Email not found in JWT payload' });
    }

    console.log(email);

    // Redirect to the SSO endpoint with query parameters
    const redirectUrl = `https://webmail-staging.riva.co/sso?email=${encodeURIComponent(
      email
    )}&slt=dummy_slt_value`;
    return res.redirect(302, redirectUrl);

  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid JWT' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
