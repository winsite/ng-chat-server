# ng-chat-server
chatovací server

## Události odesílané

  * __connected__ - vrací objekt uživatele, který se přihlásil  ```{ date: Tue May 31 2016 14:13:30 GMT+0200 (CEST),
  user: 'l1sUATJzjqd928LE' }```
  * __users__ - pošle seznam ID uživatelů, kteří jsou aktivní v chatu ``` [ 'l1sUATJzjqd928LE', '4QPtVVJncCiey2Wt' ] ``` 
  * __message__ - vrátí chatovou zprávu ```{ text: 'aaa',
  date: Tue May 31 2016 14:22:34 GMT+0200 (CEST),
  user: 'l1sUATJzjqd928LE' }```
  * __disconnected__ - vrací objekt uživatele, který se odhlásil ```{ date: Tue May 31 2016 14:19:29 GMT+0200 (CEST),
  user: 'ohu9jKJtacnXfBHZ' }```
  * __writing__ - ```{ text: 'aaa',
  user: 'l1sUATJzjqd928LE' }```

## Události přijímané
  * __connected__ - událost při připojení
  * __writing__ - událost při psaní
  * __message__ - událost při odeslání zprávy ```{ text: 'ahoj'} ```
  * __disconected__ - událost při odpojení
