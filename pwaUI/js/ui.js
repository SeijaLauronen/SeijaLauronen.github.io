
/***************************************************** common for all pages *****************************/
document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});

    // add category form
    const forms = document.querySelectorAll('.side-form');
    var instances = M.Sidenav.init(forms, {edge: 'right'}); //tähän lisätty var instances eteen
  
  
    const formclose = document.querySelector(".formclose");
    if (formclose != null) { //not evry page has form
    document
      .querySelector(".formclose")
      .addEventListener("click", function() {
        var elem = document.querySelector(".side-form");
        var instance = M.Sidenav.getInstance(elem);
  
        if (instance.isOpen) {
          console.log("Is open: I need to close it");
          instance.close();
        } 
      });
    }

    // for categorySelection in product form
    var combos = document.querySelectorAll('select'); //TODO onko tämä oikeassa paikassa...
  });

/************************************  Menu vasemmalla  **************************/ 
//https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
function getBrowserName(userAgent) {
  // The order matters here, and this may report false positives for unlisted browsers.

  if (userAgent.includes("Firefox")) {
    // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
    return "Mozilla Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
    return "Samsung Internet";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
    return "Opera";
  } else if (userAgent.includes("Edge")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    return "Microsoft Edge (Legacy)";
  } else if (userAgent.includes("Edg")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
    return "Microsoft Edge (Chromium)";
  } else if (userAgent.includes("Chrome")) {
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
    return "Google Chrome tai Chromium";
  } else if (userAgent.includes("Safari")) {
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
    return "Apple Safari";
  } else {
    return "Selainta ei tunnistettu";
  }
}
//const browserName = getBrowserName(navigator.userAgent);
//console.log(`You are using: ${browserName}`);

/*
//Ei tarvita kun käytetään submittia
const uiRemoveCategory = (categoryId) => {
  const categoryIdStr = "'" + categoryId.toString() + "'"; // Vaati hipsut toimiakseen, kun on on id stringinä
  const category = document.querySelector(`.category[data-id=${categoryIdStr}]`);
  category.remove();
};
*/

// TODO sivukohtaiset erikseen

/*****************************  Footer ******/ 

const footerNavigation = document.querySelector('.footernavigation');
footerNavigation.addEventListener('click', evt =>{
sessionStorage.removeItem("selectedCategoryId"); // tyhjätään kategoriavalinta
sessionStorage.removeItem("selectedCategoryName"); // tyhjätään kategoriavalinta
});


// Formit kategoria ja tuote -sivuilla
  function closeFormReturnToPage(page, toastTxt) {
    var elem = document.querySelector(".side-form");
    var instance = M.Sidenav.getInstance(elem);
  
    /* If something in toast text, show it and do not close the form and not go to page */
    if (toastTxt != "") 
    {
      M.toast({html: toastTxt}, 9000000); 
    } else {
      if (instance.isOpen) {
        console.log("Is open: I need to close it");
        instance.close();
      } 
      window.location.href=page;
    }
  }
  

 /************************************  Kategoriasivu  **************************/ 

  const categoryList = document.querySelector('.categories');
  function uiRenderCategoryList(categories){
    var html =``;
    let category = null;
    //categories.forEach(category => {
    let categoriesParsed= JSON.parse(categories);
    for (let i=0; i< categoriesParsed.length; i++){
          category=categoriesParsed[i];
          html =`
          <div class="card-panel category white row" data-id="${category.id}">
          
            <div class="category-details">
              <div class="category-name flow-text" name-id="${category.id}">${category.name}
              </div>
            </div>

            <div class="category-edit sidenav-trigger" data-target="side-form">
              <i class="material-icons" data-id="${category.id}">edit</i>
            </div>

            <div class="category-go">
              <i class="material-icons" data-id="${category.id}" categoryname="${category.name}">arrow_forward</i>
            </div>

          </div>
          `;
          categoryList.innerHTML += html;
    }

    if (localStorage.getItem("helper-index-quote-scroll") != null) {
      $(window).scrollTop(localStorage.getItem("helper-index-quote-scroll")); 
    }

  }

  function uiLoadCategories(){
    categoryList.innerHTML ="";
    // listCategories();
    dbGetCategories(uiRenderCategoryList);
    console.log("uiLoadCategories");
    sessionStorage.removeItem("selectedCategoryId"); // tyhjätään kategoriavalinta
    sessionStorage.removeItem("selectedCategoryName"); // tyhjätään kategoriavalinta
  }

  function emptyCategories(){
    categoryList.innerHTML ="";
  }

/*********************************** Kategoria formin eventit ********************/ 
  const categoryForm = document.querySelector('#categoryForm');
  if (categoryForm != null) {
    categoryForm.addEventListener('submit', evt => {
      evt.preventDefault(); //Ei suljeta submitilla
      console.log(evt.submitter.id);
      console.log.evt;
  
      const categoryId = parseInt(categoryForm.categoryId.value);
      const categoryName = categoryForm.input1.value;
      if (evt.submitter.id == "delCategory") {
        //dbDelCategory(categoryId);
        dbDelCategory(categoryId,"index.html", closeFormReturnToPage);
        /*
        dbDelCategory(categoryId).then(x=> {
          uiRemoveCategory(categoryId); // Poistaa ui:sta, tarvitaankohan.... Ei tarvita
        })
        */
      }

      if (evt.submitter.id == "updateCategory" || evt.submitter.id == "defaultActionCategory") {
        dbUpdateCategory(categoryId,categoryName,"index.html", closeFormReturnToPage);
      }

    });
}

/******************************  Kategoria listan eventit  *************/
  const categoryContainer = document.querySelector('.categories');
  if (categoryContainer != null) {
        categoryContainer.addEventListener('click', evt => {
          /* Klikkaus katergorialistalla */
          //console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten
          if(evt.target.tagName === 'I' && evt.target.innerText === 'edit') {
              const categoryId = parseInt(evt.target.getAttribute('data-id'));
              const categoryName = document.querySelectorAll('[name-id="' + categoryId + '"]')[0].innerText;
              console.log('categoryId:', categoryId);
              console.log('categoryName:', categoryName);
              categoryForm.input1.value=categoryName;
              categoryForm.categoryId.value = categoryId;
          } else if(evt.target.tagName === 'I' && evt.target.innerText === 'arrow_forward') {
              const categoryId = parseInt(evt.target.getAttribute('data-id'));
              const categoryName = evt.target.getAttribute('categoryname');
              sessionStorage.setItem("selectedCategoryId",categoryId);
              sessionStorage.setItem("selectedCategoryName",categoryName);
              localStorage.setItem("helper-product-quote-scroll", 0); //Nollataa tuotesivun skrollauskohta
              // window.location.replace("http://www.w3schools.com");
              //window.location.href = "http://www.w3schools.com"
              window.location.href = "product.html"; //http://127.0.0.1:5500/product.html?categoryId=2&categoryName=Rasvat
          }
        });

 /****************** Kategorain lisäys footerissa ********/
        const addCategoryButton = document.querySelector('#addCategoryBtn');
        const inputCategory = document.querySelector('#categoryinput');
        addCategoryButton.addEventListener('click',evt => {
          let cname=inputCategory.value;
            evt.preventDefault();
            dbAddCategory(cname);
            inputCategory.value=""; //TODO vasta jos meni ok?
        })
  }

 /****************************************  Tuotesivu  *********************************/ 

  function uiReloadProducts(){
    productList.innerHTML ="";
    listProducts();
  }
  
  const productList = document.querySelector('.products');
  const renderProductList = (product, id) => {
      let selectedCategoryId = sessionStorage.getItem("selectedCategoryId");
      let categoryArray = JSON.parse(sessionStorage.getItem("sessionCategories"));
      let catObj = categoryArray.find(record => record.id == product.cId);
      let catname = "";
      if (catObj != null) { //jos tuotteelle merkitty kategoria onkin poistettu
        catname=catObj.name;
      }
      let checkedText = "";
      if (product.toList == true) {
        checkedText = "checked=true";
      }
 
      var html =``;
      if (selectedCategoryId == null || product.cId == selectedCategoryId )
      
          html =`
          <div class="card-panel product white row" product-id="${id}">

            <div class="product category-info">
              <span class="product-category" productcategory-id="${id}" hidden>${product.cId}</span>
              <span class="product-category" productcategoryname-id="${id}">${catname}</span>
            </div>
            
            <div class="product-edit sidenav-trigger" data-target="side-form-product">
              <i class="material-icons" product-id="${id}">edit</i>
            </div>
            
            <div class="product-details">
              <div class="product-name flow-text" productname-id="${id}">${product.name}
              </div>
            </div>

            <div class="product checkbox">
              <label>
                <input type="checkbox" class="filled-in" productchecked-id="${id}" ${checkedText} />
              </label>
            </div>
        </div>
          `;
      productList.innerHTML += html;
  }

  /******************** Tuotelistasivun eventit  */
  const productContainer = document.querySelector('.products');
  if (productContainer != null) {

    /* Klikkaus tuotelistalla*/
      productContainer.addEventListener('click', evt => {
            console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten

            //TODO pitäisi välittää koko tuotteen tiedot
            if(evt.target.tagName === 'I' && evt.target.innerText === 'edit') {
                const productId = parseInt(evt.target.getAttribute('product-id'));
                const productName = document.querySelectorAll('[productname-id="' + productId + '"]')[0].innerText;
                const productCategory = document.querySelectorAll('[productcategory-id="' + productId + '"]')[0].innerText;
                console.log('productId:', productId);
                console.log('productName:', productName);
                productForm.prodInput1.value = productName;
                productForm.productId.value = productId; //hidden value in form
                productForm.productInputToList.checked = document.querySelectorAll('[productchecked-id="' + productId + '"]')[0].checked;
                renderCategoryDropDown(productCategory);
                
            } else if (evt.target.type == "checkbox") {
              //checked==true
              const productId = parseInt(evt.target.getAttribute('productchecked-id'));
              const checked = evt.target.checked;
              dbUpdateProductToList(productId, checked)
            }
      });

      /* Tuotteen lisäys footerissa */  
      const addProductButton = document.querySelector('#addProductBtn');
      const inputProduct = document.querySelector('#productinput');
      const selectedCategoryID = document.querySelector('.pageheader-categoryID');      
      addProductButton.addEventListener('click',evt => {
        let pname=inputProduct.value;
        let pCid = 1; //Oletuskategoria uudelle tuotteelle
        //Jos tuotesivu on suodatettu kategorian mukaan lisätään tuote siihen kategoriaan
        if (selectedCategoryID.innerText != '') {
          pCid = parseInt(selectedCategoryID.innerText);          
        }

        evt.preventDefault();
        dbAddProduct(pname, pCid);
        inputProduct.value=""; //TODO vasta jos meni ok?
      })
  }

  /******************************** Tuote Form ******************************/
  /********** dropdown lista kategorioista formille */
  const categorySelection = document.querySelector('.categorySelect');
  const renderCategoryDropDown = (productCategory) => {

      let categories = sessionStorage.getItem("sessionCategories");
      //console.log("KATEGORIAT");
      //console.log(categories);

      let objCat= JSON.parse(categories);
      let catId ="";
      let html =``;
      categorySelection.innerHTML = html;
      for (let i=0; i < objCat.length; i++){   
          catId=objCat[i].id;
          if (productCategory == catId) {
            html =`
            <option value="${catId}" selected>${objCat[i].name}</option>
            `;
          } else {
            html =`
            <option value="${catId}">${objCat[i].name}</option>
            `;
          }
        categorySelection.innerHTML += html;
      }      
  }

  /************************** Tuoteformin eventit *************************/
  const productForm = document.querySelector('#productForm');
  if (productForm != null) {
    productForm.addEventListener('submit', evt => {
      //evt.preventDefault(); //että formi ei sulkeudu ennekuin sen kentätä on luettu
      //console.log(evt.submitter.id);
      //console.log(evt);
      const productId = parseInt(productForm.productId.value);
      const productName = productForm.prodInput1.value;
      const comboinstance = document.querySelector('.categorySelect');
      var productToList = false;
      if (productForm.productInputToList.checked) {
        productToList=true;
      }

      const product = {
        id:productId,
        name:productName,
        toList:productToList
      }
      var selectedProductCategoryId = comboinstance.value;
      product.cId=parseInt(selectedProductCategoryId);

      if (evt.submitter.id == "delProduct") {
        dbDelProduct(productId, "product.html", closeFormReturnToPage);
      }

      if (evt.submitter.id == "updateProduct" || evt.submitter.id == "defaultActionProduct") {
        console.log("upd productId:",product.id);
        console.log("upd productName:", product.name);
        console.log("upd productcategoryId1:", product.cId);
        console.log("upd productcategoryIdSelected:", product.cId);
        dbUpdateProduct(product, "product.html", closeFormReturnToPage);
      }

    });
}


 
 




