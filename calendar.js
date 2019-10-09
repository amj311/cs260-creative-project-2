/***********************************************************
 DATA STRUCTURE
\***********************************************************/
const CAL_CLASSES = {
	_GGL: "google",
	_MAIN: "main",
	_CLASS: "class main",
	_REM: "reminder",
	_STUDY: "study"
}
const DAYS = { 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday"}


class Event {
	constructor(seed){
		this.start = seed.start || "Not Set";
		this.end = seed.end || "Not Set";
		this.summary = seed.summary || "Untitled Event";
		this.location = seed.location;
		this.color = seed.color;
	}
	isValid;
	startDate() { return new Date(this.start) };
	endDate() { return new Date(this.end) };
}

class StudySession extends Event {
	constructor(specs = {}){
		super(specs);
	}
}

class ClassPeriod extends Event {
	constructor(course) {
		let seed = {
			summary: course.name,
		}
	}
}

class GoogleEvent extends Event {
	constructor(eventItem) {

		eventItem.start = eventItem.start.dateTime;
		eventItem.end = eventItem.end.dateTime;

		super(eventItem)
		this.type = CAL_CLASSES._GGL;
	}
}



class Course {
	constructor(){}
}



class CalendarItemFromEvent {
	constructor(event) {
		this.baseEvent = event;
		this.summary = event.summary;
		if (event.location) this.subtitle = `📍 ${event.location}`;

		let start_dt = new Date(event.start)
		let startPos = ((unit_15Min * 4) * start_dt.getHours()) + ((unit_15Min / 15) * start_dt.getMinutes());

		let end_dt = new Date(event.end)
		let endPos = ((unit_15Min * 4) * end_dt.getHours()) + ((unit_15Min / 15) * end_dt.getMinutes());
		let eventHeight = endPos - startPos;

		this.styles = `top: ${startPos}px; height: ${eventHeight}px; background-color: ${this.baseEvent.color}`
	}
}


/***********************************************************
 TEST DATA
\***********************************************************/

var testUserData = {
	classPeriods: [
		{
			summary: "CS 260 Web Programming",
			start: "2019-10-08T09:00:00-06:00" ,
			end: "2019-10-08T09:50:00-06:00",
			location: "ESC 251",
		},
		{
			summary: "REL 250 Foundations of the Restoration",
			start: "2019-10-08T14:00:00-06:00",
			end: "2019-10-08T14:50:00-06:00",
			location: "HBLL 3721",
		},
		{
			summary: "UNDRWTR BSKTWVNG 121",
			start: "2019-10-08T10:00:00-06:00",
			end: "2019-10-08T10:50:00-06:00",
			location: "KMBL 9101",
		},
		{
			summary: "HOT YOGA 567",
			start: "2019-10-08T12:00:00-06:00",
			end: "2019-10-08T13:30:00-06:00",
			location: "RB 101",
		}
	],
	googleEvents: [
		{
			summary: "The Not Stand Up Meeting",
			start: { dateTime: "2019-10-08T08:45:00-06:00" },
			end: { dateTime: "2019-10-08T09:00:00-06:00" },
			color: "#9fe1e7"
		},
		{
			summary: "Call Someone",
			start: { dateTime: "2019-10-08T11:30:00-06:00" },
			end: { dateTime: "2019-10-08T12:30:00-06:00" },
			color: "lightgrey"
		},
		{
			summary: "Talk to CS Advisor",
			start: { dateTime: "2019-10-08T13:00:00-06:00" },
			end: { dateTime: "2019-10-08T13:45:00-06:00" },
			color: "lightgrey"
		},
		{
			summary: "Self-Reliance Course",
			start: { dateTime: "2019-10-08T19:00:00-06:00" },
			end: { dateTime: "2019-10-08T20:45:00-06:00" },
			color: "lightgrey"
		}
	]
}






/***********************************************************
 Vue Components
\***********************************************************/

var calEvents = new Vue ({
	el: '#aplus-cal-box',

	data: {
		googleEvents: [],
		userClasses: []
	},

	methods: {
		testEvents(){
			this.googleEvents = testUserData.googleEvents.map( googleEvent => {
				return new GoogleEvent(googleEvent);
			});

			this.userClasses = testUserData.classPeriods.map( period => {
				return new Event(period);
			});;
		}
	},

	computed: {
		calendarItems() {
			let events = []

			//repeat for every necessary calendar
			this.googleEvents.forEach( event => {
				events.push(new CalendarItemFromEvent(event))
			})


			this.userClasses.forEach( event => {
				event.type = CAL_CLASSES._CLASS;
				events.push(new CalendarItemFromEvent(event))
			})

			return events;
		}
	}
})


/***********************************************************
 Calendar UI
\***********************************************************/

var unit_15Min = 10;


function log(type, ...msgs){
	let logHTML = "";
	const log = document.getElementById('msgs')
	
	msgs.forEach(function(msg) {
		logHTML +=	`<div class="msg-line">${msg}</div>`
	} )
	
	log.innerHTML += `	<div class="msg ${type || ''}">
							<div class="log-time">${new Date().toISOString()}</div>
							${logHTML}
						</div>`;
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
    document.getElementsByClassName("bglines")[0].innerHTML += `<div class="sched-box hr"><div class="timestamp">12:00</div></div>`;
}


function initiateNowMarker(){
	$('.bglines')[0].innerHTML += `<div id="nowMarker"><div class="time-bubble"</div></div>`;

	let dateTime = new Date();
	let secsToMinute = 60 - dateTime.getSeconds();
	// console.log(secsToMinute);

	updateNowMarker();
	setTimeout( function(){
		// console.log("starting 1min cycle")
		updateNowMarker();
		window.setInterval(updateNowMarker, 1000*60)
	}, secsToMinute*1000)
}

function updateNowMarker(){
    let dateTime = new Date();
    
    unit_15Min = $('.sched-box')[0].offsetHeight;
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

	// console.log(`Time is now ${hrs}:${mins}`)
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



/**
 * 
 * @param {array} events 
 */
function renderEvents(array) {

}




fillCalGrid();
posCalFirstEvent();
initiateNowMarker();
posCalNow();

calEvents.testEvents()