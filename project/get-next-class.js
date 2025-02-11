const CLIENT_ID = '1045036238525-0ln5724lfecbktl2410rrknlmvc2ualr.apps.googleusercontent.com';
// important! move to backend server 
let API_KEY = null;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// calander api quickstart from google

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

// callback fter api.js is loaded

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

// callback after the API client is loaded. Loads the discovery doc to initialize the API

async function initializeGapiClient() {
    await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

// callback after google identity services are loaded
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

// enables user interaction after all libraries are loaded.
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

// sign in the user upon button click.
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
    // prompt the user to select a account and ask for consent to share their data when establishing a new session
    tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
    // skip display of account chooser and consent dialog for an existing session
    tokenClient.requestAccessToken({prompt: ''});
    }
}

// sign out the user upon button click

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

// display next class 

async function listUpcomingEvents() {
    let response;
    try {
    const request = {
        'calendarId': '6n36uv9h2mrtcohginl69o7n9feluafr@import.calendar.google.com', // have this be changeable later (mine for now)
        'timeMin': new Date().toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 5,
        'orderBy': 'startTime',
    };

    response = await gapi.client.calendar.events.list(request);
    } catch (err) {
        document.getElementById('next-class').innerText = err.message;
        return;
    }

    const events = response.result.items.filter(event => event.start && event.start.dateTime); // filter out all-day events
    console.log(response.result.items); 

    // if no classes found
    if (!events || events.length == 0) {
        document.getElementById('next-class').innerHTML = "no classes found.";
        return;
    }
    
    // show next class
    const nextClass = events[0];
    const output = `your next class is: ${nextClass.summary}`;

    document.getElementById('next-class').innerHTML = output;
}