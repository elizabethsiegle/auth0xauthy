'use strict';

const express = require('express')
const passport = require('passport')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const router = express.Router()
const authy = require('authy')(process.env.AUTHY_API_KEY)
const ManagementClient = require('auth0').ManagementClient

let authy_error = '';
const management = new ManagementClient({
  token: process.env.AUTH0_MANAGEMENT_TOKEN,
  domain: process.env.AUTH0_DOMAIN
})

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', { user: req.user, authy_error })
});

router.get('/activate', ensureLoggedIn, function(req, res, next){
  console.log(req.user)
  res.render('activation', { user: req.user })
})

router.post('/activate', ensureLoggedIn, function(req, res, next){
  authy.register_user(req.body.email, req.body.cell_number, req.body.country_code, function(err, result){
    if(err){
      console.log('Something went wrong activating your Authy account: ' + err);
      res.redirect('/user/activate')
    } else {
      authy_error = ''
      management.updateAppMetadata(req.user, { authyID: result.user.id, cellNumber: req.body.cell_number, countryCode: req.body.country_code },
        function(err, user){
          if(err){
            console.log(authy_error = 'Something went wrong updating your Auth0 user metadata: ' + err)
            res.redirect('/user/activate')
          } else {
            //Also: figure out how to ask for the token with login (customize lock?)
            res.redirect('https://kperch.auth0.com/v2/logout')
          }
        })
    }
  })
})

module.exports = router;
