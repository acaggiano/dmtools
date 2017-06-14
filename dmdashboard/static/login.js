$('#login-form').submit(function(e) {
    e.preventDefault();
    console.log('logged in');
    log_in();
});

function log_in() {

	var csrftoken = getCookie('csrftoken');

	$.ajaxSetup({ 
		beforeSend: function(xhr, settings) { 
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) { 
				xhr.setRequestHeader("X-CSRFToken", csrftoken); 
			} 
		} 
	});

	$.ajax({
    	url: "/login/",
    	type: "POST",
    	data: { 
    		email: $('#email').val(),
    		secret: $('#input2').val()
    	},
    	success: function(response){
    		console.log(response);
    	},
    	error: function(xhr, errmsg, err) {
    		console.log(xhr.responseText);
    	}

    })
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



