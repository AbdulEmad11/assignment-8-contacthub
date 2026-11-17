var contacts = [];
var editId = null;

var savedData = localStorage.getItem("contacts");
if (savedData !== null) {
  contacts = JSON.parse(savedData);
}

var modal = document.getElementById("contactModal");
var form = document.getElementById("contactForm");
var nameInput = document.getElementById("name");
var phoneInput = document.getElementById("phone");
var emailInput = document.getElementById("email");
var favCheck = document.getElementById("isFav");
var emgCheck = document.getElementById("isEmg");
var searchInput = document.getElementById("searchInput");

function saveToStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function cleanText(text) {
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  text = text.replace(/"/g, "&quot;");
  return text;
}

function getInitials(name) {
  var words = name.trim().split(" ");
  var letters = words[0][0];
  if (words.length > 1) {
    letters = letters + words[1][0];
  }
  return letters.toUpperCase();
}

function showMessage(type, title) {
  Swal.fire({
    icon: type,
    title: title,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: "top-end"
  });
}

function makeBigCard(contact) {
  var star = "";
  var heart = "";
  var favClass = "";
  var emgClass = "";

  if (contact.fav) {
    star = '<i class="fa-solid fa-star"></i>';
    favClass = "on-fav";
  }
  if (contact.emg) {
    heart = '<i class="fa-solid fa-heart-pulse"></i>';
    emgClass = "on-emg";
  }

  var html = "";
  html += '<div class="contact-card">';
  html += '  <div class="avatar">' + getInitials(contact.name) + "</div>";
  html += '  <div class="contact-info">';
  html += "    <h4>" + cleanText(contact.name) + " " + star + " " + heart + "</h4>";
  html += '    <p><i class="fa-solid fa-phone"></i> <span class="num">' + cleanText(contact.phone) + "</span></p>";
  html += '    <p><i class="fa-solid fa-envelope"></i> ' + cleanText(contact.email) + "</p>";
  html += "  </div>";
  html += '  <div class="card-actions">';
  html += '    <a class="act call" href="tel:' + cleanText(contact.phone) + '"><i class="fa-solid fa-phone"></i></a>';
  html += '    <a class="act mail" href="mailto:' + cleanText(contact.email) + '"><i class="fa-solid fa-envelope"></i></a>';
  html += '    <button class="act ' + favClass + '" onclick="toggleFav(' + contact.id + ')"><i class="fa-solid fa-star"></i></button>';
  html += '    <button class="act ' + emgClass + '" onclick="toggleEmg(' + contact.id + ')"><i class="fa-solid fa-heart-pulse"></i></button>';
  html += '    <button class="act" onclick="editContact(' + contact.id + ')"><i class="fa-solid fa-pen"></i></button>';
  html += '    <button class="act del" onclick="deleteContact(' + contact.id + ')"><i class="fa-solid fa-trash"></i></button>';
  html += "  </div>";
  html += "</div>";
  return html;
}

function makeSmallCard(contact) {
  var html = "";
  html += '<div class="mini">';
  html += '  <div class="avatar">' + getInitials(contact.name) + "</div>";
  html += '  <div class="contact-info">';
  html += "    <h4>" + cleanText(contact.name) + "</h4>";
  html += "    <p>" + cleanText(contact.phone) + "</p>";
  html += "  </div>";
  html += '  <a class="act call" href="tel:' + cleanText(contact.phone) + '"><i class="fa-solid fa-phone"></i></a>';
  html += '  <a class="act mail" href="mailto:' + cleanText(contact.email) + '"><i class="fa-solid fa-envelope"></i></a>';
  html += "</div>";
  return html;
}

function showContacts() {
  var searchText = searchInput.value.trim().toLowerCase();
  var bigHtml = "";
  var favHtml = "";
  var emgHtml = "";
  var shownCount = 0;
  var favCount = 0;
  var emgCount = 0;

  for (var i = 0; i < contacts.length; i++) {
    var c = contacts[i];

    var nameMatch = c.name.toLowerCase().includes(searchText);
    var phoneMatch = c.phone.toLowerCase().includes(searchText);
    var emailMatch = c.email.toLowerCase().includes(searchText);

    if (nameMatch || phoneMatch || emailMatch) {
      bigHtml += makeBigCard(c);
      shownCount++;
    }
    if (c.fav) {
      favHtml += makeSmallCard(c);
      favCount++;
    }
    if (c.emg) {
      emgHtml += makeSmallCard(c);
      emgCount++;
    }
  }

  if (favCount === 0) {
    favHtml = '<p class="side-empty">No favorites yet</p>';
  }
  if (emgCount === 0) {
    emgHtml = '<p class="side-empty">No emergency contacts</p>';
  }

  document.getElementById("contactsList").innerHTML = bigHtml;
  document.getElementById("favList").innerHTML = favHtml;
  document.getElementById("emgList").innerHTML = emgHtml;

  if (shownCount === 0) {
    document.getElementById("emptyState").style.display = "block";
  } else {
    document.getElementById("emptyState").style.display = "none";
  }

  document.getElementById("totalCount").innerHTML = contacts.length;
  document.getElementById("subCount").innerHTML = contacts.length;
  document.getElementById("favCount").innerHTML = favCount;
  document.getElementById("emgCount").innerHTML = emgCount;
}

function findContact(id) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].id === id) {
      return contacts[i];
    }
  }
  return null;
}

function clearErrors() {
  document.getElementById("nameError").innerHTML = "";
  document.getElementById("phoneError").innerHTML = "";
  document.getElementById("emailError").innerHTML = "";
  nameInput.classList.remove("invalid");
  phoneInput.classList.remove("invalid");
  emailInput.classList.remove("invalid");
}

function showError(errorId, input, message) {
  document.getElementById(errorId).innerHTML = message;
  input.classList.add("invalid");
}

function openModal() {
  clearErrors();
  editId = null;
  document.getElementById("modalTitle").innerHTML = "Add Contact";
  document.getElementById("saveBtn").innerHTML = "Save contact";
  form.reset();
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
}

function editContact(id) {
  var contact = findContact(id);
  clearErrors();
  editId = id;
  document.getElementById("modalTitle").innerHTML = "Edit Contact";
  document.getElementById("saveBtn").innerHTML = "Update contact";
  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
  emailInput.value = contact.email;
  favCheck.checked = contact.fav;
  emgCheck.checked = contact.emg;
  modal.classList.add("open");
}

function toggleFav(id) {
  var contact = findContact(id);
  contact.fav = !contact.fav;
  saveToStorage();
  showContacts();
  if (contact.fav) {
    showMessage("success", "Added to favorites");
  } else {
    showMessage("success", "Removed from favorites");
  }
}

function toggleEmg(id) {
  var contact = findContact(id);
  contact.emg = !contact.emg;
  saveToStorage();
  showContacts();
  if (contact.emg) {
    showMessage("success", "Added to emergency");
  } else {
    showMessage("success", "Removed from emergency");
  }
}

function deleteContact(id) {
  var contact = findContact(id);

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete " + contact.name + "?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it"
  }).then(function (result) {
    if (result.isConfirmed) {
      var newList = [];
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].id !== id) {
          newList.push(contacts[i]);
        }
      }
      contacts = newList;
      saveToStorage();
      showContacts();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

function isValid() {
  clearErrors();
  var valid = true;

  var name = nameInput.value.trim();
  var phone = phoneInput.value.trim().replace(/ /g, "");
  var email = emailInput.value.trim();

  if (name.length < 2) {
    showError("nameError", nameInput, "Name must be at least 2 characters.");
    valid = false;
  }

  var phonePattern = /^\+?[0-9]{8,15}$/;
  if (!phonePattern.test(phone)) {
    showError("phoneError", phoneInput, "Enter a valid phone number (8 to 15 digits).");
    valid = false;
  } else {
    for (var i = 0; i < contacts.length; i++) {
      var samePhone = contacts[i].phone.replace(/ /g, "") === phone;
      var otherContact = contacts[i].id !== editId;
      if (samePhone && otherContact) {
        showError("phoneError", phoneInput, "This phone number already exists.");
        valid = false;
      }
    }
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(email)) {
    showError("emailError", emailInput, "Enter a valid email address.");
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (isValid() === false) {
    return;
  }

  var name = nameInput.value.trim();
  var phone = phoneInput.value.trim();
  var email = emailInput.value.trim();

  if (editId === null) {
    var newContact = {
      id: Date.now(),
      name: name,
      phone: phone,
      email: email,
      fav: favCheck.checked,
      emg: emgCheck.checked
    };
    contacts.push(newContact);
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: name + " was added successfully.",
      confirmButtonColor: "#7c3aed"
    });
  } else {
    var contact = findContact(editId);
    contact.name = name;
    contact.phone = phone;
    contact.email = email;
    contact.fav = favCheck.checked;
    contact.emg = emgCheck.checked;
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: name + " was updated successfully.",
      confirmButtonColor: "#7c3aed"
    });
  }

  saveToStorage();
  showContacts();
  closeModal();
});

document.getElementById("openModalBtn").addEventListener("click", openModal);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
searchInput.addEventListener("input", showContacts);

showContacts();