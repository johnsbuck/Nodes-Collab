/*  groupGen.js
    This script is designed to take in a json object and parse through it and output the group messages.
*/

/* singlePost
param: json object with post information. 
return: html element to be appened to the projectcolab page.
*/
function singlePost(singleData)
{
  var obj = JSON.parse(singleData);

  var divBuilder = `<table style ="width:100%">
                        <tr>
                          <td align="left"> <b>`+obj.post[0].username+`:<b> </td>
                          <td align="center"> `+obj.post[0].text+` </td>
                          <td align="right"> <b>`+obj.post[0].timestamp+`<b> </td>
                        </tr>
                        <hr>
                        </table>`;

  return divBuilder;

}

/* updateScroll
    Used to keep the scroll on the group messages up to the most recent one. 
*/
function updateScroll(){
    var element = document.getElementById("groupGen");
    element.scrollTop = element.scrollHeight;
}
 updateScroll();
