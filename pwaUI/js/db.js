
function listaa(){
    //alert("listaan");
    db.collection('users').get().then(users => {
                  users.forEach(element => {
                    renderList(element, element.id);
                    //console.log(element.id, element.name);
                  });
                })
  }

  const form = document.querySelector('form');
  form.addEventListener('submit', evt => {
    evt.preventDefault();
        const category = {
            id:form.title.value,
            name:form.ingredients.value
        }

        db.collection('users').add(category)
        .then( reload =>
            {  // oma koodi, että lista päivittyy näytöllä
                reloadCategories();
            }
        )
        .catch(err =>console.log(err));
        
        form.title.value ="";
        form.ingredients.value = "";

        
  });