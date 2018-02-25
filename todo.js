// Schritt 1: ToDo anlegen

//Variablen mit den Elementen im HTML verknüpfen
var toDoInput = document.querySelector("#newElement"),
submit = document.querySelector("#btn"),
toDoOutput = document.querySelector("#toDoList");

//Funktion ToDo anlegen
var addToDo = function() {
  if (toDoInput.value.length > 0) {
    //ID erstellen, um Label und Checkbox zusammen zu fügen
    var id = "todo_" + new Date().getTime();

    //neues Listenelement
    var newLi = document.createElement("li");

    //definieren, dass es eine Checkbox gibt
    var newCheck = document.createElement("input");
    newCheck.type = "checkbox";
    newCheck.id = id;
    //Listenelement und Checkbox zusammen hauen
    newLi.appendChild(newCheck);

    //Label besorgen
    var newLabel = document.createElement("label");
    newLabel.htmlFor = id;
    //Feld-Value als TextNode anlegen
    var labelText = document.createTextNode(toDoInput.value);
    //Feld-Value ins Label packen
    newLabel.appendChild(labelText);
    //Label ans Listenelement hauen
    newLi.appendChild(newLabel);

    //Remove-Button anlegen
    var newBtn = document.createElement("button");
    //dem Button ne Klasse geben
    newBtn.classList.add("removeBtn");
    //Button Text anlegen
    var btnText = document.createTextNode("Löschen");
    //Button Text auf den Button schreiben
    newBtn.appendChild(btnText);
    //Remove-Button ans Listenelement anhängen
    newLi.appendChild(newBtn);

    //neues komplettes Listenelement an die Liste hängen
    toDoOutput.appendChild(newLi);

    //Input im Feld löschen
    toDoInput.value = "";
  }
};

//warten, dass man auf den Add Button klickt
submit.addEventListener("click", addToDo);

//Schritt 2: ToDo löschen

//Funktion ToDo löschen
var removeToDo = function(event) {
  //nur löschen, wenn die Klasse removeBtn gesetzt ist
  if (event.target.classList.contains("removeBtn")) {
    //ganzes li-Element löschen
    event.target.parentNode.remove();
  }
};

//warten, dass man auf den Remove Button klickt
document.addEventListener("click", removeToDo);
