/*
* Helper JS file to enable button clicks in the connections modal.
* Adds functionality to the add/remove connections button in profile.html
*/
//Function triggered when viewProfile button on a connection in Profile.html is clicked.
function viewProfile(username)
{
  sessionStorage.viewuser = username;
  location.reload();
}
//Function triggered when deleteProfile button on a connection in Profile.html is clicked.
function deleteProfile(username)
{
  var formData = {};   //Init formData

  formData['username'] = sessionStorage.getItem('username');
  formData['pass'] = sessionStorage.getItem('pass');
  //AJAX API call to delete the desired connection.
  $.ajax({
    url:'/user/delete/connection',
    type: 'DELETE',
    data: {"username" : formData['username'], "pass" : formData['pass'], "connect_user": username},
    success: function() {
      location.reload();
    }
  });

}
