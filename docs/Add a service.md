# Adding a Service to the AREA Project

## Overview

This guide outlines the steps to add a new service to the AREA project. Follow these instructions to seamlessly integrate your service into the existing ecosystem.

> [!WARNING]
> This guide may not be entirely accurate for some special cases, like services that depends on others APIs (like YouTube depends on Google API). Discuss with other contributors before following it.

## Prerequisites

Make sure you have the following prerequisites ready before proceeding:

- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or another MongoDB edition software installed with access to the AREA database,
- Two valid `.env` files in the [/server](/../server/.env) and [/web](/../web/.env) folder, based on the contents of both `.env.example` files,
- Docker services `area-server` and `area-client-web` running without errors (check [localhost:8081]([http://localhost:8081]) to be sure).

## Step 1: The service-side part

All services require a different proccess about registering a new application. In some cases, you will have to wait for a manual approval to proceed. In the case where authorized [absolute domain names](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) or complete URLs have to be added, add all of these, just to be sure:

- `http://localhost:8080`
- `http://localhost:8080/services/[name_short]/callback`
- `http://localhost:8081`
- `http://localhost:8081/new`

> [!IMPORTANT]
> Replace `[name_short]` with a short name of the service you're adding (ex.: for Google Drive, use only `drive`). It will be used as an ID throughout this guide, always with the denomination `name_short`.

When the service is ready do give you an access to their [API](https://en.wikipedia.org/wiki/API), it will probably provides you some sort of token(s) or credentials. Store them in your local [`/server/.env`](../server/.env) file and don't forget to update [`/server/.env.example`](../server/.env.example) accordingly.

## Step 2: Prepare the database

Head up to your MongoDB Compass software and connect to the AREA database with your provided credentials. Don't forget to select the `/area` database by selecting it on the left bar once connected.<br />
Select the `services` collection. By using the **Add data** button, create a new object that follows the model located in [`/server/src/models/Service.js`](../server/src/models/Service.js):

```json
{
  "name_long": "The complete name of the service (ex.: Google Drive)",
  "name_short": "The abbreviated name of the service, in lowercase letters (ex.: drive)",
  "route": "/services/[name_short]",
  "type": "[name_short]",
  "actions": [],
  "reactions": []
}
```

Speaking of models, you're going to have to update the User one located in [`/server/src/models/User.js`](../server/src/models/User.js) by adding a new field in the `auth` object:

```js
auth: {
  // The already present services are there
  service: {
    type: mongoose.Schema.Types.Mixed,
    trim: true,
  }
}
```

Replace `service` with the short lowercase name of your new service.

## Step 3: Backend and routing

Start your server configuration journey by opening the `/server/src/routes/services` folder. Here, create a new folder named with the `name_short` you've been using. Don't forget to edit [`/server/src/routes/services/index.js`](../server/src/routes/services/index.js) to make all our future routes working:

```js
const newservice = require("./newservice");

router.use("/newservice", newservice);
```

In our new folder, let's first create a file named `index.js` and paste this draft content in it:

```js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }
  let url = ``;

  /*
    Build the OAuth URL
    for the service here
  */

  url += `&state=${req.query.user_id}`; // Always keep this line at the end

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
```

In the same manner, create a `callback.js` file with this content:

```js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const User = require("@/models/User");

const initUserAuth = async (user) => {
  try {
    if (!user.auth) {
      user.auth = {
        newservice: {},
      };
    }
    await user.save();
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

router.get("/callback", async (req, res) => {
  const state = req.query.state;
  if (!state) {
    res.status(400).send("Bad request");
    return;
  }
  const user = await User.findOne({ _id: state });
  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  const {} = req.query; // To use in the case of URL parameters
  try {
    let accessTokens = {};

    /*
      Get the access tokens for
      the service here
    */

    if (!user.auth) await initUserAuth(user);
    user.auth.newservice = accessTokens;
    await user.save();
    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

module.exports = router;
```

Run a find-and-replace (Ctrl+F) operation on the file to replace occurences of `newservice` with the name_short of your service.<br /><br />
Now, in your new `index.js` file, add the code that generates the link to the OAuth screen of your service.
You will need to specify a callback URL. If it has to be in the code store it as an environnement variable called `[name_short]_CALLBACK_URL`. Set its value as `http://localhost:8080/services/[name_short]/callback`.<br />
In `callback.js` on the other hand, you will have find the code executed after this screen has been passed through.
You will have to add here the code that gets the access_token(s) or other types or credentials to save them in the user's object.

> [!TIP]
> Both of these operations can be very different from a service to another. Feel free to use [NPM modules](https://www.npmjs.com/) and to follow the examples found in the service's API documentation.

## Step 4: Front-end, testing

Close the `/server` folder and open `/web/src` instead.

Open [`/pages/New/index.jsx`](/web/src/pages/New/index.jsx).
There, you'll have to add the service to the React frontend: <br />


```jsx
// Import the icon of your service if needed at the top of the files

const [servicesData, setServicesData] = useState({
    deezer: { icon: faDeezer, display_name: "Deezer", service_name: "deezer", access: null },
    discord: { icon: faDiscord, display_name: "Discord", service_name: "discord", access: null },
    // Add your service with the same pattern
  });
```

You can now head to [localhost:8081/new](http://localhost:8081/new) (connected as a user) and try to click the button.<br />
After the OAuth screen is closed, the button should change color and the tokens should be stored in the user document in the database.<br />
If it didn't work, open the Network tab of the developer tools and look for a 400 status code.

Once everything is properly working, you can start adding [actions](./Add%20an%20action.md) and [reactions](./Add%20a%20reaction.md) !
