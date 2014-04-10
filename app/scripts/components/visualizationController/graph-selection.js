(function () {
	var $barMenu = $('#barMenu');
	var $pieMenu = $('#pieMenu').hide();
	var $mainMenu = $("#graphMenu");
	var $highchart = $('.highchart-basic');

	$barMenu.addClass('active');

	var index = 0;
	var currentData;
	var search;
	var visual;

	var GraphSelection;
	GraphSelection = function (searchController, visualizationCustom){
		search = searchController;
		visual = visualizationCustom;

		currentData = searchController.dataSet;
	};

	GraphSelection.prototype.setCurrentData = function(newData) {
		currentData = newData;
	}

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
		index++;

		var chartType;

		if($barMenu.hasClass('active')){
			chartType = '<label id="'+index+'" value="'+$mainMenu.val()+'">'+"Bar Chart"+'</label></br><label id="'+index+'" value="'+$barMenu.val()+'">'+$barMenu.find("option:selected").text()+'</label><hr>';


		}
		else if($pieMenu.hasClass('active')){
			chartType = '<label id="'+index+'" value="'+$mainMenu.val()+'">'+"Pie Chart"+'</label></br><label id="'+index+'" value="'+$pieMenu.val()+'">'+$pieMenu.find("option:selected").text()+'</label><hr>';


		}

		var removeGraphOption = '<div  id="'+index+'" class="graphBtnParent"><button type="button" class="graphButton minusButton"><i class="icon-minus"></i></button></div>';

		$('<div  id="'+index+'" class="graphParameter">'+removeGraphOption+chartType+'</div>').appendTo($(this).parent());

		var $removeGraphButton = $("#" + index).find(".graphBtnParent");
		$removeGraphButton.on("click", function() {
			$removeGraphButton.parent().remove();
			$("body").trigger("graphParameterCalled");
		});
	});

	$("body").on("graphParameterCalled", function () {
		if($barMenu.hasClass('active')){
			visual.renderVisualization($highchart, currentData, $barMenu.val(), $mainMenu.val());
		}
		else if($pieMenu.hasClass('active')){
			visual.renderVisualization($highchart, currentData, $pieMenu.val(), $mainMenu.val());
		}
	});

	(typeof exports !== "undefined" && exports !== null ? exports : window).GraphSelection = GraphSelection;
}).call(this);