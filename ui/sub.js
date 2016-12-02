$(function () {

	var isopen_usermenu = false;


	$(".header .user-menu-toggle").on("click", function () {
		if(!isopen_usermenu) {

			// Show menu
			$(".header .user-menu").show();

			//Change arrow
			$(".user-menu-toggle .simple-arrow").removeClass("fa-chevron-down").addClass("fa-chevron-up");
			
			isopen_usermenu = true;
		} else {

			// Close menu
			$(".header .user-menu").hide();


			//Change arrow
			$(".user-menu-toggle .simple-arrow").removeClass("fa-chevron-up").addClass("fa-chevron-down");

			isopen_usermenu = false;
		}
	});

});


function getUsername(){
    $.ajax({
        url: "/check-login",
        success: function(result){
            var userDetails = JSON.parse(result);
            console.log(userDetails);
            var name = userDetails[0].username;
            console.log(name);
            var firstLetter = name[0];
            $('#user-image').html(firstLetter);
            $('#displayname').html(name); 
        }
    });
}






function getAllArticles(){
    $.ajax({
    url: "/allArticles",
    success: function(result){
        $('#articleBox').html("");
        var allArticles = JSON.parse(result);
        for(var i = 0;i < allArticles.length; i++){
            var article = allArticles[i];
            var Box = `<div class="col-md-6 item">
                            <div class="item-in">
                                <h4>${article.title}</h4>
                                <div class="seperator"></div>
                                <p>${article.content}</p>
                                <a href = "http://abito12.imad.hasura-app.io/articles/${article.id}">Read More
                                <i class="fa fa-long-arrow-right"></i>
                                </a>
                            </div>
                        </div>`;
            $('#articleBox').append(Box);
            
        }
    }
});
}



function getMyArticles(){
    $.ajax({
    url: "/MyArticles",
    success: function(result){
        $('#articleBox').html("");
        var myArticles = JSON.parse(result);
        $('#sub-header').html("You have published " +myArticles.length + " articles");
        for(var i = 0;i < myArticles.length; i++){
            var article = myArticles[i];
            var Box = `<div class="col-md-6 item">
                            <div class="item-in">
                                <h4>${article.title}</h4>
                                <div class="seperator"></div>
                                <p>${article.content}</p>
                                <a href = "http://abito12.imad.hasura-app.io/articles/${article.id}">Read More
                                <i class="fa fa-long-arrow-right"></i>
                                </a>
                                 <a id="edit-link" href = "http://abito12.imad.hasura-app.io/editArticle/${article.id}">Edit Article
                                <i class="fa fa-long-arrow-right"></i>
                                </a>
                            </div>
                        </div>`;
            $('#articleBox').append(Box);
            
        }
    }
});
}

var noclicks = 0;
function getArticlesByLike(){
    $.ajax({
    url: "/LikedArticles",
    success: function(result){
        $('#articleBox').html("");
        var myArticles = JSON.parse(result);
        console.log(myArticles);
        $('#sub-header').html("The most liked " +myArticles.length + " articles");
        for(var i = 0;i < myArticles.length; i++){
            var article = myArticles[i];
            var Box = `<div class="col-md-6 item">
                            <div class="item-in">
                                <h4>${article.title}</h4>
                                <div class="seperator"></div>
                                <p>${article.content}</p>
                                <a href = "http://abito12.imad.hasura-app.io/articles/${article.id}">Read More
                                <i class="fa fa-long-arrow-right"></i>
                                </a>
                                 <a id="edit-link" href = "http://abito12.imad.hasura-app.io/articles/${article.id}" style="text-decoration:none;">${article.likes} Likes
                                <i class="fa fa-long-arrow-right"></i>
                                </a>
                            </div>
                        </div>`;
            $('#articleBox').append(Box);
        }
        $('#options').css("visibility","hidden");
        noclicks +=1;
        document.getElementById('optionsbar').innerHTML = "Likes";
        document.getElementById('orderlikes').innerHTML = "Show All";
        document.getElementById('orderlikes').onclick = getAllArticles2;
    }
});
}

function getAllArticles2(){
    document.getElementById('sub-header').innerHTML = "Have a look at our articles";
    document.getElementById('optionsbar').innerHTML = "Sort articles by";
    document.getElementById('orderlikes').onclick = getArticlesByLike;
    $('#options').css("visibility","hidden");
    getAllArticles();
    noclicks += 1;
}

$(document).ready(function(){
    getAllArticles();
    getUsername();
    var myarticles = document.getElementById('myarticles-btn');
    myarticles.onclick = function(){
        var name = document.getElementById('displayname').innerHTML.toString();
        document.getElementById('main-header').innerHTML = name +" \'s Articles ";
        document.getElementById('new-link').innerHTML = "Write a new article";
        getMyArticles();
    };
    var optionsbar = document.getElementById('optionsbar');
    optionsbar.onclick =  function(){
        noclicks += 1;
        console.log(noclicks);
            if(noclicks % 2 ===0){
    $('#options').css("visibility","hidden");
    }
    if(noclicks % 2 ===1) {
        $('#options').css("visibility","visible");
        document.getElementById("toggle2").checked = false;
        
    }
    };
});


