//Hand me a JSON file to parse into a post.

//Hand a JSON with a single object containing { "post" : [ { "author":"ex_author", "timestamp" : "ex_timestamp", "title" : "ex_title", "text" : "ex_text", "tags" : "ex_tags", "type" : "ex_type"} ] }
function viewPost(singlePost)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singlePost);
  console.log(obj);
  //well just set the post type as a tag
  var type = obj.post[0].type;
  var authorTag;

  if(type==0)//if the type is 0 then we will show this as a Q & A post, otherwise it is a freelance post
  {
    type = "Q & A";
    authorTag = "Asked by: ";
  }
  else {
    type = "Freelance";
    authorTag = "Proposed by: ";
  }
  var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
   };
  var date = new Date(obj.post[0].timestamp);
  var formatDate = date.toLocaleTimeString("en-us", dateOptions)
  var divBuilder = "";
  if(sessionStorage.getItem('username') == obj.post[0].author)
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
                    divBuilder += `<p><i class="glyphicon glyphicon-time"></i> ` + formatDate + `</p>
                    <hr>`;

  return divBuilder;

}
