/*  database.js
    Refreshes the database by dropping the SCHEMA and recreating it
    using the most up-to-date DB structure.
*/
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

var client = new pg.Client(connectionString);
client.connect();

// Deletes all table information and creates a new, empty schema
var refresh = 'drop schema public cascade; create schema public;';

// USER Table
var user = 'CREATE TABLE users (username VARCHAR(40) PRIMARY KEY, ' +
                                'pass VARCHAR(128) NOT NULL, salt VARCHAR(32) NOT NULL,' +
                                'email VARCHAR(40) UNIQUE NOT NULL, ' +
                                'first_name VARCHAR(40) NOT NULL, last_name VARCHAR(40) NOT NULL, ' +
                                'gender VARCHAR(40), ' +
                                'currentgroup VARCHAR(40), ' +
                                'bio VARCHAR(63206), ' +
                                'facebook VARCHAR(80), linkedin VARCHAR(80));';

// CONNECTIONS Table
var connections = 'CREATE TABLE connections (first_user VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE, ' +
                                            'second_user VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE, ' +
                                            'PRIMARY KEY (first_user, second_user));';

// GROUP
/* privacy
 * Private: 1
 * Public: 0
 */
var group = 'CREATE TABLE groups (groupname VARCHAR(40) PRIMARY KEY, ' +
                                  'privacy INTEGER NOT NULL);';

//USER GROUP PERMISSIONS
var user_group_perms = 'CREATE TABLE user_group_perms (username VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE, ' +
                                    'groupname VARCHAR(40) REFERENCES groups (groupname) ON DELETE CASCADE, ' +
                                    'perms INTEGER NOT NULL DEFAULT 2, ' +
                                    'PRIMARY KEY (username, groupname));';

// POSTS
var basic_post = 'CREATE TABLE posts (' +
                                'username VARCHAR(40) REFERENCES users (username), ' +
                                'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                                'title VARCHAR(64) NOT NULL, ' +
                                'text VARCHAR(63206) NOT NULL, ' +
                                'type INTEGER NOT NULL, ' +
                                'PRIMARY KEY (title, type));';

// COMMENTS
var comment = 'CREATE TABLE comments (id SERIAL NOT NULL, ' +
                                    'username VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE, ' +
                                    'text VARCHAR(63206) NOT NULL, ' +
                                    'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                                    'type INTEGER NOT NULL, ' +
                                    'title VARCHAR(64) NOT NULL, ' +
                                    'FOREIGN KEY (title, type) REFERENCES posts (title, type) ON DELETE CASCADE, ' +
                                    'PRIMARY KEY (id, title, type));';

// TAGS
var tag = 'CREATE TABLE tags (title VARCHAR(64) NOT NULL, ' +
                              'type INTEGER NOT NULL, ' +
                              'tag VARCHAR(40) NOT NULL, ' +
                              'FOREIGN KEY (title, type) REFERENCES posts (title, type) ON DELETE CASCADE, ' +
                              'PRIMARY KEY (tag, title, type));';

//GROUP POSTS
var group_post = 'CREATE TABLE group_posts (id SERIAL NOT NULL, ' +
                                'groupname VARCHAR(40) NOT NULL REFERENCES groups (groupname) ON DELETE CASCADE, ' +
                                'username VARCHAR(40) NOT NULL REFERENCES users (username) ON DELETE CASCADE, ' +
                                'text VARCHAR(63206) NOT NULL, ' +
                                'timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
                                'PRIMARY KEY (id, groupname));';

// This query is used to create the tables in our database. Is used once and isn't accessed by our server
var query = client.query(refresh + user + group + user_group_perms + basic_post + group_post + comment + tag + connections,
  function(err, result) {
    if(err) {
      // Why we can't make the tables
      console.error(err);
    }

    // Close the connection to the database
    client.end();
  });
