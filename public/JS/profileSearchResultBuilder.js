

//Hand a JSON with a single object containing { "user" : [ { "username":"ex_author", "email" : "ex_timestamp" } ] }
function singlePost(singleData)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singleData);
  console.log(obj);
  var username = obj.user[0].username;
  //well just set the post type as a tag
  var email = obj.user[0].email;

  var divBuilder = `<div class="container">
	                   <div class="row">
  		                <section class="panel panel-info">
                        <header class="panel-heading">
                          <div class="row">`+
                            `<div class="col-xs-4">` + username + `</div>
                            </div>
                        </header>
                        <section class="row panel-body">
                          <div> Email ` + email + `</div>
                       </section>
                       <section class="row">
                              <ul class="col-md-6">
                              <li class="list-unstyled"><a href="Profile.html" onclick="storeOtherUsername('` + username + `')"><i class="glyphicon glyphicon-comment"> </i> View Profile</a>
                            </section>
                      </section>
                      </div>
                    </div>`;

  return divBuilder;

}


function storeOtherUsername(username)
{
  console.log("Session Stored OtherUserName "+ username);
  sessionStorage.setItem('viewuser', username);
}
//See the note @ function above
//generate();
