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
     var type = quoteFixer(req.body.searchType);
     console.log(type);
     var fullSearch = quoteFixer(req.body.searchString);
     var wordsArray = quoteFixer(req.body.searchString).split(" ");

     var likeClause = ' ( ';
     likeClause += 'title LIKE \'%' + fullSearch+'%\'';
     likeClause += ' OR title LIKE \'' + fullSearch+'%\'';
     likeClause += ' OR title LIKE \'%' + fullSearch+'\'';
     likeClause += ' OR title LIKE \'' + fullSearch+'\'';
     for(i = 0; i < wordsArray.length; i++)
     {
       likeClause += ' OR title LIKE \'%' + quoteFixer(wordsArray[i])+'%\'';
       likeClause += ' OR title LIKE \'' + quoteFixer(wordsArray[i])+'%\'';
       likeClause += ' OR title LIKE \'%' + quoteFixer(wordsArray[i])+'\'';
       likeClause += ' OR title LIKE \'' + quoteFixer(wordsArray[i])+'\'';
     }
     likeClause += ' )';

     console.log(likeClause);

     client.query('SELECT * FROM posts WHERE' + likeClause +
       ' AND type ='+type+';',
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
           res.status(202).send(result.rows);
         }
       });
   })
 });

 router.put('/groupSearch', function(req, res) {
   console.log("in groupSearch");
   pg.connect(connectionString, function(err, client, done) {
     console.log("data base connect est");
     var searchWordsArray = req.body.searchString.split(" ");
     var likeClause = '';
     if(searchWordsArray.length > 0)
     {
       likeClause = ' groupname LIKE \'%' + quoteFixer(searchWordsArray[0])+'%\'';
       likeClause += ' OR groupname LIKE \'' + quoteFixer(searchWordsArray[0])+'%\'';
       likeClause += ' OR groupname LIKE \'%' + quoteFixer(searchWordsArray[0])+'\'';
       likeClause += ' OR groupname LIKE \'' + quoteFixer(searchWordsArray[0])+'\'';
       for(var i = 1; i < searchWordsArray.length; i++)
       {
         likeClause += ' OR groupname LIKE \'%' + quoteFixer(searchWordsArray[i])+'%\'';
         likeClause += ' OR groupname LIKE \'' + quoteFixer(searchWordsArray[i])+'%\'';
         likeClause += ' OR groupname LIKE \'%' + quoteFixer(searchWordsArray[i])+'\'';
         likeClause += ' OR groupname LIKE \'' + quoteFixer(searchWordsArray[i])+'\'';
       }
     }

     console.log(likeClause);

     client.query('SELECT * FROM groups WHERE ' +
       likeClause + ' ORDER BY groupname ASC;',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406);
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204);
         }else {
           res.status(202).send(result.rows);
         }
       });
   })
 });

 router.put('/userSearch', function(req, res) {
   console.log("in userSearch");
   pg.connect(connectionString, function(err, client, done) {
     var splitString = req.body.searchString.split(":");
     var userName = quoteFixer(splitString[0]);
     var email = "";
     if(splitString.length > 0)
     {
       email = quoteFixer(splitString[1]);
     }
     console.log(userName);
     var likeClause = "";
     likeClause += ' username LIKE \'' + userName+'\'';
     likeClause += ' OR username LIKE \'' + userName+'%\'';
     likeClause += ' OR username LIKE \'%' + userName+'\'';
     likeClause += ' OR username LIKE \'%' + userName+'%\'';
     if(email != "")
     {
       likeClause += ' OR email LIKE \'' + email+'\'';
       likeClause += ' OR email LIKE \'' + email+'%\'';
       likeClause += ' OR email LIKE \'%' + email+'\'';
       likeClause += ' OR email LIKE \'%' + email+'%\'';
     }
     var queryString = 'SELECT * FROM users WHERE' +likeClause+';'
     console.log(queryString);
     client.query(queryString,
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           console.log("in userSearch error found");
           res.sendStatus(406);
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204);
         }else {
           res.status(202).send(result.rows);
         }
       });
   })
 });

module.exports = router;
