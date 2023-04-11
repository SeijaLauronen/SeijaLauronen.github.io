/**********************************************************************************************/
/******************************************* common for all pages *****************************/
/**********************************************************************************************/
document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});

    // forms
    const forms = document.querySelectorAll('.side-form');
    var instances = M.Sidenav.init(forms, {edge: 'right'});
  
    const formclose = document.querySelector(".formclose");
    if (formclose != null) { //not evry page has form
    document
      .querySelector(".formclose")
      .addEventListener("click", function() {
        var elem = document.querySelector(".side-form");
        var instance = M.Sidenav.getInstance(elem);
        if (instance.isOpen) {
          //console.log("Is open: I need to close it");
          instance.close();
        } 
      });
    }

    // for categorySelection in product form
    var combos = document.querySelectorAll('select'); //TODO onko tämä oikeassa paikassa...

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


/**********************************************************************************************/
/************************************  Menu vasemmalla  ***************************************/ 
/**********************************************************************************************/
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

/**********************************************************************************************/
/****************************************  Footer *********************************************/ 
/**********************************************************************************************/

const footerNavigation = document.querySelector('.footernavigation');
footerNavigation.addEventListener('click', evt =>{
sessionStorage.removeItem("selectedCategoryId"); // tyhjätään kategoriavalinta
sessionStorage.removeItem("selectedCategoryName"); // tyhjätään kategoriavalinta
});

  
/**********************************************************************************************/
/************************************  Kategoriasivu  *****************************************/ 
/**********************************************************************************************/

  const categoryList = document.querySelector('.categories');
  function uiRenderCategoryList(categories){
    var html =``;
    let category = null;
    let categoriesParsed= JSON.parse(categories);

    var categoriesSorted = categoriesParsed.sort(({ordernro:a}, {ordernro:b}) => a-b)

    for (let i=0; i< categoriesSorted.length; i++){
          category=categoriesSorted[i];
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
      const categoryOrdernro = categoryForm.inputCategoryOrdernro.value;

      if (evt.submitter.id == "delCategory") {
        dbDelCategory(categoryId,"index.html", closeFormReturnToPage);
      }

      if (evt.submitter.id == "updateCategory" || evt.submitter.id == "defaultActionCategory") {
        dbUpdateCategory(categoryId,categoryName,categoryOrdernro,"index.html", closeFormReturnToPage);
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
              //categoryForm.input1.value=categoryName;
              //categoryForm.categoryId.value = categoryId;
              //categoryForm.inputCategoryOrdernro.value = 

              dbGetCategory(categoryId, fillCategoryForm); 

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

        /****************** Kategorian lisäys footerissa ********/
        const addCategoryButton = document.querySelector('#addCategoryBtn');
        const inputCategory = document.querySelector('#categoryinput');
        addCategoryButton.addEventListener('click',evt => {
          let cname=inputCategory.value;
            evt.preventDefault();
            dbAddCategory(cname, uiLoadCategories);
            inputCategory.value=""; //TODO vasta jos meni ok?
        })
}

function fillCategoryForm(category) {
  categoryForm.input1.value=category.name;
  categoryForm.categoryId.value = category.id;
  categoryForm.inputCategoryOrdernro.value = category.ordernro;
}

/**********************************************************************************************/
/****************************************  Tuotesivu  *****************************************/ 
/**********************************************************************************************/

const productList = document.querySelector('.products');

function uiLoadProducts(){
  productList.innerHTML ="";
  dbGetProducts(uiRenderProductList);
}

function uiRenderPhaseClasslist(product){
  let classList ="";
  if (product.phase1 != null && product.phase1 == true) 
  { 
    classList = "phase1 ";
  } 
  if (product.phase2 != null && product.phase2 == true) 
  { 
    classList += "phase2 ";
  } 
  if (product.phase3 != null && product.phase3 == true) 
  { 
    classList += "phase3 ";
  } 
  if (product.forbidden != null && product.forbidden == true) 
  { 
    classList = "forbidden ";
  } 
  return classList;
}

function uiRenderPhaseHtml(product){
  let html =``;

  let v1Color="";
  let v2Color="";
  let v3Color="";
  let forbiddenColor="";
  let v1Visible="hidden";
  let v2Visible="hidden";
  let v3Visible="hidden";
  let forbiddenVisible="hidden";
  let phases=false;
  v1Color="";
  v2Color="";
  v3Color="";
  forbiddenColor="grey";
  v1Visible="";
  v2Visible="";
  v3Visible="";
  forbiddenVisible="hidden";
  phases=false;

  if (product.phase1 != null && product.phase1 == true) 
  { 
    v1Color="amber";
    v1Visible ="";
    phases = true;
  } 
  if (product.phase2 != null && product.phase2 == true)
    {
    v2Color="green";
    v2Visible ="";
    phases = true;
  }
  if (product.phase3 != null && product.phase3 == true) 
  { 
    v3Color="red";
    v3Visible ="";
    phases = true;
  }
  if (product.forbidden != null && product.forbidden == true) 
  {
    forbiddenColor="grey";
    forbiddenVisible="";
    /* jos on kielletty, piilotettan kaikki vaiheet */
    v1Visible="hidden";
    v2Visible="hidden";
    v3Visible="hidden";
    phases = true;
  }

  /* Jos ei ole mitään luokiteltu, ei näytetä vaihebokseja*/
  if (phases == false) {
    v1Visible="hidden";
    v2Visible="hidden";
    v3Visible="hidden";
    forbiddenVisible="hidden";
  }

  /* kun laittaa boksein reunat saman värisiksi kuin itse boksi, niin ei näytä väri menevän yli boksin */
  /* mutta jostain syystä eipä toimi */
  html =`
                <span ${v1Visible}> <i class="tiny material-icons ${v1Color} ${v1Color}-text phase" >crop_square</i></span>
                <span ${v2Visible}> <i class="tiny material-icons ${v2Color} ${v2Color}-text phase" ${v2Visible}>crop_square</i></span>
                <span ${v3Visible}> <i class="tiny material-icons ${v3Color} ${v3Color}-text phase" ${v3Visible}>crop_square</i></span>
                <span ${forbiddenVisible}>  <i class="tiny material-icons ${forbiddenColor} ${forbiddenColor}-text phase">clear</i> </span>
              `;
              return html;
}

function uiRenderProductList(products){
      let selectedCategoryId = sessionStorage.getItem("selectedCategoryId");
      let categoryArray = JSON.parse(sessionStorage.getItem("sessionCategories"));
      let classesArray = JSON.parse(sessionStorage.getItem("sessionClasses"));
      let productsParsed= JSON.parse(products);
      let catObj = null;
      let catname = "";
      let product = null;
      let checkedText = "";
      let categoryHiddenTxt="";

      let html =``;
      for (let i=0; i< productsParsed.length; i++){
          product=productsParsed[i];
          /* Värit vaiheittain */
          phaseHtml = uiRenderPhaseHtml(product);

          catObj = categoryArray.find(record => record.id == product.cId);
          catname = "";
          if (catObj != null) { //tarkistus, jos tuotteelle merkitty kategoria onkin poistettu, ettei kaadu
            catname=catObj.name;
            if (catname.length > 30)
            {
              catname = catname.substring(0,30) + "...";
            }
          }

          classObj = classesArray.find(record => record.id == product.classId);
          classname = "";
          if (classObj != null) { //tarkistus, jos tuotteelle merkitty kategoria onkin poistettu, ettei kaadu
            classname=classObj.name;
            if (classname.length > 25)
            {
              classname = classname.substring(0,25) ;
            }
          }
          

          checkedText = "";
          if (product.toList == true) {
            checkedText = "checked=true";
          }

          if (product.cId == selectedCategoryId)
          categoryHiddenTxt ="hidden";


          html =``;
          if (selectedCategoryId == null || product.cId == selectedCategoryId )
            html =`
            <div class="card-panel product white row" product-id="${product.id}">

              
              
              <div class="product-edit sidenav-trigger" data-target="side-form-product">
                <i class="material-icons" product-id="${product.id}">edit</i>
              </div>
              
              <div class="product-details">
                <div class="product-name flow-text" productname-id="${product.id}">${product.name}
                </div>
              </div>

              <div class="product checkbox">
                <label>
                  <input type="checkbox" class="filled-in" productchecked-id="${product.id}" ${checkedText} />
                </label>
              </div>


              <div class="product class-info">
              
                  <span class="product-class">
                  ${phaseHtml}
                  </span>
                  <span class="product-class" productclass-id="${product.id}" hidden>${product.cId}</span>
                  <span class="product-class" productclassname-id="${product.id}">${classname}</span>
              </div>

              <div class="product category-info">
                  <span class="product-category" productcategory-id="${product.id}" hidden>${product.cId}</span>
                  <span class="product-category" productcategoryname-id="${product.id}" ${categoryHiddenTxt}>${catname}</span>
              </div>

          </div>
            `;
          productList.innerHTML += html;
      }

      // Skrollataan samaan kohtaan vain ei olla valitussa kategoriassa.. Voi olla tarpeellista muuttaa
      if (sessionStorage.getItem("selectedCategoryId") == null && localStorage.getItem("helper-product-quote-scroll") != null) {
        $(window).scrollTop(localStorage.getItem("helper-product-quote-scroll")); 
      }

}

/**********************************************************************************************/
/*********************************** Tuotelistasivun eventit  *********************************/
const productContainer = document.querySelector('.products');
if (productContainer != null) {
    /******************** Klikkaus tuotelistalla ********************************/
      productContainer.addEventListener('click', evt => {
            console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten

            //TODO pitäisi välittää koko tuotteen tiedot
            if(evt.target.tagName === 'I' && evt.target.innerText === 'edit') {
                const productId = parseInt(evt.target.getAttribute('product-id'));
                const productName = document.querySelectorAll('[productname-id="' + productId + '"]')[0].innerText;
                const productCategory = document.querySelectorAll('[productcategory-id="' + productId + '"]')[0].innerText;
                console.log('productId:', productId);
                console.log('productName:', productName);
                dbGetProduct(productId,fillProductForm)
                
            } else if (evt.target.type == "checkbox") {
              //checked==true
              const productId = parseInt(evt.target.getAttribute('productchecked-id'));
              const checked = evt.target.checked;
              dbUpdateProductToList(productId, checked)
            }
      });

    /************************** Tuotteen lisäys footerissa **************************/  
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
        dbAddProduct(pname, pCid, uiLoadProducts);
        inputProduct.value=""; //TODO vasta jos meni ok?
      })
}

/**********************************************************************************************/
/********************************************* Tuote Form *************************************/
/********** dropdown lista kategorioista formille */
const categorySelection = document.querySelector('.categorySelect');
const renderCategoryDropDown = (productCategory) => {
      let categories = sessionStorage.getItem("sessionCategories");
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


const productClassSelection = document.querySelector('.productClassSelect');
const renderProductClassDropDown = (productClassId) => {
      let prodClasses = sessionStorage.getItem("sessionClasses");
      let classesParsed= JSON.parse(prodClasses);
      var classesSorted = classesParsed.sort(({ordernro:a}, {ordernro:b}) => a-b)
      let classId =0;
      let html =`
      <option value="0">Valitse luokka</option>
      `;
      productClassSelection.innerHTML = html;
      for (let i=0; i < classesSorted.length; i++){   
        classId=classesSorted[i].id;
          if (productClassId == classId) {
            html =`
            <option value="${classId}" selected>${classesSorted[i].name}</option>
            `;
          } else {
            html =`
            <option value="${classId}">${classesSorted[i].name}</option>
            `;
          }
          productClassSelection.innerHTML += html;
      }      
}


const productClassCheckboxSelect = document.querySelector('.productClassCheckboxSelect');
const renderProductClassCheckboxList = (productClassIdArray) => {
  //TODO tutki array, laita checked sen mukaan
      let prodClasses = sessionStorage.getItem("sessionClasses");
      let classesParsed= JSON.parse(prodClasses);
      var classesSorted = classesParsed.sort(({ordernro:a}, {ordernro:b}) => a-b)
      let classId =0;
      let html =``;
      productClassCheckboxSelect.innerHTML = html;
      for (let i=0; i < classesSorted.length; i++){   
        classId=classesSorted[i].id;
        classname=classesSorted[i].name;
          
            html =`
            <div class="row productclass checkbox">
              <div class="col s2">
                    <input type="checkbox" class="filled-in my-collected" productclasschecked-id="${classId}" />
              </div>
              <div class="col s8">
                ${classname}
              </div>
            </div>
            `
            ;
          
          productClassCheckboxSelect.innerHTML += html;
      }      
}


function fillProductForm(product){
  const productinfo = document.querySelector('#productinfo');
  productForm.prodInput1.value = product.name;
      productForm.productId.value = product.id; //hidden value in form
      //productForm.productInputToList.checked = document.querySelectorAll('[productchecked-id="' + product.id + '"]')[0].checked;
      productForm.productInputToList.checked = product.toList;
      if (product.amount != null)
        productForm.prodInputAmount.value = product.amount;
      if (product.unit != null)
        productForm.prodInputUnit.value = product.unit;
      productForm.productInputPh1.checked = product.phase1;
      productForm.productInputPh2.checked = product.phase2;
      productForm.productInputPh3.checked = product.phase3;
      productForm.productInputForbidden.checked = product.forbidden;
      if (product.info != null)
        productinfo.value = product.info; /* huom. ei kelpuuttanut id:tä väliviivalla!! Eikä myöskään hyväksynyt productForm.productinfo miksikähän..? */
      if (product.dose != null)
        productForm.productInputDose.value = product.dose;
      renderCategoryDropDown(product.cId);
      renderProductClassDropDown(product.classId);
}

/*********************************** Tuoteformin eventit **************************************/
const productForm = document.querySelector('#productForm');
if (productForm != null) {
    productForm.addEventListener('submit', evt => {
      evt.preventDefault(); //että formi ei sulkeudu ennekuin sen kentätä on luettu. ?
      const productId = parseInt(productForm.productId.value);
      const productName = productForm.prodInput1.value;
      const comboinstance = document.querySelector('.categorySelect');
      const comboClassInstance = document.querySelector('.productClassSelect');

      var productToList = false;
      var ph1 = false;
      var ph2 = false;
      var ph3 = false;
      var fb = false;

      if (productForm.productInputToList.checked) {
        productToList=true;
      }
      if (productForm.productInputPh1.checked) {
        ph1=true;
      }
      if (productForm.productInputPh2.checked) {
        ph2=true;
      }
      if (productForm.productInputPh3.checked) {
        ph3=true;
      }
      if (productForm.productInputForbidden.checked) {
        fb=true;
      }
     
      const product = {
        id:productId,
        name:productName,
        toList:productToList,
        phase1:ph1,
        phase2:ph2,
        phase3:ph3,
        forbidden:fb
      }
      product.amount = productForm.prodInputAmount.value;
      product.unit = productForm.prodInputUnit.value; 
      product.dose = productForm.productInputDose.value;
      product.info = productForm.productinfo.value;

      //combot
      var selectedProductCategoryId = comboinstance.value;
      product.cId=parseInt(selectedProductCategoryId);
      var selectedProductClassId=comboClassInstance.value;
      product.classId = parseInt(selectedProductClassId);

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
/*******************************************Luokittelu ****************************************/
/**********************************************************************************************/

/****************** Luokan lisäys  ********/
const addClassButton = document.querySelector('#addClassBtn');
const inputCategory = document.querySelector('#classinput');
if (addClassButton != null){
    addClassButton.addEventListener('click',evt => {
      let pcname=classinput.value;
      let ordernro=orderinput.value;
        evt.preventDefault();
        dbAddClass(pcname, ordernro, uiLoadClasses);
        classinput.value=""; //TODO vasta jos meni ok?
        orderinput.value=null; //TODO vasta jos meni ok?
    })
}

/* edit klikkaa formin auki */
const classlistcontainer = document.querySelector('#classlistcontainer');
if (classlistcontainer != null){
  classlistcontainer.addEventListener('click',evt => {
    evt.preventDefault();
    if (evt.target.innerText == 'edit') {
      console.log(evt);
      const classId = parseInt(evt.target.getAttribute('class-id'));      
      dbGetClass(classId,fillClassForm)
    }
  })
}

function fillClassForm(productclass) {
  productclassForm.input1.value=productclass.name;
  productclassForm.classId.value = productclass.id;
  productclassForm.inputClassOrdernro.value = productclass.ordernro;
}


/* Tuotteiden suodatus luokittelussa */
const classFilter = document.querySelector('#classFilter');
const v1 = document.querySelector('#productFilterPh1');
const v2 = document.querySelector('#productFilterPh2');
const v3 = document.querySelector('#productFilterPh3');
const fb = document.querySelector('#productFilterForbidden');
const all = document.querySelector('#productFilterAll');
if (classFilter != null){
    classFilter.addEventListener('click',evt => {

      if (evt.target.type == 'checkbox') {

        $(".filter").hide();
        
        if (all.checked == true) {
          $(".filter").show();
        } else {

          if (v1.checked == true) {
            $('.phase1').show();
          }
          if (v2.checked == true) {
            $('.phase2').show();
          }
          if (v3.checked == true) {
            $('.phase3').show();
          }
          if (fb.checked == true) {
            $('.forbidden').show();
          }
        }

      }   
    })
}

const classList = document.querySelector('.productClasses');
function uiLoadClasses(){
  classList.innerHTML ="";
  //dbGetClasses(uiRenderClassList);
  dbGetClassesAndProducts(uiRenderClassList);
  //dbGetClasses(dbGetProducts(uiRenderClassList));
  console.log("uiLoadClasses");
}

function uiRenderClassList(products) {

    var html =``;
    let pclass = null;
    let classlist ="";
    //let classesParsed= JSON.parse(productclasses);
    let classesParsed= JSON.parse(sessionStorage.getItem("sessionClasses"));
    var classesSorted = classesParsed.sort(({ordernro:a}, {ordernro:b}) => a-b)
    let productsParsed = JSON.parse(products);

    // <ul class="collapsible expandable container green lighten-5">
    //TODO expand vaihtumaan more-> less sen mukaan onko auki vai kiinni
    for (let i=0; i< classesSorted.length; i++){
        pclass=classesSorted[i];
        prodInClass=productsParsed.filter(record=>record.classId==pclass.id);

        starthtml  =`
            <li class="active">
              <div class="collapsible-header row" data-id="${pclass.id}">

                <div class="col s2 class-edit sidenav-trigger" data-target="side-form-productclass">
                  <i class="material-icons" class-id="${pclass.id}">edit</i>
                </div>

                <div class ="col s9">${pclass.name} </div>
                <div class ="col s1">
                  <i class="material-icons">expand_more</i>
                </div>
              </div> 
              <div class="collapsible-body">
          `;

          endhtml =`
          </div>
            </li>
          `;

          prodhtml ="";
          classlist ="";
          for (let j=0; j< prodInClass.length; j++){
            product = prodInClass[j];
            classlist = (uiRenderPhaseClasslist(product));

            phaseHtml = uiRenderPhaseHtml(product);

              prodhtml +=`
                <div class="filter ${classlist}">${phaseHtml} ${product.name}</div>
                `;
          }

          classList.innerHTML += starthtml + prodhtml + endhtml ;
    }


    //voisi laittaa myös renderöinnin loppuun, varsinkin jos eri tavalla käyttäytyviä collapsiblejä
    var collElems = document.querySelectorAll('.collapsible');
    //var collInstances = M.Collapsible.init(collElems, "accordion");
    var collInstances = M.Collapsible.init(collElems, {
      accordion: false
    });   
}


/*********************************** Luokitteluformin eventit ********************/ 
const productclassForm = document.querySelector('#productclassForm');
  if (productclassForm != null) {
    productclassForm.addEventListener('submit', evt => {
      evt.preventDefault(); //Ei suljeta submitilla
      console.log(evt.submitter.id);
      console.log.evt;
  
      const classId = parseInt(productclassForm.classId.value);
      const className = productclassForm.input1.value;
      const classOrdernro = productclassForm.inputClassOrdernro.value;

      if (evt.submitter.id == "delClass") {
        dbDelClass(classId,"productclass.html", closeFormReturnToPage);
      }

      if (evt.submitter.id == "updateClass" || evt.submitter.id == "defaultActionClass") {
        dbUpdateClass(classId,className,classOrdernro,"productclass.html", closeFormReturnToPage);
      }

    });
}

/*******************************************Ateriat ****************************************/
/**********************************************************************************************/

/****************** Luokan lisäys footerissa ********/
const addMealButton = document.querySelector('#addMealBtn');
const inputMeal = document.querySelector('#mealinput');
if (addMealButton != null){
  addMealButton.addEventListener('click',evt => {
      let mealname=mealinput.value;
      let ordernro=orderinput.value;
        evt.preventDefault();
        
        dbAddMeal(mealname, ordernro, uiLoadMeals);
        mealinput.value=""; //TODO vasta jos meni ok?
        orderinput.value=null; //TODO vasta jos meni ok?
    })
}


/* edit klikkaa formin auki */
const meallistcontainer = document.querySelector('#meallistcontainer');
if (meallistcontainer != null){
  meallistcontainer.addEventListener('click',evt => {
    evt.preventDefault();
    if (evt.target.innerText == 'edit') {
      console.log(evt);
      const mealId = parseInt(evt.target.getAttribute('meal-id'));      
      dbGetMeal(mealId,fillMealForm)
    }
  })
}

function fillMealForm(meal) {
  mealForm.input1.value=meal.name;
  mealForm.mealId.value = meal.id;
  mealForm.inputMealOrdernro.value = meal.ordernro;
  mealForm.Ph1.checked = meal.phase1;
  mealForm.Ph2.checked = meal.phase2;
  mealForm.Ph3.checked = meal.phase3;
  mealForm.other.checked = meal.othertype;
 
  
  mealclassArray =[]; //TODO
  renderProductClassCheckboxList(mealclassArray);
}


const mealList = document.querySelector('.mealList');
function uiLoadMeals(){
  mealList.innerHTML ="";
  //dbGetClasses(uiRenderClassList);
  dbGetMeals(uiRenderMealList);
  //dbGetClasses(dbGetProducts(uiRenderClassList));
  console.log("uiLoadMeals");
}

function uiRenderMealList(meals) {

    var html =``;
    let meal = null;
  
    let mealsParsed= JSON.parse(meals);
    var mealsSorted = mealsParsed.sort(({ordernro:a}, {ordernro:b}) => a-b)
    

    for (let i=0; i< mealsSorted.length; i++){
        meal=mealsSorted[i];
        
        starthtml  =`
            <li class="active">                

              <div class="collapsible-header row" data-id="${meal.id}">
                
                  <div class="col s2 meal-edit sidenav-trigger" data-target="side-form-meal">
                    <i class="material-icons" meal-id="${meal.id}">edit</i>
                  </div>

                  <div class ="col s11">${meal.name} </div>
                  <div class ="col s1">
                    <i class="material-icons">expand_more</i>
                  </div>
              </div> 
              <div class="collapsible-body">
          `;

          endhtml =`
          </div>
            </li>
          `;

          ingrediesntshtml ="";
          ingredientshtml = "Tähän tulee sisältöä ";
          /*
          for (let j=0; j< prodInClass.length; j++){
            product = prodInClass[j];
            phaseHtml = uiRenderPhaseHtml(product);

              prodhtml +=`
                <div>${phaseHtml} ${product.name}</div>
                `;
          }
          */

          mealList.innerHTML += starthtml + ingredientshtml + endhtml ;
    }


    //voisi laittaa myös renderöinnin loppuun, varsinkin jos eri tavalla käyttäytyviä collapsiblejä
    var collElems = document.querySelectorAll('.collapsible');
    //var collInstances = M.Collapsible.init(collElems, "accordion");
    var collInstances = M.Collapsible.init(collElems, {
      accordion: false
    });
    
 
}

/************************** Ateriaformin eventit ********************/ 
const mealForm = document.querySelector('#mealForm');
  if (mealForm != null) {
    mealForm.addEventListener('submit', evt => {
      evt.preventDefault(); //Ei suljeta submitilla
      console.log(evt.submitter.id);
      console.log.evt;
      
      const mealId = parseInt(mealForm.mealId.value);
      const mealName = mealForm.input1.value;
      const mealOrdernro = mealForm.inputMealOrdernro.value;

      const ph1 = document.querySelector('#Ph1');
      const ph2 = document.querySelector('#Ph2');
      const ph3 = document.querySelector('#Ph3');
      const other = document.querySelector('#other');
  
      let mealPhase1 = false;
      let mealPhase2 = false;
      let mealPhase3 = false;
      let mealOthertype = false;
      if (ph1.checked == true) mealPhase1 = true;
      if (ph2.checked == true) mealPhase2 = true;
      if (ph3.checked == true) mealPhase3 = true;
      if (other.checked == true)  mealOthertype = true;


      const meal = {
        id:mealId,
        name:mealName,
        ordernro:mealOrdernro,
        phase1:mealPhase1,
        phase2:mealPhase2,
        phase3:mealPhase3,
        othertype:mealOthertype
      }

      if (evt.submitter.id == "delMeal") {
        dbDelMeal(mealId,"meals.html", closeFormReturnToPage);
      }

      if (evt.submitter.id == "updateMeal" || evt.submitter.id == "defaultActionClass") {
        dbUpdateMeal(meal,"meals.html", closeFormReturnToPage);
      }
    });
}


/**********************************************************************************************/
/********************************** Ostoslista ************************************************/
const productListToShop = document.querySelector('.productsToShop');

function uiLoadProductsToShop(){
  productListToShop.innerHTML ="";
  dbGetProducts(uiRenderProductListToShop);
}


function uiRenderProductListToShop(products){
    
  let categoryArray = JSON.parse(sessionStorage.getItem("sessionCategories"));
  var categoryArraySorted = categoryArray.sort(({ordernro:a}, {ordernro:b}) => a-b)
  let productsParsed= JSON.parse(products);

  let selectedProducts = productsParsed.filter(record => record.toList == true);


    for (let j=0; j< categoryArraySorted.length; j++){
      let currentCategoryProds = selectedProducts.filter(record => record.cId == categoryArraySorted[j].id);

      let catname = categoryArraySorted[j].name;
      let product = null;
      let checkedText = "";
      let countProds = " (" + currentCategoryProds.length + ")";

      starthtml =`
      <li class="active">
        <div class="collapsible-header toshop row" >
          <div class ="col s11">${catname}${countProds} </div>
          <div class ="col s1">
            <i class="material-icons">expand_more</i>
          </div>
        </div> 
        <div class="collapsible-body toshop">
      `;
      
      endhtml =`
      </div>
      </li>
      `;

      let productshtml=``;

      let html =``;
      for (let i=0; i< currentCategoryProds.length; i++){
                product=currentCategoryProds[i];

                checkedText = ""; 
                if (product.collected == true) {
                  checkedText = "checked=true";
                }
                
                
                      html =`
                  <div class="card-panel productToShop white row" product-id="${product.id}">
                    
                    <div class="product-edit sidenav-trigger" data-target="side-form-product">
                      <i class="material-icons" product-id="${product.id}">edit</i>
                    </div>
                    
                    <div class="product-details">
                      <div class="product-name flow-text" productname-id="${product.id}">${product.name}
                      </div>
                    </div>

                    <div class="product checkbox">
                      <label>
                        <input type="checkbox" class="filled-in my-collected" productchecked-id="${product.id}" ${checkedText} />
                      </label>
                    </div>
                </div>
                  `;
                //productListToShop.innerHTML += html;
                productshtml += html;
                //productshtml +=` ${product.name}`;
                

      }

      if (currentCategoryProds.length>0) {
        productListToShop.innerHTML += starthtml + productshtml + endhtml;
      }

    }

    var collElems = document.querySelectorAll('.collapsible');
    //var collInstances = M.Collapsible.init(collElems, "accordion");
    var collInstances = M.Collapsible.init(collElems, {
      accordion: false
    });

    // Skrollataan samaan kohtaan vain ei olla valitussa kategoriassa.. Voi olla tarpeellista muuttaa
    if (localStorage.getItem("helper-shoppinglist-quote-scroll") != null) {
      $(window).scrollTop(localStorage.getItem("helper-shoppinglist-quote-scroll")); 
    }
}


if (productListToShop != null) {
    productListToShop.addEventListener('click', evt => {
      console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten

      //TODO pitäisi välittää koko tuotteen tiedot
      if(evt.target.tagName === 'I' && evt.target.innerText === 'edit') {
        //TODO
          const productId = parseInt(evt.target.getAttribute('product-id'));
          const productName = document.querySelectorAll('[productname-id="' + productId + '"]')[0].innerText;
          const productCategory = document.querySelectorAll('[productcategory-id="' + productId + '"]')[0].innerText;
          console.log('productId:', productId);
          console.log('productName:', productName);

          //dbGetProduct(productId,fillProductForm)

          productForm.prodInput1.value = productName;
          productForm.productId.value = productId; //hidden value in form
          productForm.productInputToList.checked = document.querySelectorAll('[productchecked-id="' + productId + '"]')[0].checked;
          renderCategoryDropDown(productCategory);
          
      } else if (evt.target.type == "checkbox") {
        //checked==true
        const productId = parseInt(evt.target.getAttribute('productchecked-id'));
        const checked = evt.target.checked;
        dbUpdateProductToCollected(productId, checked);
      }
    });
}


/* Footerissa: Tuotteen poisto listalta*/
const removeFromListButton = document.querySelector('#removeFromList');
     
if (removeFromListButton != null) {
    removeFromListButton.addEventListener('click',evt => {
      updateCollected()
      .then( x => uiLoadProductsToShop());
    })
}

async function updateCollected() {
  const list = document.querySelectorAll('.my-collected');
  let pid =0;
  list.forEach(prod => {
    if (prod.checked == true) {
      pid=parseInt(prod.getAttribute("productchecked-id"));
      dbUpdateProductToList(pid, false);
    }
    
  });

}

 


