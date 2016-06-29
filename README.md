# auth0-authy-sample-app
This is the sample app for setting up Authy TOTP 2FA with Auth0

# Installation

1. Install Dependencies

  ```
  npm install
  ```

2. Gather Credentials

  * Your Auth0 domain, client ID, and client secret, obtainable [from the Auth0 dashboard](https://manage.auth0.com/)
  * Your [Auth0 Management API Token](https://auth0.com/docs/api/management/v2)
  * A [webtask.io](https://webtask.io) account, and your webtask.io profile name: the value of the -p parameter shown at the end of the code in Step 2 of the [Account Settings > Webtasks](https://manage.auth0.com/#/account/webtasks) page.

3. Create `.env` file with:

  ```bash
  AUTH0_DOMAIN="[Your Auth0 Domain]"
  AUTH0_CLIENT_ID="[Your Auth0 Client ID]"
  AUTH0_CLIENT_SECRET="[Your Auth0 Client Secret]"
  AUTH0_CALLBACK="http://localhost:3000/callback"
  AUTHY_API_KEY="[Your Authy API Key]"
  AUTH0_MANAGEMENT_TOKEN="[Your Auth0 Management API Token]"
  ```
4. Modify `wt-run` script

  ```bash
  #! /bin/bash

  wt create --name authy-mfa --secret authy_api_key=[Your Authy API Key] --secret auth0_secret=[Your Auth0 Client Secret] --secret auth0_clientID=[Your Auth0 Client ID] --secret returnUrl=https://[Your Auth0 domain]/continue --output json --profile [Your Webtask.io Profile Name] authy-mfa-wt.js
  ```

5. Make `wt-run` executable

  ```bash
  > chmod +x wt-run
  ```
  
6. [install the webtask cli](https://webtask.io/docs/101) if you haven't already

7. Deploy your webtask:

  ```bash
  > ./wt-run
  ```

8. modify `rule.js`

  ```javascript
   var configuration = {
      CLIENT_ID: '[Your Auth0 Client ID]',
      CLIENT_SECRET: '[Your Auth0 Client Secret]',
      ISSUER: '[Your Auth0 Domain]'
    };
   ```

9. [open the rules tab in the dashboard](https://manage.auth0.com), create a new rule, and paste the modified contents of `rule.js` into the editor window, and click 'Save'. 

10. Run the server

  ```bash
  node bin/www
  ```

11. navigate to `http://localhost:3000` in your browser.

## Caveat

There is a caveat with this project. If you're going to log into a social provider and use 2FA, **you'll need to use your own dev keys with the social connection, or the rule will fail.**
Using email/password combination works just fine no matter the situation.

