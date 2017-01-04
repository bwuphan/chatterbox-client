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
  firstObject: null,
  init: function(){
    var thisContext = this;
    thisContext.fetch();
    setInterval(function(){
      thisContext.fetch();
    }, 1000);
    //Send button click handler
    $('.sendbutton').click(function() {
      var newRoom = 'lobby';
      if($('input.newroom').val().length > 0){
        var newRoom = $('input.newroom').val();
      }
      var message = {
        text: $('textarea.message').val(),
        username:window.location.search.slice(10),
        roomname: newRoom
      }
      //send to server and process response
      thisContext.send(message);
    });
    //Chatroom change click handler
    $('.chatrooms').change(function(){
      thisContext.currentRoom = $('.chatrooms option:selected').val();
      // if($('input.newroom').val() !== thisContext.currentRoom){
      //   thisContext.currentRoom = $('input.newroom').val();
      // }
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
        if(!_.isEqual(thisContext.firstMessage, messages[0])){
          thisContext.displayMessages(messages);
        }
      },
      error: function(){
        console.log('error')
      }
    });
  },
  displayMessages: function(messages){
    var thisContext = this;
    thisContext.firstObject = messages[0];
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
  getChatrooms: function(){
    var $chatrooms = $('.chatrooms');

  },
  clearMessages: function(){
    $('#chats').children().remove();
  },
  clearChatrooms: function(){
    var thisContext = this;
    $('.chatrooms').children().remove();
    thisContext.rooms = {'All': 0}
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

