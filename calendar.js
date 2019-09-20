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
    document.getElementsByClassName("bglines")[0].innerHTML += `<div class="sched-box hr"><div class="timestamp">12:00</div></div>`;
    
	$('.bglines')[0].innerHTML += `<div id="nowMarker"><div class="time-bubble"</div></div>`;
	updateNowMarker();
}

function updateNowMarker(){
    let dateTime = new Date();
    
    let unit_15Min = $('.sched-box')[0].offsetHeight;
	let unit_Min = unit_15Min / 15;
    let unit_Hr = unit_15Min * 4;
    let hrs = dateTime.getHours();
    if (hrs == 0) hrs = "12"
    else if(hrs > 12) hrs -= 12; 
    let mins = dateTime.getMinutes();
    if (mins < 10) mins = "0"+mins;

	//console.log(dateTime.getHours()*unit_Hr, dateTime.getMinutes()*unit_Min, markerTop);

    $($('#nowMarker')[0]).css('top', `${(dateTime.getHours()*unit_Hr) + (dateTime.getMinutes()*unit_Min)}px`);
    $('.time-bubble')[0].innerText = `${hrs}:${mins}`
}


function posCalFirstEvent(){
	
	let eventMap = Array.from(document.getElementsByClassName('main')).map(function (event) {
		return Number($(event).css('top').slice(0,-2))
	})

	let firstEventTop = Math.min(...eventMap);

	document.getElementsByClassName('aplus-cal-scroller')[0].scrollTop = firstEventTop - 100;
}

function posCalNow(){
	//place nowMarker as close as possible to center of schedule
    document.getElementsByClassName('aplus-cal-scroller')[0].scrollTop = Number($('#nowMarker').css('top').slice(0,-2)) - ( $('.aplus-cal-scroller').outerHeight() / 2 )
}

/********************************************* */



class Event {
	constructor(){}
	start;
	end;
}



/******************************************** */



fillCalGrid();
window.setInterval(updateNowMarker, 1000*60)
//posCalNow();
posCalFirstEvent();
