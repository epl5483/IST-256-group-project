const STORAGE_KEY = 'conference_session';
let editIndex = null;

function updateBox(form, errorElement, isValid, errorMessage) {
    if (isValid) {
        form.classList.add('is-valid');
        form.classList.remove('is-invalid');
        errorElement.textContent = "";
    } else {
        form.classList.add('is-invalid');
        form.classList.remove('is-valid');
        errorElement.textContent = errorMessage;
    }
}

function validateField(form) {
    const fieldId = form.id;
    const value = form.value.trim();
    const errorElement = document.getElementById(fieldId + 'Error');

    let isValid = true;
    let errorMessage = "";

    if (form.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This is a required field';
    }

    if (isValid && value !== '') {
        switch (fieldId) {
            case 'sessionID':
                if (value.length < 4) {
                    isValid = false;
                    errorMessage = 'Session ID must be at least 4 characters';
                }
                break;

            case 'sessionTitle':
                if (value.length < 4) {
                    isValid = false;
                    errorMessage = 'Title must be at least 4 characters';
                }
                break;

            case 'workshop':
                if (value.length < 4) {
                    isValid = false;
                    errorMessage = 'Workshop must be at least 4 characters';
                }
                break;
            
            case 'duration':
                if (value.length < 1) {
                    isValid = false;
                    errorMessage = 'duration must be at least 1 character';
                }
                break;

            case 'registrationFee':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Registration Fee must be at least 2 characters';
                }
                break;

            case 'speaker':
                if (value.length < 4) {
                    isValid = false;
                    errorMessage = 'Speaker must be at least 4 characters';
                }
                break;
        }
    }

    updateBox(form, errorElement, isValid, errorMessage);
    return isValid;
}

function validateForm(formElement) {
    let isValid = true;
    const inputs = formElement.querySelectorAll('input, select');

    inputs.forEach(form => {
        if (!validateField(form)) {
            isValid = false;
        }
    });

    return isValid;
}

function getFormData(formElement) {
    const formData = new FormData(formElement);
    return {
        sessionID: formData.get('sessionID'),
        sessionTitle: formData.get('sessionTitle'),
        workshop: formData.get('workshop'),
        duration: formData.get('duration'),
        registrationFee: formData.get('registrationFee'),
        speaker: formData.get('speaker'),
        additionalInfo: formData.get('additionalInfo') || "Not provided"
    };
}

function saveFormDataLocally(formData) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    existing.push(formData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

function displayAllSessions(list = null) {
    const container = document.getElementById('sessionCard');
    const sessions = list || JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    container.innerHTML = "";

    sessions.forEach((session, index) => {
        container.innerHTML += `
            <div class="card mb-3 p-3">
                <h5>${session.sessionID}</h5>
                <p>SessionTitle: ${session.sessionTitle}</p>
                <p>Workshop: ${session.workshop}</p>
                <p>Duration: ${session.duration}</p>
                <p>Registration Fee: ${session.registrationFee}</p>
                <p>Speaker: ${session.speaker}</p>
                <p>Additional Info: ${session.additionalInfo}</p>
                <button class="btn btn-warning me-2" onclick="editSession(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deleteSession(${index})">Delete</button>
            </div>
        `;
    });
}

function searchSessions() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const filtered = sessions.filter(session =>
        session.sessionID.toLowerCase().includes(query) ||
        session.sessionTitle.toLowerCase().includes(query) ||
        session.workshop.toLowerCase().includes(query) ||
        session.speaker.toLowerCase().includes(query)
    );

    displayAllSessions(filtered);
}

function deleteSession(index) {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    sessions.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    displayAllSessions();
}

function editSession(index) {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const s = sessions[index];

    document.getElementById('sessionID').value = s.sessionID;
    document.getElementById('sessionTitle').value = s.sessionTitle;
    document.getElementById('workshop').value = s.workshop;
    document.getElementById('duration').value = s.duration;
    document.getElementById('registrationFee').value = s.registrationFee;
    document.getElementById('speaker').value = s.speaker;
    document.getElementById('additionalInfo').value = s.additionalInfo;
    editIndex = index;
}


function handleSignupSubmit(event) {
    event.preventDefault();
    const formElement = document.getElementById("signupForm");
    if (!validateForm(formElement)) {
        alert("Please correct the errors before submitting.");
        return;
    }
    const formData = getFormData(formElement);
    let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (editIndex !== null) {
        sessions[editIndex] = formData;
        editIndex = null;
        alert("Session updated successfully!");
    } else {
        sessions.push(formData);
        alert("Session successfully registered!");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    displayAllSessions();
    formElement.reset();
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm').addEventListener('submit', handleSignupSubmit);
    displayAllSessions();
});
