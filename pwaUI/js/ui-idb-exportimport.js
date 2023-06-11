// ei voi importata kuin moduulin sisällä
/*
import { idb } from 'helperdb'

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
//import { idb } from 'some-database'
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
//import { idb } from 'some-database'
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


const getDBDataButton = document.querySelector('#getBtn');
// const inputCategory = document.querySelector('#classinput');
if (getDBDataButton != null){
    getDBDataButton.addEventListener('click',evt => {
        /*
      let pcname=classinput.value;
      let ordernro=orderinput.value;
        evt.preventDefault();
        dbAddClass(pcname, ordernro, uiLoadClasses);
        classinput.value=""; //TODO vasta jos meni ok?
        orderinput.value=null; //TODO vasta jos meni ok?
        */
       exportDB();
        /*
       exportToJson('helperdb')
        .then(result => {
            console.log('Exported JSON string:', result)
        })
        .catch(error => {
            console.error('Something went wrong during export:', error)
        })
        */

    })
}