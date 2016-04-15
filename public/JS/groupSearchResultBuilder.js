

//Hand a JSON with a single object containing { "group" : [ { "groupname":"ex_name", "privacy" : "ex_public" } ] }
function singlePost(singleData)
{
  var obj = JSON.parse(singleData);
  console.log(obj);
  var groupname = obj.group[0].groupname;
  console.log(groupname);
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


function storeSearchedGroup(groupname)
{
  console.log("Session Stored SearchedGroup "+ groupname);
  sessionStorage.setItem('currentgroup', groupname);
}
//See the note @ function above
//generate();
