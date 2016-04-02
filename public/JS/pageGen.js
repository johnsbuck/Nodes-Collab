//Hand me a JSON file to parse into a post style forum page


function generate(param){

  var homeBuilder = `<h2>Recent Post Activity</h2>
       <hr>
       <div id="tableGen"></div>

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

    switch(param){
      case 0:
      return homeBuilder;
      break;
      case 1:
      return qandaBuilder;
      break;
      default: 
      return homeBuilder;
      break;
    }
    
}

document.getElementById("pageGen").innerHTML = generate();
