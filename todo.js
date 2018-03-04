//Variablen mit den Elementen im HTML verknüpfen
var toDoInput = document.querySelector("#newElement"),
submit = document.querySelector("#btn"),
toDoOutput = document.querySelector("#toDoList"),
storageKey = "todostorage";

//Funktion zum Daten laden
var loadData = function() {
  //Abfragen: gibts den angegebenen Storagekey im localStorage?
  if (localStorage.getItem(storageKey)) {
    //Dann hol dir den
    return JSON.parse(localStorage.getItem(storageKey));
  } else {
    //sonst leg nen leeren Array an
    return [];
  }
};

//Funktion zum Daten speichern
var saveData = function(toDos) {
  //Speichere im LocalStorage als String, weil der kann sonst nix
  localStorage.setItem(storageKey, JSON.stringify(toDos));
};

//Eventlistener, der speichern auslöst bevor das Fenster geschlossen oder neu geladen wird
window.addEventListener("beforeunload", function () {saveData(toDos);});

//unseren ToDo-Array erstellen, in dem die Laden-Funktion aufgerufen wird
var toDos = loadData();

//Funktion ToDo anlegen
var addToDo = function() {
  //Nur hinzufügen, wenn auch was im Inputfeld steht
  if (toDoInput.value.length > 0) {

    //Neues ToDo-Objekt erstellen und zum Array hinzufügen
    toDos.push({value: toDoInput.value, checked: false});

    //Input im Feld löschen
    toDoInput.value = "";

    //Gesamte Liste rendern
    showToDos(toDos);
  }
};

//warten, dass man auf den Add Button klickt
submit.addEventListener("click", addToDo);

//Funktion zum Anzeigen der Array-Objekte
var showToDos = function(toDos) {
  toDoOutput.innerHTML = "";
  for(var i=0; i<toDos.length; i++){
    var currentToDo = toDos[i];
    //ID mit dem Index erstellen, um Label und Checkbox zusammen zu fügen
    var id = "todo_" + i;

    //neues Listenelement
    var newLi = document.createElement("li");

    //definieren, dass es eine Checkbox gibt
    var newCheck = document.createElement("input");
    newCheck.type = "checkbox";
    //der Checkbox ne Klasse geben
    newCheck.classList.add("changeCheckbox");
    newCheck.id = id;
    //der neuen Checkbox den checked-Status vom momentanen Stand im Array geben
    newCheck.checked = currentToDo.checked;
    //Listenelement und Checkbox zusammen hauen
    newLi.appendChild(newCheck);

    //Label besorgen
    var newLabel = document.createElement("label");
    newLabel.htmlFor = id;
    //Feld-Value als TextNode anlegen
    var labelText = document.createTextNode(currentToDo.value);
    //Feld-Value ins Label packen
    newLabel.appendChild(labelText);
    //Label ans Listenelement hauen
    newLi.appendChild(newLabel);

    //Remove-Button anlegen
    var newBtn = document.createElement("button");
    //dem Button ne Klasse geben
    newBtn.classList.add("removeBtn");
    newBtn.dataset.toDoIndex = i;
    //Button Text anlegen
    var btnText = document.createTextNode("Löschen");
    //Button Text auf den Button schreiben
    newBtn.appendChild(btnText);
    //Remove-Button ans Listenelement anhängen
    newLi.appendChild(newBtn);

    //neues komplettes Listenelement an die Liste hängen
    toDoOutput.appendChild(newLi);
  }
};

//Funktion zum Status der Checkbox ändern
var changeToDo = function(event) {
  if (event.target.classList.contains("changeCheckbox")) {
    //id der Checkbox holen und Präfix todo_ abschneiden
    var idCheck = event.target.id;
    var id = idCheck.replace("todo_","");
    //Wert vom richtigen Objekt ändern
    toDos[id].checked = event.target.checked;
  }
};

//warten, dass die Checkbox geklickt wird
document.addEventListener("change", changeToDo);

//Funktion ToDo löschen
var removeToDo = function(event) {
  //nur löschen, wenn die Klasse removeBtn gesetzt ist
  if (event.target.classList.contains("removeBtn")) {
    //Element aus dem Array löschen
    toDos.splice(event.target.dataset.toDoIndex,1);

    //Gesamte Liste rendern
    showToDos(toDos);
  }
};

//warten, dass man auf den Remove Button klickt
document.addEventListener("click", removeToDo);

//gesamte Liste rendern, wenn die Seite neu geöffnet wird
showToDos(toDos);
