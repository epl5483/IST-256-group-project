const STORAGE_KEY = 'conference_attendee';

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

    // Required check
    if (form.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This is a required field';
    }

    // Field-specific validation
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
                if (value.length > 0 && value.length != 7) {
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
        contactNumber: data.contactNumber || null,
    };
}

function saveFormDataLocally(formData) {
    try {
        const attendeeJSON = JSON.stringify(formData);
        local.setItem(STORAGE_KEY, attendeeJSON);
        console.log('Saved successfully!');
        return true;
    } catch (error) {
        console.log('Error saving to local storage:', error);
        return false;
    }
}

function displayAttendeeCard(attendeeData) {
    const container = document.getElementById('userCard');

    let cardHtml = `
        <div class="card">
            <div>
                <h5>${attendeeData.fullName}</h5>
                <p>Email: ${attendeeData.email}</p>
                <p>Grade Level: ${attendeeData.gradeLevel}</p>
                <p>Institution: ${attendeeData.institution}</p>
                <p>Contact Number: ${attendeeData.contactNumber || "Not provided"}</p>
                <button class="btn btn-danger">Delete Attendee</button>
            </div>
        </div>
    `;

    container.innerHTML = cardHtml;
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

    displayAttendeeCard(formData);
}

function initializeApp() {
    document.getElementById('signupForm').addEventListener('submit', handleSignupSubmit);
}

document.addEventListener('DOMContentLoaded', initializeApp);
