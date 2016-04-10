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

  var divBuilder = `<br>
                    <button type="button" data-toggle="modal" data-target="#my` + obj.post[0].username +`Modal">` + obj.post[0].username + `</button>
                    <div id="my` + obj.post[0].username + `Modal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">` + obj.post[0].username + `</h4>
                    </div>
                    <div class="modal-body">
                    <p>Some text in the modal.</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                    </div>

                    </div>
                    </div>
                    <br>`;

return divBuilder;
}
