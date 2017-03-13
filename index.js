const hapi = require('hapi');
const vision = require('vision');
const inert = require('inert');
const handlebars = require('handlebars');
const Path = require('path');
const pg = require('pg');
const server = new hapi.Server();
const config = {
    user: 'postgres',
    password: '482106',
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

server.register(vision, (err) => {
    if (err) {
        throw err
    }
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            selectdata(client, query, function(err, result) {
                reply(result.rows)
            })
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
