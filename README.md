## Frameworks&Libraries

Frameworks Vs. Libraries
![alt text](https://i.stack.imgur.com/ZbR5p.png)

## Hapi.js framework

``hapi`` is a simple to use configuration-centric framework with built-in support for input validation, caching, authentication, and other essential facilities for building web and services applications. hapi enables developers to focus on writing reusable application logic in a highly modular and prescriptive approach.

## Handlebar.js

``handlebar``
is a popular templating engine that is powerful, simple to use and has a large community. With Handlebars, you can separate the generation of HTML from the rest of your JavaScript and write cleaner code.

### Routing

![alt text](http://imgh.us/Scan-Mar-13-10-13.jpg)

### VISION

Manage view engines that can be used to render template responses

$ npm install vision --save

Specify the engine template of the view method.

$ npm install handlebars --save

We implement vision

```js
 server.register(require('vision'),function(err){

 //write the routes here

   });
   ```

### How to serve static content:

 ```js
 server.register(require('vision'),function(err){

 server.route({
   method:'GET',
   path:'img.png',
   handler:function(req,res){
     res.file('[img path]')

   }

   });

   });```
