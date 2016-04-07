//Hand me a JSON file to parse into a post style forum page

function generatePage(param){

  // $('#pageGen').empty();
    var homeBuilder = `<h1>{{message}}</h1>
    <h2>Recent Post Activity</h2>
       <hr>
       <!--<h2>Recent Post Activity</h2>
       <hr>
       <!-- START OF -> Post Activity -->
       <div id="tableGen" ng-controller="tableGen"><p ng-bind="txt">
          <!-- under this div the posts will be generated, it is identified by its controller/div id-->
       </p></div>
       <!-- END OF -> Post Activity -->

    <footer class="blog-footer">
      <hr>
      <h6>Home page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var qandaBuilder = `<div class="blog-masthead">
      <div class="container">
        <nav class="blog-nav">
          <a class="blog-nav-item" href="#">Filter</a>
          <a class="blog-nav-item" href="#">Post</a>
        </nav>
      </div>
    </div>

    <div class="container">

      <div class="blog-header">
        <h1 class="blog-title">Question and Answers</h1>
        <p class="lead blog-description">Ask Questions, Answer Questions.</p>
      </div>

      <div class="row">

        <div class="col-sm-8 blog-main">

            <!--DELETE upon connecting with actual posts. -->
              <ul>
               <li>FILL ME</li>
                <li>FILL ME</li>
                <li>FILL ME</li>
              </ul>


            <nav>
            <ul class="pager">
              <li><a href="#">Previous</a></li>
              <li><a href="#">Next</a></li>
            </ul>
          </nav>

        </div><!-- /.blog-main -->
      </div><!-- /.row -->
    </div><!-- /.container -->

    <footer class="blog-footer">
      <h6>Q And A page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var collabBuilder = ` <div class="blog-masthead">
      <div class="container">
        <nav class="blog-nav">
          <a class="blog-nav-item" href="#">Filter</a>
          <a class="blog-nav-item" href="#">Post</a>
          <a class="blog-nav-item" href="collabSettings.html">Settings</a>
        </nav>
      </div>
    </div>

    <div class="container">

      <div class="blog-header">
        <h1 class="blog-title">Project Collaboration</h1>
        <p class="lead blog-description">See Projects with others, Do Projects with others.</p>
      </div>
      <div class="main col-sm-9">
         <h2>Recent Post Activity</h2>
         <hr>
         <div id="groupGen" ng-controller="groupPostGen"><p ng-bind="txt">
      </div>
      <div class="row">

        <div class="col-sm-8 blog-main">
            <nav>
            <ul class="pager">
              <li><a href="#">Previous</a></li>
              <li><a href="#">Next</a></li>
            </ul>
          </nav>

        </div><!-- /.blog-main -->
      </div><!-- /.row -->

    <footer class="blog-footer">

      <div class="container" ng-controller="groupPostCtrl">
        <h1>{{message}}</h1>
        <form class="form-groupPost" role="form" method="post">
        <div class="row" style="width: 480px;">
          <section class="panel panel-info">
            <header class="panel-heading">
              <div class="row">
                <div class="col-xs-4"> <h4>Post a message </h4></div>
              </div>
            </header>
          <section class="row panel-body">
            <section class="col-md-6">
                          <!--LEFT for groupname. Delete Later-->
                            <class="form-control" ng-model="formData.groupname">
                            <h4> Post text: </h4>
                            <textarea rows = "4" cols = "50" ng-model="formData.text"></textarea>
                            <!--LEFT for timestamp. Delete Later-->
                            <class="form-control" ng-model="formData.timestamp"> <br>
                            <button class="btn" class="form-control" ng-click="sub(formData)"><span class="glyphicon glyphicon-pushpin" type="submit" aria-hidden="true"></span> Post </button>
                        </section>
                       </section>
                      </section>
                      </div>
                      </form>
                    </div>

      <h6>Project Collab page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var freelanceBuilder = `<div class="blog-masthead">
        <div class="container">
          <nav class="blog-nav">
            <a class="blog-nav-item active" href="#">Work</a>
            <a class="blog-nav-item" href="#">Filter</a>
            <a class="blog-nav-item" href="#">Post</a>
          </nav>
        </div>
      </div>

      <div class="container">

        <div class="blog-header">
          <h1 class="blog-title">Freelance Work</h1>
          <p class="lead blog-description">Search for or post a job that you would like done.</p>
        </div>

        <div class="row">
          <div class="col-sm-8 blog-main">

            <div class="blog-post">
              <h2 class="blog-post-title">This would be a title</h2>
              <p class="blog-post-meta">January 1, 2014 by <a href="#">Finn</a></p>

             <p>This would be a description entered by the user to briefly describe their work, or what they want done for any freelancers to know.</p>
             <hr>
             <p>Subnotes can be added and used, such as this. This could be any recent comments or updates. <a href="#">link inserted</a>, Describe describe Describe Describe Describe Describe Describe Describe Describe Describe Describe </p>
              <blockquote>
             <p>Anything important? <strong>Yes Important</strong> But actually, maybe something important?????? Who knows, unless you actually read.</p>
              </blockquote>
              <p>Bla..... <em>italics, cool.</em> Describe Describe Describe Describe Describe Describe</p>

              <h2>Projects</h2>
             <p>LIST?</p>
             <h3>Sub-heading</h3>
             <p>Different sizes and whatnot.</p>
             <pre><code>Code Block</code></pre>
             <p>My code says Code Block. It is missing a semi-colon.</p>
             <h3>You get the point...</h3>
             <p>From here out is random gibberish in another language that I did not bother removing or typing over. But it shows how the rest of the page would look, in this blog-like format.</p>
            <ul>
              <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
              <li>Donec id elit non mi porta gravida at eget metus.</li>
              <li>Nulla vitae elit libero, a pharetra augue.</li>
            </ul>
            <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
            <ol>
              <li>Vestibulum id ligula porta felis euismod semper.</li>
              <li>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</li>
              <li>Maecenas sed diam eget risus varius blandit sit amet non magna.</li>
            </ol>
            <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.</p>
          </div><!-- /.blog-post -->

          <div class="blog-post">
            <h2 class="blog-post-title">Another blog post</h2>
            <p class="blog-post-meta">December 23, 2013 by <a href="#">Jacob</a></p>

            <p>Cum sociis natoque penatibus et magnis <a href="#">dis parturient montes</a>, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
            <blockquote>
              <p>Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna mollis</strong> ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
            </blockquote>
            <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
            <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          </div><!-- /.blog-post -->

          <div class="blog-post">
            <h2 class="blog-post-title">New feature</h2>
            <p class="blog-post-meta">December 14, 2013 by <a href="#">Chris</a></p>

            <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
            <ul>
              <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
              <li>Donec id elit non mi porta gravida at eget metus.</li>
              <li>Nulla vitae elit libero, a pharetra augue.</li>
            </ul>
            <p>Etiam porta <em>sem malesuada magna</em> mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.</p>
            <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
          </div><!-- /.blog-post -->

          <nav>
            <ul class="pager">
              <li><a href="#">Previous</a></li>
              <li><a href="#">Next</a></li>
            </ul>
          </nav>

        </div><!-- /.blog-main -->

        <div class="col-sm-3 col-sm-offset-1 blog-sidebar">
          <div class="sidebar-module sidebar-module-inset">
            <h4>About</h4>
            <p>This is a side column with the page. We can or dont have to use it. This page is just a sample to DISPLAY how a page may look. Hi guys.</p>
          </div>
          <div class="sidebar-module">
            <h4>Archives</h4>
            <ol class="list-unstyled">
              <li><a href="#">March 2014</a></li>
              <li><a href="#">February 2014</a></li>
              <li><a href="#">January 2014</a></li>
              <li><a href="#">December 2013</a></li>
              <li><a href="#">November 2013</a></li>
              <li><a href="#">October 2013</a></li>
              <li><a href="#">September 2013</a></li>
              <li><a href="#">August 2013</a></li>
              <li><a href="#">July 2013</a></li>
              <li><a href="#">June 2013</a></li>
              <li><a href="#">May 2013</a></li>
              <li><a href="#">April 2013</a></li>
            </ol>
          </div>
          <div class="sidebar-module">
            <h4>Elsewhere</h4>
            <ol class="list-unstyled">
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Facebook</a></li>
            </ol>
          </div>
        </div><!-- /.blog-sidebar -->

      </div><!-- /.row -->

    </div><!-- /.container -->

    <footer class="blog-footer">
      <h6> Freelane Work page built for NodesConnect </h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var textBuilder = `<H1> Title your post:</H1>

      <input type="text" class="form-control" placeholder="Title" aria-describedby="sizing-addon1" style="width: 300px;">
      <label></label>

      <textarea name="area3" style="width: 1000px; height: 500px;"> </textarea>


    <footer class="blog-footer">
      <h6>Text Editor page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var projectBuilder =`<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand">My Projects</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#All">All Projects <span class="sr-only">(current)</span></a></li>
        <li><a data-toggle="tab" href="#Posted">Posted by Me</a> </li>
        <li><a data-toggle="tab" href="#Collaborator">Collaborator</a></li>
      </ul>

      <div class="tab-content">
            <div id="All" class="tab-pane fade in active">
                <h3>PUT ALL PROJECTS HERE</h3>
            </div>
            <div id="Posted" class="tab-pane fade">
                <h3>PUT POSTED BY ME HERE</h3>
            </div>
            <div id="Collaborator" class="tab-pane fade">
                <h3>PUT COLLABORATOR PROJECTS HERE</h3>
            </div>
        </div>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>


    <footer class="blog-footer">
      <h6>Projects page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var searchBuilder = `<h2>Enter a Search</h2>
          <div class = "row">
          <div class = "col-lg-6">
            <input type="text" class="form-control" placeholder="Search...">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="caret"></span></button>
            <ul class="SearchPage dropdown-menu" style = "width: 200px">
              <li>
                <div class="form-group" >
                  <label for="filter">Search in:</label>
                  <select class="form-control">
                    <option value="0" selected>All</option>
                    <option value="1">Projects</option>
                    <option value="2">Freelance Work</option>
                    <option value="3">Q&A</option>
                    <option value="4">People</option>
                  </select>
                </div>
              </li> <label></label>
             <li>
              <label for="contain">Contains the words</label>
              <input class="form-control" type="text" />
            </li> <label></label>
            <button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
          </ul>
        </div>
      </div>

            <p>Search Results:</p>

            <ul>
               <li>FILL ME</li>
                <li>FILL ME</li>
                <li>FILL ME</li>
              </ul>

            <nav>
            <ul class="pager">
              <li><a href="#">Previous</a></li>
              <li><a href="#">Next</a></li>
            </ul>
          </nav>

    </div>

    <footer class="blog-footer">
      <h6>Search page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var settingsBuilder = `<nav class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand">Settings</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#General">General <span class="sr-only">(current)</span></a></li>
                        <li><a data-toggle="tab" href="#privacy">Privacy</a></li>
                        <li><a data-toggle="tab" href="#blocked">Blocked</a></li>
                    </ul>

      <div class="tab-content">
            <div id="General" class="tab-pane fade in active">
                <p>PUT GENERAL SETTINGS HERE</p>
            </div>
            <div id="privacy" class="tab-pane fade">
                <h3>PUT PRIVACY SETTINGS HERE</h3>
            </div>
            <div id="blocked" class="tab-pane fade">
                <h3>PUT BLOCKED SETTINGS HERE</h3>
            </div>
        </div>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

        <footer class="blog-footer">
            <h6>Settings page built for NodesConnect</h6>
            <p>
                <a href="#">Back to top</a>
            </p>
        </footer>`;

        var  profileBuilder = `<!-- START OF -> PROFILE DISPLAY -->
      <div id="userProfile" ng-controller="userProfile"><p ng-bind="txt">
         <!-- under this div a user's profile will be generated, it is identified by it's controller/div id-->
      </p></div>
      <!-- END OF -> PROFILE DISPLAY -->

      <div class="container" align = "center">
        <div class="row">
          <div class="col-md-9">
            <div class="panel panel-default" align = "center">
              <div class="panel-body" align = "center">
                <div class="row">
                  <div class="col-xs-12 col-sm-8">
                    <h2>Finn The Human</h2>
                     <p><strong>About: </strong> Programmer; Rowan University Graduate. </p>
                     <p><strong>Current Projects: </strong><a href="https://www.google.com/?gws_rd=ssl"> NodesConnect </a>, <a href="http://happywheelsaz.com/datacenter/imgs/flappy-bird.jpg">FlappyBird</a>, <a href="https://www.halowaypoint.com/en-us">Halo 9 </p>
                     <p><strong>Languages: </strong>
                     <span class="label label-info tags">Java</span>
                     <span class="label label-info tags">HTML</span>
                     <span class="label label-info tags">LISP</span>
                     <span class="label label-info tags">Swift</span>
                      </p>
                  </div><!--/col-->
                  <div class="col-xs-12 col-sm-4 text-center">
                    <img class="center-block img-circle img-responsive" alt="" src="http://img03.deviantart.net/32e0/i/2013/160/d/a/finn_the_human_by_andiscissorhands-d68g4d3.jpg">
                    <ul title="Ratings" class="list-inline ratings text-center">
                      <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                      <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                      <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                      <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                      <li><a href="#"><span class="fa fa-star fa-lg"></span></a></li>
                    </ul>
                  </div><!--/col-->

                  <div class="col-xs-12 col-sm-4">
                    <h2><strong> 117 </strong></h2>
                    <p><small>Reward Points</small></p>
                    <button class="btn btn-success btn-block"><span class="fa fa-plus-circle"></span> <span class="glyphicon glyphicon-phone" aria-hidden="true"></span> Social Medias </button>
                  </div><!--/col-->
                  <div class="col-xs-12 col-sm-4">
                    <h2><strong>24</strong></h2>
                   <p><small>Connections</small></p>
                    <button class="btn btn-info btn-block"><span class="fa fa-user"></span> <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add </button>
                  </div><!--/col-->
                  <div class="col-xs-12 col-sm-4">
                   <h2><strong>+43</strong></h2>
                   <p><small>Karma</small></p>
                    <button class="btn btn-primary btn-block" type="button"><span class="fa fa-gear"></span> <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Contact </button>
                  </div><!--/col-->
               </div><!--/row-->
            </div><!--/panel-body-->
        </div><!--/panel-->
    </div>
  </div>
</div>

<footer class="blog-footer">
      <h6>Profile page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    var helpBuilder = `<h1> Need Help?</h1>
     <h3> NodesConnect is currently in its early stages. There may be a few issues, however the site is hopefully easy to navigate. For any questions or to contact us, email @Rowan.edu</h3>
     <h4> To log out, press the NodesConnect in the top left corner, or press Sign out. </h4>


    <footer class="blog-footer">
      <h6>Help page built for NodesConnect</h6>
      <p>
        <a href="#">Back to top</a>
      </p>
    </footer>`;

    console.log(param);
    switch(param){
      case 0:
      console.log("case 0");
      return homeBuilder;
      break;
      case 1:
        console.log("case 1");
      return qandaBuilder;
      break;
      case 2:
        console.log("case 2");
        return collabBuilder;
        break;
      case 3:
        console.log("case 3");
        return freelanceBuilder;
        break;
      case 4:
        console.log("case 4");
        return textBuilder;
        break;
      case 5:
        console.log("case 5");
        return projectBuilder;
        break;
      case 6:
        console.log("case 6");
        return searchBuilder;
        break;
      case 7:
        console.log("case 7");
        return settingsBuilder;
        break;
      case 8:
        console.log("case 8");
        return profileBuilder;
        break;
        case 9:
        console.log("case 9");
        return helpBuilder;
        break;
      default:
        console.log("case default");
      return homeBuilder;
      break;
    }

}

function pageGen(param) {

document.getElementById("pageGen").innerHTML = generatePage(param);
}

pageGen(0);
