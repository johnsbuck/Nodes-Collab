function singlePost(singleData)
{
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

function updateScroll(){
    var element = document.getElementById("groupGen");
    element.scrollTop = element.scrollHeight;
}
 updateScroll();
