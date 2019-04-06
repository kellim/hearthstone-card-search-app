// This module saves data returned from the HearthstoneJSON API to 
// src/data/cards.json. It should be run manually whenever the HeartstoneJSON 
// data is updated, likely soon after there's any kind of change to Hearthstone card(s)
// including after new expansions come out.

const fs = require('fs')
const path = require('path')
const axios = require('axios')

// This API doesn't require a key, and you can only retrieve all the cards at once. 
const cardUrl = 'https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json'
const dataDir = path.join(__dirname, '../../data')

 // Get card data from HearthstoneJSON API
axios.get(cardUrl).then((response) => {
  const cardsWithSets = addSetsToCards(response.data)
  saveCardData(JSON.stringify(cardsWithSets))
})

// Add set name to cards based on the set code returned by the API
const addSetsToCards = (cards) => {
  let setsFilePath
  let setsData
  try {
    setsFilePath = path.join(__dirname, '../../data/card-sets.json')
    setsData = JSON.parse(fs.readFileSync(setsFilePath, 'utf-8'))
  } catch {
    console.error('Error obtaining set data. Please fix and restart server.')
  }
  cards.forEach(card => {
    const set = setsData.filter(set => set.code === card.set)
    card.setName = set[0].name
  })
}

// Save cards data to data/cards.json
const saveCardData = (cards) => {
  fs.writeFile(`${dataDir}/cards.json`, cards, (err) => {
    if (err) {
      console.log(err.message)
      return
    }
    console.log('Card data has been saved!')
  })
}