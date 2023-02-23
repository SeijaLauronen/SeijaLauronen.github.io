const categoryList = document.querySelector('.categories');

document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
    //alert("left");
    // add recipe form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'right'});
    //alert("right");
  });

  const renderList = (data, id) => {
    const html =`
    <div class="card-panel recipe category white row" data-id="${id}">
    
    <div class="recipe-details">
      <div class="recipe-ingredients flow-text">${data.name}
      </div>
    </div>
    <div class="category-edit sidenav-trigger" data-target="side-form"">
      <i class="material-icons" data-id="${id}">edit</i>
    </div>
    
    <div class="recipe-delete">
      <i class="material-icons" data-id="${id}">delete</i>
    </div>
    <div class="category-go">
    <a href="about.html?categoryId=${id}">
    <i class="material-icons data-id="${id}">arrow_right_alt</i>
    </a> 
  </div>
  </div>
    `;
    categoryList.innerHTML += html;
  }


  function reloadCategories(){
    categoryList.innerHTML ="";
    listaa();
  }

  function emptyCategories(){
    categoryList.innerHTML ="";
  }

  const removeCategory = (categoryId) => {
    const categoryIdStr = "'" + categoryId.toString() + "'"; // Vaati hipsut toimiakseen, kun on on id stringinä
    const category = document.querySelector(`.category[data-id=${categoryIdStr}]`);
    category.remove();
  };