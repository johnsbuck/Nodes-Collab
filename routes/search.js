/*  search.js
    Defines the NodeJS Database API for Searching nodesConnect
		Logs are kept in this file as they are displayed in the back-end, not to the client

		*NOTE - There was an issue using router.post and router.delete and so these functions
		are defined under router.put.
		We are allowed to do this since we can define it anyway we want and use different
		header names ie: '/get', '/delete', '/post'

    Optimally we would want to use these the correct way, but our setup was having issues with it.

		Webcodes used in this script are defined as:
		202 - Accepted - Request is OK for processing, but did not actually process
		204 ERROR - No Content - This method requires specific parts of the body which was not provided by the input
		206 ERROR - Partial Content - Fulfilled parital request; however, there is missing information in the input
		404 ERROR - Not Found - Server did not find anything amtching the request URI
		403 ERROR - Forbidden - The request/input is acceptable, but will not be fulfilled due to an authorization issue.
		406 ERROR - Not Acceptable - Bad input was provided.
*/

var express = require('express');
var router = express.Router();
var passHash = require('password-hash');
var pg = require('pg');
var quoteFixer = require('./db_tools');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost/nodesconnect';

 /*
  * Used by: searchWebsiteCtrl
  * Params: searchString - the text the user is seraching for
  *         type         - the type of post the user wanted to see
  * Returns: posts from the posts database that are similar to a user search.
  * A query is created that uses the LIKE keyword to search the title of all posts
  * in the posts database. Many Likes are used in conjunction with one another using pieces
  * of the search string.
  */
 router.put('/forumSearch', function(req, res) {
   req.body = quoteFixer(req.body);
   pg.connect(connectionString, function(err, client, done) {

     var type = quoteFixer(req.body.searchType);
     var fullSearch = quoteFixer(req.body.searchString);
     var wordsArray = quoteFixer(req.body.searchString).split(" ");

     // Converts to lowercase
     for(var i = 0; i < wordsArray.length; i++)
     {
       wordsArray[i] = wordsArray[i].toLowerCase();
     }
     //add like clauses that search for posts with titles that contain the full search string
     var likeClause = ' ( ';
     likeClause += 'lower(title) LIKE \'%' + fullSearch+'%\'';
     likeClause += ' OR lower(title) LIKE \'' + fullSearch+'%\'';
     likeClause += ' OR lower(title) LIKE \'%' + fullSearch+'\'';
     likeClause += ' OR lower(title) LIKE \'' + fullSearch+'\'';
     //add a like clause for each work in the serach string
     //for each word we look if a post has a title that contains that word
     for(i = 0; i < wordsArray.length; i++)
     {
       likeClause += ' OR lower(title) LIKE \'%' + quoteFixer(wordsArray[i])+'%\'';
       likeClause += ' OR lower(title) LIKE \'' + quoteFixer(wordsArray[i])+'%\'';
       likeClause += ' OR lower(title) LIKE \'%' + quoteFixer(wordsArray[i])+'\'';
       likeClause += ' OR lower(title) LIKE \'' + quoteFixer(wordsArray[i])+'\'';
     }
     likeClause += ' )';

     client.query('SELECT * FROM posts WHERE' + likeClause +
       ' AND type ='+type+';',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406).end();
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204).end();
         }else {
           res.status(202).send(result.rows);
         }
       });
   })
 });

 /*
  * Used by: searchWebsiteCtrl
  * Params: searchString - the text the user is seraching for
  * Returns: tags from the tags database that are similar to the user search.
  * A query is created that uses the LIKE keyword to search the tag name of all tags
  * in the tags database. Many Likes are used in conjunction with one another using pieces
  * of the search string.
  */
 router.put('/forumSearchByTags', function(req, res) {
   req.body = quoteFixer(req.body);
   pg.connect(connectionString, function(err, client, done) {
     var tagsArray = quoteFixer(req.body.searchString).split(",");

     //for each tag in the search string add a like clause seperated by an OR
     var likeClause = ' lower(tag) LIKE \'' + quoteFixer(tagsArray[0])+'\'';
     for(var i = 1; i < tagsArray.length; i++)
     {
       likeClause += ' OR lower(tag) LIKE \'' + quoteFixer(tagsArray[i])+'\'';
     }

     client.query('SELECT * FROM tags WHERE' + likeClause + ';',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406).end();
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204).end();
         }else {
           res.status(202).send(result.rows);
         }
       });
   })
 });

 /*
  * Used by: searchWebsiteCtrl
  * Params: postTitle - the title of the post
  *         postType  - a number that represents the search type
  * Returns: posts from the posts database that are equal to a given post title and type.
  * A query is created that returns all posts that have the given title and type.
  */
 router.put('/getPostFromTag', function(req, res) {
 	req.body = quoteFixer(req.body);
 	pg.connect(connectionString, function(err, client, done) {
    var type = 0;
    //set the type of the post
    //this number is given from the html and is the index of the type of search in the searchEx.html
    //this number is 4 more than the posts type
    if(req.body.searchType == 5)
    {
      type = 1;
    }
 		client.query('SELECT * FROM posts WHERE title = \'' + req.body.title + '\' AND type ='+type+';',
 		function(err, result) {
 			done();
 			if(err) {
 				console.error(err);
 				res.sendStatus(406).end();
 			}else if(!result || result.rows.length === 0) {
 				res.sendStatus(204).end();
 			}else {
 				res.status(202).send(result.rows).end();
 			}
 		});
 	});
 });

 /*
  * Used by: searchWebsiteCtrl
  * Params: searchString - the text the user is seraching for
  * Returns: groups from the groups database that are similar to the user search.
  * A query is created that uses the LIKE keyword to search the groupname of all groups
  * in the groups database. Many Likes are used in conjunction with one another using pieces
  * of the search string.
  */
 router.put('/groupSearch', function(req, res) {
   pg.connect(connectionString, function(err, client, done) {
     var searchWordsArray = req.body.searchString.split(" ");

     //Sets to lowercase
     for(var i = 0; i < searchWordsArray.length; i++)
     {
       searchWordsArray[i] = searchWordsArray[i].toLowerCase();
     }
     var likeClause = '';
     //Add a like Clause for each word in the seach string
     if(searchWordsArray.length > 0)
     {
       likeClause = ' lower(groupname) LIKE \'%' + quoteFixer(searchWordsArray[0])+'%\'';
       likeClause += ' OR lower(groupname) LIKE \'' + quoteFixer(searchWordsArray[0])+'%\'';
       likeClause += ' OR lower(groupname) LIKE \'%' + quoteFixer(searchWordsArray[0])+'\'';
       likeClause += ' OR lower(groupname) LIKE \'' + quoteFixer(searchWordsArray[0])+'\'';
       for(var i = 1; i < searchWordsArray.length; i++)
       {
         likeClause += ' OR lower(groupname) LIKE \'%' + quoteFixer(searchWordsArray[i])+'%\'';
         likeClause += ' OR lower(groupname) LIKE \'' + quoteFixer(searchWordsArray[i])+'%\'';
         likeClause += ' OR lower(groupname) LIKE \'%' + quoteFixer(searchWordsArray[i])+'\'';
         likeClause += ' OR lower(groupname) LIKE \'' + quoteFixer(searchWordsArray[i])+'\'';
       }
     }

     client.query('SELECT * FROM groups WHERE ' +
       likeClause + ' ORDER BY groupname ASC;',
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406).end();
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204).end();
         }else {
           res.status(202).send(result.rows);
         }
       });
   })
 });

 /*
  * Used by: searchWebsiteCtrl
  * Params: searchString - the text the user is seraching for
  * Returns: users from the users database that are similar to the user search.
  * A query is created that uses the LIKE keyword to search the username and email of all users
  * in the users database.
  */
 router.put('/userSearch', function(req, res) {
   pg.connect(connectionString, function(err, client, done) {
     //split on :
     var splitString = req.body.searchString.split(":");
     //string before : is the searched username
     var userName = quoteFixer(splitString[0]);
     var email = "";
     //string after : is email set it if there is an email searched
     if(splitString.length > 0)
     {
       email = quoteFixer(splitString[1]);
     }
     //add a like clause that attemps to match the searched username with a user
     var likeClause = "";
     likeClause += ' lower(username) LIKE \'' + userName+'\'';
     likeClause += ' OR lower(username) LIKE \'' + userName+'%\'';
     likeClause += ' OR lower(username) LIKE \'%' + userName+'\'';
     likeClause += ' OR lower(username) LIKE \'%' + userName+'%\'';
     //add a like clause that attemps to match the searched email with a user if an email was specified 
     if(email != "")
     {
       likeClause += ' OR lower(email) LIKE \'' + email+'\'';
       likeClause += ' OR lower(email) LIKE \'' + email+'%\'';
       likeClause += ' OR lower(email) LIKE \'%' + email+'\'';
       likeClause += ' OR lower(email) LIKE \'%' + email+'%\'';
     }
     var queryString = 'SELECT * FROM users WHERE' +likeClause+';'
     client.query(queryString,
       function(err, result) {
         done();
         console.log(result);

         if(err) {
           console.error(err);
           res.sendStatus(406).end();
         }else if(!result || result.rows.length === 0) {
           res.sendStatus(204).end();
         }else {
           res.status(202).send(result.rows);
         }
       });
   })
 });

module.exports = router;
