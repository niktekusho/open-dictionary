[![Build Status](https://travis-ci.org/niktekusho/open-dictionary.svg?branch=master)](https://travis-ci.org/niktekusho/open-dictionary)

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
