// Get a list of card mechanics so we can determine what mechanics to filter cards by.
// List is saved to src/data/mechanics-list-raw.json and I update mechanics-list.json manually
// based on it. However, I leave some mechanics from the raw file out that are not major
// mechanics or are too general, confusing, or just one card, etc. I don't plan to run this
// file very often unless I have trouble figuring out what name the API gives to a mechanic
// in a new set.

fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const cardsFilePath = path.join(__dirname, '../../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(cardsFilePath, 'utf-8'));

// Returns an array of unique mechanics
const getMechanics = (cards) => {
  let mechanicsList = [];
  cards.forEach(card => {
    if (card.hasOwnProperty('mechanics')) {
      card.mechanics.forEach(mechanic => {
        if (!mechanicsList.includes(mechanic)) {
          mechanicsList.push(mechanic);
        }
      })
    }
  })
  return mechanicsList;
}

// Save the raw list of set codes to card-sets-raw.json
const saveMechanicsList = (mechanics) => {
  fs.writeFileSync(`${dataDir}/mechanics-list-raw.json`, JSON.stringify(mechanics), (err) => {
    if (err) {
      console.log(err.message);
      return
    }
  })
  console.log('Raw card mechanics data has been saved!')
}

const mechanics = getMechanics(cardsData);
saveMechanicsList(mechanics.sort());