# pacien.tech API

A RESTful api, rewritten using ES6+, to view, add, modify, and delete patient records for private practicing physicians.

## Documentation

The patient routes are only accessible to users that are currently logged in.

**/patients**

- GET - Retrieves all patients created by the user
  - On success, returns an array of patients
  ```json
  [
    {
      "lastVisit": "09/27/18",
      "totalNumberOfSessions": 5,
      "_id": patientId,
      "phoneNumbers": [
        {
          "_id": "5bad2d7729d2ef7b733e9724",
          "type": "home",
          "number": "333-333-3333"
        },
        {
          "_id": "5bad2d7729d2ef7b733e9723",
          "type": "work",
          "number": "555-555-5555"
        }
      ],
      "sessions": [
        {
          "number": 1,
          "confirmed": true,
          "_id": "5bad2d7729d2ef7b733e9728",
          "date": "09/24/18",
          "notes": "This is notes for 09/24"
        },
        {
          "number": 2,
          "confirmed": true,
          "_id": "5bad2d7729d2ef7b733e9727",
          "date": "09/25/18",
          "notes": "This is notes for 09/25"
        },
        {
          "number": 3,
          "confirmed": false,
          "_id": "5bad2d7729d2ef7b733e9726",
          "date": "09/26/18",
          "notes": "This is notes for 09/26"
        },
        {
          "number": 4,
          "confirmed": true,
          "_id": "5bad2d7729d2ef7b733e9725",
          "date": "09/27/18",
          "notes": "This is first set of notes for 09/27"
        },
        {
          "number": 5,
          "confirmed": true,
          "_id": "5bad3055d2b8ba7f7149a27e",
          "date": "09/27/18",
          "notes": "This is the second set of notes for 09/27"
        }
      ],
      "name": "John Doe",
      "address": "12-34 Main St.",
      "email": "john@gmail.com",
      "reason": "This is the reason field",
      "diagnosis": "This is the diagnosis field",
      "notes": "This is the notes field",
      "createdBy": userId,
      "__v": 1
    }
  ]
  ```
- POST - Creates one patient
  - On success, returns the added patient
  ```json
  {
    "lastVisit": "09/07/18",
    "numberOfSessions": 1,
    "_id": patientId,
    "name": "John Doe",
    "address": "12-34 Main St.",
    "phoneNumber": "333-333-3333",
    "email": "john@gmail.com",
    "reason": "Headache",
    "diagnosis": "Fever",
    "notes": "Needs to drink plenty of water",
    "createdBy": userId,
    "__v": 0
  }
  ```

**/patients/:patientId**

- GET - Retrieves the specific patient with the provided patient ID parameter
  - On success, returns a patient object
  ```json
  {
    "lastVisit": "09/27/18",
    "totalNumberOfSessions": 5,
    "_id": patientId,
    "phoneNumbers": [
      {
        "_id": "5bad2d7729d2ef7b733e9724",
        "type": "home",
        "number": "333-333-3333"
      },
      {
        "_id": "5bad2d7729d2ef7b733e9723",
        "type": "work",
        "number": "555-555-5555"
      }
    ],
    "sessions": [
      {
        "number": 1,
        "confirmed": true,
        "_id": "5bad2d7729d2ef7b733e9728",
        "date": "09/24/18",
        "notes": "This is notes for 09/24"
      },
      {
        "number": 2,
        "confirmed": true,
        "_id": "5bad2d7729d2ef7b733e9727",
        "date": "09/25/18",
        "notes": "This is notes for 09/25"
      },
      {
        "number": 3,
        "confirmed": false,
        "_id": "5bad2d7729d2ef7b733e9726",
        "date": "09/26/18",
        "notes": "This is notes for 09/26"
      },
      {
        "number": 4,
        "confirmed": true,
        "_id": "5bad2d7729d2ef7b733e9725",
        "date": "09/27/18",
        "notes": "This is first set of notes for 09/27"
      },
      {
        "number": 5,
        "confirmed": true,
        "_id": "5bad3055d2b8ba7f7149a27e",
        "date": "09/27/18",
        "notes": "This is the second set of notes for 09/27"
      }
    ],
    "name": "John Doe",
    "address": "12-34 Main St.",
    "email": "john@gmail.com",
    "reason": "This is the reason field",
    "diagnosis": "This is the diagnosis field",
    "notes": "This is the notes field",
    "createdBy": userId,
    "__v": 1
  }
  ```
- PUT - Updates the specific patient with the provided patient ID parameter
  - On success, no returned json, as per REST specs
- DELETE - Deletes the specific patient with the provided patient ID parameter
  - On success, no returned json, as per REST specs

**/auth/register**

- POST - Registers a new user
  - On success, returns an auth object
  ```json
  {
    "auth": true,
    "token": JWT_Token
  }
  ```

**/auth/login**

- POST - Logs in an existing user
  - On success, returns an auth object
  ```json
  {
    "auth": true,
    "token": JWT_Token
  }
  ```

**/auth/logout**

- POST - Explicitly logs out the currently logged in user
  - On success, returns an auth object
  ```json
  {
    "auth": false,
    "token": null
  }
  ```

## Built with/using:

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
