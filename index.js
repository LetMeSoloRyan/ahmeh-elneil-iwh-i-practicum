const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

app.get("/", async (req, res) => {
  const contactsUrl =
    "https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(contactsUrl, { headers });
    const data = resp.data.results;
    res.render("homepage", {
      title: "Contacts | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(
      "Error fetching contacts:",
      error.response ? error.response.data : error.message
    );
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const newContact = {
    properties: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    },
  };

  const createContactUrl = "https://api.hubapi.com/crm/v3/objects/contacts";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createContactUrl, newContact, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(
      "Error creating contact:",
      err.response ? err.response.data : err.message
    );
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
