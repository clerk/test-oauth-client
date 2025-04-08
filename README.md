# Minimal OAuth Test Client

This is just about the most minimalistic OAuth client possible. It's intended for use in testing Clerk's OAuth server endpoints.

### To get it going

- Create an OAuth application [in your Clerk dashboard](https://dashboard.clerk.com/last-active?path=/oauth-applications), enter in `http://localhost:3000/callback` as the callback url
- Put the fapi url, client id, and secret into the `.env` file
- Run `npm start`

### Doing other stuff

- Hit `/refresh` to refresh the access token
- Hit `/userinfo` to get back info about the user that authorized the token
- Hit `/tokeninfo` to get back info about the refresh token

### To-do list

- Test `response_type=code` and `response_type=id_token` etc for authorization link
- Test `client_credentials`, `refresh_token`, and `password` grant types
- See what happens if AP is turned off
- OAuth applications in dashboard lets you add a url, you click save, it shows an error, but the url is still there, disappears when refresh. error message is also very bad. try it by skipping http (which we should auto map to https anyway)
- The term "client" is technically accurate in the docs but not actually clear, should be clarified at the top of the page what this means for devs not as familiar with oauth
- "Redirect uris" in dashboard should be "authorized redirect uris" - the actual redirect uri must be passed in to the authorize endpoint, this is not the actual redirect url, its just an allowlist and thats not clear on the dashboard
- FAPI docs for oauth2 endpoints are incomplete, they include no information what anything expects to get or returns
- Our `/tokens` endpoint could also take json. It takes only form-urlencoded right now, but it would add some flexibility if it also would take json
- We return an id token even if the response type is set to only `code`, it should require `code id_token` in order to return this afaik
- If account portal is turned off, I think the whole thing crashes, but need to test this
- The tokeninfo endpoint is documented as being able to return info about either token but only works for the refresh token
