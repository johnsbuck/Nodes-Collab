//Hand a JSON with a single object containing { "user" : "username" }
function singleLink(username)
{
  //document.getElementById("tableGen").innerHTML= singleData;
  var obj = JSON.parse(username);
  console.log(obj);
  var username = obj.user;

  var divBuilder = `<div class="container">
	                   <a href="Profile.html" onclick="storeOtherUsername('` + username + `')">View Profile</a>
                    </div>`;
  return divBuilder;

}


function goToProfile(username)
{
  console.log("Session Stored OtherUserName "+ username);
  sessionStorage.setItem('viewuser', username);
}
//See the note @ function above
//generate();
