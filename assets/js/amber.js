// complete javascript reference for amber client web application
// .done => implemented as function
var amber = {};
// amber.locals, containing all osm localization information 
amber.locals = {};
amber.locals.AmberMap;
amber.locals.amberMapContainer;
amber.locals.LayerMapnik = {};
amber.locals.LayerMarkers = {};
amber.locals.Marker = {};
amber.locals.zoom = 18;
amber.locals.LongLat = {};
// static for testing
amber.locals.LongLat.lon = 13.63286;
amber.locals.LongLat.lat = 52.31954;
// functions
amber.locals.initLayers;			//.done
amber.locals.drawMap;				//.done
amber.locals.drawMaps;				//.done
amber.locals.updateMarker;			//.done
amber.locals.jumpTo;				//.done

// amber.media, containing all demanded media data like screenshots and videos
amber.media = {};
// amber.cars, containing all car data available
amber.cars = {};
// list of available cars
amber.cars.carList = [];
// currently viewed car data
amber.cars.Current = {};
amber.cars.Current.drive;
amber.cars.Current.speed;
amber.cars.Current.airFlow;
amber.cars.Current.airPressure;
amber.cars.Current.airTemperature;
amber.cars.Current.coolingLiqTemp;
amber.cars.Current.fuelPressure;
amber.cars.Current.enviroPressure;
amber.cars.Current.kmAtAll;
amber.cars.Current.km;
amber.cars.Current.fuel;
// amber.ui - UI functionalities of AMBER
amber.ui = {};
// ui functions - growing
amber.ui.initLiveView; 			//.done
amber.ui.toggleMaps;			//.done
amber.ui.toggleLiveViews;		//.done
amber.ui.switchLiveView;		//.done
amber.ui.openCarPicker;			//.done
amber.ui.closeCarPicker;		//.done
amber.ui.toggleNotifier;		//.done
amber.ui.logBootStatus;			//.done
amber.ui.appendNotification;	//.done	
amber.ui.appendCars;			//.done
amber.ui.setArmatures;			//.done
amber.ui.closeLogin;			//.done
amber.ui.openLogin;				//.done
// amber.net - all net properties are stored here 
amber.net = {};
// amber.net.AmberSocket - WebSocket-based data streaming infrastructure
amber.net.AmberSocket = {};
amber.net.AmberSocket.onmessage; 
amber.net.AmberSocket.processMessage;
amber.net.AmberSocket.processCockpitData;
amber.net.AmberSocket.processNotification;
amber.net.AmberSocket.processLiveStreamData;
//amber.net.Param - params for ajax reqs etc.
amber.net.Param = {};
amber.net.Param.ADDRESS = "http://10.220.3.158:3001/";
amber.net.Param.GETLOGIN = "requestLogin";
amber.net.Param.GETLOGOUT = "requestLogout";
amber.net.Param.GETCARS = "requestCars";
amber.net.Param.SENDCOMMAND = "sendCommand";
amber.net.Param.STARTRECORD = "starRecord";
amber.net.Param.STOPRECORD = "stopRecord";
// amber.net.Ajax - ajax calls etc.
// every ajax call has its own success/error function!
amber.net.Ajax = {};
amber.net.Ajax.reqLogin;
amber.net.Ajax.loginSuccess;
amber.net.Ajax.loginError;
amber.net.Ajax.reqLogout;
amber.net.Ajax.logoutSuccess;
amber.net.Ajax.logoutError;
amber.net.Ajax.reqCars;
amber.net.Ajax.carSuccess;
amber.net.Ajax.carError;
amber.net.Ajax.reqSendCommand;
amber.net.Ajax.commandSuccess;
amber.net.Ajax.commandError;
amber.net.Ajax.startRecord;
amber.net.Ajax.startRecSuccess;
amber.net.Ajax.startRecError;
amber.net.Ajax.stopRecord;
amber.net.Ajax.stopRecSuccess;
amber.net.Ajax.stopRecError;


