// Get a list of tribes so we can determine what tribes to filter cards by.
// List is saved to src/data/tribes-list-raw.json and I update tribes-list.json manually
// based on it. I don't plan to run this file very often unless I have trouble figuring
// out what the new tribes are called in the API after a new set comes out.
// Note: tribe is called race in the API.

fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const cardsFilePath = path.join(__dirname, '../../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(cardsFilePath, 'utf-8'));

// Returns an array of unique mechanics
const getTribes = (cards) => {
  let tribesList = [];
  cards.forEach(card => {
    if (card.hasOwnProperty('race')) {
      if (!tribesList.includes(card.race)) {
          tribesList.push(card.race);
      }
    }
  })
  return tribesList;
}

// Save the raw list of set codes to card-sets-raw.json
const saveTribesList = (tribes) => {
  fs.writeFileSync(`${dataDir}/tribes-list-raw.json`, JSON.stringify(tribes), (err) => {
    if (err) {
      console.log(err.message);
      return
    }
  })
  console.log('Raw card tribe data has been saved!')
}

const tribes = getTribes(cardsData);
saveTribesList(tribes.sort());