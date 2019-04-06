# Hearthstone Card App

This app is currently in development, but once the MVP is complete, you'll be able to search Hearthstone® cards and filter by class, type, set, and rarity.

## Search Hearthstone Cards

_Progress: Will be implemented soon._

## Run App in Local Environment

### Initial Setup

Install dependencies:

```
npm install
```

### Run App
Run app in dev mode (uses [nodemon](https://nodemon.io/) to restart server when files change. Press `Ctrl-C` to stop server):

```
npm run dev
```

Run app:

```
npm run start
```

## Update Card Data and Card Sets

### Update Card Data

After a new card expansion comes out (or any time you know of an update being made to cards) run `npm run getCards` to save card data from the HearthstoneJSON API to `data/cards.json`.

### Update Card Set Names

After a new expansion comes out, first follow instructions in "Update Card Data" above. 
Then, run `npm run updateSets` to find out the set code for the new expansion.
If any new card sets have been added to cards in `data/cards.json` that aren't yet in `data/card-sets.json`, a message will be logged to the console with set codes for sets that need to be manually added to `data/card-sets.json`. To manually add a set, you'll need to first find the full set name that goes with the set code and then add an item to the array:

Example:
```
  {"code": "UNGORO",
   "name": "Journey to Un'goro"
  }
  ```

Once any sets have been manually added, delete `data/card-sets-to-manually-add.json` so a message won't be logged about it when starting up the app.

## Technologies Used

* JavaScript
* [Node.js](https://nodejs.org)
* [Express](https://expressjs.com/)
* [HearthstoneJSON API](https://hearthstonejson.com/)

## TODO

**MVP:**  
* Implement functionality in `get-card-json.js` to retrieve data from the HearthstoneJSON API and save it to a file.
* Implement Searching cards on the website.
* Implement search result filtering for different options:
  * class
  * type
  * set
  * rarity

Future enhacements may include loading a deck in from a deck code supplied by the game, saving decks and retrieving your saved decks (this would require logging in).  

## License

Code is licensed under the MIT License. 

Note that if you use Blizzard trademarks in association with the code, it's up to you to follow their policies.

## Trademark Info

Hearthstone is a trademark or registered trademark of Blizzard Entertainment, Inc., in the U.S. and/or other countries.
I'm not associated with Blizzard, Inc. but have created this app in accordance to policy in the [Blizzard FAQ](http://us.blizzard.com/en-us/company/about/legal-faq.html). 
