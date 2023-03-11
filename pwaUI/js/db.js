// https://github.com/dannyconnell/localbase

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
/*
  const categoryContainer = document.querySelector('.categories');
  categoryContainer.addEventListener('click', evt => {
    //console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten

     if(evt.target.tagName === 'I' && evt.target.innerText === 'edit') {
        const categoryId = parseInt(evt.target.getAttribute('data-id'));
        //const categoryName = document.querySelectorAll('category-name[name-id="' + categoryId + '"]');
        const categoryName = document.querySelectorAll('[name-id="' + categoryId + '"]')[0].innerText;
        console.log('categoryId:', categoryId);
        console.log('categoryName:', categoryName);
        form.input1.value=categoryName;
        form.categoryId.value = categoryId;
    }
  });
*/

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






/*
  const addCategoryButton = document.querySelector('#addCategoryBtn');
  const inputCategory = document.querySelector('#categoryinput');
  addCategoryButton.addEventListener('click',evt => {
    evt.preventDefault();
    db.collection('dbsettings').doc({ skey: 'categoryId' }).get().then(setting => {

        let cname=inputCategory.value;
       console.log('cname:'+cname + "XX")
        if (cname=="") {
            cname ='Uusi kategoria';
        }

        let kid = 1;
        if(setting != null) {
            kid = setting.value + 1;
        }
        
        const category = {
            id:kid,
            name:cname
        }

        console.log(category);

        db.collection('category')
            .add(category)
            .then( reload => {
                // oma koodi, että lista päivittyy näytöllä
                reloadCategories();
            })
            .then( updnextCatId =>
                {  
                    if(setting == null){
                        initCategoryId();
                    } else {
                        setCategoryId(category.id);
                    }
                }
            )
            .catch(err =>console.log(err));
            inputCategory.value = "";
    }) 
.catch( e =>
        console.log("AddBtn Virhe lisäyksessä",e)
);







  })
  */

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