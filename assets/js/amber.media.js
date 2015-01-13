/* 
 *amber.media namespace
 */
// do a screenshot, resp. open recieved screenshot in new tab to save
amber.media.screenshot = function(){
	window.open(amber.net.Param.DOWNLOADADRESS+amber.net.Param.SCREEN);
};
// init video download from server
amber.media.downloadVideo = function(){
	window.open(amber.net.Param.DOWNLOADADRESS+amber.net.Param.VIDEO);
	amber.ui.toggleDownloadBtn();
};
// toggle recording state
amber.media.toggleRecording = function(){
	if(!amber.media.recording)
		amber.net.startRecord();
	else
		amber.net.stopRecord();
};
