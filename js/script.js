// Fügt eine neue Notiz hinzu
function addNote() {
    var video = document.getElementById('videoPlayer');
    var note = document.getElementById('noteInput').value;
    var categories = getSelectedCategories();
    var timestamp = video.currentTime;
    var notes = JSON.parse(localStorage.getItem('videoNotes')) || [];
    notes.push({ timestamp: timestamp, note: note, categories: categories });
    localStorage.setItem('videoNotes', JSON.stringify(notes));
    displayNotes();
    resetInput();
}

// Zeigt die Notizen an



function displayNotes() {
    var notes = JSON.parse(localStorage.getItem('videoNotes')) || [];
    
    /*
    notes.sort(function(a, b) {
        return a.timestamp - b.timestamp;
    });
    */ 
    var notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    notes.forEach(function(note, index) {
        var listItem = document.createElement('li');
        listItem.onclick = function() { jumpToTime(note.timestamp); };

        var timeDiv = document.createElement('div');
        timeDiv.textContent = `Zeit: ${formatTime(note.timestamp)}`;
        listItem.appendChild(timeDiv);

        var noteDiv = document.createElement('div');
        noteDiv.textContent = `Notiz: ${note.note}`;
        listItem.appendChild(noteDiv);

        var categoryDiv = document.createElement('div');
        categoryDiv.textContent = `Kategorien: ${note.categories.join(', ')}`;
        listItem.appendChild(categoryDiv);

        var editButton = createButton('Bearbeiten', function(event) {
            event.stopPropagation();
            editNote(index); 
        });
        listItem.appendChild(editButton);

        var deleteButton = createButton('Löschen', function(event) {
            event.stopPropagation();
            deleteNote(index); 
        });

        listItem.appendChild(deleteButton);
        
        notesList.appendChild(listItem);
    });

    createTimeline();
}


// Springt zu einer bestimmten Zeit im Video
function jumpToTime(timestamp) {
    var video = document.getElementById('videoPlayer');
    video.currentTime = timestamp;
}

// Bearbeitet eine bestehende Notiz
function editNote(index) {
    var notes = JSON.parse(localStorage.getItem('videoNotes')) || [];
    var note = notes[index];
    document.getElementById('noteInput').value = note.note;
    setSelectedCategories(note.categories);

    var saveButton = document.getElementById('saveNote');
    saveButton.removeEventListener('click', addNote);
    saveButton.onclick = function() {
        updateNote(index);
        jumpToTime(note.timestamp);
    };
}

// Aktualisiert eine bestehende Notiz
function updateNote(index) {
    var notes = JSON.parse(localStorage.getItem('videoNotes')) || [];
    var note = document.getElementById('noteInput').value;
    var categories = getSelectedCategories();
    notes[index] = { timestamp: notes[index].timestamp, note: note, categories: categories };
    localStorage.setItem('videoNotes', JSON.stringify(notes));
    displayNotes();
    resetInput();

    var saveButton = document.getElementById('saveNote');
    saveButton.addEventListener('click', addNote);
    saveButton.onclick = null;
}

// Löscht eine Notiz
function deleteNote(index) {
    var notes = JSON.parse(localStorage.getItem('videoNotes'));
    notes.splice(index, 1);
    localStorage.setItem('videoNotes', JSON.stringify(notes));
    displayNotes();
}

// Erstellt die Timeline-Punkte
function createTimeline() {
    var video = document.getElementById('videoPlayer');
    var timeline = document.getElementById('timeline');
    var notes = JSON.parse(localStorage.getItem('videoNotes')) || [];
    var videoDuration = video.duration;

    timeline.innerHTML = '';
    notes.forEach(function(note) {
        var point = document.createElement('div');
        point.className = 'timeline-point';
        point.style.left = (note.timestamp / videoDuration * 100) + '%';
        point.onclick = function() {
            video.currentTime = note.timestamp;
            highlightNote(note.timestamp);
        };
        timeline.appendChild(point);
    });
}

// Hilfsfunktionen
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

function getSelectedCategories() {
    var checkboxes = document.querySelectorAll('#categoryContainer input[type=checkbox]:checked');
    return Array.from(checkboxes).map(function(checkbox) {
        return checkbox.value;
    });
}

function setSelectedCategories(categories) {
    var checkboxes = document.querySelectorAll('#categoryContainer input[type=checkbox]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = categories.includes(checkbox.value);
    });
}

function resetInput() {
    document.getElementById('noteInput').value = '';
    var checkboxes = document.querySelectorAll('#categoryContainer input[type=checkbox]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    document.getElementById('saveNote').onclick = null;
    document.getElementById('saveNote').addEventListener('click', addNote);
}

function createButton(text, onClickFunction) {
    var button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClickFunction;
    return button;
}

function highlightNote(timestamp) {
    // Optional: Implementieren Sie eine Funktion, um die entsprechende Notiz im Notizenbereich hervorzuheben
}

// Initialisierung
window.onload = function() {
    var video = document.getElementById('videoPlayer');
    
    if (video.readyState >= 1) {
        displayNotes();
    } else {
        video.addEventListener('loadedmetadata', displayNotes);
    }

    document.getElementById('saveNote').addEventListener('click', addNote);
};
