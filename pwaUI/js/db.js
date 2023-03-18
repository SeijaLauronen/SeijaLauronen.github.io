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

function dbInitProductId() {
    console.log('initProductId')
    db.collection('dbsettings').add(
        {
            skey: 'productId',
            value: 1
        }
    )
    .catch(error => {
        console.log('There was an init error (productId), do something else.', error)
    })
} 

function dbSetProductId(pid) {
    db.collection('dbsettings').doc({skey : 'productId'}).set(
        {
            skey: 'productId',
            value: pid
        }
    )
    .catch(error => {
        console.log('There was an error, do something else.')
        alert ("Ei onnistu dbsettings productId laitto")
    })
} 

/********************** category ***********************/
function listCategories(){
    //alert("listaan");
    //db.collection('category').get().then(category => {
        // voidaan järjestää data, voidaan tuoda myös avaimet(ei onnistunut avainten tuonti näin)
    //db.collection('category').orderBy('name', 'desc').get({keys: true}).then(category => {
    categoryArray = [];
    db.collection('category').orderBy('name', 'asc').get().then(categories => {
        categories.forEach(element => {
            renderCategoryList(element, element.id); //TODO tänne voi heittää tuon session
            categoryArray.push(JSON.stringify(element));
         });
         sessionStorage.setItem("sessionCategories", '[' + categoryArray +']');
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

/********************** product ***********************/

function dbUpdateProduct(product) {
    db.collection('product').doc({id : product.id}).set(
        product
        /*
        {
            id: product.id,
            cId:product.cId,
            name: product.name
        }
        */
    )
    .catch(error => {
        console.log('There was an error, do something else.', error);
        alert ("Ei onnistu tuotteet muuttaminen ");
        throw(error); // onnistuisko näin
    })
}

function dbDelProduct(productId) {
    db.collection('product')
    .doc({ id: productId })
    .delete()
    .then(response => {
        console.log(response);
        console.log('Deleting product successful, now do something.');
    })
    .catch(error => {
        console.log('There was an error, do something else.', error);
        alert ("Ei onnistu delete prod sumbitterillä", error);
        throw(error); // onnistuisko näin
    })
}


/************************************************ Products ****/
function listProducts(categoryId){
    //alert("listaan");
    //db.collection('category').get().then(category => {
        // voidaan järjestää data, voidaan tuoda myös avaimet(ei onnistunut avainten tuonti näin)
    //db.collection('category').orderBy('name', 'desc').get({keys: true}).then(category => {
    db.collection('product').orderBy('name', 'asc').get().then(products => {
        products.forEach(product => {
            renderProductList(categoryId, product, product.id);
        });
    })

}


function dbAddProduct(pname, pCid){
    // First get new categoryId
    db.collection('dbsettings').doc({ skey: 'productId' }).get().then(setting => {
        let pid = 1;
        
        if(setting != null) {
            pid = setting.value + 1;
  
        }

        if (pname == "") {
            pname ='Uusi tuote ' + pid.toString();
        }
        
        const product = {
            id:pid,
            cId:pCid,
            name:pname
        }
        //Then add new category
        db.collection('product')
            .add(product)
            .then( reload => {
                // oma koodi, että lista päivittyy näytöllä TODO voisiko siirtää ui:lle
                uiReloadProducts();
            })
            .then( updnextProdId =>
                {  
                    if(setting == null){
                        dbInitProductId();
                    } else {
                        dbSetProductId(product.id);
                    }
                }
            )
            .catch(err =>console.log(err));
            // inputCategory.value = ""; // viittaa UI:hin
    }) 
    .catch( e =>
            console.log("AddBtn Virhe tuotteen lisäyksessä",e)
    );

}



/******************* Ylläpitoa kehitysvaiheessa **********************/

function deleteOldDB()
{
    dbold.delete()
        .then( x=> {
            console.log("dbold deleted");
            emptyCategories();
        }
)}

function deleteDB() {
    db.delete()
        .then( x=> {
            console.log("db deleted");
            emptyCategories();
        }
    );
}

function deleteCategory() {
    db.collection('category').delete()
        .then( x=>
           { 
            console.log("category deleted");
            emptyCategories();
           }
    );
}
  