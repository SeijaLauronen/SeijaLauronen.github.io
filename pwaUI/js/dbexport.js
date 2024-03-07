/*
<script src="https://gist.github.com/loilo/ddfdb3c54fa474a89f71ce0660cd38b7.js"></script>
Browser console support for shellking4, see https://gist.github.com/loilo/ed43739361ec718129a15ae5d531095b?permalink_comment_id=3649980#gistcomment-3649980
export.js
// Copy this whole snippet to your browser console
*/

//var dbName = prompt("What's the name of the database to export?")

function exportDB(){
  var dbName = 'helperdb';
  var json ="";

  (async () => {
  try {
    
    var dbExists = await new Promise(resolve => {
      var request = window.indexedDB.open(dbName)
      request.onupgradeneeded = e => {
        e.target.transaction.abort()
        resolve(false)
      }
      request.onerror = () => resolve(true)
      request.onsuccess = () => resolve(true)
    })
    

    if (!dbExists) {
      throw new Error('Database does not exist')
    }

    var idbDatabase = await new Promise((resolve, reject) => {
      var request = window.indexedDB.open(dbName)
      request.onerror = () => reject('Could not open the database')
      request.onsuccess = () => resolve(request.result)
    })



    var json = await new Promise((resolve, reject) => {
      const exportObject = {}
      if (idbDatabase.objectStoreNames.length === 0) {
        resolve(JSON.stringify(exportObject))
      } else {
        const transaction = idbDatabase.transaction(
          idbDatabase.objectStoreNames,
          'readonly'
        )
    
        transaction.addEventListener('error', reject)
    
        for (const storeName of idbDatabase.objectStoreNames) {
          const allObjects = []
          transaction
            .objectStore(storeName)
            .openCursor()
            .addEventListener('success', event => {
              const cursor = event.target.result
              if (cursor) {
                // Cursor holds value, put it into store data
                allObjects.push(cursor.value)
                cursor.continue()
              } else {
                // No more values, store is done
                exportObject[storeName] = allObjects
    
                // Last store was handled
                if (
                  idbDatabase.objectStoreNames.length ===
                  Object.keys(exportObject).length
                ) {
                  resolve(JSON.stringify(exportObject))
                }
              }
            })
        }
      }
    })



    console.log(' ')
    console.log('Database has been exported:')
    console.log(' ')
    console.log(json)
    console.log(' ')
    // data näytölle, tämä ei hyvä tässä, pitäisi siirtää parempaan paikkaan, ui-kerrokseen
    datatext.value=json //TODO tämä parmmin

  } catch(error) {
    console.error(error)
  }
  
  })() //async

  return json //mihin tämä pitäisi laittaa
}


function importDBFromJson() {

  var dbName = 'helperdb';
  var json = datatext.value; //TODO tämä parmmin

  (async () => {
  try {
    

    alert("Korvataan dataa...")

    var dbExists = await new Promise(resolve => {
      var request = window.indexedDB.open(dbName)
      request.onupgradeneeded = e => {
        e.target.transaction.abort()
        resolve(false)
      }
      request.onerror = () => resolve(true)
      request.onsuccess = () => resolve(true)
    })
    

    if (!dbExists) {
      throw new Error('Database does not exist')
    }

    var idbDatabase = await new Promise((resolve, reject) => {
      var request = window.indexedDB.open(dbName)
      request.onerror = () => reject('Could not open the database')
      request.onsuccess = () => resolve(request.result)
    })



  return await new Promise((resolve, reject) => {
    const transaction = idbDatabase.transaction(
      idbDatabase.objectStoreNames,
      'readwrite'
    )
    transaction.addEventListener('error', reject)

    var importObject = JSON.parse(json)
    for (const storeName of idbDatabase.objectStoreNames) {

        let count = 0
        let key=0
        for (const toAdd of importObject[storeName]) {
          key++
          //const request = transaction.objectStore(storeName).add(toAdd) //tästä tulee virhe: Failed to execute 'add' on 'IDBObjectStore': The object store uses out-of-line keys and has no key generator and the key parameter was not provided.
          const request = transaction.objectStore(storeName).add(toAdd,String(key)) // pitää antaa myös avain 7.3.2024 pitääkin olla string tyyppinen avain, että jatko menee ok
          request.addEventListener('success', () => {
            count++
            if (count === importObject[storeName].length) {
              // Added all objects for this store
              delete importObject[storeName]
              if (Object.keys(importObject).length === 0) {
                // Added all object stores
                resolve()
              }
            }
          })
        }
      
    }
  })

} catch(error) {
  alert(error)
  console.error(error)
}


})() //async




}

