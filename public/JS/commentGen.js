//Hand me a JSON file to parse into a post.

//Hand a JSON with a single object containing { "comment" : [ { "username":"ex_author", "timestamp" : "ex_timestamp","text"} ] }
function viewComment(singleComment)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(singleComment);
  console.log(obj);
  var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
   };
  var date = new Date(obj.comment[0].timestamp);
  var formatDate = date.toLocaleTimeString("en-us", dateOptions)

  var divBuilder = `<div class="panel panel-default">
                    <div class="panel-body">
                    ` + obj.comment[0].text +
                    `<hr>
                    <p>Written by: `+ obj.comment[0].author +`</p>
                    <p><i class="glyphicon glyphicon-time"></i> ` + formatDate + `</p>
                    </div>
                    </div>`;

  return divBuilder;

}
