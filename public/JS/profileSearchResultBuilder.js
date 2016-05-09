/*  profileSearchResultBuilder.js
    The purpose of this script is to generate a format for a given set of data
    singleUser takes in a set of "user" data and generates it into nicely formatted HTML

    param : JSON file to parse into a post.
    return : HTML code representing the post data
*/

//Hand a JSON with a single object containing { "user" : [ { "username":"ex_author", "email" : "ex_timestamp" } ] }
function singleUser(singleData)
{
  var obj = JSON.parse(singleData);
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

//Stores the username to the session when you view the post so the controller knows which Profile to show to the viewer
//Id stored as: viewuser
function storeOtherUsername(username)
{
  sessionStorage.setItem('viewuser', username);
}
