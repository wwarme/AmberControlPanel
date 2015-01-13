// init variables for videocontainer-elements
amber.ui.initVideoContainers = function(){
	this.liveViewL = document.getElementById('liveviewL');
	this.liveViewS = document.getElementById('liveviewS');
};
// set the initial state of mini map and live stream
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
	// draw the map into a particular container, 
	// depending on which map element is visible
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
// show request stats, connectivity, data during login, general feedback to user
amber.ui.logBootStatus = function(message){
	$('.info').text(message);
};
// toggle notification center
amber.ui.toggleNotifier = function(){
	// if center is open:
	if($('.notifier').attr('open')){
		$('.notifier').animate({
			"marginLeft":"-20%" // close not.center
		},"fast", function(){
			$('.notifier').removeAttr('open');
		});
	// if center is closed:
	} else {
		$('.notifier').animate({
			"marginLeft":"0" // open not.center
		},"fast").attr('open','');
		this.notifierToggled = true;
	}
};
// open car picker dialog, stop running data stream
// new car MUST be picked to reenable data streaming, but session is held
amber.ui.openCarPicker = function(){
	amber.net.stopDataStream(amber.cars.Current.id);
	this.closeVideoStream();
	$('.loginfade, .loginmaterial, .carpickerbody').fadeIn("fast");
};
// open dialog to add car to database
amber.ui.toggleAddCar = function(){
	// if car adding dialog is already open
	if($('.caraddbody').is(':visible')){
		// fade out dialog and fade in car picker again
		$('.caraddbody').fadeOut("fast");
		$('.carpickerbody').fadeIn("fast");
	} else {
		// if dialog is not visible, fadeout car picker
		// car picker is the only position in ui to access 
		// car adding dialog!
		$('.carpickerbody').fadeOut();
		// fade in dialog
		$('.loginfade, .loginmaterial, .caraddbody').fadeIn("fast");
	}
};
// close car picker dialog
amber.ui.closeCarPicker = function(){
	$('.loginfade, .loginmaterial, .carpickerbody').fadeOut("fast");
};
// close login screen and switch to carpicker
amber.ui.closeLogin = function(){
	$('.loginbody').fadeOut("fast",function(){
		if($('.caraddbody').is(':visible'))
			amber.ui.toggleAddCar();
		$('.carpickerbody').fadeIn("fast");
	});
};
// open command center:
amber.ui.toggleCommandCenter = function(){
	if($('.commandbar').is(":visible"))
		$('.commandbar').fadeOut("fast");
	else
		$('.commandbar').fadeIn("fast");
};
// open login dialog after logout
amber.ui.openLogin = function(s){
	$('.carpickerbody, .caraddbody').fadeOut();
	this.FX.lightsOFF();
	$('.loginfade, .loginmaterial, .loginbody').fadeIn("fast");
};
// append a notification to the notification center
amber.ui.appendNotification = function(data){
	console.log(data.eventType);
	// notification is concatenated as a string representative
	// of the resulting DOM element
	var noti = '<li class="notification">';
		noti+= '<ul class="notiproperties">';
		noti+= '<li>Typ: '+data.eventMessage+'</li>';
		noti+= '<li>Lat: '+data.latitude+'</li>';
		noti+= '<li>Long: '+data.longitude+'</li>';
		if(data.eventImage){
			// append image to notification if possible:
			var imgUrl = "data:image/png;base64,"+data.eventImage;
			noti+= '<li class="notipic" style="';
			noti+= 'background: url('+imgUrl+');';
			noti+= 'background-position: 0 0 ;';
			noti+= 'background-repeat: no-repeat;';
			noti+= 'height: 150px;">';
		}
		noti+= '</ul></li>';
		// append notification
	$('#noticontainer').append(noti);
};
// append cars to car picker dialog (data is considered a list)
// same principle like in appendNotification
amber.ui.appendCars = function(data){
	console.log("Appending cars to car picker...");
	// clean from older car elements to avoid duplicates
	$('.carcontainer').empty();
	var concat = [];
	// iterate over car list:
	for(var l = 0; l < data.length; l++){
		var car = data[l];
		var imgUrl = "data:image/png;base64,"+car.image;
		var element = '<li class="car"'
					 +'style="background: url('+imgUrl+');'
					 +       'background-repeat: no-repeat;'
					 +       'background-position: 50% 50%;'
					 +       'background-color: #000000;"'
					 +'carname="'+car.vehicleName+'"'
					 +'carid="'+car.vehicleID+'">';
		element += '<p>'+car.vehicleName+'</p>';
		element += '</li>';
		// push the new DOM elements string representative in a list
		concat.push(element);
	}
	// append the car elements by concatenating the single strings
	// in the list to one big single string and inject it in the 
	// html list
	$('.carcontainer').append(concat.join(""));
	this.closeLogin();
};
// pick a car:
amber.ui.carPicked = function(element){
	// set the current car id as integer (attributes can only hold strings!)
	amber.carID = parseInt(element.attr('carid'));
	// append cars former events to notification center
	$('#noticontainer').empty();
	for(var c = 0; c < amber.cars.carList.length; c++){
		// find the car in the carlist:
		if(amber.cars.carList[c].vehicleID == amber.carID){
			// push all notifications into the array
			amber.cars.carList[c].eventList.forEach(function(noti){
				amber.ui.appendNotification(noti);
			});
			// stop loop if car was found
			break;
		}
	}
	// start data streaming from the picked car
	amber.net.startDataStream();
	// reset old route viewed in the map 
	amber.locals.resetRoute();
	// close car picker
	this.closeCarPicker();
	$('.vehicle').text(element.attr('carname'));
	$('username').text(amber.userName);
	
	this.FX.lightsON();
};
// enable video download button: 
amber.ui.toggleDownloadBtn = function(){
	if($('#btndownload').is(":visible"))
		$('#btndownload').fadeOut("fast");
	else
		$('#btndownload').fadeIn("fast");
};
//enable download of screenshot:
amber.ui.toggleDownloadBtnScreen = function(){
	if($('#btndownloadscreen').is(":visible"))
		$('#btndownloadscreen').fadeOut("fast");
	else
		$('#btndownloadscreen').fadeIn("fast");
};
// pick a command:
amber.ui.commandPicked = function(){
	// close command center
	this.toggleCommandCenter();
};
// set ambers armature labels, represented by css-classes
amber.ui.setArmatures = function(data){
	$('.target_kmall').text(data.kmAtAll);
	$('.target_km').text(data.km);
	$('.target_airflow').text(data.airFlow);
	$('.target_airpress').text(data.airPressure);
	$('.target_airtemp').text(data.airTemp);
	$('.target_coolingliq').text(data.coolingLiqTemp);
	$('.target_fuelpress').text(data.fuelPressure);
	$('.target_eviropress').text(data.enviroPressure);
	$('.drivetarget').text(data.revolutions);
	$('.tachotarget').text(data.speed);
	var gas = data.fuel+"%";
	var load = parseInt(data.engineLoad)+"%";
	$('.fuelin').css('width',gas);
	if(data.engineLoad && data.engineLoad > 0){
		$('.motorload').css('width',load)
					   .css('box-shadow','0 -11px 61px 48px #ffcc33');
	$('.motorload_label').text(load);
	} else
		$('.motorload').css('box-shadow','none').css('width','0');
};
// retrieve new cars id from input field
amber.ui.getNewCarID = function(){
	return parseInt($('.loginfield[type="obuid"]').val());
};
// retrieve logindata from login dialog
amber.ui.getLoginData = function(){
	// build an object for in-app data communication
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
// clear the video stream containers for logout and while chosing new car
amber.ui.closeVideoStream = function(){
	this.liveViewL.src = "";
	this.liveViewS.src = "";
};

/* amber.ui.FX
 * visual effects for the amber control panel
 * powered by CSS3
 */
// switch on "the lights" after login
amber.ui.FX.lightsON = function(){
	setTimeout(function(){
		$('.ridedata').css('box-shadow','inset 0 0 25px 0px #ffcc33');
		$('.ridedata>div').css({
			'color':'#ffcc33',
			'text-shadow':'0 0 0.2em #ffcc33',
			'opacity':'1.0'
		});
		$('.fuelin').css('background','#ffcc33');
		$('.fuelout').css('border-color','#ffcc33');
	},500);
	setTimeout(function(){
		$('.drivein').css('box-shadow','inset 0 0 35px 0px #ffcc33');
		$('.drivein').find('.armalabel, .unitlabel').css('color','#ffcc33');
		$('.drivein').find('.armalabel, .unitlabel').css('text-shadow','0 0 0.2em #ffcc33');
	},1000);
	setTimeout(function(){
		$('.tachoin').css('box-shadow','inset 0 0 35px 0px #ffcc33');
		$('.tachoin').find('.armalabel, .unitlabel').css('color','#ffcc33');
		$('.tachoin').find('.armalabel, .unitlabel').css('text-shadow','0 0 0.2em #ffcc33');
	},1500);
	setTimeout(function(){
		$('.motorcontrolin').css('box-shadow','inset 0 0 35px 0px #ffcc33');
		$('.controlelement').css('opacity','1.0');
		$('.btnbar>button').css('opacity','1.0');
	},2000);
};
// switch the lights off after logout
amber.ui.FX.lightsOFF = function(){
	$('.ridedata').css('box-shadow','none');
	$('.ridedata>div').css({
		'color':'#494949',
		'text-shadow':'none',
		'opacity':'0.1'
	});
	$('.fuelin').css('background','#494949');
	$('.fuelout').css('border-color','#494949');
	$('.drivein').css('box-shadow','none');
	$('.drivein').find('.armalabel, .unitlabel').css('color','#494949');
	$('.drivein').find('.armalabel, .unitlabel').css('text-shadow','none');
	$('.tachoin').css('box-shadow','none');
	$('.tachoin').find('.armalabel, .unitlabel').css('color','#494949');
	$('.tachoin').find('.armalabel, .unitlabel').css('text-shadow','none');
	$('.motorcontrolin').css('box-shadow','none');
	$('.controlelement').css('opacity','0.1');
	$('.btnbar>button').css('opacity','0.1');
	$('.target_km, .target_kmall, .armalabel').text("0");
	$('.controllabel').text("100");
	$('.motorload').css({
		'width': '0',
		'box-shadow': 'none'
	});
};
// blinking record symbol due video stream recording
amber.ui.FX.recordingON = function(){
	if(amber.media.recording){
		$('#btnrecord').fadeTo('fast', 0.1).fadeTo('fast', 1.0);
		setTimeout(function(){
			amber.ui.FX.recordingON();
		},500);
	}
};
// new notification received!
amber.ui.FX.notificationON = function(){
	if(!amber.ui.notifierToggled){
		$('#btnnotifier').fadeTo('slow', 0.1).fadeTo('slow', 1.0);
		setTimeout(function(){
			amber.ui.FX.notificationON();
		},500);
	}
};






