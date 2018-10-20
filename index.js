/*
Dotenv Configuration:
- Required As First Package - Local Enviroment Variables e.g. API Keys And Email Configuration
*/
require('dotenv').config();

/*
Dependencies For The Application:
- Starting dependencies for the application
- Feel free to add more e.g. connect-flash (recently removed plugin)
- Routes go here as well as plugin imports
*/

var express = require("express"), // Route And Server Handling (https://expressjs.com/en/guide/routing.html)
      app = express(), // Short Hand For Express  (https://expressjs.com/en/guide/routing.html)
      bodyParser = require("body-parser"), //Middleware To Handle Form Data
      session = require("express-session"), //Express Sessions - Needed For connect-flash
      indexRoutes = require("./public/routes/Index"); //Route For Page

/* 
Links To Build Directory:
- To Link Assets It Would Be /[Resoruce Directory]/[FileName].[file extension] 
- Public is the starting point for the application, its where the files are compiled to
*/

app.use(express.static(__dirname + "/public"));

/*
EJS Configuration:
- Setting the default view engine which is ejs, if your using jade instead insert jade
- This points to where the applications views start
*/
app.set("view engine", "ejs");
app.set("views", "./public/views");

/* 
 Bodyparser Configuration:
 - Essential for NodeJS applications
 - It grabs the data from forms, to use bodyparser use req.body.[name attribute value]
 - This is then inserted into the route which is assigned to the form
*/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



/* 
Session Configuration:
- Express requires a session to be present
- Needed for plugins such as express, connect-flash and many more
*/
app.use(session({
    secret: "Portfolio Website",
    resave: false,
    saveUninitialized: false
}));



/* 
Route Placeholder: 
- Route placeholder allow the starting route for the specific locatn 
- e.g. if the location is /campgrounds then all you would need to do is / as it knows /campgrounds is the placeholder
*/
app.use("/" ,indexRoutes);



/* 
Express Server :
- Starts te express server up on the specific port number
*/

var port = process.env.PORT || 3000;

app.listen(port, function (err) {
  if(err){
    console.error(err);
  } else {
    console.log(`The Server Has Successfully Started On http://localhost:${port}.`);
    console.warn("Check the gulpfile to see if the port number is being proxied off.")
  }
});
