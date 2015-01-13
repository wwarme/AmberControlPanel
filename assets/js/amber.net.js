// initiate websocket connection
amber.net.initSocket = function(){
	this.AmberSocket = new WebSocket(this.Param.SOCKETADRESS);
	// overwrite onmessage to receive data on AmberSocket
	this.AmberSocket.onmessage = function(data){
		amber.net.messageReceived(data);
	};
	// opening event on AmberSocket, indicates connection success
	this.AmberSocket.onopen = function(evt){
		console.log("Socket Connection opened!");
		amber.ui.logBootStatus("Bitte melden Sie sich an");
	};
	// log socket error events
	this.AmberSocket.onerror = function(evt){
		console.log("Socket Connection ERROR!");
		console.log(evt);
		// return to login after connection error
		amber.ui.openLogin();
	};
	// overwrite WebSocket.onclose
	this.AmberSocket.onclose = function(evt){
		console.log("Socket Connection closed!");
		console.log(evt);
		// return to login after socket connection has been closed
		amber.ui.openLogin();
		// clean log out/socket close event:
		if(evt.wasClean){
			amber.ui.logBootStatus("Sie wurden abgemeldet");
			setTimeout(function(){
				amber.ui.logBootStatus("Bitte melden Sie sich an");
			},5000);
		// socket close triggered by error/failure:
		} else {
			amber.ui.logBootStatus("Verbindungsfehler. Bitte warten...");
		}
		// recursion! amber keeps trying to open a socket connection 
		// in case of a socket error
		amber.net.initSocket();
	};
};
// method to be called to implement onmessage to receive data on 
// a WebSocket
amber.net.messageReceived = function(socketPackage){
	// work that protocol!
	try{
		// try parsing JSON directly from incoming data
		var incoming = JSON.parse(socketPackage.data);
//		console.log(incoming.id);
		switch(incoming.id){
		// different ids = different type of data/information:
		case "streamClosed":
			amber.ui.closeVideoStream();
			break;
		case "addCarACK":
			console.log(incoming);
			this.addCarSuccess();
			break;
		case "telemetry":
			this.processCockpitData(incoming.data);
			this.processLiveStreamData(incoming.image);
			break;
		case "loginACK":
			this.loginSuccess(incoming);
			break;
		case "logoutACK":
			this.logoutDone();
			break;
		case "commandACK":
			console.log("Command received and transmitted");
			break;
		case "startRecordACK":
			this.recordingStarted();
			break;
		case "stopRecordACK":
			this.recordingStopped();
			break;
		case "screenshotACK":
			this.screenshotDone();
			break;
		case "carsACK":
			this.carsSuccess(incoming.data.vehicles);
			break;
		case "error":
			console.log("Error: "+incoming.data);
			// initiate error protocol:
			switch(incoming.data){
			case "Login failed":
				amber.ui.logBootStatus("Anmeldedaten nicht korrekt");
				break;
			}
		}
	// catch errors that may occur during JSON parsing: 
	} catch (SyntaxError){
		console.log(SyntaxError);
		console.log("Unknown dataset:");
		console.log(socketPackage);
	}
};
// process image data for live video streaming 
amber.net.processLiveStreamData = function(data){
	// set the current image data received from server
	// image data are received as base64 binary strings 
	amber.media.scene = "data:image/png;base64,"+data;
	// set the image as src-attribute
	if($(amber.ui.liveViewL).is(":visible")) // small view in the corner
	// the binary strings can be set as src urls directly
	// parsing done by html/javascript engine of browser, internally
		amber.ui.liveViewL.src = amber.media.scene;
	if($(amber.ui.liveViewS).is(":visible")) // main video view
		amber.ui.liveViewS.src = amber.media.scene;
	$('.waitingforstream').toggle();
};
// process cockpit and telemetry data 
amber.net.processCockpitData = function(incoming){
	// set the current telemetry data (constantly updated)
	incoming.id = amber.carID;
	amber.cars.Current = incoming;
	// write telemetry data into UI
	amber.ui.setArmatures(incoming);
	// update cars position (done every 30 "Ticks", see amber.locals.js) 
	amber.locals.updateMarker();
	// notification incoming?
	if(incoming.notification != null){
		// append notification to notif.center
		this.processNotification(incoming.notification);
	}
		
};
// process incoming notifications
amber.net.processNotification = function(incoming){
	amber.ui.appendNotification(incoming);
	amber.ui.notifierToggled = false;
	// alarm user about new notification!
	amber.ui.FX.notificationON();
};

/*
 * socket commands: via WebSocket.send, a stringified object is 
 * sent to the server. the object ALWAYS contains a callID and 
 * has an optional data-attribute, which can contain data like 
 * login-data 
 */ 

// initiate data stream from a chosen car
amber.net.startDataStream = function(){
	var data = {};
	data.callID = this.Param.STARTSTREAM;
	data.data = {
			carID : amber.carID,
			userID : amber.userID
	};
	this.AmberSocket.send(JSON.stringify(data));
};
// stop the data stream in order to change the car to observe
amber.net.stopDataStream = function(){
	var data = {};
	data.callID = this.Param.STOPSTREAM;
	data.data = {
			carID : amber.carID,
			userID : amber.userID
	};
	this.AmberSocket.send(JSON.stringify(data));	
};
//send a command to the on board unit via WebSocket
amber.net.reqSendCommand = function(command){
	var data = {};
	data.callID = this.Param.SENDCOMMAND;
	data.data = {
		carID : amber.carID,
		command : command
	};
	this.AmberSocket.send(JSON.stringify(data));
};
// start recording a video via AmberSocket
amber.net.startRecord = function(){
	var data = {};
	data.callID = this.Param.STARTRECORD;
	data.data = {
		carID : amber.cars.Current.id,
		userID : amber.userID
	};
	this.AmberSocket.send(JSON.stringify(data));
	amber.media.recording = true;
	amber.ui.FX.recordingON();
	// set recording to false in case server returns an error!
	console.log("Recording started!");
};	
// record has been started on server side! 
amber.net.recordingStarted = function(){
	console.log("Recording started!");
};
// send a command to stop the recording over AmberSocket
amber.net.stopRecord = function(){
	var data = {};
	data.callID = this.Param.STOPRECORD;
	data.data = {
			carID : amber.cars.Current.id,
			userID : amber.userID
		};
	this.AmberSocket.send(JSON.stringify(data));
	amber.media.recording = false;
};
// recording has been stopped on server side
amber.net.recordingStopped = function(){
	console.log("Recording stopped!");
	// enable button to start download
	amber.ui.toggleDownloadBtn();
};
// login call
amber.net.reqLogin = function(){
	amber.ui.logBootStatus("anmelden...");
	var data = {};
	data.callID = this.Param.GETLOGIN;
	data.data = amber.ui.getLoginData();
	amber.user = amber.ui.getLoginData.email;
	this.AmberSocket.send(JSON.stringify(data));
};
// function executed if login was successful
amber.net.loginSuccess = function(incoming){
	console.log("Access granted! Car data incoming...");
	amber.ui.clearLogin();
	amber.userID = incoming.data.userID;
	amber.cars.carList = incoming.data.vehicles;
	amber.ui.appendCars(incoming.data.vehicles);
};
// function executed if login fails
amber.net.loginError = function(data){
	amber.ui.clearLogin();
	amber.ui.logBootStatus("Fehler bei der Anmeldung");
};
// send message to server for logging user out
amber.net.reqLogout = function(){
	var data = {};
	data.callID = this.Param.GETLOGOUT;
	data.data = amber.userID;
	console.log(data);
	this.AmberSocket.send(JSON.stringify(data));
};
// logout successful - return to login, streaming stopped on server side
amber.net.logoutDone = function(){
	console.log("User logged out!");
	amber.ui.logBootStatus("Sie wurden erfolgreich abgemeldet.");
	amber.ui.openLogin();
};
// add a car to database
amber.net.addCar = function(){
	var data = {};
	data.callID = this.Param.ADDCAR;
	data.data = {
		carID : amber.ui.getNewCarID(),
		userID : amber.userID
	};
	this.AmberSocket.send(JSON.stringify(data));
};
// car successfully added!
amber.net.addCarSuccess = function(){
	amber.ui.logBootStatus("Fahrzeug wurde hinzugefügt!");
	amber.net.reqCars();
};
// request list of cars available to user
amber.net.reqCars = function(){
	var data = {};
	data.callID = this.Param.GETCARS;
	data.data = amber.userID;
	this.AmberSocket.send(JSON.stringify(data));
};
// cars received!
amber.net.carsSuccess = function(carList){
	console.log(carList);
	amber.ui.appendCars(carList);
};
// request a screenshot with position data
amber.net.reqScreenshot = function(){
	var data = {};
	data.callID = this.Param.GETSCREENSHOT;
	data.data = {
		carID : amber.cars.Current.id,
		userID : amber.userID
	};
	this.AmberSocket.send(JSON.stringify(data));
};
// enable screenshot download button
amber.net.screenshotDone = function(){
	console.log("Screenshot done!");
	amber.ui.toggleDownloadBtnScreen();
};
