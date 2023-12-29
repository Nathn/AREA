# Adding an Action to the AREA Project

## Overview

This guide outlines the steps to add a new action to a [service](./Add%20a%20service.md) in the AREA project. Follow these instructions to seamlessly integrate your new action into the existing ecosystem.
> This guide assumes that you already have a working project and a properly configured service.

## Prerequisites

Make sure you have the following prerequisites ready before proceeding:

- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or another MongoDB edition software installed with access to the AREA database,
- Two valid `.env` files in the [/server](/../server/.env) and [/web](/../web/.env) folder, based on the contents of both `.env.example` files,
- Docker services `area-server` and `area-client-web` running without errors (check [localhost:8081]([http://localhost:8081]) to be sure).

> [!IMPORTANT]
> The following guide intended use is to configure the __first action__ of a service. If the service you're working on already has a working action, you can skip the first step. But it's still recommended to read it to understand the **baseValues** concept.

## Step 1: The baseValues route

## Step 2: The actual action

## Step 3: Deploying with the database
