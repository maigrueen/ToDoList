//TODO Kategorie mit Angeben:
// - nach Kategorie filtern
// - Kategorien auf farbigem Button platzieren: gleiche Farbe für gleiche Kategorien
// - oder Farbe auswählen beim anlegen?
// - Textsuche auf Kategorien erweitern

//Variablen mit den Elementen im HTML verknüpfen
var toDoInput = document.querySelector("#newElement"),
categoryInput = document.querySelector("#newCategory"),
submit = document.querySelector("#btn"),
toDoOutput = document.querySelector("#toDoList"),
searchField = document.querySelector("#textFilterElement"),
deleteSearch = document.querySelector("#removeSearchButton"),
radioNoSort = document.querySelector("#noSort"),
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
    toDos.push({value: toDoInput.value, category: categoryInput.value, checked: false, timestamp: new Date().getTime()});
    //Input im Feld löschen
    toDoInput.value = "";
    //Input in der Kategorie Löschen
    categoryInput.value = "";
    //Input im Textfilter löschen, damit alle Elemente angezeigt werden
    searchField.value = "";
    //Gesamte Liste rendern
    showToDos(toDos);
  }
};

//warten, dass man auf den Add Button klickt (oder im Input- oder Kategorie-Feld Enter klickt)
submit.addEventListener("click", addToDo);
toDoInput.addEventListener("keyup", function(event) {
  if (event.keyCode == 13) {
    addToDo();
  }
});
categoryInput.addEventListener("keyup", function(event) {
  if (event.keyCode == 13) {
    addToDo();
  }
});

//Funktion zum Anzeigen der Array-Objekte
var showToDos = function(toDos) {
  //gefilterte Liste benutzen (damit kein Filter einfach so zurück gesetzt wird)
  var filteredTodos = filter(toDos);
  //wenn eine Sortierung angehakt ist, dann benutz sie auch
  if(sortings[sortings.activeSort]) {
    filteredTodos.sort(sortings[sortings.activeSort]);
  }
  //Liste erstmal löschen
  toDoOutput.innerHTML = "";
  //jedes Listenelement zusammen bauen
  for(var i=0; i<filteredTodos.length; i++){
    var currentToDo = filteredTodos[i];
    //ID mit dem Index erstellen, um Label und Checkbox zusammen zu fügen
    var id = "todo_" + currentToDo.timestamp;

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
    //über Dataset ID geben
    newBtn.dataset.toDoIndex = currentToDo.timestamp;
    //i-Tag erstellen, um Icon einzufügen
    var sp = document.createElement("i");
    //Icon hinzufügen
    sp.setAttribute("class", "fal fa-trash");
    //Icon an den Button hängen
    newBtn.appendChild(sp);
    //Remove-Button ans Listenelement anhängen
    newLi.appendChild(newBtn);

    if (currentToDo.category.length > 0) {
      //Kategorie als Button anlegen
      var newCatBtn = document.createElement("button");
      //Klasse zuweisen
      newCatBtn.classList.add("categoryLabel");
      //über Dataset ID geben
      newCatBtn.dataset.toDoIndex = currentToDo.timestamp;
      //Button Text anlegen
      var catBtnText = document.createTextNode(currentToDo.category);
      //Text auf Button schreiben
      newCatBtn.appendChild(catBtnText);
      //Kategorie Button ans Listenelement anhängen
      newLi.appendChild(newCatBtn);
    }

    //neues komplettes Listenelement an die Liste hängen
    toDoOutput.appendChild(newLi);
  }

  if (toDoOutput.innerHTML == "") {
    toDoOutput.innerHTML = '<li>Leider keine ToDos zur Anzeige vorhanden.</li>'
  }
};

//Funktion zum Status der Checkbox ändern
var changeToDo = function(event) {
  if (event.target.classList.contains("changeCheckbox")) {
    //id der Checkbox holen und Präfix todo_ abschneiden
    var idCheck = event.target.id;
    var timestamp = idCheck.replace("todo_","");
    var id = toDos.findIndex(function(todo) {
      return todo.timestamp == timestamp;
    });
    //Wert vom richtigen Objekt ändern
    toDos[id].checked = event.target.checked;
    showToDos(toDos);
  }
};

//warten, dass die Checkbox geklickt wird
document.addEventListener("change", changeToDo);

//Funktion ToDo löschen
var removeToDo = function(event) {
  //nur löschen, wenn die Klasse removeBtn gesetzt ist
  if (event.target.classList.contains("removeBtn")) {
    var timestamp = event.target.dataset.toDoIndex;
    var id = toDos.findIndex(function(todo) {
      return todo.timestamp == timestamp;
    });
    //Element aus dem Array löschen
    toDos.splice(id,1);
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
    event.target.innerHTML = '<i class="fas fa-check-circle"></i> Fertige einblenden';
    //Filter-Status im Objekt ändern
    filters.filterDone.active = true;
    //Funktion zum filtern aufrufen
    showToDos(toDos);
  } else if (event.target.classList.contains("filterOn")) {
    //Klasse ändern
    filterFinished.className = "filterOff";
    //Button Beschriftung ändern
    event.target.innerHTML = '<i class="fal fa-check-circle"></i> Fertige ausblenden';
    //Filter-Status im Objekt ändern
    filters.filterDone.active = false;
    //Funktion zum filtern aufrufen
    showToDos(toDos);
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
    showToDos(toDos);
  } else if (event.target.classList.contains("removeSearch")) {
    //Feldwert löschen
    searchField.value = "";
    //Filter-Status im Objekt ändern
    filters.filterText.active = false;
    //Funktion zum filtern aufrufen
    showToDos(toDos);
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
var filter = function(toDos) {
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
  return filteredToDos;
};

sortings = {
  noSort: function(todoA, todoB) {
    if (todoA.timestamp == todoB.timestamp) {
      return 0;
    } else if (todoA.timestamp < todoB.timestamp) {
      return -1;
    } else if (todoA.timestamp > todoB.timestamp) {
      return 1;
    }
  },
  sortDoneUp: function(todoA, todoB) {
    if (todoA.checked == todoB.checked) {
      return 0;
    } else if (todoA.checked) {
      return -1;
    } else if (todoB.checked) {
      return 1;
    }
  },
  sortDoneDown: function(todoA, todoB) {
    if (todoA.checked == todoB.checked) {
      return 0;
    } else if (todoA.checked) {
      return 1;
    } else if (todoB.checked) {
      return -1;
    }
  },
  sortABCup: function(todoA, todoB) {
    return todoA.value.localeCompare(todoB.value);
  },
  sortABCdown: function(todoA, todoB) {
    return todoB.value.localeCompare(todoA.value);
  },
  sortCategoryUp: function(todoA, todoB) {
    return todoA.category.localeCompare(todoB.category);
  },
  sortCategoryDown: function(todoA, todoB) {
    return todoB.category.localeCompare(todoA.category);
  }
};

var sort = function(event) {
  if (event.target.classList.contains("sort")) {
    var sortValue = event.target.value;
    sortings.activeSort = sortValue;
    showToDos(toDos);
  }
};

document.addEventListener("change", sort);

//Zeig den (gespeicherten) Array an (beim Neuladen)
showToDos(toDos);
