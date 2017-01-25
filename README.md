Welcome to the Hills Have APIs Scary movie database system.

### Project Objective

### Introduce you to the Team



| Collaborators  |               |           |            |   |
|----------------|---------------|-----------|------------|---|
| Michael Bishop | Kyle Winckler | JR Hitaro | Ron Dunphy |   |



# Project MVP
###  3 Schemas:
- User
- Movie
- Review

# Start-up the Server
* From the folder root directory:
```
node server.js
```
* Create a user in the database:


## User
### Signup Process
The first thing you will need to do is sign up to create an account that you
will use to access the database.

### SIGNUP  /signup
Required Information
```
curl -X POST -H "Content-Type: application/json" -d '{"username":"your-username","password":"your-password","email":"your-email"}' http://localhost:3000/signup

```

### LOGIN /login
Go ahead and login with the username and password you created
```
curl -u username:password http://localhost:3000/login

```
This will return an authentication token that will authorize you for the routes.
 Here is an example:
* *eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODZlMTc2ZDQ3MWYxMmViM2JhM
zAyZiIsImlhdCI6MTQ4NTIzNDU4Nn0.DiISI9V6daM17G90zhtFZ7fdcy-KCj6rV_w3Wnsg_II*

**You have 2 options from here:**

(1)  Export token to a local environment variable -- export TOKEN=your-token
```
curl -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" http://localhost:3000/users
```
(2) Use the full token in a bearer auth environment
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODZlMTc2ZDQ3MWYxMmViM2JhM
zAyZiIsImlhdCI6MTQ4NTIzNDU4Nn0.DiISI9V6daM17G90zhtFZ7fdcy-KCj6rV_w3Wnsg_II" -H "Content-type: application/json" http://localhost:3000/users
```
**This will allow you to be able to see all the other users that have signed up.**  








### Modules Used:
* NPM Dependencies
  - mongoose
  - express
  - bluebird
  - http-errors


* NPM Dev-Dependencies
  - mocha
  - chai
  - superagent
  - gulp
  - gulp-mocha
  - gulp-eslint


#### Testing


## Attribution
![TMDB Logo](https://www.themoviedb.org/assets/static_cache/2dceae11589334eecd61443249261daf/images/v4/logos/208x226-stacked-green.png)

"This product uses the TMDb API but is not endorsed or certified by TMDb."



























