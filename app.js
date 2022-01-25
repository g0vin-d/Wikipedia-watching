// this seperates two report
exports.generateReport = (revisions, window, windowTime) => {
  const report = {};
  const userReport = {};
  let noOfDomains = 0;

  for (const rev of revisions) {
    if (window - rev.timestamp > windowTime) {
      continue;
    }

    // Domain report
    if (report[rev.domain]) {
      if (!report[rev.domain].pageTitles.includes(rev.pageTitle)) {
        report[rev.domain].pages += 1;
        report[rev.domain].pageTitles.push(rev.pageTitle);
      }
    } else {
      report[rev.domain] = {
        pages: 1,
        pageTitles: [rev.pageTitle],
      };
      noOfDomains += 1;
    }

    // User report
    if (rev.domain === 'en.wikipedia.org' && !rev.isBot) {
      if (
        userReport[rev.user] &&
        userReport[rev.user].pageEditCount > rev.userEditCount
      ) {
        userReport[rev.user].pageEditCount = re.userEditCount;
      } else {
        userReport[rev.user] = {
          user: rev.user,
          pageEditCount: rev.userEditCount,
          // bot: rev.isBot,
        };
      }
    }
  }

  return { noOfDomains, domains: report, users: userReport };
};

exports.domainReport = (noOfDomains, report) => {
  // sorting on pages
  const domains = Object.entries(report).sort(
    (a, b) => b[1].pages - a[1].pages
  );

  console.log(`Total number of Wikipedia Domains Updated: ${noOfDomains}`);
  domains.forEach((dom) => {
    console.log(`${dom[0]}: ${dom[1].pages} pages updated`);
  });
};

exports.userReport = (report) => {
  // sorting userEditcount
  const users = Object.entries(report).sort(
    (a, b) => b[1].pageEditCount - a[1].pageEditCount
  );

  console.log(`Users who made changes to en.wikipedia.org: ${users.length}`);
  users.forEach((user) => {
    console.log(`${user[1].user}: ${user[1].pageEditCount}`);
  });
  console.log();
};
