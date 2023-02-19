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
    <div class="card-panel recipe white row" data-id="${data.id}">
    <img src="img/dish.png" alt="recipe thumb">
    <div class="recipe-details">
      <div class="recipe-title">${data.id}</div>
      <div class="recipe-ingredients">${data.name}</div>
    </div>
    <div class="recipe-delete">
      <i class="material-icons" data-id="${data.id}">delete_outline</i>
    </div>
  </div>
    `;
    categoryList.innerHTML += html;
  }