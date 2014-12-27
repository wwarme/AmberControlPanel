/**
 * ui event handler reference for 
 * amber client web application, based on 
 * jQuery event handling 
 */
// bind all event handlers to their elements 
// if document is completely rendered
$(document).ready(function(){
	// login
	$(document).on("click", ".loginsubmit", function(){
		amber.net.reqLogin();
	});
	// toggle notification center
	$(document).on("click", "#btnnotifier", function(){
		amber.ui.toggleNotifier();
	});
	// toggle car picker dialog
	$(document).on("click", "#btncarpicker", function(){
		amber.ui.openCarPicker();
	});
	// switch video/map view
	$(document).on("click", "#btnswitchview", function(){
		amber.ui.switchLiveView();
	});
	// record a video on server side
	$(document).on("click", "#btnrecord", function(){
		if(!amber.media.recording)
			amber.net.startRecord();
		else
			amber.net.stopRecord();
	});
	// choose a car for live control
	$(document).on("click", ".car", function(){
		amber.car.Current.id = $(this).attr('carid');
		amber.net.startDataStream(amber.car.Current.id);
		amber.ui.closeCarPicker();
	});
});
