 #**Authentication**

![alt text](https://achievement-images.teamtreehouse.com/badges_Ruby_UserAuthentication_Stage1.png)
___

 ### What are authentication and password encryption ?
 ___

 #### Authentication :       
 ###### is a process in which the credentials provided are compared to those on file in a database of authorized users' information on a local operating system or within an authentication server. If the credentials match, the process is completed and the user is granted authorization for access .
 ___
 #### Password encryption :
 ###### is the conversion of password into another form, called ciphertext, which cannot be easily understood by anyone except authorized parties.

 ### How they can be implemented in hapi ?

![alt text](https://hapijs.com/public/img/logo.svg)

 ###### Authentication within hapi is based on the concept of schemes and strategies.Think of a scheme as a general type of auth, like "basic" or "digest". A strategy on the other hand, is a pre-configured and named instance of a scheme.

 #### First, let's look at an example of how to use hapi-auth-basic:

 ```
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

  ###### First, we define our users database, which is a simple object in this example. Then we define a validation function, which is a feature specific to hapi-auth-basic and allows us to verify that the user has provided valid credentials.
  Next, we register the plugin, which creates a scheme with the name of basic. This is done within the plugin via server.auth.scheme().
  Once the plugin has been registered, we use server.auth.strategy() to create a strategy with the name of simple that refers to our scheme named basic. We also pass an options object that gets passed to the scheme and allows us to configure its behavior.
  The last thing we do is tell a route to use the strategy named simple for authentication.
