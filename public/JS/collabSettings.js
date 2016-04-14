function addGroup(singleData)
{
  var obj = JSON.parse(singleData);
  var privacy = obj.post[0].privacy = 1 ? "Private" : "Public";

  var divBuilder = `<br>
                    <button type="button" data-toggle="modal" data-target="#my` + obj.post[0].groupname +`GroupModal">` + obj.post[0].groupname + `</button>
                    <div id="my` + obj.post[0].groupname + `GroupModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">` + obj.post[0].groupname + `</h4>
                    </div>
                    <div class="modal-body">
                    <p>This group is ` + privacy + `</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="removeGroup(` + obj.post[0].groupname + `)">Submit</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                    </div>

                    </div>
                    </div>
                    <br>`;
  return divBuilder;

}

function addMember(singleData)
{
  var obj = JSON.parse(singleData);
  var perms = obj.post[0].perms = 1 ? "Member" : "Admin";

  var divBuilder = `<br>
                    <button type="button" data-toggle="modal" data-target="#my` + obj.post[0].username +`UserModal">` + obj.post[0].username + `</button>
                    <div id="my` + obj.post[0].username + `UserModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">` + obj.post[0].username + `</h4>
                    </div>
                    <div class="modal-body">
                    <p>This user is a ` + perms + `</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="removeMember(` + obj.post[0].username + `)">Submit</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                    </div>

                    </div>
                    </div>
                    <br>`;

return divBuilder;
}
