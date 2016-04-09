//Hand me a JSON file to parse into a post.

//Hand a JSON with a single object containing { "comment" : [ { "username":"ex_author", "timestamp" : "ex_timestamp","text"} ] }
function viewComment(singleComment)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singleComment);
  console.log(obj);

  var divBuilder = `<div class="panel panel-default">
                    <div class="panel-body">
                    ` + obj.post[0].text +
                    `<hr>
                    <p>Written by: `+ obj.post[0].author +`</p>
                    <br>
                    <p><i class="glyphicon glyphicon-time"></i> ` + obj.post[0].timestamp + `</p>
                    </div>
                    </div>`;

  return divBuilder;

}
