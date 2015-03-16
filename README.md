# AngularJS-JWT-OAuth2-Demo

An app to demonstrate authorization and authentication built on top of MEAN stack.

Demo: http://jwt-oauth2-demo.herokuapp.com

Features of this app include:

1. Authentication using JWT (JSON Web Tokens)
2. Using popup windows for OAuth 2.0 authentication
3. User can either login via OAuth 2.0 or can login after signing up for a new user account (if one does not exist already)
4. Some views may require login. Such scenarios are handled in the front-end itself by redirecting the user to login view 
   and after successful login, the user is redirected back to the original view.
5. Front-end technologies include:
   i.    Angular
   ii.   Angular Bootstrap
   iii.  Angular UI Router
   iv.   Angular JWT (for decoding JWT tokens received from the server and sending them in every request to the server)
   v.    ngStorage (for storing the JWT tokens)
   vi.   Font Awesome for displaying various icons
6. Back-end technologies include:
   i.   Express
   ii.  Mongoose 
   iii. Passport
   iv.  Jade Templating Engine
   v.   jsonwebtoken (jwt utility library)
   vi.  Various Passport strategies for different OAuth 2.0 providers
   
Important Note: Since passport strategy for Twitter OAuth 1.0 a requires session support, I have decided not to include
                Twitter login. 
                
Installation
============

1. Download the repository
2. Install npm modules: npm install
3. Install bower modules: bower install
4. Install mongodb server (if you haven't already) and start it
5. Update config/mongo.json file with prod and dev mongodb config
6. Update config/passport.json file with prod and dev OAuth2 config data for different providers
7. Update config/token.json file with your own custom secret (to be used in JWT sent after a user is successfully logged in)

TODOs
=====

1. Test cases
2. Docs
