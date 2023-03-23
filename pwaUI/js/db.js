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
    let categoryArray = [];
    let category ={};
    let cIdStr="";
    db.collection('category').orderBy('name', 'asc').get().then(categories => {
        categories.forEach(element => {
            renderCategoryList(element, element.id); //TODO tänne voi heittää tuon session
            //categoryArray.push(JSON.stringify(element));
            cIdStr = element.id.toString();
            console.log(cIdStr);
            category ={
                id:element.id,
                cId:cIdStr,
                name:element.name,
                cname:element.name
            }
            categoryArray.push(JSON.stringify(category));

         });
         sessionStorage.setItem("sessionCategories", '[' + categoryArray +']');
        })
        .then(x=>{
            if (localStorage.getItem("helper-index-quote-scroll") != null) {
                  $(window).scrollTop(localStorage.getItem("helper-index-quote-scroll")); //TODO toimii, mutta muuta callbac:ksi
            }
        })
}

//TODO älä anna poistaa kategoriaa, jos siinä on vielä tuotteita, tulee virhe tuotteiden listaamisessa
//function dbDelCategory(categoryId) {
    function dbDelCategory(categoryId, page, callback) {
    var toastTxt ="";
    // Hakua ei voi rajoittaa kuin kentällä, joka rajaa tuloksen yhteen :(
    db.collection('product')
        .get()
        .then(products => {
            //console.log(products);
            var productsInCategory = products.find(prod => prod.cId == categoryId);  
            if (productsInCategory == null) {
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
                //callback(page, toastTxt);
            }   
            else {
                toastTxt ='Kategoriassa on tuotteita, siirrä/poista ensin kategorian tuotteet';
                //M.toast({html: toastTxt}, 5000);
            } 
            callback(page, toastTxt);       
                
        }) //TODO vaikka callback info, että kategoriassa on tuotteita, ei poisteta
}

function dbUpdateCategory(categoryId,categoryName,page,callback) {
    let toastTxt ="";
    db.collection('category').doc({id : categoryId}).set(
        {
            id: categoryId,
            name: categoryName
        }
    )
    .catch(error => {
        console.log('There was an error, do something else.', error);
        //alert ("Ei onnistu kategorian muuttaminen laitto");
        //throw(error); // onnistuisko näin
        toastTxt = "Ei onnistu kategorian muuttaminen laitto";
    })
    callback(page, toastTxt);
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
                uiLoadCategories();
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

/*************************************** product **********************************/
/**************************** events from product list **********************************/
/* when page loaded */
// TODO tämä voisi lähettää taulukon/objektit ja kutsutaan callbackilla tulostusta
function listProducts(){
    //alert("listaan");
    //db.collection('category').get().then(category => {
        // voidaan järjestää data, voidaan tuoda myös avaimet(ei onnistunut avainten tuonti näin)
    //db.collection('category').orderBy('name', 'desc').get({keys: true}).then(category => {
    db.collection('product').orderBy('name', 'asc').get().then(products => {
        products.forEach(product => {
            renderProductList(product, product.id);
        });
    })
    .then(x=>{
        if (sessionStorage.getItem("selectedCategoryId") == null && localStorage.getItem("helper-product-quote-scroll") != null) {
              $(window).scrollTop(localStorage.getItem("helper-product-quote-scroll")); //TODO toimii, mutta muuta callbac:ksi
        }
    })
}

/* add product using button on page footer */
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

/* click checked on productlista */
function dbUpdateProductToList(pid, checked) {
    db.collection('product').doc({id : pid}).update({
            toList:checked
    })
    .catch(error => {
        console.log('There was an error updating product to list, do something else.', error);
        alert ("Ei onnistu tuotteen listalle muuttaminen ");
        throw(error); // onnistuisko näin
    })
}

/**************************** events from productform  **********************************/
function dbUpdateProduct(product, page, callback) {
    var toastTxt ="";
    db.collection('product').doc({id : product.id}).set(
        product
    ).then(x => {
        callback(page,toastTxt);
    })
    .catch(error => {
        console.log('There was an error, do something else.', error);
        //alert ("Ei onnistu tuotteet muuttaminen ");
        toastTxt ="Ei onnistu tuotteet muuttaminen";
        callback(page,toastTxt);
        //throw(error); // onnistuisko näin
    })
}


function dbDelProduct(productId, page, callback) {
    var toastTxt ="";
    db.collection('product')
    .doc({ id: productId })
    .delete()
    .then(response => {
        console.log(response);
        console.log('Deleting product successful, now do something.');
        callback(page, toastTxt);
    })
    .catch(error => {
        console.log('There was an error, do something else.', error);
        //alert ("Ei onnistu delete prod sumbitterillä", error);
        //throw(error); // onnistuisko näin
        toastTxt ="Ei onnistu delete prod sumbitterillä";
        callback(page, toastTxt);
    })
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

function deleteProduct() {
    db.collection('product').delete()
        .then( x=>
           { 
            console.log("product deleted");
            emptyCategories();
           }
    );
}
  