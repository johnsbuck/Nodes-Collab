var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

var client = new pg.Client(connectionString);
client.connect();

var user = 'CREATE TABLE users (username VARCHAR(40) PRIMARY KEY, ' +
                                'pass VARCHAR(128) NOT NULL, salt VARCHAR(32) NOT NULL,' +
                                'email VARCHAR(40) UNIQUE NOT NULL, ' +
                                'first_name VARCHAR(40) NOT NULL, last_name VARCHAR(40) NOT NULL, ' +
                                'gender VARCHAR(40) NOT NULL);';

var group = 'CREATE TABLE groups (groupname VARCHAR(40) PRIMARY KEY, ' +
                                  'privacy INTEGER NOT NULL);';

var user_group_perm = 'CREATE TABLE user_group_perms (username VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE, ' +
                                    'groupname VARCHAR(40) REFERENCES groups (groupname) ON DELETE CASCADE, ' +
                                    'perms INTEGER NOT NULL DEFAULT 2, ' +
                                    'PRIMARY KEY (username, groupname));';

var basic_post = 'CREATE TABLE posts (id SERIAL PRIMARY KEY, ' +
                                'username VARCHAR(40) REFERENCES users (username), ' +
                                'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                                'title VARCHAR(64) NOT NULL, ' +
                                'text VARCHAR(63206) NOT NULL, ' +
                                'type INTEGER NOT NULL);';

var comment = 'CREATE TABLE comments (id SERIAL NOT NULL, ' +
                                    'username VARCHAR(40) REFERENCES users (username), ' +
                                    'post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE, ' +
                                    'text VARCHAR(63206) NOT NULL, ' +
                                    'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                                    'type INTEGER NOT NULL, ' +
                                    'PRIMARY KEY (id, post_id));';

var tag = 'CREATE TABLE tags (post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE, ' +
                              'tag VARCHAR(40) NOT NULL, ' +
                              'PRIMARY KEY (post_id, tag));';

var group_post = 'CREATE TABLE group_posts (id SERIAL NOT NULL, ' +
                                'groupname VARCHAR(40) NOT NULL REFERENCES groups (groupname) ON DELETE CASCADE, ' +
                                'username VARCHAR(40) NOT NULL REFERENCES users (username), ' +
                                'text VARCHAR(63206) NOT NULL, ' +
                                'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
                                'PRIMARY KEY (id, groupname));';

var query = client.query(user + group + user_group_perm + basic_post + group_post + comment + tag);

query.on('end', function() { client.end(); });
