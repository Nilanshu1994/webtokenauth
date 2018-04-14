Micro service with api's to : 
1 . accept and authorize users using jsonwebtoken
2 . accept json object and jsonpatch then patch the json object with the provided patch to give out the resultant json object
3 . accept image url and resize it into thumbnail and return image tag with the thumbnail

// download or pull the app then in the app folder 
# run npm install to install the dependencies

# run npm start to start running the app

# run npm test to start the test

# All the logs can be found in /logs/output.log file

// App working

# send all the requests with appropriate parameters in the body with "content-type", "application/x-www-form-urlencoded" with key value pairs appropriate to the routes

# to login send a post request to /login required values :
      1- username : usernamevalue
      2- password : passwordvalue

# save the jsonwebtoken received in the response to access further routes

# to access json patching send a post request to /patch required values :
      1- json webtoken provided during login as token:token-value
      2- jsonfile : json-data
      3- jsonpatch : json-patch-data

# To access image resizing send a post request to /imageresize required values :
      1- json webtoken provided during login as token:token-value
      2- imageurl : image-url


// Use the Dockerfile to create a docker container and run it