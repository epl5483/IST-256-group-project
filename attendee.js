const STORAGE_KEY = 'conference_attendees';

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
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Invalid email format';
                }
                break;

            case 'contactNumber':
                if (value.length > 0 && value.length !== 7) {
                    isValid = false;
                    errorMessage = 'Number must be 7 digits';
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
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        gradeLevel: formData.get('gradeLevel'),
        institution: formData.get('institution'),
        contactNumber: formData.get('contactNumber') || "Not provided"
    };
}

function saveFormDataLocally(formData) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    existing.push(formData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

function displayAllAttendees() {
    const container = document.getElementById('userCard');
    const attendees = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    container.innerHTML = "";

    attendees.forEach((attendee, index) => {
        container.innerHTML += `
            <div class="card mb-3 p-3">
                <h5>${attendee.fullName}</h5>
                <p>Email: ${attendee.email}</p>
                <p>Grade Level: ${attendee.gradeLevel}</p>
                <p>Institution: ${attendee.institution}</p>
                <p>Contact Number: ${attendee.contactNumber}</p>
                <button class="btn btn-danger" onclick="deleteAttendee(${index})">Delete</button>
            </div>
        `;
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
        alert("Please correct the errors before submitting.");
        return;
    }

    const formData = getFormData(formElement);
    saveFormDataLocally(formData);

    alert("Attendee successfully registered!");

    displayAllAttendees();
    formElement.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm').addEventListener('submit', handleSignupSubmit);
    displayAllAttendees();
});
