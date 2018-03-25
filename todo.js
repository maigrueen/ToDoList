//Variablen mit den Elementen im HTML verknüpfen
var toDoInput = document.querySelector("#newElement"),
submit = document.querySelector("#btn"),
toDoOutput = document.querySelector("#toDoList"),
searchField = document.querySelector("#textFilterElement"),
deleteSearch = document.querySelector("#removeSearchButton"),
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
    //Input im Textfilter löschen, damit alle Elemente angezeigt werden
    searchField.value = "";
    //Gesamte Liste rendern
    showToDos(toDos);
  }
};

//TODO Einfügen, dass auch mit Enter Sachen submitted werden können - auch im HTML submit verwenden?

//warten, dass man auf den Add Button klickt
submit.addEventListener("click", addToDo);

//Funktion zum Anzeigen der Array-Objekte
var showToDos = function(toDos) {
  if (toDoOutput.innerHTML == "") {
    console.dir("Liste leider leer!");
    //TODO irgendwie einfügen, dass ein Hinweis ausgegeben wird
  }
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
    //der Checkbox ne ID geben
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
    //i-Tag erstellen, um Icon einzufügen
    var sp = document.createElement("i");
    //Icon hinzufügen
    sp.setAttribute("class", "fal fa-trash");
    //Icon an den Button hängen
    newBtn.appendChild(sp);
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

//aufrufen, wenn Button zum aus/einblenden geklickt wurde
var filterChecked = function(event) {
  if (event.target.classList.contains("filterOff")) {
    //Klasse ändern
    filterFinished.className = "filterOn";
    //Button Beschriftung ändern
    event.target.innerHTML = "Fertige einblenden";
    //Filter-Status im Objekt ändern
    filters.filterDone.active = true;
    //Funktion zum filtern aufrufen
    filter();
  } else if (event.target.classList.contains("filterOn")) {
    //Klasse ändern
    filterFinished.className = "filterOff";
    //Button Beschriftung ändern
    event.target.innerHTML = "Fertige ausblenden";
    //Filter-Status im Objekt ändern
    filters.filterDone.active = false;
    //Funktion zum filtern aufrufen
    filter();
  }
};

//warten, dass man auf den Filter-Button klickt
document.addEventListener("click", filterChecked)

//aufrufen, wenn man was in den Textfilter eingibt oder auf den Löschen-Button drückt
var textFilter = function(event) {
  if (event.target.classList.contains("textFilter")) {
    //Filter-Status im Objekt ändern
    filters.filterText.active = true;
    //Funktion zum filtern aufrufen
    filter();
  } else if (event.target.classList.contains("removeSearch")) {
    //Feldwert löschen
    searchField.value = "";
    //Filter-Status im Objekt ändern
    filters.filterText.active = false;
    //Funktion zum filtern aufrufen
    filter();
  }
};

//warten, dass etwas eingegeben oder der Remove-Button gedrückt wird
document.addEventListener("keyup", textFilter);
document.addEventListener("click", textFilter);

//Objekt, dass die verschiedenen Filter enthält:
//Für jeden Filter wird gespeichert, ob er aktiv ist, und was er zurückgeben muss
filters = {
  filterDone: {active: false, func: function(toDo) {return toDo.checked == false;}},
  filterText: {active: false, func: function(toDo) {return toDo.value.includes(searchField.value);}}
};

//allgemeine Filter-Funktion
var filter = function() {
  //bestehenden Array zwischen speichern
  var filteredToDos = toDos;
  //Schleife: gehe durch alle Keys in "filters", wobei i das aktuelle Attribut von filters ist
  for (var i in filters) {
    //Value von i merken
    var currentFilter = filters[i];
    //wenn der zu prüfende Filter aktiv ist
    if (currentFilter.active) {
      //dann filtere
      filteredToDos = filteredToDos.filter(currentFilter.func);
    }
  }
  //zeig den neuen (gefilterten) Array an
  showToDos(filteredToDos);
};

//Zeig den (gespeicherten) Array an (beim Neuladen)
showToDos(toDos);
