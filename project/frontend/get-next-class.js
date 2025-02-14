const CLIENT_ID = "1045036238525-0ln5724lfecbktl2410rrknlmvc2ualr.apps.googleusercontent.com";
let API_KEY;
let CALENDAR_ID =
  localStorage.getItem("savedCalendarID") ||
  "6n36uv9h2mrtcohginl69o7n9feluafr@import.calendar.google.com";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// A P I  Q U I C K S T A R T (from google)

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

// fetch api key

async function fetchApiKey() {
  try {
    const response = await fetch("/api/get-google-api-key");
    const data = await response.json();
    API_KEY = data.apiKey;
    gapiLoaded();
  } catch (error) {
    console.error("error fetching API key:", error);
  }
}

// callback fter api.js is loaded

function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
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
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

// enables user interaction after all libraries are loaded.
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

// sign in the user upon button click.
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // prompt the user to select a account and ask for consent to share their data when establishing a new session
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // skip display of account chooser and consent dialog for an existing session
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

// sign out the user upon button click

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

// R E Q U E S T  N E X T  C L A S S

async function listUpcomingEvents() {
  let response;
  try {
    const request = {
      calendarId: `${CALENDAR_ID}`,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 5,
      orderBy: "startTime",
    };

    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    document.getElementById("next-class").innerText = err.message;
    return;
  }

  console.log(
    "making request to Google Calendar API with calendarId: ",
    CALENDAR_ID
  );

  const events = response.result.items.filter(
    (event) => event.start && event.start.dateTime
  ); // filter out all-day events

  // if no classes found
  if (events.length == 0) {
    localStorage.setItem("savedClass", "No upcoming classes :)");
    return;
  };

  let nextClass = events[0]; 
  console.log(nextClass);
  
  let output;
  let currentTime = new Date();
  let startTime = new Date(nextClass.start.dateTime); // class start time
  let endTime = new Date(nextClass.end.dateTime); // class end time

  if (currentTime >= startTime && currentTime <= endTime){
    // if in a class, display current class
    console.log("test");
    output = `You are in ${nextClass.summary}`;
  } else {
    // if not in a class, display next class
    output = `Your next class is ${nextClass.summary}`;
  };

  localStorage.setItem("savedClass", output);

  console.log("class updated")
  setTimeout(listUpcomingEvents, 60000); // update every minute
}
