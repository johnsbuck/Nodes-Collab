/*  commentGen.js
    The purpose of this script is to generate a format for a given set of data
    viewComment takes in a set of "comment" data and generates it into nicely formatted HTML

    param : JSON file to parse into a post.
    return : HTML code representing the post data
*/

//Hand a JSON with a single object containing { "comment" : [ { "author":"ex_author", "timestamp" : "ex_timestamp", "text" : "ex_text", "id" : "1"} ] }
function viewComment(singleComment)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singleComment);
  var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
   };
  var date = new Date(obj.comment[0].timestamp);
  var formatDate = date.toLocaleTimeString("en-us", dateOptions)
  var myComment = "false";
  if(sessionStorage.getItem('username') == obj.comment[0].author)
  {
    myComment = "true";
  }

  var divBuilder = `<div class="panel panel-default">
                    <div class="panel-body">
                    ` + obj.comment[0].text +
                    `<hr>
                    <p>Written by: `+ obj.comment[0].author +`</p>
                    <p><i class="glyphicon glyphicon-time"></i> ` + formatDate;
  if(myComment=="true")
  {
      divBuilder += `<button class="btn pull-right" title="Delete this comment." onclick="deleteComment('`+ obj.comment[0].id +`')" type="button"><i class="glyphicon glyphicon-remove"></i></button></p>`;
  }
  divBuilder += `</div>
                 </div>`;

  return divBuilder;

}

//deleteCommentt helper allows the user to click a button and delete the associated comment if it is theirs.
function deleteComment(commentID)
{
  sessionStorage.setItem('commentID', commentID);
  var scope = angular.element(document.getElementById("postCommentCtrl")).scope();
    scope.$apply(function () {
    scope.delete();
    });
}
