

$(document).ready(function(){

function lettersOnly(input){
    console.log('hyehye');
    var regex = /[^a-z-]/gi;
    input.value = input.value.replace(regex, " ");
}

function lettersOnly2(input){
    console.log('hyehye');
    var regex = /[^a-z-]/gi;
    input.value = input.value.replace(regex, " ");
}


var submit = document.getElementById('submit-btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
     request.onreadystatechange = function(){
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 500){
              alert('Article could not be added');
          }
          else {
              alert('Article was created');
              window.location.href='http://abito12.imad.hasura-app.io/articles';
          }
      }
  };
  
  var title = document.getElementById('title').value;
  var content = document.getElementById('content').value;
  console.log(content);
  console.log(title);
  request.open('POST', 'http://abito12.imad.hasura-app.io/add-article', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({title:title, content:content}));
  



};
});



