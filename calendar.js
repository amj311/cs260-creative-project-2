/*  global Vue */
/*  global fetch */
/*  global $ */
/*  global moment */

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

const DAYS = { 
	list: [
		{full: "sunday", code: "Su"},
		{full: "monday", code: "M"},
		{full: "tuesday", code: "T"},
		{full: "wednesday", code: "W"},
		{full: "thursday", code: "Th"},
		{full: "friday", code: "F"},
		{full: "Saturday", code: "S"}
	],
	getFull(int_array) {
		return int_array.map( int => { return this.list[int].full } )
	},
	getLetters(int_array) {
		return int_array.map( int => { return this.list[int].full.slice(0,1).toUpperCase() } )
	},
	getShort(int_array) {
		return int_array.map( int => { return this.list[int].full.slice(0,3) } )
	},
	getSchedCode(int_array) {
		return int_array.map( int => { return this.list[int].code } ).reduce( (string, code) => { return string + code })
	}
}



const DATE_FORMAT = 'Y-M-D HH:mm';



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
	constructor(seed){
		super(seed);
	}
}

class ClassPeriod extends Event {
	constructor(course) {
		let seed = {
			summary: course.name,
		}
		super(seed)
		this.type = CAL_CLASSES._CLASS;
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
	constructor(seed = {}){
		this.name = seed.name || "No Name";		
		this.sched = seed.sched || {
			example:
			{ 
				start: { hr: null, min: null},
				end: { hr: null, min: null}
			}
		}
		this.location = seed.location;
		this.color = seed.color || "lightgrey";
	}

	relTimeSeed(sched_day) {
		let start = `${moment().format('Y-M-D')} ${sched_day.start.hr}:${sched_day.start.hr}`;
		let end = `${moment().format('Y-M-D')} ${sched_day.end.hr}:${sched_day.end.hr}`;
		return { start, end }
	}

}



class CalendarElFromEvent {
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

var testUserData_1 = {
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

var testUserData_2 = {
	classPeriods: [
		{
			summary: "zdgh fhj ghj fghj",
			start: "2019-10-08T09:00:00-06:00" ,
			end: "2019-10-08T09:50:00-06:00",
			location: "ESC 251",
		},
		{
			summary: "awe QWER wer",
			start: "2019-10-08T12:00:00-06:00",
			end: "2019-10-08T13:30:00-06:00",
			location: "RB 101",
		}
	],
	googleEvents: [
		{
			summary: "Thjfgh jfgkj ghj",
			start: { dateTime: "2019-10-08T08:45:00-06:00" },
			end: { dateTime: "2019-10-08T09:00:00-06:00" },
			color: "#9fe1e7"
		},
		{
			summary: "xfnghj gfkj",
			start: { dateTime: "2019-10-08T11:30:00-06:00" },
			end: { dateTime: "2019-10-08T12:30:00-06:00" },
			color: "lightgrey"
		}
	]
}






/***********************************************************
 Vue Components
\***********************************************************/

var calEvents = new Vue ({
	el: '#aplus-cal-box .events-box',

	data: {
		googleEvents: [],
		userClasses: [],
		test: "hello"
	},

	methods: {
		testEvents(testData){
			
			this.googleEvents = testData.googleEvents.map( googleEvent => {
				return new GoogleEvent(googleEvent);
			});

			this.userClasses = testData.classPeriods.map( period => {
				return new Event(period);
			});;
		}
	},

	computed: {
		googleItems() {
			var elements = []

			//repeat for every necessary calendar
			this.googleEvents.forEach( event => {
				console.log(event)
				elements.push(new CalendarElFromEvent(new GoogleEvent(event)))
				console.log(elements[elements.length-1])
			})


			//this.userClasses.forEach( event => {
			//	event.type = CAL_CLASSES._CLASS;
			//	elements.push(new CalendarElFromEvent(event))
			//})

			return elements;
		}
	}
})


var nowMarker = new Vue ({
	el: "#nowMarker",

	data: {
		timeStamp: "10:00",
		offset: null,
		styles: "top: 20px"
	},

	methods: {
		initiate() {
			let dateTime = new Date();
			let secsToMinute = 60 - dateTime.getSeconds();
			// console.log(secsToMinute);
		
			nowMarker.update();
			setTimeout( function(){
				// console.log("starting 1min cycle")
				nowMarker.update();
				window.setInterval(nowMarker.update, 1000*60)
			}, secsToMinute*1000)

		},

		update(){
			let dateTime = new Date();
			
			unit_15Min = $('.sched-box')[0].offsetHeight;
			let unit_Min = unit_15Min / 15;
			let unit_Hr = unit_15Min * 4;
			let hrs = dateTime.getHours();
			if (hrs == 0) hrs = "12"
			else if(hrs > 12) hrs -= 12; 
			let mins = dateTime.getMinutes();
			if (mins < 10) mins = "0"+mins;
	
	
			this.offset = (dateTime.getHours()*unit_Hr) + (dateTime.getMinutes()*unit_Min)
			this.styles = `top: ${this.offset}px`;
			this.timeStamp = `${hrs}:${mins}`
	
			// console.log(`Time is now ${hrs}:${mins}`)
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


function posCalFirstEvent(){
	
	let eventMap = Array.from(document.getElementsByClassName('main')).map(function (event) {
		return Number($(event).css('top').slice(0,-2))
	})

	let firstEventTop = Math.min(...eventMap);

	document.getElementsByClassName('aplus-cal-scroller')[0].scrollTop = firstEventTop - 100;
}

function posCalNow(){
	//place nowMarker as close as possible to center of schedule
	document.getElementsByClassName('aplus-cal-scroller')[0].scrollTop = nowMarker.offset - ( $('.aplus-cal-scroller').outerHeight() / 2 )
}



/**
 * 
 * @param {array} events 
 */
function renderEvents(array) {

}




fillCalGrid();
posCalFirstEvent();
nowMarker.initiate();
posCalNow();

//FIXTHIS: weeeeird bug morphs data when swapping test objects repeatedly. Maybe a problem with 'new' and memory?
//calBox.testEvents(testUserData_1)
