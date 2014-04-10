var $barMenu = $('#barMenu');
var $pieMenu = $('#pieMenu').hide();
var $mainMenu = $("#graphMenu");
var $graphOpt = $("#graphOptions");

$barMenu.addClass('active');

var i = 0;

$("#graphMenu").on("change", function () {
		if ($mainMenu.val() == "bar") { //The person chose bar graph
			$barMenu.show();
			$pieMenu.hide();
			$barMenu.addClass('active');
			$pieMenu.removeClass('active');
		}

		else if ($mainMenu.val() == "pie") { //User chooses pie chart
			$barMenu.hide();
			$pieMenu.show();
			$barMenu.removeClass('active');
			$pieMenu.addClass('active');
		}
});

$("#addRow").on("click", function () {
	i++;

	if($barMenu.hasClass('active')){
		console.log($mainMenu.val());
		console.log($barMenu.val());
		$('<label id="'+i+'" value="'+$mainMenu.val()+'"></label>asd<label id="'+i+'" value="'+$barMenu.val()+'"></label><br>').appendTo($graphOpt);
	}
	else if($pieMenu.hasClass('active')){
		console.log($mainMenu.val());
		console.log($pieMenu.val());
		$('<label id="'+i+'" value="'+$mainMenu.val()+'"></label>ddd<label id="'+i+'" value="'+$pieMenu.val()+'"></label><br>').appendTo($graphOpt);
	}

});
