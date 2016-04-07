/*
* Attributes to do:
* about_text
* karma_points
* connections table/multivalue attribute OR just # of connections here?
* profilePic (file/URL?)
**/

/**Hand a JSON containing
{ "profile" :
    [ { "username":"ex_user",
        "about_text" : "ex_about_text",
        "karma_points" : "ex_karma_points",
        "reward_points" : "ex_reward_points",
        "no_connections":"ex_no_connections"} ],
  "user_projects" :
    [ {"name" : "ex_projectname",   //we also need project URLs, etc. How to represent in JSON?
      //so on...
    }],
  "user_languages" :
    [{"name" : "ex_language",
      //and so on...
    }]
  }
**/
function generateProfile(data)
{
  var obj = JSON.parse(data);   //parse the JSON into an object we can use to generate HTML
  /**
  TODO: project links need to be passed from JSON.
  **/
  var divBuilder = `<div class="panel panel-default" align = "center">
  <div class="panel-body" align = "center">
              <div class="row">
                    <div class="col-xs-12 col-sm-8">
                        <h2>` + obj.profile[0].username + `</h2>
                        <p><strong>About: </strong> ` + obj.profile[0].about_text + `</p>
                        <p><strong>Current Projects: </strong><a href="https://www.google.com/?gws_rd=ssl"> ` + expandProfileProjectList(obj.user_projects) + ` </a>, <a href="http://happywheelsaz.com/datacenter/imgs/flappy-bird.jpg">FlappyBird</a>, <a href="https://www.halowaypoint.com/en-us">Halo 9 </p>
                        <p><strong>Languages: </strong>
                            `+ expandLanguagesList(obj.user_languages) + `
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
                        <h2><strong> `+ obj.profile[0].reward_points + ` </strong></h2>
                        <p><small>Reward Points</small></p>
                        <button class="btn btn-success btn-block"><span class="fa fa-plus-circle"></span> <span class="glyphicon glyphicon-phone" aria-hidden="true"></span> Social Medias </button>
                    </div><!--/col-->
                    <div class="col-xs-12 col-sm-4">
                        <h2><strong>`+ obj.profile[0].no_connections + `</strong></h2>
                        <p><small>Connections</small></p>
                        <button class="btn btn-info btn-block"><span class="fa fa-user"></span> <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add </button>
                    </div><!--/col-->
                    <div class="col-xs-12 col-sm-4">
                        <h2><strong>`+ obj.profile[0].karma_points + `</strong></h2>
                        <p><small>Karma</small></p>
                        <button class="btn btn-primary btn-block" type="button"><span class="fa fa-gear"></span> <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Contact </button>
                    </div><!--/col-->
              </div><!--/row-->
          </div><!--/panel-body-->
      </div><!--/panel-->`;

  return divBuilder;

}
/**
TODO: Once links are being passed in JSON, this should actually make hrefs, not just text.
**/
function expandProfileProjectList(list){
  var hrefBuilder = ``;
  if(list.length == 0){
    hrefBuilder += "No projects!";
    return hrefBuilder;
  }
  //Keep appending for each project name in the list.
  for(i = 0; i < list.length; i++){
    if(i == 0) {
      hrefBuilder += `` + list[i].name;
    }
    else {
      hrefBuilder += `, ` + list[i].name;
    }
  }
  return hrefBuilder;
}
//Generates span tags for a user's known languages
function expandLanguagesList(list){
  var spanBuilder = ``;
  for each(var lang in list) {
    spanBuilder += `<span class="label label-info tags">` + lang.name +`</span>`;
  }
}
