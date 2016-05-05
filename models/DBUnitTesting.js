/*  DBUnitTesting.js
    Prior to having functional front-end input, this was used to make sure
    data was correctly being added to the database thus far.

    It was also used to make sample test-data to display.
*/

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

var client = new pg.Client(connectionString);
client.connect();

var user_data = "INSERT INTO users (username, pass, salt, email, first_name, last_name, gender) VALUES" +
                                "('middle60', 'unhashed', 'unhashed_salt', 'sample2@email.com', 'Mike', 'Middleton', 'male');";

var post_data = "INSERT INTO posts (username, timestamp, title, text, type) VALUES " +
                                "('middle60', '2011-11-09', 'SamplePost2', 'SampleBody', 0);";

var query = client.query(user_data + post_data);

query.on('end', function() { client.end(); });
