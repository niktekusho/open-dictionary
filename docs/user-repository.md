# User Repository

According to Martin Fowler's [definition](https://www.martinfowler.com/eaaCatalog/repository.html), a repository is a collection interface used to access objects in a data container.
The user repository aggregates user entities and provides both a generic interface to operate on them and some quick helper functions.
As of `ISO 2018-08-13`, the user data store is a MongoDB collection, therefore the following function specs will use specific implementation details based on the MongoDB client API.

## Initialization

The user repository module exports a function with which you can create the user repository object.
The exported function requires the following objects:
-  the MongoDB driver client as exported by the `mongodb` npm package;
-  an object containing the mongo connection settings (`host`, `port`, `database`);
-  an optional logger instance (used throughout the module and in the exported object).

### Steps

TODO: insert flowchart here

During the initialization phase, the module will try to connect to the specified MongoDB instance using the default reconnection parameters.
TODO: handle manual reconnection (when `connect` function fails...)


## Functions

### find(query?: object)

The query argument is an optional MongoDB query (as of `ISO 2018-08-13`).
If the query argument is `undefined` or `null`, all users from the `users` collection will be fetched, otherwise the query will be used **directly** by the MongoDB Node client to query the aformentioned collection.

Normally, the generic `find` function returns an array which may be empty, may contain a single result (document) or multiple results.
This function will "unbox" the array in the following cases:
-  if the find result array is empty, **null** will be returned;
-  if the find result array contains a single entity, that single entity will be returned, thus an **object** will be returned (and not an array).

### insert(user: User|User[])

If the user is `undefined` or `null`, the function's default behaviour is to ignore the method invocation **without throwing errors**.

Then this function will try to insert the argument in the database; please note that this function **will not check nor verify** the input passed in.
As stated in the steps section, the collection will validate each document (user) insert/update.

The repository must use the `insertOne` and `insertMany` collection methods according to the argument passed in (single user object -> `insertOne`, user array -> `insertMany`).
The reason behind this implementation detail is that the *generic* insert method is deprecated in most if not all MongoDB driver implementations.
In this case please take a look at the [Node.js native driver page](http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insert).

### update(username: string, user: User)

If either one of the arguments is `undefined` or `null` the function's default behaviour is to **throw an error regarding which argument is missing**.
Then the repository will try to update the document corresponding to the username specified with the new user entity.
If the username is not found the function will **throw an error indicating that a user with the specified username is not present in the system**.
If the username is found, the `updateOne` will take care of the database update. Please note that this function **will not check nor verify** the input passed in.
As stated in the steps section, the collection will validate each document (user) insert/update.

### delete(username: string)

If the username argument is `undefined` or `null`, the function's default behaviour is to ignore the method invocation **without throwing errors**.

Then the repository will try to delete the document corresponding to the specified username.
Please note that this function **will not check nor verify**:
-  the existance of the username specified, (and)
-  the authorizations required to perform the operation.
