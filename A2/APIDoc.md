

# A1 - API Documentation - A00941422

**GET Pokemons**
----
  Returns a number of pokemon specified by count, after a certain number specified by after.

* **URL**

  /api/v1/pokemons

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `count=[integer]`\
  `after=[integer]`,



* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `{
    "name": {
      "english": "Metapod",
      "japanese": "トランセル",
      "chinese": "铁甲蛹",
      "french": "Chrysacier"
    },
    "base": {
      "HP": 50,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30
    },
    "_id": "633f4677abbfb426f66ceac2",
    "id": 11,
    "type": [
      {
        "english": "Bug",
        "chinese": "虫",
        "japanese": "むし"
      }
    ],
    "__v": 0
  }`
 
* **Error Response:**


  * **Code:** 200 OK <br />
    **Content:** `{errMsg:'Error Reading Database'}`

  * **Code:** 200 OK <br />
    **Content:** `{errMsg : {
                code: "11000"
            }}`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "pokemons/?count=2&after=10",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

---
\
**GET Pokemon**
----
  Returns a specific pokemon by id.

* **URL**

  /api/v1/pokemon/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`



* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ` {
    "name": {
      "english": "Metapod",
      "japanese": "トランセル",
      "chinese": "铁甲蛹",
      "french": "Chrysacier"
    },
    "base": {
      "HP": 50,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30
    },
    "_id": "633f4677abbfb426f66ceac2",
    "id": 11,
    "type": [
      {
        "english": "Bug",
        "chinese": "虫",
        "japanese": "むし"
      }
    ],
    "__v": 0
  }
 
* **Error Response:**


    * **Code:** 200 OK <br />
    **Content:** `{errMsg: 'ValidationError: check your ...'}`

  * **Code:** 200 OK <br />
    **Content:** `{ errMsg: "Cast Error: pass pokemon id between 1 and 811"}`



* **Sample Call:**

  ```javascript
    $.ajax({
      url: "pokemons/77",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
---
**GET Pokemon Image**
----
  Add a single pokemon image URL.

* **URL**

  /api/v1/pokemonImage/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
  `id=[integer]`


* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ` {success: 'New Pokemon Saved Successfully' }`
 
* **Error Response:**


  * **Code:** 200 OK <br />
    **Content:** `{"URL":"https://github.com/fanzeyi/pokemon.json/blob/master/images/134.png"}`

  * **Code:** 200 OK <br />
    **Content:** `{"URL" : Null}`



* **Sample Call:**

  ```javascript
    $.ajax({
      url: "pokemons/124",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  

---
\
**POST Pokemon**
----
  Add a single pokemon.

* **URL**

  /api/v1/pokemon/

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**

    `NONE`


* **Data Params**

  `{
    "name": {
      "english": String,
      "japanese": String,
      "chinese": String,
      "french": String
    },
    "base": {
      "HP": Number,
      "Attack": Number,
      "Defense": Number,
      "Speed": Number,
      "Speed Attack": Number,
      "Speed Defense": Number
    },
    
    "id": Number,
    "type": [
    String
    ],
    "__v": Number
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ` {success: 'New Pokemon Saved Successfully' }`
 
* **Error Response:**


  * **Code:** 200 OK <br />
    **Content:** `{ Error: 'Pokemon Not Found' }`

  * **Code:** 200 OK <br />
    **Content:** `{errMsg : {
                code: "11000"
            }}`



* **Sample Call:**

  ```javascript
    $.ajax({
      url: "pokemons/",
      dataType: "json",
      type : "POST",
      body: {
    "name": {
      "english": "test",
      "japanese": "test",
      "chinese": "test",
      "french": "test"
    },
    "base": {
      "HP": 50,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "Speed Attack": 25,
      "Speed Defense": 25
    },
    
    "id": 1000,
    "type": [
      "Bug"
    ],
    "__v": 0
  }
      success : function(r) {
        console.log(r);
      }
    });
  ```

---
  
\
**DELETE Pokemon**
---
  Delete a single pokemon.

* **URL**

  /api/v1/pokemon/

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
  `id=[integer]`



* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ` { msg: 'Deleted Successfully' }`
 
* **Error Response:**


  * **Code:** 200 OK <br />
    **Content:** `{ Error: 'Pokemon Not Found' }`




* **Sample Call:**

  
  ```javascript
    $.ajax({
      url: "pokemons/124",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```

---

\
**PUT Pokemon**
----
  Insert a single Pokemon.
  If Pokemon exists, update information.

* **URL**

  /api/v1/pokemon/

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
  `id=[integer]`



* **Data Params**

  `{
    "name": {
      "english": "test",
      "japanese": "test",
      "chinese": "test",
      "french": "test"
    },
    "base": {
      "HP": 60,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "Speed Attack": 25,
      "Speed Defense": 25
    },
    
    "id": 10,
    "type": [
      "Bug"
    ],
    "__v": 0
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ` {
            msg: 'Updated successfully'
        }`
 
* **Error Response:**


  * **Code:** 200 OK <br />
    **Content:** `{msg: 'Not found'}`

  * **Code:** 200 OK <br />
    **Content:** `{errMsg: "ValidationError: check your ..."}`


* **Sample Call:**

  
  ```javascript
    $.ajax({
      url: "pokemons/124",
      dataType: "json",
      type : "PUT",
      body : {
    "name": {
      "english": "test",
      "japanese": "test",
      "chinese": "test",
      "french": "test"
    },
    "base": {
      "HP": 60,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "Speed Attack": 25,
      "Speed Defense": 25
    },
    
    "id": 10,
    "type": [
      "Bug"
    ],
    "__v": 0
  }
      success : function(r) {
        console.log(r);
      }
    });
  ```
---
\
**PATCH Pokemon**
----
  Update the information of a Pokemon

* **URL**

  /api/v1/pokemon/

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
  `id=[integer]`



* **Data Params**
  
  `{
    "base": {
      "HP": 6666,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "SpecialAttack": 25,
      "SpecialDefense": 25
    }
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ` {
            msg: 'Updated successfully'
        }`
 
* **Error Response:**


  * **Code:** 200 OK <br />
    **Content:** `{msg: 'pokemon not found'}`

  * **Code:** 200 OK <br />
    **Content:** `{errMsg: 'Dangerous operation'}`


* **Sample Call:**

  
  ```javascript
    $.ajax({
      url: "pokemons/124",
      dataType: "json",
      type : "PUT",
      body : {
    "base": {
      "HP": 6666,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "SpecialAttack": 25,
      "SpecialDefense": 25
    }
      success : function(r) {
        console.log(r);
      }
    });
  ```


  
  

