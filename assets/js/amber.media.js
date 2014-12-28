// amber.media namespace
amber.media.screenshot = function(){
	var blob = new Blob([amber.cars.Current.sceneBlob],
						{ type : 'image/jpeg' });
	var url = window.URL.createObjectURL(blob);
//	window.open(url, 'Download');
	window.open(url);
};