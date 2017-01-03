// YOUR CODE HERE:
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  friends: {},
  rooms: {'All': 0},
  currentRoom: 'All',
  init: function(){
    var thisContext = this;
    thisContext.fetch();
    setInterval(function(){
      thisContext.fetch();
    }, 1000);
    //Send button click handler
    $('.sendbutton').click(function() {
      if($('input.newroom').val()){
        thisContext.currentRoom = $('input.newroom').val();
      }
      var message = {
        text: $('textarea.message').val(),
        username:window.location.search.slice(10),
        roomname: thisContext.currentRoom
      }
      //send to server and process response
      thisContext.send(message);
    });
    //Chatroom change click handler
    $('.chatrooms').change(function(){
      thisContext.currentRoom = $('.chatrooms option:selected').val();
    });
    //Friend click handler
    $(document).on('click', '.username', function(){
      var username = $(this).text();
      thisContext.friends[username] = username;
    });
  },
  send: function(message){
    var thisContext = this;
    $.ajax({
      url: thisContext.server,
      type: 'POST',
      data: JSON.stringify(message)
    });
  },
  fetch: function(){
    var thisContext = this;
    $.ajax({
      url: thisContext.server,
      type: 'GET',
      success: function(response) {
        var messages = response.results;
        thisContext.displayMessages(messages);
      },
      error: function(){
        console.log('error')
      }
    });
  },
  displayMessages: function(messages){
    var thisContext = this;
    for(var key in thisContext.friends){
      console.log(key);
    }
    thisContext.clearMessages();
    for(var i = 0; i < messages.length; i++){
      var escapedUsername = escapeHtml(messages[i].username);
      var escapedMessage = escapeHtml(messages[i].text);
      var escapedRoomname = escapeHtml(messages[i].roomname);
      if(!(messages[i].roomname in thisContext.rooms)){
        thisContext.rooms[messages[i].roomname] = 0;
        $('.chatrooms').append($('<option>', {value: escapedRoomname, text:escapedRoomname}));
      }
      //$('select').append($('<option>', {value:1, text:'One'}));
      if(messages[i].roomname === thisContext.currentRoom || thisContext.currentRoom === 'All'){
        if(messages[i].username in thisContext.friends){
          var oneMessage = '<span class="username">' + escapedUsername + '</span><div class="usertext friend">' + escapedMessage + '</div>';
        } else {
          var oneMessage = '<span class="username">' + escapedUsername + '</span><div class="usertext">' + escapedMessage + '</div>';
          // var oneMessage ='<div><span class="username">' + messages[i].username + "</span> : " + messages[i].text + '</div>';
        }
        $('#chats').append(oneMessage);
      }
    }
  },
  clearMessages: function(){
    $('#chats').children().remove();
  },
  renderMessage: function(message){
    $('#chats').append('<div>' + JSON.stringify(message) + '</div>');
  },
  renderRoom: function(room){
    $('#roomSelect').append('<div>' + JSON.stringify(room) + '</div>');
  },
  // $(document).on('click', '.username', function(){
  //   friends.push(this.text());
  // })
};


$(document).ready(function(){
  app.init();
});

