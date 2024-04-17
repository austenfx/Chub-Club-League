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
        let dates = await GetDatesForGameWeek(req.query.week);

        let gameDataList = await GetGameDataList(dates);
        let gameList = FormatGameData(gameDataList);

        res.render("index.ejs", { data: gameList });
    } catch (error) {
        res.send(error.message);
    }
    
})

function InfotoURL(dates){
    let info = [
        'https://push.api.bbci.co.uk/batch?t=',
        'data',
        'bbc-morph-football-scores-match-list-data',
        'endDate',
        dates.end,
        'startDate',
        dates.start,
        'todayDate',
        dates.now,
        'tournament',
        'premier-league',
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

async function GetGameDataList(dates){
    const response = await axios.get(InfotoURL(dates));
    const result = response.data;

    let gameDataList = [];
    
    try {
        let rawGamesList = result.payload[0].body.matchData[0].tournamentDatesWithEvents;
        Object.values(rawGamesList).forEach(date => {
            date[0].events.forEach(game => {
                gameDataList.push({
                    homeTeam: game.homeTeam.name.first,
                    awayTeam: game.awayTeam.name.first,
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