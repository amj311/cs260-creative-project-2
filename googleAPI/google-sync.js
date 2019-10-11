// Client ID and API key from the Developer Console
var CLIENT_ID = '611544680661-1mo4l472al753pt9j6m0n61cb5ktfdi9.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDaxitMumGVkJRqTSK0tdIqwK2OpNlj7Zc';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var fetchCalButton = document.getElementById('fetch_cal_button');
var listCalButton = document.getElementById('list_cal_button');
var listEventButton = document.getElementById('list_event_button');
var userButtonSpan = document.getElementById('user_buttons');
var syncButton = document.getElementById('sync_button');



// FOR TESTING WITH DATA
//userCalendars = JSON.parse(testcalJSON);


var userCalendars = [];
var todayEvents = [];

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        // assign button tasks
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        fetchCalButton.onclick = fetchUserCalendars;
        listCalButton.onclick = listUserCalendars;
        listEventButton.onclick = listUpcomingEvents;
        syncButton.onclick = getAllCalendarEvents;

    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        userButtonSpan.style.display = 'block';
        syncButton.style.display = 'block'
        fetchUserCalendars();
    }
    else {
        authorizeButton.style.display = 'block';
        userButtonSpan.style.display = 'none';
        signoutButton.style.display = 'none';
        syncButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    calEvents.googleEvents = [];
}


/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    //pre.appendChild(textContent);

    log('', message);
}


function fetchUserCalendars() {
    gapi.client.calendar.calendarList.list()
        .then(function(response) {
            userCalendars = response.result.items;
            listUserCalendars();
        })
}

function listUserCalendars() {
    let cal_sums = [];
    for (let i = 0; i < userCalendars.length; i++) {
        cal_sums.push(userCalendars[i].summary)
    }
        log('','All user calendars: ',cal_sums);
    
}


function getAllCalendarEvents() {
    for (i=0; i < userCalendars.length; i++){
    	syncCalendar(userCalendars[i])
    }
}


function syncCalendar(cal) {
    todayEvents = [];
    var currentDay = new Date;
    var startOfDay = currentDay.setHours(0, 0, 0);
    var endOfDay = currentDay.setHours(23, 59, 59);


    gapi.client.calendar.events.list({
        'calendarId': cal.id,
        'timeMin': (new Date(startOfDay)).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        // 'maxResults': 10,
        'timeMax': (new Date(endOfDay)).toISOString(),
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        console.log(cal.summary, cal)
        
        if (events.length > 0) {
            for (let i = 0; i < events.length; i++) {
                var eventDate = new Date(events[i].start.dateTime);
                if (currentDay.getDate() == eventDate.getDate()) {
                    
                    console.log(events[i].summary, events[i].colorId)
                    console.log(events[i])
                    if( !events[i].colorId ) { events[i].colorId = cal.colorId } 
                    events[i].color = cal.backgroundColor;
                    todayEvents.push(events[i]);
                }
            }
        }
        else {
            appendPre('No events for calendar: '+cal.summary);
        }
        calEvents.googleEvents = todayEvents
        
    });
}




/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {

    let calendars = gapi.client.items;
    console.log(calendars);

    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
                console.table(event)
            }
        }
        else {
            appendPre('No upcoming events found.');
        }
    });
}
