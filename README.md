[![Build Status](https://travis-ci.org/niktekusho/open-dictionary.svg?branch=master)](https://travis-ci.org/niktekusho/open-dictionary)
[![Build status](https://ci.appveyor.com/api/projects/status/q52howibupnrp386/branch/master?svg=true)](https://ci.appveyor.com/project/niktekusho/open-dictionary/branch/master)

# Open Dictionary

Open Dictionary consists of a set of services that you use to serve dictionary entries in an open source manner.
This project is heavily inspired by PokeAPI. PokeAPI is a service that provides a handful of data regarding Pokémon games. You can read more at their [official website](https://pokeapi.co).

# Installation

First off, clone the repository and navigate inside the newly created folder:

```sh
git clone https://github.com/niktekusho/open-dictionary
cd open-dictionary
```

Then, if you use yarn, just run it:
```sh
yarn
```

otherwise (using npm):

```sh
npm install
```

# Testing

This project uses jest as a development dependency (so you don't have to install it globally). As common practice for Node.js project, in order to test the code you just have to run the "test" script.

With yarn:

```sh
yarn test
```

or with npm:

```sh
npm test
```

# Static Analysis

Project's code style is managed using xo, a wrapper of eslint with sane defaults.
Linter is run before executing tests. However you can manually execute it using the "lint" script.

With yarn:

```sh
yarn lint
```

or with npm:

```sh
npm run lint
```

# Docker setup

## User service

The user service default repository connects to a mongodb server. Without touching the config file or setting custom environment variables, the local instance of the mongo that the service will try to connect to is at localhost:27000.
In a dev environment you can create a container using the following command:
```sh
docker run -p 27000:27017 --name users-db -d mongo:4.0.0
```

Here's a brief explanation of the command above:
-  `-p 27000:27017`: the Docker Engine will map the port used by the default mongodb configuration (`27017`) to the local machine network at port `27000`. With this flag the mongodb instance will be available for tools using the address `mongodb://localhost:27000`.
-  `--name users-db`: the Docker Engine will create the container with the name "users-db" (so random generated names won't be used). This flag allow us to start the container when we will need it using the command: `docker start users-db`.
-  `-d`: the Docker Engine will create the container and start it in the background.
-  `mongodb:4.0.0`: the image we will use is the mongodb one tagged with a specific version (`4.0.0`).

In order to connect to the created db using mongo cli you can use the following command:

```sh
docker run -it --link users-db:mongo --rm mongo:4.0.0 mongo --host mongo users
```

