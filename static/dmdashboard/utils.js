if ($('.flash').is(":empty")) {
    $(".flash").hide();
}

$(function () {
    $('#party-tab a:first').tab('show')
})

$(function () {
  $('.ammunition-property').popover({
    title: "Ammunition Property",
    content: "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack. At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield."
  })
})

$(function () {
  $('.finesse-property').popover({
    title: "Finesse Property",
    content: "When making an attack with a finesse weapon, you use your choice o f your Strength or Dexterity modifier for the attack and damage rolls. You must use the same modifier for both rolls. "
  })
})

$(function () {
  $('.heavy-property').popover({
    title: "Heavy Property",
    content: "Small creatures have disadvantage on attack rolls with heavy weapons. A heavy weapon's size and bulk make it too large for a Small creature to use effectively."
  })
})

$(function () {
  $('.light-property').popover({
    title: "Light Property",
    content: "A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons."
  })
})

$(function () {
  $('.loading-property').popover({
    title: "Loading Property",
    content: "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make."
    })
});

$(function () {
  $('.range-property').popover({
    title: "Range Property",
    content: "A weapon that can be used to make a ranged attack has a range shown in parentheses after the ammunition or thrown property. The range lists two numbers. The first is the weapon's normal range in feet, and the second indicates the weapon's maximum range. When attacking a target beyond normal range, you have disadvantage on the attack roll. You can't attack a target beyond the weapon's long range."
  })
})

$(function () {
  $('.reach-property').popover({
    title: "Reach Property",
    content: "This weapon adds 5 feet to your reach when you attack with it."
  })
})

$(function () {
  $('.special-property').popover({
    title: "Special Property",
    content: "A weapon with the special property has unusual rules governing its use, explained in the weapon's description."
  })
})

$(function () {
  $('.thrown-property').popover({
    title: "Thrown Property",
    content: "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your Strength, but if you throw a dagger, you can use either your Strength or your Dexterity, since the dagger has the finesse property."
  })
})

$(function () {
  $('.two-handed-property').popover({
    title: "Two-Handed Property",
    content: "This weapon requires two hands to use."
  })
})

$(function () {
  $('.versatile-property').popover({
    title: "Versatile Property",
    content: "This weapon can be used with one or two hands. A damage value in parentheses appears with the property—the damage when the weapon is used with two hands to make a melee attack."
  })
})

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
        $(".flash").addClass('bg-danger');
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

$('#edit-character').on('show.bs.modal', function(e) {
    console.log('opened character edit modal');
    $(".character-link").removeClass("editing");
    var slug = ($(e.relatedTarget).data('slug'));

    $(e.relatedTarget).addClass("editing");

    get_character_info(slug);
});

$("#edit-party-form").submit(function(e) {
    e.preventDefault();
    var slug = ($(".party-link.editing").data('slug'));
    console.log("editing party");

    edit_party(slug);
});

$("#edit-party-form button.delete").click(function(e) {
    console.log('deleting this bad boy.');

    var slug = ($(".party-link.editing").data('slug'));

    delete_party(slug);
});

$("#edit-character-form").submit(function(e) {
    e.preventDefault();
    var slug = ($(".character-link.editing").data('slug'));
    console.log(`editing character ${slug}`);

    edit_character(slug);
});

$("#edit-character-form button.delete").click(function(e) {
    console.log('deleting this bad boy.');

    var slug = ($(".character-link.editing").data('slug'));

    delete_character(slug);
});

$('.modal').on('hide.bs.modal', function(e) {
    this.querySelector('form').reset();
});


function goToPage(sender, pageClass) {
    var target = sender.getAttribute("data-target");
    var pages = Array.prototype.slice.call(document.getElementsByClassName(pageClass));
    for (index in pages) {
        if (target == pages[index].getAttribute("data-id")) {
            pages[index].className = pageClass + " initial-display";
        }
        else {
            pages[index].className = pageClass + " no-display"
        }
    }
}


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
            $(".flash").addClass('bg-danger');
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
            $(".flash").addClass('bg-danger');
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
            $(".flash").removeClass('bg-danger');
            $(".flash").addClass('bg-success');
            $("#create-party").modal('hide');
            $(".flash").show().delay(3000).fadeOut();
            $('#parties').load(' #parties', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html($("#party-name").val() + xhr.responseText);
            $("#party-name").val("");
            $(".flash").removeClass('bg-success');
            $(".flash").addClass('bg-danger');
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
            $('#edit-party-name').val(response.party_name);
            $('#edit-active').prop("checked", response.isActive);
            var characterChecks = document.querySelectorAll(".character-check");
            for(check of characterChecks) {
                if($.inArray(check.name, response.characters) != -1){
                    $(check).prop("checked", true);
                }
            }
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
            active: document.querySelector('#edit-active').checked,
            characters: $('#edit-character-choices input:checkbox:checked').map(function() {
                return this.value;
            }).get(),
        },
        success: function(response) {
            $(".flash").html(response);
            $(".flash").removeClass('bg-danger');
            $(".flash").addClass('bg-success');
            $("#edit-party").modal('hide');
            $("#edit-party-name").val("");
            $(".flash").show().delay(3000).fadeOut();
            $('#parties').load(' #parties', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseJSON.message);
            $("#edit-party-name").val(xhr.responseJSON.original);
            $(".flash").removeClass('bg-success');
            $(".flash").addClass('bg-danger');
            $(".flash").show().delay(3000).fadeOut();;
        }
    })
}

function delete_party(name) {
    setupAjax();

    var confirm = window.confirm("Are you sure you want to delete this party?");

    if(!confirm) {
        console.log("delete canceled.");
        return
    }
    else {
        console.log('delete confirmed');
    }

    $.ajax({
        url: `/party/${name}/`,
        type: "DELETE",
        success: function(response) {
            $(".flash").html(response);
            $(".flash").removeClass('bg-danger');
            $(".flash").addClass('bg-success');
            $("#edit-party").modal('hide');
            $(".flash").show().delay(3000).fadeOut();
            $('#parties').load(' #parties', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseJSON.message);
            $(".flash").addClass('bg-danger');
            $(".flash").show().delay(5000).fadeOut();
            $("#edit-character-form")[0].reset();
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
            $(".flash").addClass('bg-success');
            $("#create-character").modal('hide');
            $(".flash").show().delay(3000).fadeOut();
            $('#characters').load(' #characters', function(){$(this).children().unwrap()})
            $('#character-choices').load(' #character-choices', function(){$(this).children().unwrap()})
            $('#edit-character-choices').load(' #edit-character-choices', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseText);
            $(".flash").addClass('bg-danger');
            $(".flash").show().delay(5000).fadeOut();
            $("#create-character-form")[0].reset();
        }
    })
}

function get_character_info(name) {
    setupAjax();

    $.ajax({
        url: `/character/${name}/`,
        type: "GET",
        success: function(response) {
            response = JSON.parse(response);
            console.log(response)
            $("#edit-character-name").val(response[0].fields.name);
            $("#edit-race").val(response[0].fields.race);
            $("#edit-class").val(response[0].fields.char_class);
            $("#edit-background").val(response[0].fields.background);
            $("#edit-alignment").val(response[0].fields.alignment);
            $("#edit-armor-class").val(response[0].fields.armor_class);
            $("#edit-passive-perception").val(response[0].fields.passive_perception);
            $("#edit-spell-dc").val(response[0].fields.spell_dc);



        },
        error: function(xhr, errmsg, err) {
            console.log(xhr.responseText);
        }
    })
}

function edit_character(name) {
    setupAjax();

    $.ajax({
        url: `/character/${name}/`,
        type: 'POST',
        data: {
            character_name: $('#edit-character-name').val(),
            race: $('#edit-race').val(),
            char_class: $('#edit-class').val(),
            background: $('#edit-background').val(),
            alignment: $('#edit-alignment').val(),
            armor_class: $('#edit-armor-class').val(),
            passive_perception: $('#edit-passive-perception').val(),
            spell_dc: $('#edit-spell-dc').val(),
        },
        success: function(response) {
            $(".flash").html(response);
            $(".flash").addClass('bg-success');
            $("#edit-character").modal('hide');
            $(".flash").show().delay(3000).fadeOut();
            $('#characters').load(' #characters', function(){$(this).children().unwrap()})
            $('#character-choices').load(' #character-choices', function(){$(this).children().unwrap()})
            $('#edit-character-choices').load(' #edit-character-choices', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseJSON.message);
            $(".flash").addClass('bg-danger');
            $(".flash").show().delay(5000).fadeOut();
            $("#edit-character-form")[0].reset();
        }
    })
}

function delete_character(name) {
    setupAjax();

    var confirm = window.confirm("Are you sure you want to delete this character?");

    if(!confirm) {
        console.log("delete canceled.");
        return
    }
    else {
        console.log('delete confirmed');
    }

    $.ajax({
        url: `/character/${name}/`,
        type: "DELETE",
        success: function(response) {
            $(".flash").html(response);
            $(".flash").addClass('bg-success');
            $("#edit-character").modal('hide');
            $(".flash").show().delay(3000).fadeOut();
            $('#characters').load(' #characters', function(){$(this).children().unwrap()})
        },
        error: function(xhr, errmsg, err) {
            $(".flash").html(xhr.responseJSON.message);
            $(".flash").addClass('bg-danger');
            $(".flash").show().delay(5000).fadeOut();
            $("#edit-character-form")[0].reset();
        }
    })
}

