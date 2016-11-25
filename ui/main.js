$('.tabs .tab').click(function(){
    if ($(this).hasClass('signin')) {
        $('.tabs .tab').removeClass('active');
        $(this).addClass('active');
        $('.cont').hide();
        $('.signin-cont').show();
    } 
    if ($(this).hasClass('signup')) {
        $('.tabs .tab').removeClass('active');
        $(this).addClass('active');
        $('.cont').hide();
        $('.signup-cont').show();
    }
});
$('.container .bg').mousemove(function(e){
    var amountMovedX = (e.pageX * -1 / 30);
    var amountMovedY = (e.pageY * -1 / 9);
    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});



//Login
var submit = document.getElementById('submit-btn');
submit.onclick = function(){
    
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200){
              console.log('user logged in');
              alert('Logged in successfully');
          } else if(request.status ===403){
              alert("Incorrect User Credentials");
          } else if(request.status === 500){
              alert("SERVER ERROR");
          }
      }  
    };








    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://abito12.imad.hasura-app.io/login', true);
    request.send(JSON.stringify({username: username, password: password}));
};