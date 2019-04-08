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
const setsFilePath = path.join(__dirname, '../../data/card-sets.json')
const setsData = JSON.parse(fs.readFileSync(setsFilePath, 'utf-8'))

 // Get card data from HearthstoneJSON API
axios.get(cardUrl).then((response) => {
  const updatedCards = updateCards(response.data)
  saveCardData(JSON.stringify(updatedCards))
})

// Add set name to cards and fix formatting issues
const updateCards = (cards) => {
  cards.forEach(card => {
    // Add set name to card
    const set = setsData.filter(set => set.code === card.set)
    card.setName = set[0].name
    if (card.text) {
      // strong and em should be only html tags in text from api, convert b and i tags to those
      card.text = card.text.replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;')
                           .replace(/&lt;b&gt;/g, '<strong>')
                           .replace(/&lt;\/b&gt;/g, '</strong>')
                           .replace(/&lt;i&gt;<i>/g, '<em>')
                           .replace(/&lt;\/i&gt;<\/i>/g, '</em>')
    }
  })
  return cards
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