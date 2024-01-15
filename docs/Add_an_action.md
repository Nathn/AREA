# Adding an Action to the AREA Project

### [Return to the README](../README.md)
---



## Overview

This guide outlines the steps to add a new action to a [service](./Add%20a%20service.md) in the AREA project. Follow these instructions to seamlessly integrate your new action into the existing ecosystem.

> This guide assumes that you already have a working project, a properly configured service and at least one working [reaction](./Add%20a%20reaction.md) to test your action with.

## Prerequisites

Make sure you have the following prerequisites ready before proceeding:

- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or another MongoDB edition software installed with access to the AREA database,
- Two valid `.env` files in the [/server](/../server/.env) and [/web](/../web/.env) folder, based on the contents of both `.env.example` files,
- Docker services `area-server` and `area-client-web` running without errors (check [localhost:8081]([http://localhost:8081]) to be sure).

> [!IMPORTANT]
> The following guide intended use is to configure the **first action** of a service. If the service you're working on already has a working action, you can skip the first step. But it's still recommended to read it to understand the **baseValues** concept.

## Step 1: The baseValues route

Supposing you just created a fresh new service, you should have, in the `/server/src/routes/services` directory, a folder named as per the name of your service. The folder should contain:

- an entrypoint `index.js` file,
- a `callback.js` file.

Create two new files at the same place, called `baseValues.js` and `actions.js`. Connect them to the routing system by adding these lines to `index.js`:

```js
const baseValues = require("./baseValues");
const actions = require("./actions");

router.use("/", baseValues);
router.use("/action", actions);
```

Let's start with `baseValues.js` as it is the route that's gonna be called first. Here is the draft to paste in it:

```js
const express = require("express");
const router = express.Router();

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }
    let baseValues = {};

    /*
      Build the baseValues
      object here
    */

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
```

You're gonna have to use the credentials stored in the `user` object to retrieve useful pieces of information about the user's account on the service.
Then, assemble them to form a custom `baseValues` object that will be sent.<br />
For example, an email service baseValues format could be:

```json
{
  "receivedMails": [],
  "sentMails": []
}
```

Both of the fields could then be used by actions to check if they change or not over time.

> [!NOTE]
> If the user stored credentials (passwords, tokens, etc.) are invalid, expired or simply absent, log the error and return a 400 HTTP status. The code to regenerate them in case of expiration is not supposed to be here.

## Step 2: The actual action

Head now to the `actions.js` file you just created and paste this draft in it:

```js
const express = require("express");
const router = express.Router();

router.post("/actionName", async (req, res) => {
  // Replace with your action name
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.relevant_property; // Replace relevant_property with the baseValues property your action will be using
  if (!user || !usefulBaseValues) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let result = false;
    let newBaseValues = {};

    /*
      Check here if the
      action should be fired
    */

    res.status(200).send({
      result: result,
      newBaseValues: newBaseValues,
      baseValuesId: "relevant_property",
      reactionNeededBaseValues: "relevant_property" // Optional
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
```

Replace `actionName` with the name of your action (ideally in the `nameVerb` format) and replace both occurences of `relevant_property` with baseValues property you're gonna work with.<br />
The `newBaseValues` returned variable has to be set to the new value of your selected relevant_property.<br />
For example, in the case of a `mailReceived` action for an email service, we could have:

```js
const usefulBaseValues = baseValues?.receivedMails;

// Get the received mails from the service API
let receivedMails = getReceivedMails();

// Compare mails by ID to check if there are new ones
let newMails = receivedMails.filter((mail) => {
  return !usefulBaseValues.some((baseMail) => baseMail.id === mail.id);
});

res.status(200).send({
  result: newMails.length > 0, // true if newMails is not empty
  newBaseValues: receivedMails,
  baseValuesId: "receivedMails",
});
```

The returned `result` variable set to true means the action is gonna be fired.
Both `newBaseValues` and `baseValuesId` ensure the service baseValues is always up to date and prevents an action to be fired multiple times.

## Step 3: Deploying with the database

All we have left to do is to make the project aknowlegde the existence of your new action, to make it automatically available in the [New action/reaction](http://localhost:8081/new) page of the frontend.<br />
Open **MongoDB Compass** and connect to the AREA database with your provided credentials. Don't forget to select the `/area` database by selecting it on the left bar once connected.<br />
Select the `services` collection and find your service's object. Click the **Edit document** button icon. If the `actions` field doesn't exist yet, create it by clicking the little **+** button on the left. Select **Array** as the field's type. Add an item to `actions` (**+** button -> **Add item to actions**) and populate it like that:

```json
{
  "name_long": "Received an email",
  "name_short": "mailReceived",
  "description": "The user receives a new e-mail on its Mail account"
}
```

Replace the values with your custom ones, and _voilà_ !<br />
Go check the [frontend](http://localhost:8081/), connect your account with the service if it's not already done then check that the new action successfully appears within the available actions list.

Test it by linking it with a reaction of your choice. <br />
If you encouters problems, check for errors by opening the **Network** tab of the devlopers tools panel of your browser, or the server's logs with the bash `docker logs -f area-server` command.

---
<br>

### [Return to the README](../README.md)
