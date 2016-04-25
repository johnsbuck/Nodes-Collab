function viewProfile(username)
{
  sessionStorage.viewuser = username;
  location.reload();
}
function deleteProfile(username)
{
  console.log("I was clicked!");
  var formData = {};   //Init formData

  formData['username'] = sessionStorage.getItem('username');
  formData['pass'] = sessionStorage.getItem('pass');
  console.log(formData);

  $.ajax({
    url:'/user/delete/connection',
    type: 'DELETE',
    context: {"username" : formData['username'], "pass" : formData['pass']},
    success: function() {
      console.log("Connection removed!");
    }
  });

}
