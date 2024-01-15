# Adding a Reaction to the AREA Project

### [Return to the README](../README.md)
---



## Overview

This guide outlines the steps to add a new reaction to a [service](./Add%20a%20service.md) in the AREA project. Follow these instructions to seamlessly integrate your new reaction into the existing ecosystem.

> This guide assumes that you already have a working project, a properly configured service and at least one working [action](./Add%20an%20action.md) to test your reaction with.

## Prerequisites

Make sure you have the following prerequisites ready before proceeding:

- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or another MongoDB edition software installed with access to the AREA database,
- Two valid `.env` files in the [/server](/../server/.env) and [/web](/../web/.env) folder, based on the contents of both `.env.example` files,
- Docker services `area-server` and `area-client-web` running without errors (check [localhost:8081]([http://localhost:8081]) to be sure).

## Step 1: Server part

Building a first reaction for a service is much easier than building the first action. this is mostly due to a reaction having no side effects whatever happens.<br />
You should have, in the `/server/src/routes/services` directory, a folder named as per the name of your service. Open it.<br />
If the folder does not contain the file `reactions.js`, create it and add the following contents to it:

```js
const express = require("express");
const router = express.Router();

router.post("/reactionName", async (req, res) => {
  // Replace reactionName with your reaction name
  const { user, baseValues } = req.body; // baseValues is optional and can be null
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    /*
      Use the credentials stored
      in the user object to
      execute the reaction here
    */

    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
```

Replace `reactionName` with the name of your reaction (ideally in the `verbName` format).

Connect the newly created route by editing the `index.js` files located in the same folder:

```js
const reactions = require("./reactions");

router.use("/reaction", reactions);
```

Now edit `reactions.js` to add the code necessary to execute the reaction. Be careful to not edit the user object during the reaction, as this could cause an infinite loop of actions/reactions.

> [!NOTE]
> If the user stored credentials (passwords, tokens, etc.) are invalid, expired or simply absent, log the error and return a 400 HTTP status. The code to regenerate them in case of expiration is not supposed to be here.

## Step 2: Deploying with the database

All we have left to do is to make the project aknowlegde the existence of your new reaction, to make it automatically available in the [New action/reaction](http://localhost:8081/new) page of the frontend.<br />
Open **MongoDB Compass** and connect to the AREA database with your provided credentials. Don't forget to select the `/area` database by selecting it on the left bar once connected.<br />
Select the `services` collection and find your service's object. Click the **Edit document** button icon. If the `reactions` field doesn't exist yet, create it by clicking the little **+** button on the left. Select **Array** as the field's type. Add an item to `reactions` (**+** button -> **Add item to reactions**) and populate it like that:

```json
{
  "name_long": "Send an email",
  "name_short": "sendEmail",
  "description": "Send a new email to the Gmail inbox of the user"
}
```

Replace the values with your custom ones, and _voilà_ !<br />

> [!IMPORTANT]
> For the reaction to work, ensure that its `name_short` field matches up with the route name you've given in the server code.

Go check the [frontend](http://localhost:8081/), connect your account with the service if it's not already done then check that the new reaction successfully appears within the available reactions list.

Test it by linking it with an action of your choice. <br />
If you encouters problems, check for errors by opening the **Network** tab of the devlopers tools panel of your browser, or the server's logs with the bash `docker logs -f area-server` command.

---
<br>

### [Return to the README](../README.md)
