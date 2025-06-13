import express from "express";
import qs from "qs";
import dotenv from "dotenv";
import shortid from "shortid";
import open from "open";

dotenv.config();

const PORT = process.env.PORT || 3000;
const state = shortid.generate();
const app = express();
const fapiUrl = deriveFapiUrl(process.env.CLERK_PUBLISHABLE_KEY);
const tokens = {}; // in memory store because thats how the real pros do it

// Log out the initial authorization url to get the flow started
const params = {
	response_type: "code",
	client_id: process.env.CLIENT_ID,
	redirect_uri: `http://localhost:${PORT}/callback`,
	scope: "email profile",
	state,
};

console.log("Opening initial authorization url in browser...")
open(`${fapiUrl}/oauth/authorize?${qs.stringify(params)}`)

// hit this endpoint to exchange the code for an access token
app.get("/callback", async (req, res) => {
    const { code, state: callbackState } = qs.parse(req.query)

    if (callbackState !== state) {
        return res.status(400).send("State param mismatch")
    }

    const response = await fetch(`${fapiUrl}/oauth/token`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `http://localhost:${PORT}/callback`,
        }),
    })
    .then((res) => res.json())
    .catch((error) => error.data)

    tokens.accessToken = response.access_token;
    tokens.refreshToken = response.refresh_token;
    tokens.idToken = response.id_token;

    res.json(response);
});

// hit this endpoint to refresh the access token
app.get("/refresh", async (_, res) => {
    const response = await fetch(`${fapiUrl}/oauth/token`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: tokens.refreshToken,
            grant_type: "refresh_token",
            redirect_uri: `http://localhost:${PORT}/callback`,
        }),
    })
    .then((res) => res.json())
    .catch((error) => error.data)

    tokens.accessToken = response.access_token;
    tokens.refreshToken = response.refresh_token;

    res.json(response);
});

// get user info given an access token
app.get("/userinfo", async (_, res) => {
    const response = await fetch(`${fapiUrl}/oauth/userinfo`, {
        headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
        },
    })
    .then((res) => res.json())
    .catch((error) => error.data)

    res.json(response);
});

// get refresh token info
app.get("/tokeninfo", async (_, res) => {
    const response = await fetch(`${fapiUrl}/oauth/token_info`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({
            token: tokens.refreshToken,
        }),
    })
    .then((res) => res.json())
    .catch((error) => error.data)

    res.json(response);
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// clerk utility function
function deriveFapiUrl(publishableKey) {
    const key = publishableKey.replace(/^pk_(test|live)_/, "");
    const decoded = Buffer.from(key, "base64").toString("utf8");
    return "https://" + decoded.replace(/\$/, "");
}