const STORAGE_KEY = 'conference_attendees';

function updateBox(form, errorElement, isValid, errorMessage) {
    if (isValid) {
        form.classList.add('is-valid');
        form.classList.remove('is-invalid');
        errorElement.textContent = "";
        errorElement.classList.remove('show');
    } else {
        form.classList.add('is-invalid');
        form.classList.remove('is-valid');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
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
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Invalid email, please enter a valid email';
                }
                break;

            case 'contactNumber':
                if (value.length > 0 && value.length !== 10) {
                    isValid = false;
                    errorMessage = 'Invalid number, number must be 7 digits';
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
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return {
        fullName: data.fullName,
        email: data.email,
        gradeLevel: data.gradeLevel,
        institution: data.institution,
        contactNumber: data.contactNumber || null
    };
}

function saveFormDataLocally(formData) {
    try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        existing.push(formData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        return true;
    } catch (error) {
        console.log('Error saving to local storage:', error);
        return false;
    }
}

function displayAllAttendees() {
    const container = document.getElementById('userCard');
    const attendees = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    container.innerHTML = "";

    attendees.forEach((attendee, index) => {
        const cardHtml = `
            <div class="card mb-3 p-3">
                <h5>${attendee.fullName}</h5>
                <p>Email: ${attendee.email}</p>
                <p>Grade Level: ${attendee.gradeLevel}</p>
                <p>Institution: ${attendee.institution}</p>
                <p>Contact Number: ${attendee.contactNumber || "Not provided"}</p>
                <button class="btn btn-danger" onclick="deleteAttendee(${index})">Delete</button>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function deleteAttendee(index) {
    const attendees = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    attendees.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
    displayAllAttendees();
}

function handleSignupSubmit(event) {
    event.preventDefault();

    const formElement = document.getElementById("signupForm");

    if (!validateForm(formElement)) {
        return;
    }

    const formData = getFormData(formElement);

    if (saveFormDataLocally(formData)) {
        window.alert('Attendee successfully registered!');
    } else {
        window.alert('Registration failed.');
    }

    displayAllAttendees();
    formElement.reset();
}

function initializeApp() {
    document.getElementById('signupForm').addEventListener('submit', handleSignupSubmit);
    displayAllAttendees();
}

document.addEventListener('DOMContentLoaded', initializeApp);
