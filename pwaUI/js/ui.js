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
  });

  const renderList = (data, id) => {
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


  function reloadCategories(){
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
      return "Google Chrome or Chromium";
    } else if (userAgent.includes("Safari")) {
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
      return "Apple Safari";
    } else {
      return "unknown";
    }
  }
  //const browserName = getBrowserName(navigator.userAgent);
  //console.log(`You are using: ${browserName}`);


  const removeCategory = (categoryId) => {
    const categoryIdStr = "'" + categoryId.toString() + "'"; // Vaati hipsut toimiakseen, kun on on id stringinä
    const category = document.querySelector(`.category[data-id=${categoryIdStr}]`);
    category.remove();
  };

  // formclose
  /*
  const formclose = document.querySelector('.formclose');
  var catform = document.querySelectorAll('.side-form');
  formclose.addEventListener('click',evt => {
    alert('formclose');
    console.log(evt);
    console.log('catform:', catform);
    //var instance = M.Sidenav.getInstance(forms);
    //console.log('instance:', instance);
    //instance.close();
    //catform.forms.M.
  });
  */


  /* 
  Pitää varmaan tehdä tuonne ylös?
  https://stackoverflow.com/questions/54595661/materialize-fixed-sidebar-close
  document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".sidenav");
  var options = {};
  var instances = M.Sidenav.init(elems, options);

  document
    .querySelector("#toggle_sidenav")
    .addEventListener("click", function() {
      var elem = document.querySelector(".sidenav");
      var instance = M.Sidenav.getInstance(elem);

      if (instance.isOpen) {
        console.log("Is open: I need to close it");
        instance.close();
      } else {
        console.log("Is closed: I need to open it");
        instance.open();
      }
    });
});
  
  
  */


