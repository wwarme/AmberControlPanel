$(document).ready(function(){
	$('.loginsubmit').click(function(){
		
		$('.loginbody, .loginmaterial').fadeOut("slow", function(){
			$('.loginfade').slideUp();
			drawmap();
		});
		
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
			$('.mapin').css('box-shadow','inset 0 0 35px 0px #ffcc33');
		},2000);
	});
});