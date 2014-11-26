$(document).ready(function(){
	$('.loginsubmit').click(function(){
		$('.loginbody').fadeOut("fast",function(){
			$('.carpickerbody').fadeIn("fast");
		});		
	});
		
	$('.car').click(function(){
		$('.carpickerbody, .loginmaterial').fadeOut("slow",function(){
			$('.loginfade').slideUp(function(){
				setTimeout(function(){
					$('.drivein').css('box-shadow','inset 0 0 35px 0px #ffcc33');
					$('.drivein').find('.armalabel, .unitlabel').css('color','#ffcc33');
					$('.drivein').find('.armalabel, .unitlabel').css('text-shadow','0 0 0.2em #ffcc33');
				},2000);
				setTimeout(function(){
					$('.tachoin').css('box-shadow','inset 0 0 35px 0px #ffcc33');
					$('.tachoin').find('.armalabel, .unitlabel').css('color','#ffcc33');
					$('.tachoin').find('.armalabel, .unitlabel').css('text-shadow','0 0 0.2em #ffcc33');
				},3000);
				setTimeout(function(){
					$('.mapin').css('box-shadow','inset 0 0 35px 0px #ffcc33');
				},4000);
			});
		});
	});
	
	$('#btnnotifier').click(function(){
		
		if($('.notifier').attr('open')){
			$('.notifier').animate({
				"marginLeft":"-20%"
			},"fast", function(){
				$('.notifier').removeAttr('open');
			});
		} else {
			$('.notifier').animate({
				"marginLeft":"0"
			},"fast").attr('open','');
		}
	});
	
	$('#btncarpicker').click(function(){
		$('.loginfade, .loginmaterial, .carpickerbody').fadeIn("fast");
		amber.locals.drawMaps('map');
		amber.locals.drawMaps('mapview');
	});
});

function toggleView(){
	$('#map, #videosmall, #mapview, #videocontainer').toggle();
}
