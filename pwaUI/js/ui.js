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


