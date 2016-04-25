function generateNav(){

  // $('#pageGen').empty();
    var navBuilder = `<nav class="navbar navbar-inverse navbar-fixed-top" ng-controller="navCtrl">
      <div class="container-fluid" ng-controller="mainCtrl">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="cover.html">NodesConnect</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="main.html">Dashboard</a></li>
            <li><a href="SettingsEx.html">Settings</a></li>
            <li><a href="ProfileEx.html">Profile</a></li>
            <li><a href="Help.html">Help</a></li>
            <li><a ng-click="signout()">Sign Out</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <li><a href="main.html" class="main">Home </a></li>
            <li><a href="QandA.html" class="QA">Q and A</a></li>
            <li><a href="ProjectCollab.html" class="collab">Project Collab</a></li>
            <li><a href="FreelanceEx.html" class="Freelance" onclick="FreeLance()">Freelance Work</a></li>
          </ul>
          <ul class="nav nav-sidebar">
            <li><a href="TextEditorEx.html"  >Text Editor</a></li>

            <li><a href="Messenger.html" class="Messenger">Messaging</a></li>
          </ul>
          <ul class="nav nav-sidebar">
            <li><a href="SearchEx.html">Search</a></li>
            <li><a href="SettingsEx.html">Settings</a></li>
            <li><a href="ProfileEx.html">Profile</a></li>
          </ul>
        </div>
      </div>
    </div>`;

    document.getElementById("navGen").innerHTML = navBuilder;
    }

generateNav();
