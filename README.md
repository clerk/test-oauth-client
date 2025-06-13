# Minimal OAuth Test Client

This is just about the most minimalistic OAuth client possible. It's intended for use in testing Clerk's OAuth server endpoints.

### To get it going

- Create an OAuth application [in your Clerk dashboard](https://dashboard.clerk.com/last-active?path=/oauth-applications), enter in `http://localhost:3000/oauth_callback` as the callback url
- Run `cp .env.sample .env` and fill out the OAuth client id, secret, and your clerk publishable key
- Run `npm start`

### Doing other stuff

- Hit `/refresh` to refresh the access token
- Hit `/userinfo` to get back info about the user that authorized the token
- Hit `/tokeninfo` to get back info about the refresh token
