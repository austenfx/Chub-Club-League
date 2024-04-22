import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/games", async (req, res) => {
    try {
        //let dates = await GetDatesForGameWeek(req.query.week);
        let dates = {
            start: req.query.startDate,
            end: req.query.endDate,
            now: DatetoISO(new Date())
        }
        let league = req.query.league;
        let gameDataList = await GetGameDataList(dates, league);
        let gameList = FormatGameData(gameDataList);

        res.render("index.ejs", { data: gameList, dates: dates });
    } catch (error) {
        res.send(error.message);
    }
    
})

function InfotoURL(dates, league){
    let info = [
        'https://push.api.bbci.co.uk/batch?t=',
        'data',
        'bbc-morph-football-scores-match-list-data',
        'endDate',
        dates.end,
        'startDate',
        dates.start,
        'team',
        'arsenal',
        'todayDate',
        dates.now,

        'version',
        '2.4.6?timeout=5'
      ];

      let URL = "\n" + info.join("%2F");
      console.log(URL);

      return URL;
}

async function GetDatesForGameWeek(gameweek){
    try {
        const response = await axios.get("https://fantasy.premierleague.com/api/fixtures/?event=" + gameweek);
        const result = response.data;

        let startDate = result[0].kickoff_time.split('T')[0];
        let endDate = result[result.length - 1].kickoff_time.split('T')[0];
        console.log(startDate, endDate);
        return {
            start: startDate,
            end: endDate,
            now: DatetoISO(new Date())
        }
    } catch (error) {
        console.log(error.message);
        return {
            start: "error",
            end: "error",
            now: "error"
        }
    }
}

async function GetGameDataList(dates, league){
    const response = await axios.get(InfotoURL(dates, league));
    const result = response.data;

    let gameDataList = [];
    
    try {
        let rawTournamentList = result.payload[0].body.matchData;
        Object.values(rawTournamentList).forEach(comp => {
            comp.tournamentDatesWithEvents
            Object.values(comp.tournamentDatesWithEvents).forEach(date => {
                date[0].events.forEach(game => {
                    gameDataList.push({
                        homeTeam: game.homeTeam.name.first,
                        awayTeam: game.awayTeam.name.first,
                    });
                });
            });
        });
    } catch (error) {
        console.log(error.message);
    }

    return gameDataList;
}

function FormatGameData(gameDataList){
    let gameList = [];

    gameDataList.forEach((gameData) => {
        gameList.push(gameData.homeTeam + " v " + gameData.awayTeam);
    })

    return gameList;
}

function DatetoISO(date){
    let newDate = date.toISOString().split('T')[0];
    return newDate;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});