function lettersOnly(input){
     var regex = /[^a-z-^0-9,#]/gi;
    input.value = input.value.replace(regex, " ");
}



function getComments(){
    var key = document.getElementById('key').innerHTML.toString();
    console.log(key)
    $.ajax({
    url: "/comments/" + key,
    success: function(result){
        $('#comments-container').html("");
        var allComments = JSON.parse(result);
        console.log(allComments);
        for(var i = 0;i < allComments.length; i++){
            var comment = allComments[i];
            var Box = `<div class="comment">
        <div class="comment-user">
      <span class="user-details"><span class="username">${comment.username} </span><span>on </span><span>${comment.date.toString()}</span></span>
        </div>
        <div class="comment-text">
            ${comment.body}
        </div>
      </div>`;
            $('#comments-container').append(Box);
            
        }
    }
});
}

$(document).ready(function(){
    getComments();
    
var addBtn = document.getElementById('addBtn');
addBtn.onclick = function(){
      var request = new XMLHttpRequest();
  
  
  request.onreadystatechange = function(){
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 500){
              alert('Comment could not be added');
          }
          else {
              console.log('Comment added');
              getComments();
              document.getElementById('textarea').value = "";
          }
      }
  };
  
  var comment = document.getElementById('textarea').value;
  var Vcomment = comment.trim();
  if(Vcomment.length === 0){
      alert('Comment body cannot be empty');
      document.getElementById('textarea').value ="";
  }
  else{
  var id = document.getElementById('key').innerHTML.toString();
  console.log(comment);
  request.open('POST', 'http://abito12.imad.hasura-app.io/add-comment/' + id , true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({comment:comment}));
  }



};

});


