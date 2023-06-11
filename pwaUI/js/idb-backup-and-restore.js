//https://gist.github.com/loilo/ed43739361ec718129a15ae5d531095b



/*
//kommenteissa oli tämmönen, tarvitaankohan ollenkaan, kun ainakin tuo export.js näyttää toimivat consolista käsin
var conn = indexedDB.open('some-db', 1) // change the name and version as needed
connection.onsuccess = e => {
  var database = e.target.result
  exportToJson(database).then(console.log).catch(console.error)
}

*/


// importit pitäisi olla moduuleissa
/*
import { idb } from 'some-database'
import { exportToJson } from 'idb-backup-and-restore.js'
*/
/*
exportToJson(idb)
  .then(result => {
    console.log('Exported JSON string:', result)
  })
  .catch(error => {
    console.error('Something went wrong during export:', error)
  })
*/
//
/*
import { idb } from 'some-database'
import { serializedData } from 'some-serialized-data'

import { importFromJson } from 'idb-backup-and-restore.js'
*/
/*
importFromJson(idb, serializedData)
.then(() => {
    console.log('Successfully imported data')
})
.catch(error => {
    console.error('Something went wrong during import:', error)
}) 
*/
//
/*
import { idb } from 'some-database'
import { serializedData } from 'some-serialized-data'

import { importFromJson, clearDatabase } from 'idb-backup-and-restore.js'
*/
/*
clearDatabase(idb)
  .then(() => importFromJson(idb, serializedData))
  .then(() => {
    console.log('Successfully cleared database and imported data')
  })
  .catch(error => {
    console.error('Could not clear & import database:', error)
  })

*/


/**
 * Export all data from an IndexedDB database
 *
 * @param {IDBDatabase} idbDatabase The database to export from
 * @return {Promise<string>}
 */
//export function exportToJson(idbDatabase) {
//function exportToJson(idbDatabase) {
function exportToJson(dbName) {

    
    return new Promise((resolve, reject) => {
      const exportObject = {}
 
      // toimiikohan näin. oli alunperin erikseen, kts dbexport.js:stä
      var idbDatabase = new Promise((resolve, reject) => {
        var request = window.indexedDB.open(dbName)
        request.onerror = () => reject('Could not open the database')
        request.onsuccess = () => resolve(request.result)
      })



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
  }
  
  /**
   * Import data from JSON into an IndexedDB database.
   * This does not delete any existing data from the database, so keys may clash.
   *
   * @param {IDBDatabase} idbDatabase Database to import into
   * @param {string}      json        Data to import, one key per object store
   * @return {Promise<void>}
   */
  // export function importFromJson(idbDatabase, json) {

function importFromJson(idbDatabase, json) {
    return new Promise((resolve, reject) => {
      const transaction = idbDatabase.transaction(
        idbDatabase.objectStoreNames,
        'readwrite'
      )
      transaction.addEventListener('error', reject)
  
      var importObject = JSON.parse(json)
      for (const storeName of idbDatabase.objectStoreNames) {
        let count = 0
        for (const toAdd of importObject[storeName]) {
          const request = transaction.objectStore(storeName).add(toAdd)
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
  }
  
  /**
   * Clear a database
   *
   * @param {IDBDatabase} idbDatabase The database to delete all data from
   * @return {Promise<void>}
   */
//  export function clearDatabase(idbDatabase) {
function clearDatabase(idbDatabase) {
    return new Promise((resolve, reject) => {
      const transaction = idbDatabase.transaction(
        idbDatabase.objectStoreNames,
        'readwrite'
      )
      transaction.addEventListener('error', reject)
  
      let count = 0
      for (const storeName of idbDatabase.objectStoreNames) {
        transaction
          .objectStore(storeName)
          .clear()
          .addEventListener('success', () => {
            count++
            if (count === idbDatabase.objectStoreNames.length) {
              // Cleared all object stores
              resolve()
            }
          })
      }
    })
  }