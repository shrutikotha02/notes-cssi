window.onload = event => {
  // Firebase authentication goes here.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Console log the user to confirm they are logged in
      console.log("Logged in as: " + user.displayName);
      const googleUserID = user.uid;
      getNotes(googleUserID, user);
    } else {
      // If not logged in, navigate back to login page.
      window.location = "index.html";
    }
  });
};

const getNotes = (userId, user) => {
  const notesRef = firebase.database().ref(`users/${userId}`);

  notesRef.on("value", snapshot => {
    const data = snapshot.val();
    renderDataAsHtml(data, user);
  });
};




//Given a list of notes, render them in HTML
const renderDataAsHtml = (data, user) => {
  const appElement = document.querySelector("#app")
  for (const noteItem in data) {
    const note = data[noteItem];
    const card = createCard(note, user)
    appElement.appendChild(card)
  }
};

// Return a note object converted into an HTML card
const createCard = (note, user) => {
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // column
  const columnElement = document.createElement('div') // <div></div>
  columnElement.classList.add('column');
  columnElement.classList.add('is-one-quarter');
 // columnElement.style.cssText = `background-color:${randomColor}` // "background-color:${randomColor}"
  
  // card
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  columnElement.appendChild(cardElement)
  cardElement.style.cssText = `background-color:${randomColor}` // "background-color:${randomColor}"

  
  // card header
  const cardHeader = document.createElement('header')
  cardHeader.classList.add('card-header')
  cardElement.appendChild(cardHeader);
  
  // Title
  const noteTitle = document.createElement('p')
  noteTitle.classList.add('card-header-title')
  cardHeader.appendChild(noteTitle);
  noteTitle.innerHTML = note.title;
  
  // card content 
  const cardContent = document.createElement('div')
  cardContent.classList.add('card-content')
  cardElement.appendChild(cardContent);
  
  // noteContent
  const noteContent = document.createElement('div')
  noteContent.classList.add('content')
  noteContent.innerHTML = 'Message: ' + note.text;
  cardContent.appendChild(noteContent);
  
  // userID card
  const userCard = document.createElement('div')
  cardElement.appendChild(userCard);
  
  // user content
  const userContent = document.createElement('div')
  userContent.classList.add('content') 
  userContent.innerHTML = 'Username: ' + user.displayName;
  cardContent.appendChild(userContent);

  // footer 
  const footer = document.createElement('footer');
  footer.classList.add()

  

  // var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return columnElement;
};


// edit notes
const editNote = (noteId) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const noteDetails = data[noteId];
    document.querySelector('#editNoteId').value = noteId;
    document.querySelector('#editTitleInput').value = noteDetails.title;
    document.querySelector('#editTextInput').value = noteDetails.text;
  });

  editNoteModal.classList.toggle('is-active');
};


const deleteNote = (noteId) => {
  firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
}


const saveEditedNote = () => {
  const noteId = document.querySelector('#editNoteId').value;
  const noteTitle = document.querySelector('#editTitleInput').value;
  const noteText = document.querySelector('#editTextInput').value;
  const noteEdits = {
    title: noteTitle,
    text: noteText
  };
  firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
  closeEditModal();
}

const closeEditModal = () => {
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
};


/*
`
             <div class="column is-one-quarter" style="background-color:${randomColor};">
               <div class="card" style="background-color:${randomColor};" >
                 <header class="card-header" >
                   <p class="card-header-title">${note.title}</p>
                 </header>
                    <div class="card-content">
                     <div class="content">${note.text}</div>
                   </div>
                   <div class="card-content">
                     <div class="content">${user.displayName}</div>
                   </div>
                 </div>
               </div>
           </div> `
*/