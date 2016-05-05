/*  viewPost.js
    The purpose of this script is to dynamically generate a post based on the
    JSON file information that is handed to it.

    param : JSON file to parse into a post.
    return : HTML code representing the post data
*/

//JSON Structure { "post" : [ { "author":"ex_author", "timestamp" : "ex_timestamp", "title" : "ex_title", "text" : "ex_text", "tags" : "ex_tag1;ex_tag2", "type" : "ex_type"} ] }
function viewPost(singlePost)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singlePost);

  //well just set the post type as a tag
  var type = obj.post[0].type;
  var authorTag;

  //We use this script for both Freelance and Q & A posts, so this will handle either case
  if(type==0)//if the type is 0 then we will show this as a Q & A post, otherwise it is a freelance post
  {
    type = "Q & A";
    authorTag = "Asked by: ";
  }
  else {
    type = "Freelance";
    authorTag = "Proposed by: ";
  }

  //Date formatting options
  var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
   };
  var date = new Date(obj.post[0].timestamp);
  var formatDate = date.toLocaleTimeString("en-us", dateOptions)
  var divBuilder = "";

  //If this post is owned by the logged in user, they will have additional functionality
  var myPost = "false";
  if(sessionStorage.getItem('username') == obj.post[0].author)
  {
    myPost = "true";
  }

  if(myPost=="true")
  {
    divBuilder += `<div class="alert alert-info alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><i class="glyphicon glyphicon-wrench"></i> This is your post. You will have additional functionality to edit or delete it.</div>`;
  }

  divBuilder += `<h1><u>` + obj.post[0].title + `</u></h1>
                    <p>` + authorTag + obj.post[0].author +`</p>
                    <br>
                    <p>`+ obj.post[0].text +`</p>
                    <br>
                    <p>Tags:
                    <a href=#><span class="label label-info tags">` + type + `</span></a> `;
                    if(obj.post[0].post_tags!="notag")
                    {
                      var tags = obj.post[0].post_tags.split(";");
                      for(i=0; i<tags.length; i++)
                      {
                        divBuilder += `<a href=#><span class="label label-info tags">` + tags[i] + `</span></a> `;
                      }
                    }
                    divBuilder += `<p><i class="glyphicon glyphicon-time"></i> ` + formatDate;
  if(myPost=="true")
  {
      divBuilder += `<button class="btn btn-primary pull-right" style="margin-left:5px" data-toggle="modal" data-target="#deleteModal" type="button"><i class="glyphicon glyphicon-trash"></i></button>`
  }

  divBuilder += `</p><hr>`;

  if(myPost=="true")
  {
        //Delete Modal
        divBuilder += `<div id="deleteModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Are you sure you would like to delete your post?</h4>
            </div>
            <div class="modal-body">
              <button class="btn btn-primary" onclick="deletePost()" type="button">Delete</button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>`;
  }

  return divBuilder;

}

//DeletePost helper allows the user to click a button and delete the associated post.
function deletePost()
{
  var scope = angular.element(document.getElementById("viewPostCtrl")).scope();
    scope.$apply(function () {
    scope.delete();
    });
}
