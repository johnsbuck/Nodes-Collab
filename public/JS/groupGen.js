//Hand me a JSON file to parse into a post style forum page

/*
function generate(){

  //$("#groupGen").html(" <br>New content!");

  //Sample data JSON
  var samplePost = '{ "post" : [' +
  '{ "username":"middle59", "text":"JQUERY HELP NEEDED!!", "timestamp":"39 seconds ago"},' +
  '{ "username":"scottboyce", "text":"Im am scripting", "timestamp":"1 minute ago"}' +
   ']}';

document.getElementById("groupGen").innerHTML = ``;


  var obj = JSON.parse(samplePost);
  var size = obj.post.length;
  for(i = 0; i < size; i++) {
      param = '{ "post" : [' +
      '{ "username":"' + obj.post[i].username + '", "text":"' + obj.post[i].text + '", "timestamp":"' + obj.post[i].timestamp + '" }]}';
      document.getElementById("groupGen").innerHTML += singlePost(param);
  }

}
*/
//Hand a JSON with a single object containing { "post" : [ { "author":"ex_author", "timestamp" : "ex_timestamp", "title" : "ex_title", "tags" : "ex_tag"} ] }
function singlePost(singleData)
{
  //document.getElementById("groupGen").innerHTML= singleData;
  var obj = JSON.parse(singleData);

  var divBuilder = `<table style ="width:100%">
                        <tr>
                          <td align="left"> `+obj.post[0].username+` </td>
                          <td align="center"> `+obj.post[0].text+` </td>
                          <td align="right"> `+obj.post[0].timestamp+` </td>
                        </tr>
                        <hr>
                        </table>`;

  return divBuilder;

}
//generate();
