// https://github.com/dannyconnell/localbase

function listaa(){
    //alert("listaan");
    //db.collection('users').get().then(users => {
        // voidaan järjestää data, voidaan tuoda myös avaimet(ei onnistunut avainten tuonti näin)
    //db.collection('users').orderBy('name', 'desc').get({keys: true}).then(users => {
    db.collection('users').orderBy('name', 'asc').get().then(users => {
                  users.forEach(element => {
                    renderList(element, element.id);
                    console.log("elem:",element.id, element.name);
                  });
                })
  }


  function listCategories(){
    //alert("listaan");
    //db.collection('users').get().then(users => {
        // voidaan järjestää data, voidaan tuoda myös avaimet(ei onnistunut avainten tuonti näin)
    //db.collection('users').orderBy('name', 'desc').get({keys: true}).then(users => {
    db.collection('category').orderBy('name', 'asc').get().then(categories => {
        categories.forEach(element => {
            //renderList(element, element.id);
            //console.log("elem:",element.id, element.name);
         });
        })
  }


 function getCategoryId() {
    //alert('get');
/*
    db.collection('dbsettings').doc({ skey: 'categoryId' }).get().then(document => {
        console.log(document)
     
      })
*/
    db.collection('dbsettings').doc({skey : 'categoryId'}).get()
    .then(document=>{
        //alert(document.value);
        return document.value;
    })
    .catch(error => {
        
        //if(error.includes('ReferenceError')) {
        //    console.log('initialisoidaan')
        //    initCategoryId();
        //} else {
          
        console.log('getCategoryId: There was an error', error);
       // alert ('Get: Ei onnistu dbsettings categoryId haku',error)
        initCategoryId();
        //}
    })
   
    
 } 

 function initCategoryId() {
    //alert('init');
    console.log('initCategoryId')
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

 function setCategoryId(kid) {
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

  const form = document.querySelector('form');
  form.addEventListener('submit', evt => {
    evt.preventDefault();
        //let categoryID=parseInt(form.title.value); // toDo tämä paremmin
        //let categoryID=form.title.value // TODO pidetään toistaseks sitten vaan tekstinä
        db.collection('dbsettings').doc({ skey: 'categoryId' }).get().then(setting => {

            let kid = 1;
            if(setting != null) {
                kid = setting.value + 1;
            }
            
            const category = {
                id:kid,
                name:form.ingredients.value
            }

            console.log(category);

            db.collection('users')
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

                form.title.value ="";
                form.ingredients.value = "";
        }) 
    .catch( e =>
            console.log("Virhe lisäyksessä",e)
    );
        
  });

  const categoryContainer = document.querySelector('.categories');
  categoryContainer.addEventListener('click', evt => {
    console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten
    if(evt.target.tagName === 'I') {
        const categoryId = parseInt(evt.target.getAttribute('data-id')); //menee stringinä attribuuttiin

        db.collection('users')
                        .doc({ id: categoryId })
                        .delete()
                        .then(response => {
                          console.log('Delete successful, now do something.');
                          // reloadCategories(); Toimii tälläkin
                          removeCategory(categoryId); // Poistaa ui:sta
                        })
                        .catch(error => {
                          console.log('There was an error, do something else.', error)
                          alert ("Ei onnistu del", error)
                        })
    }
  })

  //ei nämä ihan toimi niinkuin pitää, mutta aikansa kun rämplää, niin poistuu...
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

  const deleteusersButton = document.querySelector('#deleteusers');
  deleteusersButton.addEventListener('click', evt => {
    evt.preventDefault();
    //alert('delete users');
    db.collection('users').delete()
        .then( x=>
           { 
            console.log("users deleted");
            //alert('deleted users');
            //reloadCategories();
            emptyCategories();
           }
    );
  });
