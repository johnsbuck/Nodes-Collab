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

  var divBuilder = `<div class="container">
	                   <div class="row">
  		                <section class="panel panel-info">
                        <header class="panel-heading">
                          <div class="row">
                            <div class="col-xs-4">` + obj.post[0].groupname + `</div>
                            <div class="col-xs-8">
                               <div class="row">
                                     <div class="col-md-4 col-md-push-10">` + obj.post[0].username + `</div>
                               </div>
                              </div>
                            </div>
                        </header>
                        <section class="row panel-body">
                          <section class="col-md-6">
                            <h3><u>` + obj.post[0].post_title + `</u></h3>
                            <p>Tags: <a href=#><span class="label label-info tags">` + obj.post[0].post_tags + `</span></a><p>
                            <hr>
                            <section class="row">
                              <ul class="col-md-6">
                              <li class="list-unstyled"><a href="#"><i class="glyphicon glyphicon-comment"> </i> View Full Post</a>
                            </section>
                        </section>
                       </section>
                      </section>
                      </div>
                    </div>`;

  return divBuilder;

}
//See the note @ function above
//generate();
