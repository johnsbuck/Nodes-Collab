/*  groupSearchResultBuilder.js
    The purpose of this script is to generate a format for a given set of data
    singleGroup takes in a set of "group" data and generates it into nicely formatted HTML

    param : JSON file to parse into a post.
    return : HTML code representing the post data
*/

//Hand a JSON with a single object containing { "group" : [ { "groupname":"ex_name", "privacy" : "ex_public" } ] }
function singleGroup(singleData)
{
  var obj = JSON.parse(singleData);
  var groupname = obj.group[0].groupname;
  //well just set the post type as a tag
  var privacy = obj.group[0].privacy;

  var divBuilder = `<div class="container">
	                   <div class="row">
  		                <section class="panel panel-info">
                        <header class="panel-heading">
                          <div class="row">`+
                            `<div class="col-xs-4">` + groupname + `</div>
                            </div>
                        </header>
                        <section class="row panel-body">
                          <div> privacy ` + privacy + `</div>
                       </section>
                       <section class="row">
                              <ul class="col-md-6">`
                              if(privacy === "public")
                              {
                                divBuilder += `<li class="list-unstyled"><a href="ProjectCollab.html" onclick="storeSearchedGroup('` + groupname + `')"><i class="glyphicon glyphicon-comment"> </i> View Group</a>`
                              }
                            `</section>
                      </section>
                      </div>
                    </div>`;

  return divBuilder;

}

//Stores the group name in the session when you view the post so the controller knows which group to show to the viewer
//Id stored as: currentgroup
function storeSearchedGroup(groupname)
{
  sessionStorage.setItem('currentgroup', groupname);
}
//See the note @ function above
//generate();
