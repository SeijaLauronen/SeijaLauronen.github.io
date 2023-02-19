
function listaa(){
    //alert("listaan");
    db.collection('users').get().then(users => {
                  //resultset.value =users[0].name

                  let listOfNames ="";
                  users.forEach(element => {
                    listOfNames+=element.id + ":"
                    listOfNames+=element.name + ", "
                    //addItemToTable(element.id,element.name);

                    renderList(element, element.id);

                  });

                  //resultset.value =listOfNames
                  console.log(listOfNames);
                  
                  


                })

  }