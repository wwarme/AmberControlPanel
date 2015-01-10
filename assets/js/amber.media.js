// amber.media namespace
amber.media.screenshot = function(){
	// view the image in a new tab so the user can save it to the pc
	window.open(this.scene);
};
// init video download from server
amber.media.downloadVideo = function(){
	window.open(amber.net.Param.DOWNLOADADRESS);
	amber.ui.toggleDownloadBtn();
};
// toggle recording state
amber.media.toggleRecording = function(){
	if(!amber.media.recording)
		amber.net.startRecord();
	else
		amber.net.stopRecord();
};