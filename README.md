# AREA

<img src="./img_src/place_holder.png" height="150px" style=";margin: 1em 30vh 0;z-index: 1">

## **Table of contents**
- [AREA](#area)
  - [**Table of contents**](#table-of-contents)
  - [Description](#description)
    - [Developers](#developers)
    - [Benchmark](#benchmark)
  - [Requirements](#requirements)
  - [Launching the project](#launching-the-project)
  - [Working on the project](#working-on-the-project)

## Description
<p style="font-size:40px; color: cyan;font-weight:bold;">A<span style="color:white;font-weight:bold">ction</span></span><span style="color:gray;font-size:30px"> and</span> REA<span style="color:white">ction</span></p>

The aim of this project is to create a software platform that function like a IFTTT (IF This Then That):
- The user can define an event, which will trigger the execution of one or more actions.
- The user can specify conditions for each action.
- If all conditions are met, then execute the corresponding action(s).
- A set of rules that can be used for automation. The system will have the ability to trigger actions based on certain conditions and events.

### Developers
- Benjamin Cottone&nbsp;&nbsp;(benjamin.cottone@epitech.eu)
- Corentin Levet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(corentin.levet@epitech.eu)
- Hugo Grisel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(hugo.grisel@epitech.eu)
- Nathan Tranchant&nbsp;&nbsp;(nathan.tranchant@epitech.eu)
- Noah Cherel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(noah.cherel@epitech.eu)


### Benchmark
- <p style="color:red;font-weight:bolder"> MERN (MongoDB | Express | React | NodeJs)
- MEAN (MongoDB | Express | AngularJS | NodeJS)
- RUBY (Ruby on rails full stack)


## Requirements
For this project you will need at least on your computer:

> Using the provided Docker installation
- [Docker](https://docs.docker.com/engine/install/)
- [Docker compose](https://docs.docker.com/compose/install/)

## Launching the project

> Using Docker compose

First, build the containers using:
```bash
docker compose build
```

Once the containers are built, you can run the project by using:

```bash
docker compose up -d
```

Now you should be able to access the web application on [localhost:8081](http://localhost:8081) !

### Working on the project
If you want to work on the project and add new features.
<br>
Here are a few link to help you figure out :
- ### [Add a reaction](./docs/Add_a_reaction.md)
- ### [Add a service](./docs/Add_a_service.md)
- ### [Add an action](./docs/Add_an_action.md)
