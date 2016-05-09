var socket = io.connect('http://localhost:8000');

// Taken from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getParameterUrl(sParam) {
  var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('?');
	for (var i = 0; i < sURLVariables.length; i++)
	{
	  var sParameterName = sURLVariables[i].split('=');
	  if (sParameterName[0] == sParam)
	  {
	    return sParameterName[1];
	  }
	}

  return null;
}

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
	// call the server-side function 'adduser' and send one parameter (value of prompt)
  var otheruser = getParameterUrl('user');

  if (otheruser == sessionStorage.username) {
    otheruser = null;
  }

	socket.emit('adduser', sessionStorage.username, otheruser);
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
  time = new Date().toLocaleString();

  var scroll = document.getElementById('conversation');
  var oldScrollHeight = scroll.scrollHeight;
  var oldScrollTop = scroll.scrollTop;

  $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>' + time + '<br>');

  if(oldScrollTop + scroll.clientHeight === oldScrollHeight) {
    scroll.scrollTop = scroll.scrollHeight;
  }
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
	$('#users').empty();

  // Matches username and otheruser
  if(sessionStorage.username == data['username'] && data['otheruser']) {
    sessionStorage.otheruser = data['otheruser'];
  }

  // Checks if not null
  if(typeof sessionStorage.otheruser === 'string') {
    // Creates info for other user chat
    $('#users').append('<a href="?">Return to General</a><br><br>');
    $('#users').append(sessionStorage.username + '<br>');
    $('#users').append(sessionStorage.otheruser + '<br>');
  } else {
    $('#users').append(sessionStorage.username + '<br>');
  }

  $('#users').append('<br>');

  // Generates the list of available users
	$.each(data['users'], function(index, value) {
    if(value !== sessionStorage.username && (!sessionStorage.otheruser || value !== sessionStorage.otheruser)) {
		    $('#users').append('<a href="?user=' + value + '">' + value + '</a><br>');
    }
	});
});

$(window).unload(function() {
  socket.emit('disconnect');

  sessionStorage.removeItem('otheruser');
});

// on load of page
$(function(){
	// when the client clicks SEND
	$('#datasend').click( function() {
		var message = $('#data').val();
    if(message.length > 0) {
		  $('#data').val('');
		  // tell server to execute 'sendchat' and send along one parameter
		  socket.emit('sendchat', message);
    }
	});

	// when the client hits ENTER on their keyboard
	$('#data').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#datasend').focus().click();
		}
	});

  // On click, switch to user
  $('#users a').click(function() {
    $('#conversation').clear();
    var otheruser = getParameterUrl('user');
    if(otheruser !== socket.username) {
      socket.emit('switchuser', otheruser);
    }
  });
});
