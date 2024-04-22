In progress autonomous premier league prediction game.

DOCUMENTATION FOR BBC SPORT INTERNAL API

Base URL: https://push.api.bbci.co.uk

Currently 1 known endpoint: /batch
With 1 known parameter: t

Actual parameters split up inside parameter t, with each word split by %2F.
Format is "parameter-name%2Fparameter-value%2F".


Fixture and Result Data parameters:

data:
bbc-morph-football-scores-match-list-data

startDate:
ISO date format for start of period
format: "YYYY-MM-DD"

endDate:
ISO date format for end of period
format: "YYYY-MM-DD"

todayDate:
ISO date format for current date
Currently unaware of true purpose
format: "YYYY-MM-DD"

tournament:
Competition for fixtures wanted
Examples:
premier-league
championship
league-one
league-two
national-league
italian-serie-a
spanish-la-liga
champions-league

version:
Version of API?
Current version is 2.4.6

?timeout=5:
Extra bit on the end used by BBC requests
Not necessary for completion but most likely useful
Will require further investigation on exact units