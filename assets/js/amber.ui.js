// init variables for videocontainers
amber.ui.initVideoContainers = function(){
	this.liveViewL = document.getElementById('liveviewL');
	this.liveViewS = document.getElementById('liveviewS');
};
// sets the initial state of mini map and live stream
amber.ui.initLiveView = function(){
	var switchables = $('#map, #videocontainer, #mapview, #videosmall');
	// set initial state: small map, big live view visible, small view and big map hidden
	$(switchables[1]).toggle();
	$(switchables[2]).toggle();
	// draw small map initially
	amber.locals.drawMaps('map');
	this.initVideoContainers();
};
// switch live stream and mini map
amber.ui.switchLiveView = function(){
	this.toggleLiveViews();
	this.toggleMaps();
};
// switch the map views 
amber.ui.toggleMaps = function(){
	var maps = $('#map, #mapview').toggle();
	if($(maps[0]).is(":visible"))
		amber.locals.drawMaps($(maps[0]).attr("id"));
	if($(maps[1]).is(":visible"))
		amber.locals.drawMaps($(maps[1]).attr("id"));
};
// switch the live video shows
amber.ui.toggleLiveViews = function(){
	$('#videosmall, #videocontainer').toggle();
};
// show request stats and data during login
amber.ui.logBootStatus = function(message){
	$('.info').text(message);
};
// toggle notification center
amber.ui.toggleNotifier = function(){
	if($('.notifier').attr('open')){
		$('.notifier').animate({
			"marginLeft":"-20%" // close not.center
		},"fast", function(){
			$('.notifier').removeAttr('open');
		});
	} else {
		$('.notifier').animate({
			"marginLeft":"0" // open not.center
		},"fast").attr('open','');
	}
};
// open car picker dialog
amber.ui.openCarPicker = function(){
	$('.loginfade, .loginmaterial, .carpickerbody').fadeIn("fast");
};
// close car picker dialog
amber.ui.closeCarPicker = function(){
	$('.loginfade, .loginmaterial, .carpickerbody').fadeOut("fast");
};
// close login screen and switch to carpicker
amber.ui.closeLogin = function(){
	$('.loginbody').fadeOut("fast",function(){
		$('.carpickerbody').fadeIn("fast");
	});
};
// open login dialog after logout
amber.ui.openLogin = function(s){
	$('.carpickerbody').fadeOut();
	$('.loginfade, .loginmaterial, .loginbody').fadeIn("fast");
};
// append a notification to the notification center
amber.ui.appendNotification = function(data){
	$('#noticontainer').append('<li class="notification">'+data+'</li>');
};
// append cars to car picker dialog (data is considered a list)
amber.ui.appendCars = function(data){
	console.log("Appending cars to car picker...");
	$('.carcontainer').empty();
	var concat = [];
	// iterate over car list:
	for(var l = 0; l < data.length; l++){
		var car = data[l];
		var element = '<li class="car"'
					 +'carname="'+car.vehicleName+'"'
					 +'carid="'+car.vehicleID+'">'
					 +car.vehicleName+'</li>';
		concat.push(element);
	}
	$('.carcontainer').append(concat.join(""));
	this.closeLogin();
};
// pick a car:
amber.ui.carPicked = function(element){
	amber.cars.Current.id = element.attr('carid');
	amber.net.startDataStream(amber.cars.Current.id);
	amber.ui.closeCarPicker();
};
// set ambers armature labels, represented by css-classes
amber.ui.setArmatures = function(data){
	$('.target_kmall').text(data.kmAtAll);
	$('.target_km').text(data.km);
	$('.target_airflow').text(data.airFlow);
	$('.target_airpress').text(data.airPressure);
	$('.target_airtemp').text(data.airPressure);
	$('.target_coolingliq').text(data.coolingLiqTemp);
	$('.target_fuelpress').text(data.fuelPressure);
	$('.target_eviropress').text(data.enviroPressure);
	$('.drivetarget').text(data.drive);
	$('.tachotarget').text(data.speed);
};
// retrieve logindata from login dialog
amber.ui.getLoginData = function(){
	var loginData = {};
	loginData.email = $('.loginfield[type=email]').val();
	loginData.password = $('.loginfield[type=password]').val();
	return loginData;
};
// clear login fields:
amber.ui.clearLogin = function(){
	$('.loginfield[type=email]').val("");
	$('.loginfield[type=password]').val("");
};

