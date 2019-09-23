// The data in the HearthstoneJSON API has a set field that contains the set code, but we 
// need set names for the app too and for now that has to be added manually to data/card-sets.json.
// This module checks if card data in the HearthstoneJSON API contains any new sets. 
// It saves the set codes for all sets cards belong to in src/data/card-sets-raw.json
// It then compares card-sets-raw.json to the processed sets in card-sets.json and logs any sets that
// haven't been added to card-sets.json yet.
// Any sets that it finds that aren't in card-sets.json need to be manually added to the file after
// figuring out the full set name.
module.exports = function(cardsData) {
  fs = require('fs');
  const path = require('path');
  
  const dataDir = path.join(__dirname, '../../data');
  const processedSetsFilePath = path.join(__dirname, '../../data/card-sets.json');
    const processedSets = JSON.parse(fs.readFileSync(processedSetsFilePath, 'utf-8'));

  const getCardSets = (cardsData) => {
    const uniqueSets = [];
    cardsData.forEach((card) => {
      if (!uniqueSets.includes(card.set)) {
        uniqueSets.push(card.set);
      }
    })
    return uniqueSets;
  }
  
  // Save the raw list of set codes to card-sets-raw.json
  const saveCardData = (cardSets) => {
    fs.writeFileSync(`${dataDir}/card-sets-raw.json`, JSON.stringify(cardSets), (err) => {
      if (err) {
        console.log(err.message);
        return
      }
    })
  }
  
  // Returns any added sets (set codes) that haven't yet been manually added to card-sets.json
  const checkForAddedSets = (processedSets, allSets) => {
    return allSets.filter(cardSet => processedSets.every(processedSet => processedSet.type !== cardSet));
  }
  
  // Print set codes for sets that haven't yet been manually added to card-sets.json
  const logAddedSets = (addedSets) => {
    if (addedSets.length >= 1) {
      fs.writeFileSync(`${dataDir}/card-sets-to-manually-add.json`, JSON.stringify(addedSets), (err) => {
        if (err) {
          console.log(err.message);
          return
        }
      })
      console.log('\nIMPORTANT: The following sets need to be manually added to data/card-sets.json after determining set names:')
      addedSets.forEach(addedSet => {
        console.log(addedSet);
      })
    } else {
      console.log("There are no sets to manually add.");
    }
  }

  const allSets = getCardSets(cardsData);
  saveCardData(allSets);
  const addedSets = checkForAddedSets(processedSets, allSets);
  logAddedSets(addedSets);
  if (addedSets.length > 0) {
    return true;
  }
  return false;
}