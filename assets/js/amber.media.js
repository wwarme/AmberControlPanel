// amber.media namespace
amber.media.screenshot = function(){
	// build a blob from the latest image received
	var blob = new Blob([amber.cars.Current.sceneBlob],
						{ type : 'image/jpeg' });
	var url = window.URL.createObjectURL(blob);
	// view the image in a new tab so the user can save it to the pc
	window.open(url);
};