const { response } = require("express");

//Create a variable to hold db connection
let db;
//Establish a connection to IndexedDB databased called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

//this event will emit if the database version changes (nonexistent to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  //save a reference to the database
  const db = event.target.result;

  //create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

//upon a successful
request.onsuccess = function (event) {
  //When db is successfully created with its object store (from onupgraded event) or simply established a connect, save reference to db in global variable
  db = event.target.result;

  //Check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.online) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

//This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  //Open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  //Access the object store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //Add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // Open a transaction to your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // Access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // Get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();
}

// upon a successful .getAll() execution, run this function
getAll.onsuccess = function () {
  // if there was data in indexedDb's store, let's send it to the api server
  if (getAll.result.length > 0) {
    fetch("/api/pizzas", {
      method: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((serverResponse) => {
        if (serverResponse.message) {
          throw new Error(serverResponse);
        }
        // open one more transaction
        const transaction = db.transaction(["new_pizza"], "readwrite");
        // access the new_pizza object store
        const pizzaObjectStore = transaction.objectStore("new_pizza");
        // clear all items in your store
        pizzaObjectStore.clear();

        alert("All saved pizza has been submitted!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//Listen for app coming back online
window.addEventListener("online", uploadPizza);
