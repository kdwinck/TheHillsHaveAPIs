Welcome to TheHillsHaveAPIs Scary movie database system.

### Project Objective
Our goal was to create an easy to use fully RESTful api for horror films. Users
can create an authenticated account to find movies, add them to their list of favorites, and even rate and review films.

### Introduce you to the Team

| Collaborators  |               |            |            |
|----------------|---------------|------------|------------|
| Michael Bishop | Kyle Winckler | JR Iriarte | Ron Dunphy |


### Three Schemas:
All data is created using mongo and stored remotely on MLab

- User - all users that have signed up for the api
- Movie - all movies in the api database
- Review - all reviews created by loggin in users


![thehillshaveapis](https://cloud.githubusercontent.com/assets/18372172/22401404/ab684f2a-e586-11e6-97d0-e82d74ae2d0a.png)

# Start-up the Server
* From the folder root directory:
```
node server.js
```


* Create a user in the database:

## User Routes

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

(1)  Export token to a local environment variable -- export TOKEN=<your token>
```
curl -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" http://localhost:3000/users
```
(2) Use the full token in a bearer auth environment
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODZlMTc2ZDQ3MWYxMmViM2JhM
zAyZiIsImlhdCI6MTQ4NTIzNDU4Nn0.DiISI9V6daM17G90zhtFZ7fdcy-KCj6rV_w3Wnsg_II" -H "Content-type: application/json" http://localhost:3000/users
```
**This will allow you to be able to see all the other users that have signed up.**  

### GET /users
This will return all user ID's in the database.

```
curl http://localhost:3000/users
```

### GET /users/:id
This will return a specific user from the database.

```
curl http://localhost:3000/users/12345
```

### GET /auth-users
This is an authorized route that will return all users from the DB with more detailed information.

```
curl -H "Authorization Bearer <your token>" http://localhost:3000/auth-users
```

### PUT /users
This will update a logged in users information.

```
curl -H "Authorization: Bearer <your token>" -H "Content-type: application/json" -d '{<information you want to update>}' -X PUT http://localhost:3000/auth-users
```

### DELETE /users
This will delete the logged in user.

```
curl -H "Authorization: Bearer <token>" -X DELETE http://localhost:3000/users
```

## Movie Routes - Unauthorized

### GET /movies
This will return all the movies from the database.

```
curl http://localhost:3000/movies
```

### GET /movies/:id
This will return a specific movie with the passed in id parameter.

```
curl http://localhost:3000/movies/12345
```

### GET /movies/title/:title
This will return a specific movie the with passed in title parameter.

```
curl http://localhost:3000/movies/title/Blade
```

### GET /movies/:id/reviews
This will return an array of all reviews for that specific movie with the given ID.

```
curl http://localhost:3000/movies/12345/reviews
```

## Movie routes - Authorized

### POST /movies/:id/reviews
This allows the logged in user to create a review for a given movie.

```
curl -H "Authorization: Bearer <your token>" -H "Content-type: application/json" -d '{"rating": "8", "reviewText": "Awesome!" }'  http://localhost:3000/movies/12345/reviews
```

### GET /favorites
This allows the logged in user to see all of their favorite movies.

```
curl -H "Authorization: Bearer <your token>"
http://localhost:3000/favorites
```

### PUT /movies/:id/add
This allows the logged in user to add a movie to their favorite movies list. It will return the updated user.

```
curl -H "Authorization: Bearer <your token>" -X PUT  http://localhost:3000/movies/12345/add
```

### DELETE /movies/:id/DELETE
This allows the logged in user to delete a movie from their favorite movies list. It will return the updated user.

```
curl -H "Authorization: Bearer <your token>" -X DELETE http://localhost:3000/movies/12345/delete
```

## Review routes - Unauthorized

### GET /user/:id/reviews
This will get all reviews associated with the user whose ID is passed in as a parameter.

```
curl http://localhost:3000/user/12345/revews
```

## Review routes - Authorized

### GET /user/reviews
This will get all reviews associated with the logged in user.

```
curl -H "Authorization: Bearer <your token>" http://localhost:3000/users/reviews
```

### DELETE /movies/:movieId/reviews/:reviewId
This will delete a review and remove its associations with the both the logged in user and the movie associated with the passed in ID.

```
curl -H "Authorization: Bearer <your token>" -X DELETE http://localhost:3000/movies/12345/review/15
```

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
Testing was done using gulp, mocha, and superagent.

## Attribution
![TMDB Logo](https://www.themoviedb.org/assets/static_cache/2dceae11589334eecd61443249261daf/images/v4/logos/208x226-stacked-green.png)

"This product uses the TMDb API but is not endorsed or certified by TMDb."
