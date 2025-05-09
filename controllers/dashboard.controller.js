const { google } = require('googleapis');
const { http } = require("../constants");

const getIndex = async (req, res, next) => {
  const { country, year } = req.query || {};
  let countryInfo = null;
  let population = null;
  let holidays = [];

  try {
    const countries = await fetch("https://date.nager.at/api/v3/AvailableCountries").then((res) => res.json());

    if (country) {
      countryInfo = await fetch(`https://date.nager.at/api/v3/CountryInfo/${country}`).then((res) => res.json());
    }

    if (countryInfo?.officialName) {
      const populationData = await fetch(`https://countriesnow.space/api/v0.1/countries/population`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryInfo.officialName }),
      }).then((res) => res.json());

      if (!populationData.error) {
        population = populationData.data.populationCounts[populationData.data.populationCounts.length - 1];
      }
    }

    if (year && country) {
      const holidaysData = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`).then((res) => res.json());
      holidays = Array.isArray(holidaysData) ? holidaysData : [];
    }

    res.render("dashboard/index", {
      pageTitle: "Dashboard",
      path: "/",
      countries,
      countryInfo,
      borders: countryInfo?.borders ?? [],
      population,
      holidays,
      values: { country, year },
    });
  } catch (err) {
    next(err);
  }
};

const postSaveHolidays = async (req, res, next) => {
  const { selectedHolidays } = req.body;
  const calendar = google.calendar({
    version: 'v3',
    auth: process.env.GOOGLE_CALENDAR_API_KEY
  });
  const startDate = selectedHolidays[0];
  const endDate = selectedHolidays[0];
  const event = {
    summary: "Holiday Holiday Holiday",
    start: { date: startDate },
    end: { date: endDate },
    colorId: '10', // Holiday color
  };

  try {
    console.log(">>> save:", event);

    await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res.status(http.OK).json({ data: req.body })
  } catch (err) {
    next(err);
  }
};

module.exports = { getIndex, postSaveHolidays };
