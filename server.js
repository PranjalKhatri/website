if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const { MongoClient } = require("mongodb");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
/*

*/

// MongoDB connection URI
const uri = "mongodb://localhost:27017"; // Change this to your MongoDB URI

// Database name
const dbName = "HackathonDB";
// const db_Name_Dates_Hazarika = "DatesDB_Hazarika";
// Create a MongoClient instance
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the database
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    // Get a reference to the database
    const db = client.db(dbName);

    // You can now perform CRUD operations on the database
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Function to save a user to the users collection
async function saveUser(db, user) {
  // Get a reference to the users collection
  const usersCollection = db.collection("users");

  // Insert the user document into the collection
  const result = await usersCollection.insertOne(user);

  console.log(`User saved with ID: ${result.insertedId}`);
}
async function saveDate(db, date, veneue) {
  // Get a reference to the users collection
  const usersCollection = db.collection("DatesDB_" + veneue);
  console.log("Saved in DatesDB_" + veneue);
  // Insert the user document into the collection
  const result = await usersCollection.insertOne(date);

  console.log(`date saved with ID: ${result.insertedId}`);
}
// Function to load users from the `users` collection
async function loadUsers(db) {
  // Get a reference to the `users` collection
  const usersCollection = db.collection("users");

  // Query the `users` collection to retrieve all user documents
  const users = await usersCollection.find({}).toArray();

  // Print the users (you can do other processing as needed)
  console.log("Users:", users);

  // Return the users
  return users;
}

// Function to load dates from the `dates` collection
async function loadDates(db, veneue) {
  // Get a reference to the `dates` collection
  const datesCollection = db.collection("DatesDB_" + veneue);
  // Query the `dates` collection to retrieve all date documents
  const dates = await datesCollection.find({}).toArray();
  // Print the dates (you can do other processing as needed)
  console.log("Dates:", dates);
  // Return the dates
  return dates;
}
/*
 */
let users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});
app.get("/HomePage", (req, res) => {
  res.render("HomePage.ejs");
});
/**/
let dates = [];
app.get("/bhupenHazarika", (req, res) => {
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadDates(db, "Hazarika")
        .then((dates_arr) => {
          dates = dates_arr;
          // Here you can handle the users data
          console.log("Retrieved dates data:", dates);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log("pleasee", dates);
  setTimeout(() => {
    res.render("Hazarika.ejs", { array: dates });
  }, 2000);
  // res.render("Hazarika.ejs", { array: dates });
});
app.get("/openTheatre", (req, res) => {
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadDates(db, "OpenTheatre")
        .then((dates_arr) => {
          dates = dates_arr;
          // Here you can handle the users data
          console.log("Retrieved dates data:", dates);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log("pleasee", dates);
  res.render("OpenTheatre.ejs", { array: dates });
});
app.get("/bookings", checkAuthenticated, async (req, res) => {
  names = [
    "OpenTheatre",
    "Hazarika",
    "conferenceCentre",
    "miniAudi",
    "yogaRoom",
  ];
  let dates = [];
  for (let i = 0; i < names.length; i++) {
    n = names[i];
    // const datesArr = await loadDates(db, name);
    // dates.push(...datesArr);
    client
      .connect()
      .then(async () => {
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        // Load users from the database
        await loadDates(db, n)
          .then((dates_arr) => {
            dates.push(...dates_arr);
            // Here you can handle the users data
            console.log("Retrieved dates data:", dates);
          })
          .catch((error) => {
            console.error("Error loading users:", error);
          });
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  }
  setTimeout(() => {
    console.log("Waited for a few seconds");
    console.log("datesssss", dates);
    res.render("bookings.ejs", { array: dates });
  }, 2000);
  // console.log("datesssss", dates);
  // res.render("bookings.ejs", { array: dates });
});
app.get("/yogaRoom", (req, res) => {
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadDates(db, "yogaRoom")
        .then((dates_arr) => {
          dates = dates_arr;
          // Here you can handle the users data
          console.log("Retrieved dates data:", dates);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log("pleasee", dates);
  setTimeout(() => {
    res.render("YogaRoom.ejs", { array: dates });
  }, 1000);
  // res.render("YogaRoom.ejs", { array: dates });
});
app.get("/MiniAudi", (req, res) => {
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadDates(db, "miniAudi")
        .then((dates_arr) => {
          dates = dates_arr;
          // Here you can handle the users data
          console.log("Retrieved dates data:", dates);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log("pleasee", dates);
  setTimeout(() => {
    res.render("MiniAudi.ejs", { array: dates });
  }, 2000);
  // res.render("MiniAudi.ejs", { array: dates });
});
app.get("/ConferenceCentre", (req, res) => {
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadDates(db, "conferenceCentre")
        .then((dates_arr) => {
          dates = dates_arr;
          // Here you can handle the users data
          console.log("Retrieved dates data:", dates);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log("pleasee", dates);
  setTimeout(() => {
    res.render("ConferenceCentre.ejs", { array: dates });
  }, 2000);
});
/**/
app.get("/login", checkNotAuthenticated, (req, res) => {
  // / Example usage
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadUsers(db)
        .then((users_arr) => {
          users = users_arr;
          // Here you can handle the users data
          console.log("Retrieved users data:", users);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  res.render("login.ejs");
});
app.get("/announcements", (req, res) => {
  names = [
    "OpenTheatre",
    "Hazarika",
    "conferenceCentre",
    "miniAudi",
    "yogaRoom",
  ];
  // let nd = {};
  let data_ = [];
  for (let i = 0; i < names.length; i++) {
    n = names[i];
    // const datesArr = await loadDates(db, name);
    // dates.push(...datesArr);
    client
      .connect()
      .then(async () => {
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        // Load users from the database
        await loadDates(db, n)
          .then((dates_arr) => {
            // data_.push(...dates_arr);
            
            data_.push({
              key:   names[i],
              value: dates_arr
          });
            // Here you can handle the users data
            console.log("Retrieved dates data:");
          })
          .catch((error) => {
            console.error("Error loading users:", error);
          });
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  }
  setTimeout(() => {
    console.log("Waited for a few seconds");
    console.log("DATA nd", data_);
    // res.render("bookings.ejs", { array: dates });
    res.render("announcements.ejs", { array: data_ });
  }, 2000);
});
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  // / Example usage
  client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      const db = client.db(dbName);

      // Load users from the database
      loadUsers(db)
        .then((users_arr) => {
          users = users_arr;
          // Here you can handle the users data
          console.log("Retrieved users data:", users);
        })
        .catch((error) => {
          console.error("Error loading users:", error);
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    client
      .connect()
      .then(() => {
        console.log("Connected to MongoDB");
        const db = client.db(dbName);

        // Save the user to the database
        saveUser(db, users[users.length - 1]);
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});
app.post("/bookings", async (req, res) => {
  let n_date = [];
  let ven;
  try {
    ven = req.body.venue;
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    n_date.push({
      id: Date.now().toString(),
      // email: req.body.email,
      // password: hashedPassword,
      dateTime: req.body.startDateTime,
    });
    n_date.push({
      id: Date.now().toString(),
      // email: req.body.email,
      // password: hashedPassword,
      dateTime: req.body.endDateTime,
    });
    console.log("asfafas");
    console.log(n_date);
    client
      .connect()
      .then(() => {
        console.log("Connected to MongoDB");
        const db = client.db(dbName);

        // Save the user to the database
        saveDate(db, n_date[0], ven);
        saveDate(db, n_date[1], ven);
        //  saveUser(db, users[users.length - 1]);
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkbookings(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/bookings");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);
