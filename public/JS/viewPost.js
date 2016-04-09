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

  var divBuilder = `<h1><u>` + obj.post[0].title + `</u></h1>
                    <p>` + authorTag + obj.post[0].author +`</p>
                    <br>
                    <p>`+ obj.post[0].text +`</p>
                    <br>
                    <p>Tags:
                    <a href=#><span class="label label-info tags">` + type + `</span></a>
                    <a href=#><span class="label label-info tags">` + obj.post[0].post_tags + `</span></a></p>
                    <p><i class="glyphicon glyphicon-time"></i> ` + obj.post[0].timestamp + `</p>
                    <hr>`;

  return divBuilder;

}
