//Hand me a JSON file to parse into a post style forum page

//SIDENOTE -- THIS HANDLING HAS BEEN MOVED TO controller.js
/*function generate(){

  //$("#tableGen").html(" <br>New content!");

  //Sample data JSON
  var samplePost = '{ "post" : [' +
  '{ "groupname":"middle59", "username":"39 seconds ago", "text":"JQUERY HELP NEEDED!!", "timestamp":"jquery" },' +
  '{ "groupname":"scottboyce", "username":"1 minute ago", "text":"Im a scrub!!", "timestamp":"noobin" }' +
   ']}';




  var obj = JSON.parse(samplePost);
  var size = obj.post.length;
  for(i = 0; i < size; i++) {
      param = '{ "post" : [' +
      '{ "groupname": "' + obj.post[i].groupname + '", "username":"' + obj.post[i].username + '", "text":"' + obj.post[i].text + '", "timestamp":"' + obj.post[i].timestamp + '" }]}';
      document.getElementById("tableGen").innerHTML += singlePost(param);
  }
}*/

//Hand a JSON with a single object containing { "post" : [ { "author":"ex_author", "timestamp" : "ex_timestamp", "title" : "ex_title", "tags" : "ex_tag"} ] }
function singlePost(singleData)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singleData);
  console.log(obj);
  var postTitle = obj.post[0].post_title;
  //well just set the post type as a tag
  var type = obj.post[0].type;
  if(type==0)//if the type is 0 then we will show this as a Q & A post, otherwise it is a freelance post
  {
    type = "Q & A";
  }
  else {
    type = "Freelance";
  }
  var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
   };
  var date = new Date(obj.post[0].timestamp);
  var formatDate = date.toLocaleTimeString("en-us", dateOptions)


  var divBuilder = `<div class="container">
	                   <div class="row">
  		                <section class="panel panel-info">
                        <header class="panel-heading">
                          <div class="row">`+
                            //<div class="col-xs-4">` + obj.post[0].groupname + `</div>//uncomment when we have groups done
                            `<div class="col-xs-4">` + obj.post[0].username + `</div>
                            </div>
                        </header>
                        <section class="row panel-body">
                          <section class="col-md-6">
                            <h3><u>` + postTitle + `</u></h3>
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
                            <hr>
                            <section class="row">
                              <ul class="col-md-6">
                              <li class="list-unstyled"><a href="View`;
                              if(obj.post[0].type==0)//if the type is 0 then we will show this as a Q & A post, otherwise it is a freelance post
                              {
                                divBuilder += 'QA';
                              }
                              else {
                                divBuilder += 'Freelance';
                              }
                              divBuilder += `Post.html" onclick="storePostID('` + postTitle + "', '" + obj.post[0].type +`')"><i class="glyphicon glyphicon-comment"> </i> View Full Post</a>
                            </section>
                        </section>
                       </section>
                      </section>
                      </div>
                    </div>`;

  return divBuilder;

}

//Stores the post ID to the session when you view the post so the controller knows which post to show to the viewer
//UPDATED FOR NEW POST PK(title, type)
//Id stored as: postID
function storePostID(postTitle, postType)
{
  console.log("Session Stored Post Title: " + postTitle + ", Session Stored Post Type: " + postType);
  sessionStorage.setItem('postTitle', postTitle);
  sessionStorage.setItem('postType', postType);
}
//See the note @ function above
//generate();
