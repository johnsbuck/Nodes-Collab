//Hand me a JSON file to parse into a post style forum page


function generate(){

  //$("#groupGen").html(" <br>New content!");

  //Sample data JSON
  var samplePost = '{ "post" : [' +
  '{ "groupname":"middle59", "username":"39 seconds ago", "text":"JQUERY HELP NEEDED!!", "timestamp":"jquery" },' +
  '{ "groupname":"scottboyce", "username":"1 minute ago", "text":"Im a scrub!!", "timestamp":"noobin" }' +
   ']}';

document.getElementById("groupGen").innerHTML = ``;


  var obj = JSON.parse(samplePost);
  var size = obj.post.length;
  for(i = 0; i < size; i++) {
      param = '{ "post" : [' +
      '{ "groupname": "' + obj.post[i].groupname + '", "username":"' + obj.post[i].username + '", "text":"' + obj.post[i].text + '", "timestamp":"' + obj.post[i].timestamp + '" }]}';
      document.getElementById("groupGen").innerHTML += singlePost(param);
  }

}

//Hand a JSON with a single object containing { "post" : [ { "author":"ex_author", "timestamp" : "ex_timestamp", "title" : "ex_title", "tags" : "ex_tag"} ] }
function singlePost(singleData)
{
  //document.getElementById("groupGen").innerHTML= singleData;
  var obj = JSON.parse(singleData);

  var divBuilder = `<table style ="width:100%">
                        <tr>
                          <td align="left"> `+obj.post[0].groupname+` </td>
                          <td align="center"> `+obj.post[0].text+` </td>
                          <td align="right"> `+obj.post[0].username+` </td>
                        </tr>
                        <hr>
                        </table>`;

  return divBuilder;

}
generate();
