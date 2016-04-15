var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

/* /get
 * Method: PUT (Should be GET)
 *
 * Gets the description of a single user that either matches their email or
 * their username.
 */
 router.put('/forumSearch', function(req, res) {
   console.log("in forumSearch");
   req.body = quoteFixer(req.body);
   pg.connect(connectionString, function(err, client, done) {

     console.log("in forumSearch");
     var stringAndTagSplit = req.body.searchString.split(':');
     var type = quoteFixer(req.body.searchType);
     var tagsArray;
     var wordsArray;
     if(stringAndTagSplit.length == 2)
     {
       wordsArray = stringAndTagSplit[0].split(' ');
       tagsArray = stringAndTagSplit[1].split(' ');
     }
     else if (stringAndTagSplit.length == 1)
     {
       wordsArray = stringAndTagSplit[0].split(' ');
       tagsArray = [""];
     }
     else {
       //need case where string is empty or where a : is used in search
     }
     var tagsQuery = '(';
     for(var i = 1; i < tagsArray.length; i++)
     {
       if(i < tagsArray.length-1)
       {
         tagsQuery += "'" + quoteFixer(tagsArray[i]) + "', ";
       }
       else
       {
         tagsQuery += "'" + quoteFixer(tagsArray[i]) + "'";
       }
     }
     tagsQuery += ') ';
     var wordsQuery = 'ARRAY['
     for(i = 0; i < wordsArray.length; i++)
     {
       if(i < wordsArray.length-1)
       {
         wordsQuery += "'" + quoteFixer(wordsArray[i]) + "', ";
       }
       else
       {
         wordsQuery += "'" + quoteFixer(wordsArray[i]) + "'";
       }
     }
     wordsQuery += "] ";

     console.log(tagsQuery, wordsQuery);

     client.query('SELECT * ' +
       'FROM posts INNER JOIN tags ON tags.tag IN ' + tagsQuery + 'OR ' +
       'posts.title CONTAINS ANY(' + wordsQuery + ') AND posts.type = "'+ type + '"' +
       'ORDER BY posts.post_id ASC;',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.log("meme");
           console.error(err);
           res.sendStatus(406);
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204);
         }else {
           res.status(202).send(result.rows[0]);
         }
       });
   })
 });

 router.put('/groupSearch', function(req, res) {
   pg.connect(connectionString, function(err, client, done) {
     var searchWordsArray = req.body.searchString.split(" ");
     var containsClause = '';
     if(searchWordsArray.length > 0)
     {
       containsClause = ' CONTAINS \'' + quoteFixer(searchWordsArray[0])+'\'';
       for(var i = 1; i < searchWordsArray.length; i++)
       {
         containsClause += ' OR CONTAINS \'' + quoteFixer(searchWordsArray[i])+'\'';
       }
     }

     console.log(containsClause);

     client.query('SELECT * FROM groups WHERE groupname' +
       containsClause + ' ORDER BY groupname ASC;',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406);
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204);
         }else {
           res.status(202).send(result.rows[0]);
         }
       });
   })
 });

 router.put('/userSearch', function(req, res) {
   pg.connect(connectionString, function(err, client, done) {
     var userName = quoteFixer(req.body.searchString);

     console.log(userName);

     client.query('SELECT * FROM users WHERE username CONTAINS \''+ userName + '\';',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406);
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204);
         }else {
           res.status(202).send(result.rows[0]);
         }
       });
   })
 });

module.exports = router;
