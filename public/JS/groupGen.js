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

function updateScroll(){
    var element = document.getElementById("groupGen");
    element.scrollTop = element.scrollHeight;
}
 updateScroll();
