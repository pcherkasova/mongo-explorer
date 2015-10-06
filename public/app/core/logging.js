"use strict";

function logUserEvent(event) {
	var input = event.data;
	input.element = event.target.id;
	$.ajax({
			method: "POST",
			url: "../api/logUserEvent",
			data: input
			})
		.done(function (msg) {
    
		});
}
  
	