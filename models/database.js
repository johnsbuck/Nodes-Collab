var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

var client = new pg.Client(connectionString);
client.connect();

var user = 'CREATE TABLE users (username VARCHAR(40) PRIMARY KEY, ' +
                                'pass VARCHAR(128) NOT NULL, salt VARCHAR(32) NOT NULL,' +
                                'email VARCHAR(40) UNIQUE NOT NULL, ' + 
                                'first_name VARCHAR(40) NOT NULL, last_name VARCHAR(40) NOT NULL);';
var group;
var user_group_perm;
var post;
var comment;
var tag;

var query = client.query(user /*+ group + user_group_perm + post + comment + tag*/);

query.on('end', function() { client.end(); });
