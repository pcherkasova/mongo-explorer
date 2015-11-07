"use strict";


/// we want this module to be available both in browser client and nodejs server
if (typeof Window != "undefined")
	var exports = this.$helpers = {};
//////////////////////

Number.prototype.format = function(decimalPlaces){
    return (Math.round(this * 100) / 100).toFixed(decimalPlaces);
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

Boolean.prototype.toFriendlyString = function(){
    if (this == true)
        return "yes";
    else
        return "no"
}

String.prototype.addLeadingZeros = function(size) { 
	var res = this;
	while (res.length < size)
		res = "0" + res;
	return res; 
};

Date.prototype.toLocalSortableString = function() { 
	var res = this.getFullYear() + "-" 
		+ ((this.getMonth() + 1) + "").addLeadingZeros(2) 
		+ "-" + (this.getDate() + "").addLeadingZeros(2) 
		+ " " + (this.getHours() + "").addLeadingZeros(2)  
		+ ":" + (this.getMinutes() + "").addLeadingZeros(2)  
		+ ":" + (this.getSeconds() + "").addLeadingZeros(2);	
	return res;
};




exports.getURLParameter = function(url, param) {
    return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
}


exports.isValidJSON = function(json) {

}



exports.objectToHTMLTable = function(obj){

    var res = "<table>";
   
    for (var prop in obj) {
        var val = obj[prop];
        if (typeof obj[prop] == "string") {
            var dt = new Date(obj[prop]);
            if ((dt.toString() != "Invalid Date") && (obj[prop].length > 10))
                val = dt.toLocalSortableString();
        }
        if (typeof obj[prop] == "object")
            val = exports.objectToHTMLTable(obj[prop]);  /// Recursion!!!!
            
        res+="<tr>";
        res += "<td>" + prop + ":</td>"; 
        res += "<td>" + val + "</td>"; 
        res+="</tr>";
    }
    res += "</table>";
    
    return res;
    
}


exports.buildHTMLTable = function(header, rows, getCellCallback){

    var res = "<table><tr>";
    for (var j = 0; j < header.length; j++){
       res+= "<th>" + header[j] + "</th>"; 
    }
    res+="</tr>";
    
    for (var i = 0; i < rows; i++) {
        res+="<tr>";
        for (var j =0; j < header.length; j++){
           res+= "<td>" + getCellCallback(i,j) + "</td>"; 
        }
        res+="</tr>";
    }
    res += "</table>";
    
    return res;
    
}


// converts multi-layer object to one-layer object
// we are assuming that object is not recursive since it is created from json
exports.pressObject = function (obj) {
    var result = {};
    
    // renames field if a field with such name alrady exist
    function addField(name, value) {
        while (result[name] != undefined) {
            name += "_";
        }       
        result[name] = value;
    }
    
    //updates result
    function pressObjectRecursively(o, prefix)
    {
        for (var f in o) {
            switch (typeof o[f]) {
                case "string": 
                case "boolean": 
                case "number": addField(prefix + f, o[f].toString()); break;
                case "function": break;
                case "undefined": addField(prefix + f, ""); break;
                case "object":
                    if (o[f] instanceof Array)
                        addField(prefix + f, o[f].toString());
                    else
                        pressObjectRecursively(o[f], prefix + f + "."); // recurcion !!!     
                    break;            
            }
        }
    }
    
    pressObjectRecursively(obj, "");
    
    return result;     
}

exports.arrayToCSV = function (array, lineSeparator) {
    function escapeForCSV(cell_value) {
        var result = cell_value;
        if (cell_value.contains('"') || cell_value.contains(",")) {
            result = '"' + cell_value.replace(new RegExp('"', 'g'), '""') + '"';
        };
        return result;
    }
    
    var headerMap = {}; // name - number
    var headerOrder = []; // number - name
    var header = "";
    var data = "";
    var headerStart = true;
    
    for (var i in array) {
        
        var obj = this.pressObject(array[i]);
        var rowStart = true;
        
        // write all known fields
        for (var j in headerOrder) {
            if (rowStart) { rowStart = false } else {data+="," };
            if (obj[headerOrder[j]] != undefined)
                data += escapeForCSV(obj[headerOrder[j]]);    
            
        }

        // write all new fields
        for (var f in obj) {
            if (headerMap[f] == undefined) {
                // add field to header 
                headerMap[f] = headerOrder.length;
                headerOrder[headerOrder.length] = f;
                if (headerStart) { headerStart = false } else {header += "," };
                header += escapeForCSV(f);
                
                
                // add field to data                
                if (rowStart) { rowStart = false } else { data += "," };
                data += escapeForCSV(obj[f]);  
            }        
        }
        
        data += lineSeparator;
    }
    return header + lineSeparator + data;
}



exports.DataWithComments = function (data, comments) {
    this.data = data;
    this.warmings = comments;
}

exports.arrayToHTMLTable = function (array, className, maxColNum) {
    function escapeForHTML(cell_value) {
        var result = cell_value
                .replace(new RegExp('&', 'g'), '&amp;')
                .replace(new RegExp('<', 'g'), '&lt;')
                .replace(new RegExp('>', 'g'), '&gt;')
                .replace(new RegExp("'", 'g'), '&apos;')
                .replace(new RegExp('"', 'g'), '&quot;')
                .replace(new RegExp('\n', 'g'), '<br>');
        return result;
    }
    
    
    var actualMaxColNum = 0;
    var headerMap = {}; // name - number
    var headerOrder = []; // number - name
    var header = "";
    var data = "";
    
    for (var i in array) {
        
        var obj = this.pressObject(array[i]);
        
        data += "<tr>";
        
        // write all known fields
        for (var j in headerOrder) {
            if (obj[headerOrder[j]] == undefined) {
                data += "<td></td>"; 
            } else {
                data += "<td>" + escapeForHTML(obj[headerOrder[j]]) + "</td>";
            }    
            
        }
        
        var cellsInRow = headerOrder.length;

        // write all new fields
        if (cellsInRow < maxColNum)
            for (var f in obj) if (cellsInRow < maxColNum) {
                if (headerMap[f] == undefined) {
                    // add field to header 
                    headerMap[f] = headerOrder.length;
                    headerOrder[headerOrder.length] = f;
                    header += "<th>" + escapeForHTML(f) + "</th>";
                    cellsInRow++;
                    
                    // add field to data                
                    data += "<td>" + escapeForHTML(obj[f]) + "</td>";  
                }        
            }
        
        
        // write empty fields up to max allowed number
        actualMaxColNum = Math.max(cellsInRow, actualMaxColNum);
        for (; cellsInRow < maxColNum; cellsInRow++)
            data += "<td></td>"; 
        
        data += "</tr>";
    }
    
    // remove extra columns
    var stringToRemove = "";
    for (var columnsToRemove = maxColNum - actualMaxColNum; columnsToRemove > 0; columnsToRemove--){
        stringToRemove += "<td></td>";
    }
    data = data.replace(new RegExp(stringToRemove + "</tr>", 'g'), "</tr>")
    
    return "<table class='" + className + "'><tr>" +  header + "</tr>" + data + "</table>";
}

/*
exports.arrayToHTMLOptions = function(array, getValue, getText){

    var res = "";
    for (var item in array) {
        res += "<option value='" + getValue(array[item]) + "'>" + getText(array[item])  + "</option>";
    }
    return res;
    
}
*/

exports.download = function(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
