var csrftoken = getCookie('csrftoken');

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



if ($('.flash').is(":empty")) {
    $(".flash").hide();
}

// LISTENERS
$('#login-form').submit(function(e) {
    e.preventDefault();
    console.log('logging in');
    log_in();
});

$("#register-form").submit(function(e) {
    e.preventDefault();
    console.log("registering");
    if($("#input2").val() != $("#checkinput").val()){
        $(".flash").html('Your passwords do not match!');
        $(".flash").addClass('card-danger');
        $(".flash").show();
    }
    else {
       register_user();
    }
})

$("#create-party-form").submit(function(e) {
    e.preventDefault();
    console.log("creating new party");

    create_party();
});

$("#create-character-form").submit(function(e) {
    e.preventDefault();
    console.log("creating new character");

    create_character();
});

$('#edit-party').on('show.bs.modal', function(e) {
    console.log('opened edit modal');
    $(".party-link").removeClass("editing");
    var slug = ($(e.relatedTarget).data('slug'));

    $(e.relatedTarget).addClass("editing");

    get_party_info(slug);
});

$("#edit-party-form").submit(function(e) {
    e.preventDefault();
    var slug = ($(".editing").data('slug'));
    console.log("editing party");

    edit_party(slug);
});

// LOGIN AJAX CODE

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
            $(".flash").html(xhr.responseText);
            $(".flash").addClass('card-danger');
            $(".flash").show();
        }

    })
}

// REGISTRATION AJAX CODE
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
            $(".flash").html(xhr.responseText);
            $(".flash").addClass('card-danger');
            $(".flash").show();
        }
    });
}

// PARTY AJAX CODE
function create_party() {

    setupAjax();

    $.ajax({
        url: '/create_party/',
        type: "POST",
        data: {
            party_name: $('#party-name').val(),
            active: document.querySelector('#make-active').checked,
            characters: $('#character-choices input:checkbox:checked').map(function() {
                return this.value;
            }).get(),
        },
        success: function(response) {
            $(".flash").html(response);
            $(".flash").removeClass('card-danger');
            $(".flash").addClass('card-success');
            $("#create-party").modal('hide');
            $("#party-name").val("");
            $(".flash").show().delay(3000).fadeOut();
            $('#parties').load(' #parties', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html($("#party-name").val() + xhr.responseText);
            $("#party-name").val("");
            $(".flash").removeClass('card-success');
            $(".flash").addClass('card-danger');
            $(".flash").show().delay(3000).fadeOut();;
        }
    })
}

function get_party_info(name) {
    setupAjax();

    $.ajax({
        url: `/party/${name}/`,
        type: "GET",
        success: function(response) {
            $('#edit-party-name').val(response.party_name)
            console.log(response.isActive)
            $('#edit-active').prop("checked", response.isActive)
        },
        error: function(xhr, errmsg, err) {
            console.log(xhr.responseText);
        }
    })
}

function edit_party(name) {

    setupAjax();

    $.ajax({
        url: `/party/${name}/`,
        type: "POST",
        data: {
            party_name: $('#edit-party-name').val(),
            active: document.querySelector('#edit-active').checked
        },
        success: function(response) {
            $(".flash").html(response);
            $(".flash").removeClass('card-danger');
            $(".flash").addClass('card-success');
            $("#edit-party").modal('hide');
            $("#edit-party-name").val("");
            $(".flash").show().delay(3000).fadeOut();
            $('#parties').load(' #parties', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseJSON.message);
            $("#edit-party-name").val(xhr.responseJSON.original);
            $(".flash").removeClass('card-success');
            $(".flash").addClass('card-danger');
            $(".flash").show().delay(3000).fadeOut();;
        }
    })
}

// CHARACTER AJAX CODE
function create_character() {

    setupAjax();

    $.ajax({
        url: '/create_character/',
        type: "POST",
        data: {
            character_name: $('#character-name').val(),
            race: $('#race').val(),
            char_class: $('#class').val(),
            background: $('#background').val(),
            alignment: $('#alignment').val(),
            armor_class: $('#armor-class').val(),
            passive_perception: $('#passive-perception').val(),
            spell_dc: $('#spell-dc').val(),

        },
        success: function(response) {
            $(".flash").html(response);
            $(".flash").addClass('card-success');
            $("#create-character").modal('hide');
            $(".flash").show().delay(3000).fadeOut();
            $('#characters').load(' #characters', function(){$(this).children().unwrap()})
            $('#character-choices').load(' #character-choices', function(){$(this).children().unwrap()})
            $("#create-character-form")[0].reset();
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseText);
            $(".flash").addClass('card-danger');
            $(".flash").show().delay(5000).fadeOut();
            $("#create-character-form")[0].reset();
        }
    })
}
