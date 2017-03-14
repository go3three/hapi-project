
 # Templating with Helper Functions

 ---
 ![alt text]( https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAU3AAAAJDgxYjAwNDZmLTZjNzEtNDAzYi1hY2QzLWZjMDdiMzUwNDYzZA.jpg)

  ### What are helper functions ?

  ###### functions used in templates to manipulate data
 ---
  ### How they can be implemeted in handlebars ?

  ##### To get started with views, first we have to configure at least one templating engine on the server. This is done by using the server.views method:

    ```
    'use strict';

    const Path = require('path');
    const Hapi = require('hapi');
    const Hoek = require('hoek');

    const server = new Hapi.Server();

    server.register(require('vision'), (err) => {

        Hoek.assert(!err, err);

        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: 'templates'
        });
    });
    ```
