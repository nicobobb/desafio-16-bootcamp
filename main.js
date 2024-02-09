const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const dateInput = document.getElementById("date");
const addForm = document.getElementById("addForm");
const contactElement = document.getElementById("contact");
const editFormModal = document.getElementById("editFormModal");
const editForm = document.getElementById("editForm");
const nameEdit = document.getElementById("nameEdit");
const emailEdit = document.getElementById("emailEdit");
const dateEdit = document.getElementById("dateEdit");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const dateError = document.getElementById("dateError");
const nameEditError = document.getElementById("nameEditError");
const emailEditError = document.getElementById("emailEditError");
const dateEditError = document.getElementById("dateEditError");
const successModal = document.getElementById("successModal");

const closeSuccessModal = document.querySelector("#successModal .close");

const showSuccessModal = (message) => {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successModal.style.display = "block";
};

const hideSuccessModal = () => {
    successModal.style.display = "none";
};

closeSuccessModal.addEventListener("click", () => {
    hideSuccessModal();
});

window.addEventListener("click", (event) => {
    if (event.target === successModal) {
        hideSuccessModal();
    }
});

const validationName = (name) => {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]{2,20}(?:\s[a-zA-ZÀ-ÖØ-öø-ÿ]{2,20})?$/;
    return regex.test(name);
};

const validationEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validationDate = (dateStr) => {
    const regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(dateStr);
};

const showModalEdit = (isVisibled) => {
    if (isVisibled) {
        editForm.style.opacity = "1";
        editFormModal.style.display = "block";
    } else {
        editForm.style.opacity = "0";
        editFormModal.style.display = "none";
    }
};

class Contact {
    constructor(id, name, mail, date) {
        this.id = id;
        this.name = name;
        this.mail = mail;
        this.date = date;
    }

    getHtmlContact() {
        const dateParts = this.date.split("-");
        const formattedDate =
            dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
        return `
        <div class="contact__container">
                <div class="info__container">
                    <h2 class="info__name">${this.name}</h2>
                    <h3 class="info__mail">${this.mail}</h3>
                    <h3 class="info__date">${formattedDate}</h3>
                </div>
                <div class="button__container">
                    <i class="fa-solid fa-pen-to-square" data-id="${this.id}"></i>
                    <i class="fa-solid fa-trash-can" data-id="${this.id}"></i>
                </div>
            </div>
        `;
    }
}

const storedContacts = localStorage.getItem("allContacts");
let allContacts = [];
let idContact = "";

if (storedContacts) {
    allContacts = JSON.parse(storedContacts).map((contactData) => {
        return new Contact(
            contactData.id,
            contactData.name,
            contactData.mail,
            contactData.date
        );
    });
}

addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let validated = true;
    const name = nameInput.value;
    const mail = emailInput.value;
    const date = dateInput.value;

    if (!validationName(name)) {
        nameError.textContent = "El nombre no es válido.";
        nameError.style.opacity = "1";
        validated = false;
    } else {
        nameError.textContent = "";
        nameError.style.opacity = "0";
    }

    if (!validationEmail(mail)) {
        emailError.textContent = "El email no es válido.";
        emailError.style.opacity = "1";
        validated = false;
    } else {
        emailError.textContent = "";
        emailError.style.opacity = "0";
    }

    if (!validationDate(date)) {
        dateError.textContent = "La fecha no es válida.";
        dateError.style.opacity = "1";
        validated = false;
    } else {
        dateError.textContent = "";
        dateError.style.opacity = "0";
    }

    if (validated) {
        let newContact = new Contact(randomId(), name, mail, date);

        allContacts.push(newContact);
        localStorage.setItem("allContacts", JSON.stringify(allContacts));

        addForm.reset();
        renderContacts();
        showSuccessModal("Se guardó bien 😎");
    }
});

const renderContacts = () => {
    if (allContacts.length === 0) {
        contactElement.innerHTML = `<p class="msjEmpty">Todavía no tiene un contacto guardado</p>`;
    } else {
        contactElement.innerHTML = "";
        allContacts.forEach((contact) => {
            const contactHtml = contact.getHtmlContact();
            contactElement.innerHTML += contactHtml;
        });
    }
};

const randomId = () => {
    return Math.random().toString(36).slice(2, 11);
};

const editContact = (contactId) => {
    showModalEdit(true);
    allContacts.map((contact) => {
        if (contact.id === contactId) {
            idContact = contact.id;
            nameEdit.value = contact.name;
            emailEdit.value = contact.mail;
            dateEdit.value = contact.date;
        }
    });
};

const deleteContact = (contactId) => {
    allContacts = allContacts.filter((contact) => contact.id !== contactId);
    localStorage.setItem("allContacts", JSON.stringify(allContacts));
    renderContacts();
    showSuccessModal("Lo borraste 🗑");
};

renderContacts();

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-pen-to-square")) {
        const contactId = event.target.dataset.id;
        editContact(contactId);
    } else if (event.target.classList.contains("fa-trash-can")) {
        const contactId = event.target.dataset.id;
        deleteContact(contactId);
    }
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let validated = true;
    const newName = nameEdit.value;
    const newMail = emailEdit.value;
    const newDate = dateEdit.value;

    if (!validationName(newName)) {
        nameEditError.textContent = "El nombre no es válido.";
        nameEditError.style.opacity = "1";

        validated = false;
    } else {
        nameEditError.textContent = "";
        nameEditError.style.opacity = "0";
    }

    if (!validationEmail(newMail)) {
        emailEditError.textContent = "El email no es válido.";
        emailEditError.style.opacity = "1";
        validated = false;
    } else {
        emailEditError.textContent = "";
        emailEditError.style.opacity = "0";
    }

    if (!validationDate(newDate)) {
        dateEditError.textContent = "La fecha no es válida.";
        dateEditError.style.opacity = "1";
        validated = false;
    } else {
        dateEditError.textContent = "";
        dateEditError.style.opacity = "0";
    }

    if (validated) {
        allContacts.forEach((c) => {
            if (c.id === idContact) {
                c.name = newName;
                c.mail = newMail;
                c.date = newDate;
            }
        });
        localStorage.setItem("allContacts", JSON.stringify(allContacts));
        renderContacts();
        showModalEdit(false);
        showSuccessModal("Se actualizó bien 😁");
    }
});
