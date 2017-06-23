function addPlayer() {
	var player_list = document.getElementById("initiatives-list");

	var row = document.createElement("div");
	row.className = "form-group row";

	var button = document.createElement("i");
	button.innerHTML = "edit";
	button.className = "material-icons col-sm-1";

	var label = document.createElement("label");
	label.className = "name col-sm";
	label.innerHTML = "Enemy";
	label.setAttribute("onblur","setAttribute('contenteditable', 'false')");

	var text = document.createTextNode(" ");

	var input = document.createElement("input");
	input.type = "number";
	input.className = "initiative col-md-5 form-control form-control-sm";

	player_list.appendChild(row)
	row.appendChild(button);
	row.appendChild(label);
	row.appendChild(text);
	row.appendChild(input);
}

function initiativeSort() {

	var output = document.getElementById("output");
	output.innerHTML = "";
	var initiatives = document.getElementsByClassName("initiative");
	var turns = []
	for (var i = 0; i < initiatives.length; i++) {
		var char = initiatives[i].previousElementSibling.innerHTML;
		turns.push({name: char , roll: initiatives[i].value});
	}
	turns.sort(function(a,b){return a.roll - b.roll}).reverse();
	turns.forEach(function(character){
		output.innerHTML = output.innerHTML+ "<li>" + character.name + ": " + character.roll + "</li>";
	});
	$("#initiatives-modal").modal("hide");
}