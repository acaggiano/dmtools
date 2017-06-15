var csrftoken = getCookie('csrftoken');

$('#login-form').submit(function(e) {
    e.preventDefault();
    console.log('logging in');
    log_in();
});

if ($('#bad-login').is(":empty")) {
    $("#bad-login").hide();
}

$("#register-form").submit(function(e) {
	e.preventDefault();
	console.log("registering");
    if($("#input2").val() != $("#checkinput").val()){
        $("#bad-login").html('Your passwords do not match!');
        $("#bad-login").show();
    }
    else {
	   register_user();
    }
})

function log_in() {

	setupAjax();

	$.ajax({
    	url: "/login/",
    	type: "POST",
    	data: { 
    		email: $('#email').val(),
    		secret: $('#input2').val()
    	},
    	success: function(response){
            window.location = response.url;
    		
    	},
    	error: function(xhr, errmsg, err) {
            $("#bad-login").html(xhr.responseText);
            $("#bad-login").show();
    	}

    })
}

function register_user() {

	setupAjax();

	$.ajax({
		url: "/register/",
		type: "POST",
		data: {
			email: $('#email').val(),
    		secret: $('#input2').val(),
    		secretCheck: $("#checkinput").val()
		},
        success: function(response) {
            window.location = response.url;
        },
        error: function(xhr, errmsg, err) {
            $("#bad-login").html(xhr.responseText);
            $("#bad-login").show();
        }
	});
}

function setupAjax() {
	$.ajaxSetup({ 
		beforeSend: function(xhr, settings) { 
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) { 
				xhr.setRequestHeader("X-CSRFToken", csrftoken); 
			} 
		} 
	});
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function csrfSafeMethod(method) { 
	// these HTTP methods do not require CSRF protection 
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)); 
} 



