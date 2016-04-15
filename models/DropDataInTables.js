var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

var client = new pg.Client(connectionString);
client.connect();

//Drops all the data in our tables
//TRUNCATE TABLE table_name is more efficient but there might be inssue with PK/FK so we will use
//DELETE FROM table_name

var user = "DELETE FROM users;";

var group = "DELETE FROM groups;";

var user_group_perm = "DELETE FROM user_group_perms;";

var basic_post = "DELETE FROM posts;";

var comment = "DELETE FROM comments;";

var tag = "DELETE FROM tags;";

var group_post = "DELETE FROM group_posts;";

//ERROR WITH PK/FK so this must be done in a specific order
var query = client.query(basic_post + user + group + user_group_perm + group_post + comment + tag);

query.on('end', function() { client.end(); });
