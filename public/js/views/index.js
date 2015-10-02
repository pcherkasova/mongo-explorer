
"use strict";

$(document).ready(function () {	
	$("#connectionString").val(exports.DEMO_DB);
	$("#query").val(exports.FIND_QUERY);
	$("#resultHeader").html("Result (top " + exports.ROW_LIMIT + " documents)");
	$("#colLimit").html("(up to " + exports.COL_LIMIT + " cols)");
	
	showStatus(STATUS.NONE);
	
	$("#refreshCollections").click(refreshCollections);
	$("input[name='operation']").change(updateExample);
	$("a[name='run']").click(runQuery);
	
	$("#stop").click(function () { currentRunRequest.abort(); });
	
	configureLogging();	
	refreshCollections();	
	
});



function configureLogging() {
	
	$("a[name='run']").on("click", {step:"1_examples", event:"runQuery", details:""}, logUserEvent);
}


function updateExample() {
	var update = true;
	
	switch ($("#query").val()){
		case "": case exports.FIND_QUERY: case exports.AGGREGATE_QUERY: break;
		default: update = (confirm("Do you want to replace the query text with example?"));
	}
	
	if (!update) return;
	
	var op = $("input:radio[name ='operation']:checked").val(); 
	switch (op) {
		case "find": $("#query").val(exports.FIND_QUERY); break;
		case "aggr": $("#query").val(exports.AGGREGATE_QUERY); break;
		default: alert("wrong name of operation: " + op);
	}
}

var currentRefreshRequest = null;			
function refreshCollections(){
	var input = {conn: $("#connectionString").val()	};
	var collections = $('#collections');
	
	if (currentRefreshRequest != null) { currentRefreshRequest.abort(); };
	currentRefreshRequest = $.getJSON("../api/getCollections", input
		,  
		function( output ) {
			if (output.err){
				collections.empty();
				$("#connectionError").html(JSON.stringify(output.err));
				
			} else {
				collections.empty().append(exports.arrayToHTMLOptions(
					output.res,
					function (o) { return o.name},
					function (o) { return o.name + " (" + o.count + ")" }
					));
					
				$("#collections").val(output.res[Math.min(2, output.res.length - 1)].name); 
				$("#connectionError").html("");
			}
		}).fail(function(jqXHR, status, error){
			collections.empty();
			$("#connectionError").html(JSON.stringify({jqXHR:jqXHR, status:status, error:error}));
		});
}

var currentRunRequest = null;				
function runQuery() {
	if (!$("#collections").val()){
		alert("Please, select collection");
		return;
	}
	
	showStatus(STATUS.PROGRESS);

	var input = {
		conn: $("#connectionString").val(),
		coll: $("#collections").val(),
		q: $("#query").val(),
		operation:  $("input:radio[name ='operation']:checked").val()
	};

	if (currentRunRequest != null) {currentRunRequest.abort(); };
	currentRunRequest = $.getJSON("../api/runQuery", input
		,  
		function (output) {
			if (output.err) {
				showStatus(STATUS.ERROR, output.err);
			} else {
				deliverResult(output.res);
			}					
		}).fail(function (jqXHR, status, error) {
			if (status == "abort") {
				showStatus(STATUS.ABORT);
			} else {
				showStatus(STATUS.ERROR, status + " " + error);
			}
		});
}

function deliverResult(arr){
	var delivery = $('input[name=delivery]:checked').val();
	var format = $('input[name=format]:checked').val();
	var filename = $("#collections").val();
	
	var result;
	
	switch (format){
		case "JSON":
			result = JSON.stringify(arr);
			filename = filename + ".json";
			break;
		case "CSV":
			var lineSeparator = "\n";
			if (delivery == "web"){
				lineSeparator = "<br>";
			} 
			result = exports.arrayToCSV(arr, lineSeparator);
			filename = filename + ".csv";
			break;
		case "HTML":
			var tableClass = "";
			if (delivery == "web"){
				tableClass = "w3-table w3-bordered w3-striped";
			}
			result = exports.arrayToHTMLTable(arr, tableClass, exports.COL_LIMIT); 
			filename = filename + ".html";
			break;
	}
	
	if (delivery == "web") {
		showStatus(STATUS.SHOWING_RESULT, result);
	} else {
		exports.download(filename, result);
		showStatus(STATUS.OPENING_FILE);
	}	
}


var STATUS = {
	NONE: 0,
	PROGRESS: 1,
	OPENING_FILE: 2,
	SHOWING_RESULT: 3,
	ERROR: 4,
	ABORT: 5
}

function showStatus(status, details) {
	
	if (status != STATUS.NONE)
		$('html, body').animate({scrollTop: $("#result").offset().top}, 1000);
		
	
	status == STATUS.PROGRESS ? $("#progress").show() : $("#progress").hide();
	status == STATUS.ERROR ? $("#result").addClass("w3-text-red") : $("#result").removeClass("w3-text-red");
	
	
	
	switch (status) {
		case STATUS.NONE: $("#result").html(""); break;
		case STATUS.PROGRESS:  $("#result").html(""); break;
		case STATUS.OPENING_FILE:  $("#result").html("Download started..."); break;
		case STATUS.SHOWING_RESULT: $("#result").html(details); break;
		case STATUS.ERROR:
			if (details.operational) {
				$("#result").html(details.errType + "<br>" + details.details);
			} else {
				$("#result").html("Unexpected error: " + JSON.stringify(details));
			}
				
			break;
		case STATUS.ABORT: $("#result").html("Request cancelled"); break;
		default: alert("wrong status value: " + status);
	}
	
}

