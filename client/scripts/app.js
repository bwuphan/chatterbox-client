// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  friends: [],
  init: function(){
    var thisContext = this;
    // $(document).on('click', '.username', function(){
    //   friends.push(this.text());
    // })
    setInterval(function(){
      thisContext.fetch();
    }, 2000);
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
    var context = this;
    $('#chats').empty();

    for(var i = 0; i < messages.length; i++){
      var oneMessage ='<div><span class="username">' + messages[i].username + "</span> : " + messages[i].text + '</div>';
      $('#chats').append('<div>' + oneMessage + '</div>')

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

