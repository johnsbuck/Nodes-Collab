function addGroup(singleData)
{
  var obj = JSON.parse(singleData);

  var divBuilder = `<table style ="width:100%">
                        <tr>
                          <td align="left"> `+ obj.post[0].groupname +` </td>
                        </tr>
                        <hr>
                        </table>`;

  return divBuilder;

}

function addMember(singleData)
{
  var obj = JSON.parse(singleData);

  var divBuilder = `<label><button class="glyphicon glyphicon-remove"></button> ` + obj.post[0].username + `</label>`;

return divBuilder;
}
