// https://github.com/dannyconnell/localbase

/*********************************************** dbsettings ***********************************/
/**********************************************************************************************/
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


function dbInitClassId() {
    console.log('initClassId')
    db.collection('dbsettings').add(
        {
            skey: 'classId',
            value: 1
        }
    )
    .catch(error => {
        console.log('There was an init error (classId), do something else.', error)
    })
} 

function dbSetClassId(clid) {
    db.collection('dbsettings').doc({skey : 'classId'}).set(
        {
            skey: 'classId',
            value: clid
        }
    )
    .catch(error => {
        console.log('There was an error, do something else.')
        alert ("Ei onnistu dbsettings classId laitto")
    })
} 

/**********************************************************************************************/
/************************************ category ************************************************/
/**********************************************************************************************/
function dbGetCategories(callback){
    db.collection('category').orderBy('name', 'asc').get().then(categories => {
        sessionStorage.setItem("sessionCategories",JSON.stringify(categories));
        })
        .then(x=>{
           callback(sessionStorage.getItem("sessionCategories"));
        })
}

function dbDelCategory(categoryId, page, callback) {
    var toastTxt ="";
    // Hakua ei voi rajoittaa kuin kentällä, joka rajaa tuloksen yhteen :(
    db.collection('product')
        .get()
        .then(products => {
            //console.log(products);
            //Ei anneta poistaa kategoriaa, jos siinä on vielä tuotteita
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
            } 
            callback(page, toastTxt);         
        }) 
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
        toastTxt = "Ei onnistu kategorian muuttaminen laitto";
    })
    callback(page, toastTxt);
}

function dbAddCategory(cname, callback){
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
                callback(); //uiLoadCategories();
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

/**********************************************************************************************/
/*********************************************** product **************************************/
/**********************************************************************************************/

/********************************** events from product list **********************************/
// zzz: tulkitsee ekakerralla jostain että halutaan doc, eikä collection!?
//localebase.min.js kohdassa 
        //var n = u.default.call(this);
        // return "collection" == n ? this.getCollection() : "doc" == n ? this.getDocument() : void 
function dbGetProducts(callback){
    db.collection('product').orderBy('name', 'asc').get()
    .then(products => {
        prods =JSON.stringify(products); //miksi dbUpdateProductToCollected jälkeen tämä kutsu hakee vain yhden?? kts zzz
        if (prods.charAt(0) =='[') {
            callback(prods);    
        } else {
            //otetaanpa uusiksi. Jostain syystä ostoslista sivulta kun kutsuu dbUpdateProductToCollected, niin toisaan tuo ekalla kerralla vain viimeksi päivitetyn
            db.collection('product').orderBy('name', 'asc').get()
            .then(products => {
                callback(JSON.stringify(products)); 
            })
        }
    })
     
}


/* click checked on productlista */
function dbGetProduct(pid, callback) {
    db.collection('product').doc({id : pid}).get()
    .then(product=> callback(product))
    .catch(error => {
        console.log('There was an error updating product to list, do something else.', error);
        alert ("Ei onnistu tuotteen listalle muuttaminen ");
        throw(error); // onnistuisko näin TODO toastilla callbackin kanssa
    })
}


/* add product using button on page footer */
function dbAddProduct(pname, pCid, callback){
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
                callback();
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
            toList:checked,
            collected:false
    })
    .catch(error => {
        console.log('There was an error updating product to list, do something else.', error);
        alert ("Ei onnistu tuotteen listalle muuttaminen ");
        throw(error); // onnistuisko näin TODO toastilla callbackin kanssa
    })
}

/******************************* events from productform  *************************************/
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

/***************************** Ostolistalla****************************************************/
function dbUpdateProductToCollected(pid, checked) {
    db.collection('product').doc({id : pid}).update({
            collected:checked
    })
    .catch(error => {
        console.log('There was an error updating product to collected, do something else.', error);
        //TODO callback toast
        alert ("Ei onnistu tuotteen listalle kerätty muuttaminen ");
        throw(error); // onnistuisko näin TODO toastilla callbackin kanssa
    })
}

/**********************************************************************************************/
/********************************** Classes ***************************************************/
/**********************************************************************************************/
function dbGetClasses(callback){
    db.collection('productclass').orderBy('ordernro', 'asc').get().then(classes => {
        sessionStorage.setItem("sessionClasses",JSON.stringify(classes));
        callback(sessionStorage.getItem("sessionClasses"));
        })        
}
function dbAddClass(pcname, pcordernro,callback){
    // First get new categoryId
    var pcordernroInt = 0;
    if (pcordernro !="") {
        pcordernroInt = parseInt(pcordernro);
    }

    db.collection('dbsettings').doc({ skey: 'classId' }).get().then(setting => {
        let pcid = 1;
        if(setting != null) {
            pcid = setting.value + 1;
        }

        if (pcname == "") {
            pcname ='Uusi luokka ' + clid.toString();
        }
        
        const productclass = {
            id:pcid,
            name:pcname,
            ordernro:pcordernroInt
        }
        //Then add new category
        db.collection('productclass')
            .add(productclass)
            .then( reload => {
                // oma koodi, että lista päivittyy näytöllä TODO voisiko siirtää ui:lle
                callback();
            })
            .then( updnextPCId =>
                {  
                    if(setting == null){
                        dbInitClassId();
                    } else {
                        dbSetClassId(productclass.id);
                    }
                }
            )
            .catch(err =>console.log(err));
            // inputCategory.value = ""; // viittaa UI:hin
    }) 
    .catch( e =>
            console.log("AddBtn Virhe productclass lisäyksessä",e)
    );
}

/**********************************************************************************************/
/********************************** Ylläpitoa kehitysvaiheessa ********************************/
/**********************************************************************************************/

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
            //emptyProducts();
           }
    );
}

function deleteProductclass() {
    db.collection('productclass').delete()
        .then( x=>
           { 
            console.log("productclass deleted");
            //emptyClasses();
           }
    );
}
  
/**********************************************************************************************/


