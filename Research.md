
# Data ``Validation``


### What is Data Validating
Imagine you run < your application > and you want visitors to sign up on the website with real names and not something like ``l337_p@nda`` in the first name field.

How would you define ``the limitations of what can be inputted and validate it against the validation rules set?``

### Validation procedure
>The data validation Procedure was designed to improve the quality of data by finding inconsistencies in the data.

For example:

The user's ``birth date`` **can't be** later than the ``date of the operation``.

### Validation rules

A Validation rule is a criterion or constraint used in the process of data validation, carried out after the data has been encoded onto an input medium and involves a data validation program.

In other words ``validation rules`` are the rules to ensure the internal data integrity.

#### Input
The first type of validation hapi can perform is input validation. This is defined in the **config** object on a route and is able to validate

``headers, path parameters, query parameters, and payload data.``

For example:

```js
validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(200).required()
      ```
Another example

```js
const Joi = require('joi');

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  access_token: [Joi.string(), Joi.number()],
  birthyear: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email()
}).with('username', 'birthyear').without('password', 'access_token');

// Return result.
const result = Joi.validate({ username: 'abc', birthyear: 1994 }, schema);
// result.error === null -> valid

// You can also pass a callback which will be called synchronously with the validation result.
Joi.validate({ username: 'abc', birthyear: 1994 }, schema, function (err, value) { });  // err === null -> valid
```
The above schema defines the following constraints:

  username
      a required string
      must contain only alphanumeric characters
      at least 3 characters long but no more than 30
      must be accompanied by birthyear

  password
      an optional string
      must satisfy the custom regex
      cannot appear together with access_token

  access_token
      an optional, unconstrained string or number

  birthyear
      an integer between 1900 and 2013

  email
      a valid email address string

![alt text](http://2.bp.blogspot.com/-Hria_6je0T8/T-Af6KarNwI/AAAAAAAAADc/y-33Wb9BH7A/s1600/sample-registration-form-validation.gif)

-----

# **Authentication**

![alt text](https://achievement-images.teamtreehouse.com/badges_Ruby_UserAuthentication_Stage1.png)


#### What are authentication and password encryption ?

#### Authentication :       

is a process in which the credentials provided are compared to those on file in a database of authorized users' information on a local operating system or within an authentication server. If the credentials match, the process is completed and the user is granted authorization for access .

#### Password encryption :

is the conversion of password into another form, called ciphertext, which cannot be easily understood by anyone except authorized parties.

#### How we can be implement both in hapi?

![alt text](https://hapijs.com/public/img/logo.svg)

Authentication within hapi is based on the concept of schemes and strategies.Think of a scheme as a general type of auth, like "basic" or "digest". A strategy on the other hand, is a pre-configured and named instance of a scheme.

#### First, let's take a look at an example of how to use hapi-auth-basic:


```js
'use strict';

const Bcrypt = require('bcrypt');
const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const users = {
  john: {
      username: 'john',
      password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
      name: 'John Doe',
      id: '2133d32a'
  }
};

const validate = function (request, username, password, callback) {
  const user = users[username];
  if (!user) {
      return callback(null, false);
  }

  Bcrypt.compare(password, user.password, (err, isValid) => {
      callback(err, isValid, { id: user.id, name: user.name });
  });
};

server.register(Basic, (err) => {

  if (err) {
      throw err;
    }

  server.auth.strategy('simple', 'basic', { validateFunc: validate });
  server.route({
      method: 'GET',
      path: '/',
      config: {
          auth: 'simple',
          handler: function (request, reply) {
              reply('hello, ' + request.auth.credentials.name);
          }
      }
  });

  server.start((err) => {

      if (err) {
          throw err;
      }

      console.log('server running at: ' + server.info.uri);
  });
});
```
----

#### First, we define our users database,

which is a simple object in this example.

#### Then we define a validation function,

which is a feature specific to hapi-auth-basic and allows us to verify that the user has provided valid credentials.

#### Next, we register the plugin,

which creates a scheme with the name of basic. This is done within the plugin via server.auth.scheme().

#### Once the plugin has been registered,

we use `server.auth.strategy()` to create a strategy with the name of ``simple`` that refers to our scheme named basic.

We also pass an options object that gets passed to the scheme and allows us to configure its behavior.

#### The last thing we do is

tell a route to use the strategy named simple for authentication.

----

# **Templating with Helper Functions**

---
![alt text]( https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAU3AAAAJDgxYjAwNDZmLTZjNzEtNDAzYi1hY2QzLWZjMDdiMzUwNDYzZA.jpg)

### What are helper functions ?


Basically, functions used in templates to manipulate data.

### How they can be implemented in handlebars?

A Handlebars helper call is a simple identifier, followed by zero or more parameters (separated by space). Each parameter is a ```Handlebars expression```.

### What is Handlebars expression?

>Handlebars expressions are the basic unit of a Handlebars template. You can use them alone in a ** {{mustache}} **, pass them to a Handlebars helper or use them as values in hash arguments.

#### There are 2 kinds of helpers,

a function helper and a block helper.

The difference is that one is meant for a single expression and the other uses a block expression (a mechanism for invoking a helper with a block of the template).

** Custom Function Helpers **

To create one, we have to register it using the registerHelper() method. Inside your script, add this bit of code at the very top.

```
//Create a custom function helper to check the status.
Handlebars.registerHelper( "checkStatus", function ( status ){
    if (status == "leaving" )
    {
        return 'leave';
    }
    else
    {
        return 'stay';
    }
});```

>The first parameter is the name of the expression the user must type in order to use this function helper.

>The second parameter is the function that will execute when the user uses this function helper.
