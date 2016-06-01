# ng-chat-server
chatovací server

instalace:
``` npm install ```

spuštění:
``` npm start ```

## Události odesílané

  * __connected__ - vrací objekt uživatele, který se přihlásil  ```{ date: Tue May 31 2016 14:13:30 GMT+0200 (CEST),
  user: 'l1sUATJzjqd928LE' }```
  * __users__ - pošle seznam ID uživatelů, kteří jsou aktivní v chatu ``` [ 'l1sUATJzjqd928LE', '4QPtVVJncCiey2Wt' ] ``` 
  * __message__ - vrátí chatovou zprávu ```{ text: 'aaa',
  date: Tue May 31 2016 14:22:34 GMT+0200 (CEST),
  user: 'l1sUATJzjqd928LE' }```
  * __disconnected__ - vrací objekt uživatele, který se odhlásil ```{ date: Tue May 31 2016 14:19:29 GMT+0200 (CEST),
  user: 'ohu9jKJtacnXfBHZ' }```
  * __writing__ - ```{ user: 'l1sUATJzjqd928LE' }```

## Události přijímané
  * __connect__ - událost při připojení
  * __writing__ - událost při psaní
  * __message__ - událost při odeslání zprávy ```{ text: 'ahoj'} ```
  * __disconnect__ - událost při odpojení

## REST API
 * __api/users__ - vrací všechny registrované uživatele
 * __api/users/{ID}__ - vrací jednoho uživatele. Př: ``` {
    "google": "1010428855912203354981",
    "picture": "https://lh4.googleusercontent.com/-8LXVuqCBmFc/dfwe/AAAAAAAAACE/fdawerfasd-qY/photo.jpg?sz=200",
    "displayName": "Jan Novak",
    "_id": "4gXONmtBl6KjhciM"
  } ```
