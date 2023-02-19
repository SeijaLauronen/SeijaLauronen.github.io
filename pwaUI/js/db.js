
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
    try {
        //let categoryID=parseInt(form.title.value); // toDo tämä paremmin
        let categoryID=form.title.value // TODO pidetään toistaseks sitten vaan tekstinä

        evt.preventDefault();
            const category = {
                id:categoryID,
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
            }
    catch (e){
            console.log("Virhe lisäyksessä",e)
    }
        
  });

  const categoryContainer = document.querySelector('.categories');
  categoryContainer.addEventListener('click', evt => {
    console.log(evt); //tällä näet tagName:t jne tuo I tarkoittanee ikonia, niin jos niitä tulee useita, pitää erotella jotenkin muuten
    if(evt.target.tagName === 'I') {
        const categoryId = evt.target.getAttribute('data-id');

        db.collection('users')
                        .doc({ id: categoryId })
                        .delete()
                        .then(response => {
                          console.log('Delete successful, now do something.');
                          // reloadCategories(); Toimii tälläkin
                          removeCategory(categoryId); // Poistaa ui:sta
                        })
                        .catch(error => {
                          console.log('There was an error, do something else.', error)
                          alert ("Ei onnistu del", error)
                        })
    }
  })