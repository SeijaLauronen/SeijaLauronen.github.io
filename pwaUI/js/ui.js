//TODO siirrä tänne db.js:stä osia
// formissa jos painaa enteriä, ottaa poiston oletuksena

const categoryList = document.querySelector('.categories');

document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
    //alert("left");
    // add category form
    const forms = document.querySelectorAll('.side-form');
    var instances = M.Sidenav.init(forms, {edge: 'right'}); //tähän lisätty var instances eteen
    //alert("right");


    //var elems = document.querySelectorAll(".sidenav");
    //var options = {};
    //var instances = M.Sidenav.init(elems, options);
  
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

    //checkBrowser();
    document.getElementById("browserinfo").innerHTML = getBrowserName(navigator.userAgent);
    document.getElementById("programVersion").innerHTML = "Ohjelmaversio:" + programVersion;

  });

  const renderCategoryList = (data, id) => {
    const html =`
    <div class="card-panel category category white row" data-id="${id}">
    
    <div class="category-details">
      <div class="category-name flow-text" name-id="${id}">${data.name}
      </div>
    </div>
    <div class="category-edit sidenav-trigger" data-target="side-form"">
      <i class="material-icons" data-id="${id}">edit</i>
    </div>
    
    <div class="category-go">
    <a href="about.html?categoryId=${id}">
    <i class="material-icons data-id="${id}">arrow_forward</i>
    </a> 
  </div>
  </div>
    `;
    categoryList.innerHTML += html;
  }


  function uiReloadCategories(){
    categoryList.innerHTML ="";
    //listaa();
    listCategories();
  }

  function emptyCategories(){
    categoryList.innerHTML ="";
  }

 
  function checkBrowser(){
    // https://www.webfx.com/blog/web-design/browser-detection-javascript/
   //https://www.w3schools.com/js/js_window_navigator.asp

   let text = "<p>Browser CodeName: " + navigator.appCodeName + "<br>" +
   "Browser Name: " + navigator.appName + "<br>" +
   "Browser Version: " + navigator.appVersion + "<br>" +
   "Cookies Enabled: " + navigator.cookieEnabled + "<br>" +
   "Browser Language: " + navigator.language + "<br>" +
   "Browser Online: " + navigator.onLine + "<br>" +
   "Platform: " + navigator.platform + "<br>" +
   "User-agent header: " + navigator.userAgent + "</p>";
   
   document.getElementById("browserinfo").innerHTML = text;
    return navigator.userAgent;
  }


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

// 11.3.2023 vaihdetaan eventit UI:lle
  const form = document.querySelector('form');
  form.addEventListener('submit', evt => {
     //evt.preventDefault();
     //console.log(evt.submitter.id);
 
    const categoryId = parseInt(form.categoryId.value);
    const categoryName = form.input1.value;
    if (evt.submitter.id == "delCategory") {
      dbDelCategory(categoryId);
      /*
      dbDelCategory(categoryId).then(x=> {
        uiRemoveCategory(categoryId); // Poistaa ui:sta, tarvitaankohan.... Ei tarvita
      })
      */
    }

    if (evt.submitter.id == "updateCategory" || evt.submitter.id == "defaultActionCategory") {
      dbUpdateCategory(categoryId,categoryName);
    }

  });

  const categoryContainer = document.querySelector('.categories');
  categoryContainer.addEventListener('click', evt => {
    //console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten

     if(evt.target.tagName === 'I' && evt.target.innerText === 'edit') {
        const categoryId = parseInt(evt.target.getAttribute('data-id'));
        const categoryName = document.querySelectorAll('[name-id="' + categoryId + '"]')[0].innerText;
        console.log('categoryId:', categoryId);
        console.log('categoryName:', categoryName);
        form.input1.value=categoryName;
        form.categoryId.value = categoryId;
    }
  });

const addCategoryButton = document.querySelector('#addCategoryBtn');
const inputCategory = document.querySelector('#categoryinput');
const cname=inputCategory.value;
addCategoryButton.addEventListener('click',evt => {
    evt.preventDefault();
    dbAddCategory(cname);
})


/*
Data from serviceworker to UI
https://stackoverflow.com/questions/37704641/access-dom-by-web-worker
*/
function getVersionInfo() {
  "use strict";

  if (!navigator.serviceWorker || !navigator.serviceWorker.register) {
      console.log("This browser doesn't support service workers");
      return;
  }

  // Listen to messages from service workers.
  navigator.serviceWorker.addEventListener('message', function(event) {
      //console.log("Got reply from service worker: " + event.data);
      document.getElementById("programVersion").innerHTML = event.data;
  });

  // Are we being controlled?
  if (navigator.serviceWorker.controller) {
      // Yes, send our controller a message.
      //console.log("Sending 'Ohjelmaversio:' to controller");
      navigator.serviceWorker.controller.postMessage("Ohjelmaversio:");
  } else {
      // No, register a service worker to control pages like us.
      // Note that it won't control this instance of this page, it only takes effect
      // for pages in its scope loaded *after* it's installed.
      navigator.serviceWorker.register("service-worker.js")
          .then(function(registration) {
              console.log("Service worker registered, scope: " + registration.scope);
              console.log("Refresh the page to talk to it.");
              // If we want to, we might do `location.reload();` so that we'd be controlled by it
          })
          .catch(function(error) {
              console.log("Service worker registration failed: " + error.message);
          });
  }
};


