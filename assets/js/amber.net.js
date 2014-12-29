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
		amber.ui.openLogin();
	};
	// overwrite WebSocket.onclose
	this.AmberSocket.onclose = function(evt){
		console.log("Socket Connection closed!");
		console.log(evt);
		amber.ui.openLogin();
		// clean log out/socket close event:
		if(evt.wasClean){
			amber.ui.logBootStatus("Sie wurden abgemeldet");
			setTimeout(function(){
				amber.ui.logBootStatus("Bitte melden Sie sich an");
			},5000);
		// socket close triggered by error/failure:
		} else {
			amber.ui.logBootStatus("Verbindung fehlerhaft");
		}
		amber.net.initSocket();
	};
};
// method to be called to implement onmessage to receive data on 
// a WebSocket
amber.net.messageReceived = function(socketPackage){
	// work that protocol!
	console.log(socketPackage);
	try{
		// try if data is in json format
		var incoming = JSON.parse(socketPackage.data);
		console.log(incoming);
		switch(incoming.id){
		case "streamClosed":
			amber.ui.closeVideoStream();
			break;
		case "telemetry":
			this.processCockpitData(incoming);
			break;
		case "loginACK":
			this.loginSuccess(incoming);
			break;
		case "logoutACK":
			this.logoutDone();
			break;
		case "commandACK":
			console.log("Command received and ");
			break;
		case "startRecordACK":
			this.recordingStarted();
			break;
		case "stopRecordACK":
			this.recordingStopped(incoming);
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
	} catch (SyntaxError){
		// if its NOT json, then it probably is a blob containing 
		// picture data for the video stream
		if(socketPackage.data instanceof Blob)
			amber.net.processLiveStreamData(socketPackage.data);
	}
};
// process image data for live video streaming 
amber.net.processLiveStreamData = function(data){
	// save and refresh image data for saving screenshots
	amber.cars.Current.sceneBlob = data;
// 'resource interpreted as image but transferred with mime type text/plain'
	// -> warning suppressed by creation of a copy of the blob data with explicitly 
	// declared content-type (image/jpeg)
	var blob = new Blob([data],{type : 'image/jpeg'});
	// only ever render one video frame for performance reasons
	if($(amber.ui.liveViewL).is(":visible")) // small view in the corner
		amber.ui.liveViewL.src = window.URL.createObjectURL(blob);
	if($(amber.ui.liveViewS).is(":visible")) // main video view
		amber.ui.liveViewS.src = window.URL.createObjectURL(blob);
};
// process cockpit data - TODOOOO!!!
amber.net.processCockpitData = function(incoming){
	// further processing needed for sure...
	var carInfo = incoming.data;
	amber.ui.setArmatures(carInfo);
};
// process incoming notifications
amber.net.processNotification = function(incoming){
	amber.ui.appendNotification(iincoming.data);
};
// initiate data stream from a chosen car
amber.net.startDataStream = function(carID){
	var data = {};
	data.callID = this.Param.STARTSTREAM;
	data.data = carID;
	this.AmberSocket.send(JSON.stringify(data));
};
// stop the data stream in order to change the car to observe
amber.net.stopDataStream = function(carID){
	var data = {};
	data.callID = this.Param.STOPSTREAM;
	data.data = carID;
	this.AmberSocket.send(JSON.stringify(data));
};
//send a command to the on board unit via WebSocket
amber.net.reqSendCommand = function(command){
	var data = {};
	data.callID = this.Param.SENDCOMMAND;
	data.data = command;
	this.AmberSocket.send(JSON.stringify(data));
};
// start recording a video via AmberSocket
amber.net.startRecord = function(){
	var data = {};
	data.callID = this.Param.STARTRECORD;
	this.AmberSocker.send(JSON.stringify(data));
	amber.media.recording = true;
	// set recording to false in case server returns an error!
};
// record has been started on server side! 
amber.net.recordingStarted = function(){
	console.log("Recording started!");
};
// send a command to stop the recording over AmberSocket
amber.net.stopRecord = function(){
	var data = {};
	data.callID = this.Param.STOPRECORD;
	this.AmberSocket.send(JSON.stringify(data));
	amber.media.recording = false;
};
// recording has been stopped on server side
amber.net.recordingStopped = function(incoming){
	console.log("Recording stopped!");
};
// login call
amber.net.reqLogin = function(){
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
	amber.ui.openLogin();
};
// request list of cars available to user
amber.net.reqCars = function(){
	var data = {};
	data.callID = this.Param.GETCARS;
	this.AmberSocket.send(JSON.stringify(data));
};
// if call for cars produced an error:
amber.net.carsError = function(data){
};
