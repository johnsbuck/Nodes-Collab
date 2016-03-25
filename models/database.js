var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

var client = new pg.Client(connectionString);
client.connect();

var user = 'CREATE TABLE users (username VARCHAR(40) PRIMARY KEY, ' +
                                'pass VARCHAR(128) NOT NULL, salt VARCHAR(32) NOT NULL,' +
                                'email VARCHAR(40) UNIQUE NOT NULL, ' +
                                'first_name VARCHAR(40) NOT NULL, last_name VARCHAR(40) NOT NULL' +
                                'gender INTEGER NOT NULL, birthdate DATE NOT NULL);';
var group = 'CREATE TABLE groups (groupname VARCHAR(40) PRIMARY KEY, ' +
                                  'dirpath VARCHAR(40) NOT NULL, ' +
                                  'privacy INTEGER NOT NULL);';
var user_group_perm = 'CREATE TABLE user_group_perms (username VARCHAR(40) REFERENCES users (username), ' +
                                    'groupname VARCHAR(40) REFERENCES groups (groupname), ' +
                                    'permissions INTEGER NOT NULL, ' +
                                    'PRIMARY KEY(username, groupname));';
var basic_post = 'CREATE TABLE posts (id SERIAL PRIMARY KEY, ' +
                                'username VARCHAR(40) REFERENCES users (username), ' +
                                'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                                'title VARCHAR(64) NOT NULL UNIQUE, ' +
                                'text VARCHAR(255) NOT NULL, ' +
                                'type INTEGER NOT NULL);';
var comment = 'CREATE TABLE comments (id SERIAL PRIMARY KEY, ' +
                                    'username VARCHAR(40) REFERENCES users (username), ' +
                                    'post_id INTEGER REFERENCES posts (id), ' +
                                    'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                                    'type INTEGER NOT NULL);';
var tag = 'CREATE TABLE tags (post_id INTEGER PRIMARY KEY REFERENCES posts (id), ' +
                              'tag VARCHAR(40));';
var group_post = 'CREATE TABLE group_posts (id SERIAL PRIMARY KEY, ' +
                                'groupname VARCHAR(40) NOT NULL REFERENCES groups (groupname), ' +
                                'username VARCHAR(40) NOT NULL REFERENCES users (username), ' +
                                'text VARCHAR(255) NOT NULL, ' +
                                'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);';

var query = client.query(user + group + user_group_perm + basic_post + group_post + comment + tag);

query.on('end', function() { client.end(); });
