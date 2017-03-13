const hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
const handlebars = require('handlebars');
const Path = require('path');
const pg = require('pg');
const Bcrypt = require('bcrypt');
const Basic = require('hapi-auth-basic');
const Joi = require('joi');
const server = new hapi.Server();
const config = {
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: '5432',
    database: 'facebook'
};
const client = new pg.Client(config);

const selectdata = (client, query, cb) => {

    client.query(query, cb);
};
const query = `SELECT * FROM info ;`;

server.connection({
    host: 'localhost',
    port: '3000'
});
client.connect(err => {
    if (err) {
        throw err;
    }
});
const users = {
    john: {
        username: 'john',
        password: '$2a$10$R7U2Lwe7PUa3h101TvzZuujS6e.nXnT5xhfWH1W9Ct86IvXJz84KS', // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    },
    ahmed: {
        username: 'admin'
    }
};
const validate = function(request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }

    Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, {
            id: user.id,
            name: user.name
        });
    });
};
server.register(Basic, (err) => {

    if (err) {
        throw err;
    }

    server.auth.strategy('simple', 'basic', {
        validateFunc: validate
    });
    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: 'simple',
            handler: function(request, reply) {
                selectdata(client, query, function(err, result) {
                    reply(result.rows)
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{name}',
        handler: (request, reply) => {
            const name = encodeURIComponent(request.params.name);
            reply.view("users", {
                name: name
            });
        }
    });

});
server.route({
    method: 'POST',
    path: '/hello',
    config: {
        handler: (request, reply) => {
            reply.view("ghada");
        },
        validate: {
            payload: {
                fullname: Joi.string().alphanum().min(3).max(30).required(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
                email: Joi.string().email()
            }
        }
    }
});
server.route({
    method: 'GET',
    path: '/hello',
    handler: (request, reply) => {
        const name = encodeURIComponent(request.params.name);
        reply.view("hello");
    }
});
server.register(vision, (err) => {
    if (err) {
        throw err
    }

});
server.register(inert, (err) => {
    server.route({
        method: 'GET',
        path: '/google.png',
        handler: (request, reply) => {
            reply.file('google.png');
        }
    });


})
server.views({
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'

});

server.start((err) => {
    if (err) {
        throw err
    }
    console.log('Server is running at :' + server.info.uri);
});
