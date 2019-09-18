function log(msg, type){
	const log = document.getElementById('msgs')
	log.innerHTML += `<div class="msg ${type || ''}">
											${msg} - 
											<em>
												${new Date().toISOString()}
											</em></div>`;
	log.scrollTop = log.scrollHeight;
}


function fillCalGrid()
{
	for (let i = 0; i < (24*4); i++)
	{
		let hr24 = Math.floor(i/4);
		let hr = (hr24%12 > 0) ? hr24%12 : "12";
		let min;
		className="min";
		
		switch (i%4){
			case 0:
				min = "00"
				className = "hr";
				break;
			case 1:
				min = "15";
				break;
			case 2:
				min = "30";
				break;
			case 3:
				min = "45";
				break;
		}
		document.getElementsByClassName("bglines")[0].innerHTML += `<div class="sched-box ${className}"><div class="timestamp">${hr}:${min}</div></div>`;
	}
	$('.bglines')[0].innerHTML += `<div id="nowMarker"></div>`;
	updateNowMarker();
}

function updateNowMarker(){
	let unit_15Min = $('.sched-box')[0].offsetHeight;
	let unit_Min = unit_15Min / 15;
	let unit_Hr = unit_15Min * 4;

	let dateTime = new Date();
	let markerTop = `${(dateTime.getHours()*unit_Hr) + (dateTime.getMinutes()*unit_Min)}px`;

	console.log(dateTime.getHours()*unit_Hr, dateTime.getMinutes()*unit_Min, markerTop);

	$($('#nowMarker')[0]).css('top', `${(dateTime.getHours()*unit_Hr) + (dateTime.getMinutes()*unit_Min)}px`);
}

function posCalFirstEvent(){
	
	let eventMap = Array.from(document.getElementsByClassName('main')).map(function (event) {
		return Number($(event).css('top').slice(0,-2))
	})

	let firstEventTop = Math.min(...eventMap);

	document.getElementById('calendar').scrollTop = firstEventTop - 10;
}
function posCalNow(){
	//place nowMarker as close as possible to center of schedule
	document.getElementById('calendar').scrollTop = Number($('#nowMarker').css('top').slice(0,-2)) - ( $('#calendar').outerHeight() / 2 )
}

/********************************************* */



class Event {
	constructor(){}
	start;
	end;
}



/******************************************** */



fillCalGrid();
posCalFirstEvent();
window.setInterval(updateNowMarker, 1000*60)
posCalNow();