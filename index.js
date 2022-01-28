const EventSource = require('eventsource');
const { generateReport, domainReport, userReport } = require('./app');

// Global Variables
const url = 'https://stream.wikimedia.org/v2/stream/revision-create';
let oneMinute = 1;
const revisions = [];

console.log(`Connecting to EventStreams at ${url}`);
var eventSource = new EventSource(url);

// on stream connected
eventSource.onopen = function (event) {
  console.log('--- Opened connection.');

  setInterval(() => {
    intervalHandler(5, 60);
    oneMinute += 1;
  }, 1 * 60 * 1000);
};

// on connection error
eventSource.onerror = function (event) {
  console.error('--- Encountered error', event);
};
eventSource.onmessage = function (event) {
  // parse important date for report.
  scrapRevision(JSON.parse(event.data));
};

// handler for interval call
const intervalHandler = (minutes, seconds) => {
  console.log(
    `Minute ${oneMinute} Report - Minute ${
      oneMinute > 5 ? oneMinute - 5 : 0
    }-${oneMinute} data`
  );
  const windowStart = Date.now();
  const windowTime = minutes * seconds * 1000;
  const { noOfDomains, domains, users } = generateReport(
    revisions,
    windowStart,
    windowTime
  );
  domainReport(noOfDomains, domains);
  userReport(users);
};

// this part scraps data from stream
const scrapRevision = (rev) => {
  const revision = {
    domain: rev.meta.domain,
    pageTitle: rev.page_title,
    user: rev.performer.user_text,
    isBot: rev.performer.user_is_bot,
    userEditCount: rev.performer.user_edit_count
      ? rev.performer.user_edit_count
      : 0,
    timestamp: new Date(rev.rev_timestamp).getTime(),
    window: true,
  };

  revisions.push(revision);
};
