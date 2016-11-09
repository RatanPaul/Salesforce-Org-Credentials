$(document).ready(function() {

    $("#savebtn").click(function() {
    	var skillsSelect = document.getElementById("orgTypeId");
		var selectedOrgType = skillsSelect.options[skillsSelect.selectedIndex].value;
		if($("#usernameid").val() && $("#passwordid").val())
		{
			chrome.storage.sync.get({'records': []}, function(data) { // Default to empty array
			  data.records.push({
			    username: $("#usernameid").val(), 
			    password: $("#passwordid").val(),
			    orgType: selectedOrgType
			  });
			  chrome.storage.sync.set(data, function(){
			  	$("#usernameid").val('') ; 
			  	$("#passwordid").val('') ; 
			  	getRecordsFromStorageAPI();
			  	$("#addNewid").click();
			  });
			}); 
		}    
    });
    $("#deleteAllId").click(function() {
    	if(confirm("Do you want delete all existing credentials ?"))
    	{
    		chrome.storage.sync.get({'records': []}, function(data) { 
    			data.records = [];
				chrome.storage.sync.set(data, function(){
				  	getRecordsFromStorageAPI();
				});
			});
    	}
    });
    $("#exportDataBtnId").click(function() {
    	chrome.storage.sync.get('records', function(items){
			$("#exportDataid").val(JSON.stringify(items.records));       	
	    });
    });
    $("#importsave").click(function() {
    	var lstRecordsVal = $("#importDataid").val();
    	if(lstRecordsVal)
    	{
    		lstRecordsVal = JSON.parse(lstRecordsVal);

    		chrome.storage.sync.get({'records': []}, function(data) { 

    			for(var i = 0; i < lstRecordsVal.length; i++)
    			{
    				data.records.push({
					    username: lstRecordsVal[i].username, 
					    password: lstRecordsVal[i].password,
					    orgType: lstRecordsVal[i].orgType
					  });
    			}
				chrome.storage.sync.set(data, function(){

				  	getRecordsFromStorageAPI();
				  	$("#importDataid").val('')
				  	$("#importDataBtnId").click();
				});
			});
    	}
    });
    function appendInUl(username, password, selectedOrgType, index) {
		$('#recordTable tbody').append(createRecordTableRow(selectedOrgType +'?un='+username+'&pw='+password, username, index));
	}

	function createRecordTableRow(url, username, index) {
	    var tr = '<tr>' ;
	        tr += '<td> <a  href="" id="'+index+'" class="del"><span style="color:red;" class="glyphicon glyphicon-trash"></span></a> </td>';
	        tr += '<td> <a class="orgUrl" href="' + url  + '"> '+username+'</a></td>';
	        tr += '<td> </td>';  
	    	tr +='</tr>';
	    return tr;
	}
	$('body').on('click', 'a.del', function(){
     	var that = this;	
     	chrome.storage.sync.get({'records': []}, function(data) { // Default to empty array
     	data.records.splice(that.id, 1);
		  
		  chrome.storage.sync.set(data, function(){
		  	$("#usernameid").val('') ; $("#passwordid").val('') ; getRecordsFromStorageAPI();
		  });
		});
    	return false;
   	});
    // get records using storage api
    function getRecordsFromStorageAPI(){
    	$("#recordTable > tbody").html("");
	    chrome.storage.sync.get('records', function(items){
			for(var i = 0; i < items.records.length; i++){
				appendInUl(items.records[i].username, items.records[i].password, items.records[i].orgType, i);
			}        	
	    });	
    }
	

    // add chrome tab for each hyper links
	$('body').on('click', 'a.orgUrl', function(){
     	chrome.tabs.create({url: $(this).attr('href')});
    	return false;
   	});

	getRecordsFromStorageAPI();

});