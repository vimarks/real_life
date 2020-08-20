/*
  # requiring external modules
*/
const express = require("express");
const path = require("path");

/*
 # app variables
 heuristics dictate that we bind `const app` with the default function export of the express library
*/
const app = express();
const port = process.env.PORT || 8000;

/**
 *  App Configuration
 here we tell express where to look for for views, and what view engine to expect.
 set() must expect a property name and secondly what to set that property to.  set(name, value)
 path.join(string, string) path.join(current directory, directory to link to)
 */
//       name ,          value
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  //res.render(file path, variables)
  res.render("index", { x: "vincent aF!@#" });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`David! we listen on port:${port}`);
});
