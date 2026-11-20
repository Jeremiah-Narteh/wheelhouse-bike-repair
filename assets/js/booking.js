/* =========================================================
   FORMS
   Two forms, two jobs:
   - Booking form: "I want a repair done."
   - Quick question form: "I just want to ask something."
   Both check their fields, show a clear message next to anything
   missing, then open WhatsApp with the answers filled in.
   ========================================================= */

const shopWhatsApp = "https://wa.me/233244000001?text=";

/* Checks a list of fields. Shared by both forms, so the checking
   rules only live in one place.
   - fields:   the inputs to check
   - messages: one message per field, keyed by the field's id
   Shows a message under each empty field, marks it aria-invalid,
   and moves the cursor to the first problem.
   Returns true when every field is filled in. */
function checkFields(fields, messages) {
  let firstProblem = null;

  for (const field of fields) {
    // "required" accepts a field that holds only spaces, so trim
    // text first and treat a blank answer as empty. (A <select>
    // can't hold spaces, so it is skipped.)
    if (field.tagName !== "SELECT") {
      field.value = field.value.trim();
    }

    const errorSpan = document.querySelector("#" + field.id + "-error");

    if (!field.checkValidity()) {
      // Show the message and mark the field as wrong.
      errorSpan.textContent = messages[field.id];
      field.setAttribute("aria-invalid", "true");

      // Remember the first wrong field so we can send the cursor there.
      if (!firstProblem) {
        firstProblem = field;
      }
    } else {
      // Field is fine: clear any old message.
      errorSpan.textContent = "";
      field.removeAttribute("aria-invalid");
    }
  }

  if (firstProblem) {
    firstProblem.focus();
    return false;
  }

  return true;
}

/* ---------- Form 1: booking ---------- */

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameField = document.querySelector("#name");
    const phoneField = document.querySelector("#phone");
    const bikeSelect = document.querySelector("#bike-type");
    const needField = document.querySelector("#need");

    // One clear message per field (tells the visitor how to fix it).
    const allFilledIn = checkFields(
      [nameField, phoneField, bikeSelect, needField],
      {
        name: "Please enter your name",
        phone: "Please enter your contact number",
        "bike-type": "Please select a bike type",
        need: "Please enter what's wrong with the bike",
      }
    );

    if (!allFilledIn) {
      return;
    }

    const bikeType = bikeSelect.options[bikeSelect.selectedIndex].text;

    const message =
      "Hello Wheelhouse, I'd like to book a repair.\n" +
      `Name: ${nameField.value}\n` +
      `Phone: ${phoneField.value}\n` +
      `Bike type: ${bikeType}\n` +
      `Need: ${needField.value}`;

    window.location.href = shopWhatsApp + encodeURIComponent(message);
  });
}

/* ---------- Form 2: quick question ---------- */

const questionForm = document.querySelector("#question-form");

if (questionForm) {
  questionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameField = document.querySelector("#q-name");
    const questionField = document.querySelector("#question");

    const allFilledIn = checkFields([nameField, questionField], {
      "q-name": "Please enter your name",
      question: "Please type your question",
    });

    if (!allFilledIn) {
      return;
    }

    const message =
      "Hello Wheelhouse, I have a question.\n" +
      `Name: ${nameField.value}\n` +
      `Question: ${questionField.value}`;

    window.location.href = shopWhatsApp + encodeURIComponent(message);
  });
}
