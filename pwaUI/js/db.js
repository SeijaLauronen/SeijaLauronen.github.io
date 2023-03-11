// https://github.com/dannyconnell/localbase


/********************** dbsettings ***********************/
function getCategoryId() {
    db.collection('dbsettings').doc({skey : 'categoryId'}).get()
    .then(document=>{
        return document.value;
    })
    .catch(error => {
        console.log('getCategoryId: There was an error', error);
        dbInitCategoryId();
    })
} 

function dbInitCategoryId() {
    //console.log('initCategoryId')
    db.collection('dbsettings').add(
        {
            skey: 'categoryId',
            value: 1
        }
    )
    .catch(error => {
        console.log('There was an init error, do something else.', error)
    })
} 

function dbSetCategoryId(kid) {
    db.collection('dbsettings').doc({skey : 'categoryId'}).set(
        {
            skey: 'categoryId',
            value: kid
        }
    )
    .catch(error => {
        console.log('There was an error, do something else.')
        alert ("Ei onnistu dbsettings categoryId laitto")
    })
} 

/********************** category ***********************/
function listCategories(){
    //alert("listaan");
    //db.collection('category').get().then(category => {
        // voidaan järjestää data, voidaan tuoda myös avaimet(ei onnistunut avainten tuonti näin)
    //db.collection('category').orderBy('name', 'desc').get({keys: true}).then(category => {
    db.collection('category').orderBy('name', 'asc').get().then(categories => {
        categories.forEach(element => {
            renderCategoryList(element, element.id);
         });
        })
}

function dbDelCategory(categoryId) {
    db.collection('category')
    .doc({ id: categoryId })
    .delete()
    .then(response => {
        console.log('Delete successful, now do something.');
        //removeCategory(categoryId); // Poistaa ui:sta
    })
    .catch(error => {
        console.log('There was an error, do something else.', error);
        alert ("Ei onnistu delete sumbitterillä", error);
        throw(error); // onnistuisko näin
    })
}

function dbUpdateCategory(categoryId,categoryName) {
    db.collection('category').doc({id : categoryId}).set(
        {
            id: categoryId,
            name: categoryName
        }
    )
    .catch(error => {
        console.log('There was an error, do something else.', error);
        alert ("Ei onnistu kategorian muuttaminen laitto");
        throw(error); // onnistuisko näin
    })
}

function dbAddCategory(cname){
    // First get new categoryId
    db.collection('dbsettings').doc({ skey: 'categoryId' }).get().then(setting => {
        let kid = 1;
        if(setting != null) {
            kid = setting.value + 1;
        }

        if (cname == "") {
            cname ='Uusi kategoria ' + kid.toString();
        }
        
        const category = {
            id:kid,
            name:cname
        }
        //Then add new category
        db.collection('category')
            .add(category)
            .then( reload => {
                // oma koodi, että lista päivittyy näytöllä TODO voisiko siirtää ui:lle
                uiReloadCategories();
            })
            .then( updnextCatId =>
                {  
                    if(setting == null){
                        dbInitCategoryId();
                    } else {
                        dbSetCategoryId(category.id);
                    }
                }
            )
            .catch(err =>console.log(err));
            // inputCategory.value = ""; // viittaa UI:hin
    }) 
    .catch( e =>
            console.log("AddBtn Virhe lisäyksessä",e)
    );

}


/******************* Ylläpitoa kehitysvaiheessa **********************/
  const deletedboldButton = document.querySelector('#deletedbold');
  deletedboldButton.addEventListener('click', evt => {
    evt.preventDefault();
    //alert('deletessä');
    dbold.delete()
        .then( x=> {
            //alert('deleted db');
            //reloadCategories()
            console.log("dbold deleted");
            emptyCategories();
        }
    );
  });


  const deletedbButton = document.querySelector('#deletedb');
  deletedbButton.addEventListener('click', evt => {
    evt.preventDefault();
    //alert('deletessä');
    db.delete()
        .then( x=> {
            //alert('deleted db');
            //reloadCategories()
            console.log("db deleted");
            emptyCategories();
        }
    );
  });



  const deletecategoryButton = document.querySelector('#deletecategory');
  deletecategoryButton.addEventListener('click', evt => {
    evt.preventDefault();
    //alert('delete category');
    db.collection('category').delete()
        .then( x=>
           { 
            console.log("category deleted");
            //alert('deleted category');
            //reloadCategories();
            emptyCategories();
           }
    );
  });