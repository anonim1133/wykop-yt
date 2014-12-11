// ==UserScript==
// @name          Wykopowy odtwarzacz muzyki
// @description   Odtwarza muzukę spod tagów
// @include       http://www.wykop.pl/tag/*
// @version       0.2.2
// ==/UserScript==


if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}

function main(){
	$( document ).ready(function() {
			var block = $('<div>').addClass('r-block');
	var ul = $('<ul>').addClass('menu-list');;
	block.append('<h4>Odtwarzacz YouTube</h4>');
	ul.append('<li><a href="#playYT" onClick="playFirst()"> Odtwarzaj </a></li>');
		ul.append('<li><a href="#playNext" onClick="playNext()"> Następna </a></li>');
	ul.append('<li><a href="#stopYT" onClick="stopPlaying()"> Zatrzymaj</a></li>');
	
	block.append(ul);
		$('.grid-right').prepend(block);
	});
	
	window.playFirst = function (){
		var v_id = '';

		if($($('.video a[class= ajax]')[0]).attr('href').match('youtu.be') !== null) {
			v_id = $($('.video a[class= ajax]')[0]).attr('href').split('/')[3];
		}else{
			$.each($($('.video a[class= ajax]')[0]).attr('href').split('?')[1].split('&'), function(i, p){
				if(p[0] === 'v' && p[1] === '=')
					v_id = (p.split('=')[1]);
			});
		}

		var embed = $('<embed id="ytplayer" style="height: 390px; width: 640px" allowfullscreen="true" allowscriptaccess="always" quality="high" bgcolor="#000000" name="playerid" style="" src="http://www.youtube.com/v/'+v_id+'?enablejsapi=1&version=3&playerapiid=ytplayer" type="application/x-shockwave-flash" type="application/x-shockwave-flash">');

		var player = $('<div id=player></div>').append(embed);
		$($('.video')[0]).after(player);
	}
	
	window.stopPlaying = function (){
		var ytplayer = document.getElementById("ytplayer");
		 if (ytplayer) {
			ytplayer.removeEventListener("onStateChange", "onPlayerStateChange");
			ytplayer.stopVideo();		
		}
	}
	
	window.onYouTubePlayerReady = function(){
		$('.video')[0].remove();
		var ytplayer = document.getElementById("ytplayer");

		if (ytplayer) {
			ytplayer.playVideo();
		}
		
		ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
		
		onPlayerStateChange = function (state) {
			if (state === 0) {
				window.removeFirst();
					playFirst();
					
				if($('.video a[class= ajax]').size() < 10){
					$('.pager a').click();
					$("html, body").animate({ scrollTop: $(document).height() }, "slow");
					$("html, body").animate({ scrollTop: 0 }, "slow");
				}
			}
		};
	}

	window.playNext = function(){
		console.log('next');
		window.removeFirst();
		window.playFirst();
	}

	window.removeFirst = function(){
		console.log('remove first');

		var entry = $($('#player')).parent().parent().parent().parent();

		if(entry.length == 0){
			entry = $($('.video a[class= ajax]')[0]).parent().parent().parent().parent().parent();
		}

		entry.remove();
	}
}
