/*
  # requiring external modules
*/
const express = require("express");
const path = require("path");
const mongodb = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ExpressWs = require("express-ws");
const axios = require("axios");
const puppeteer = require("puppeteer");
// const auth = require("./routes/auth");
User = require("./user-model");

/*
 # app variables
 heuristics dictate that we bind `const app` with the default function export of the express library
*/
const app = express();
const port = process.env.PORT || 8000;
const ws = ExpressWs(app);

mongoose.connect("mongodb://127.0.0.1:27017/users", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
let db = mongoose.connection;
db.once("open", function(callback) {
  console.log("connection succeeded #@!");
});

/**
 *  App Configuration
 here we tell express where to look for for views, and what view engine to expect.
 set() must expect a property name and secondly what to set that property to.  set(name, value)
 path.join(string, string) path.join(current directory, directory to link to)
 */
//       name ,          value
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Routes Definitions
 */

app.get("/", function(req, res) {
  res.render("login");
});

app
  .route("/signup")
  .get((req, res) => {
    res.render("signup", { x: "vincent aF!@#" });
  })
  .post((req, res) => {
    let username = req.body.username;
    let password = req.body.userpass;
    let displayName = req.body.displayName;

    let newUser = new User({
      username: username,
      password: password,
      displayName: displayName
    });

    newUser.save(function(err) {
      if (err) {
        res.status(500).send("Username is not unique, please try again");
      } else {
        res.cookie("user", username, { maxAge: 360000 });
        res.render("chatroom");
      }
    });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    let username = req.body.username;
    let password = req.body.userpass;
    User.getAuthenticated(username, password, function(err, user, reason) {
      if (err) {
        console.log("reason", reason);
        res.status(500).send(reason);
        throw err;
      }

      if (!user) {
        console.log("not user");
        res.status(500).send(reason);
      }
      if (user) {
        res.cookie("user", username, { maxAge: 360000 });
        res.render("chatroom", { getLink: getLink.getLink });
      }
    });
  });

app.get("/logout", function(req, res) {
  res.render("logout", { userName: req.cookies.user });
  res.clearCookie("user");
});

app.get("/chatroom", function(req, res) {
  res.render("chatroom");
});

app.get("/profile", function(req, res) {
  res.render("profile");
});

app.post("/delete", function(req, res) {
  let username = req.body.username;
  let password = req.body.userpass;
  User.getAuthenticated(username, password, function(err, user, reason) {
    if (err) {
      console.log(reason);
      res.status(500).send(reason);
      throw err;
    }

    if (!user) {
      console.log("cannot delete, not user");
      res.status(500).send(reason);
      // res.jsonp({ success: true });
    }
    if (user) {
      User.deleteOne({ username: username }, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
        res.render("logout");
      });
    }
  });
});

/*
WebSocket configuration
*/

app.ws("/messages", (webSocket, req) => {
  webSocket.on("message", message => {
    console.log("Received:", message);
    //look up username in DB

    let unverifiedUser = req.cookies.user;
    User.findOne({ username: unverifiedUser }, function(err, obj) {
      let displayName = obj.displayName;
      if (message === "typing link request") {
        getLink(displayName);
      } else broadcast(displayName + message);
    });
  });
});

async function getLink(displayName) {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage();
  const response = await page.goto(
    "https://keyboard-racing.com/personal-game.html"
  );
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  await page.evaluate(() => {
    let selector = document.getElementsByName("game_mode")[0];
    selector.selectedIndex = 1;
  });
  await page.evaluate(() => {
    let submit = document.querySelector("[type=submit]");
    submit.click();
  });
  await page.waitForTimeout(1500);

  // let hostURL = await page.url();
  const hostURL = await page.$$eval(
    "input",
    items => items.map(item => item.value)[55]
  );
  await broadcast(`${displayName} ${hostURL}`);

  await page.waitForTimeout(10000);

  await page.$$eval("a", items =>
    items.filter(item => item.innerHTML === "Start now!")[0].click()
  );
  // await page.screenshot({ path: "racer.png", fullPage: true });

  await browser.close();
}

function broadcast(data) {
  ws.getWss().clients.forEach(client => {
    client.send(data);
  });
}

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Hello! we listen on port:${port}`);
});
