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
	};
	// log socket error events
	this.AmberSocket.onerror = function(evt){
		console.log("Socket Connection ERROR!");
		console.log(evt);
		amber.ui.openLogin();
		amber.ui.logBootStatus("Die Verbindung wurde abgebrochen");
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
			amber.ui.logBootStatus("Die Verbindung wurde abgebrochen");
		}
	};
};
// method to be called to implement onmessage to receive data on 
// a WebSocket
amber.net.messageReceived = function(socketPackage){
	if(socketPackage.data instanceof Blob){
		amber.net.processLiveStreamData(socketPackage.data);
	}
};
// process livestream picture data 
amber.net.processLiveStreamData = function(blob){
	// only ever render one video frame for performance reasons
	if($(amber.ui.liveViewL).is(":visible")) // small view in the corner
		amber.ui.liveViewL.src = window.URL.createObjectURL(blob);
	if($(amber.ui.liveViewS).is(":visible")) // main video view
		amber.ui.liveViewS.src = window.URL.createObjectURL(blob);
};
// process cockpit data - TODOOOO!!!
amber.net.processCockpitData = function(data){
	// further processing needed for sure...
	var carInfo = data;
	amber.ui.setArmatures(carInfo);
};
// process incoming notifications
amber.net.processNotification = function(data){
	var notification = data.text;
	amber.ui.appendNotification(notification);
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
};
// send a command to stop the recording over AmberSocket
amber.net.stopRecord = function(){
	var data = {};
	data.callID = this.Param.STOPRECORD;
	this.AmberSocket.send(JSON.stringify(data));
};
// login call
amber.net.reqLogin = function(){
	var data = {};
	data.callID = this.Param.GETLOGIN;
	data.data = amber.ui.getLoginData();
	this.AmberSocket.send(JSON.stringify(data));
};
// function executed if login was successful
amber.net.loginSuccess = function(data){
	amber.ui.closeLogin();
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
	this.AmberSocket.send(JSON.stringify(data));
};
// logout successful - return to login
amber.net.logoutSuccess = function(data){
};
// logout failed....
amber.net.logoutError = function(data){
};
// request list of cars available to user
amber.net.reqCars = function(){
	var data = {};
	data.callID = this.Param.GETCARS;
	this.AmberSocket.send(JSON.stringify(data));
};
// if call for cars was successfull: 
amber.net.carsSuccess = function(data){
};
// if call for cars produced an error:
amber.net.carsError = function(data){
};
