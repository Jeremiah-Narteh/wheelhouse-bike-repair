/* =========================================================
   FORMS
   Two forms, two jobs:
   - Booking form: "I want a repair done."
   - Quick question form: "I just want to ask something."
   Both check their fields, show a clear message next to anything
   missing, then open WhatsApp with the answers filled in.
   ========================================================= */

const shopWhatsApp = "https://wa.me/233244000001?text=";

/* Checks a form's fields. Shared by both forms, so the checking
   rules only live in one place.
   - checks: one entry per field: { field, errorSpan, message }
   Shows the message under each empty field, marks it aria-invalid,
   and moves the cursor to the first problem.
   Returns true when every field is filled in. */
function checkFields(checks) {
  let firstProblem = null;

  for (const check of checks) {
    const field = check.field;

    // "required" accepts a field that holds only spaces, so trim
    // text first and treat a blank answer as empty. (A <select>
    // can't hold spaces, so it is skipped.)
    if (field.tagName !== "SELECT") {
      field.value = field.value.trim();
    }

    if (!field.checkValidity()) {
      // Show the message and mark the field as wrong. If the message
      // space is missing from the HTML, the field is still marked and
      // focused; only the written message is skipped.
      if (check.errorSpan) {
        check.errorSpan.textContent = check.message;
      }
      field.setAttribute("aria-invalid", "true");

      // Remember the first wrong field so we can send the cursor there.
      if (!firstProblem) {
        firstProblem = field;
      }
    } else {
      // Field is fine: clear any old message.
      if (check.errorSpan) {
        check.errorSpan.textContent = "";
      }
      field.removeAttribute("aria-invalid");
    }
  }

  if (firstProblem) {
    firstProblem.focus();
    return false;
  }

  return true;
}

/* Sets up one form. Runs once, when the page loads.
   - formId:        the form's id
   - fieldMessages: { fieldId: "message if empty" }, in page order
   - buildMessage:  turns the fields into the WhatsApp message
   Every field and its message space is looked up here, once, not
   again on every submit. */
function setUpWhatsAppForm(formId, fieldMessages, buildMessage) {
  const form = document.querySelector("#" + formId);
  if (!form) {
    return;
  }

  const fields = {}; // fields by id, for buildMessage
  const checks = []; // fields in page order, for checkFields

  for (const id of Object.keys(fieldMessages)) {
    const field = document.querySelector("#" + id);
    if (!field) {
      // The HTML doesn't match this script: leave the form alone
      // rather than crash.
      return;
    }

    fields[id] = field;
    checks.push({
      field: field,
      errorSpan: document.querySelector("#" + id + "-error"),
      message: fieldMessages[id],
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!checkFields(checks)) {
      return;
    }

    window.location.href =
      shopWhatsApp + encodeURIComponent(buildMessage(fields));
  });
}

/* ---------- Form 1: booking ---------- */

setUpWhatsAppForm(
  "booking-form",
  {
    name: "Please enter your name",
    phone: "Please enter your contact number",
    "bike-type": "Please select a bike type",
    need: "Please enter what's wrong with the bike",
  },
  function (fields) {
    // Send the words the visitor chose ("Child's bike"), not the code
    // ("kids"). checkFields has already made sure a bike type is
    // chosen; the fallback to the code is just a safety net.
    const bikeSelect = fields["bike-type"];
    const chosenOption = bikeSelect.selectedOptions[0];
    const bikeType = chosenOption ? chosenOption.text : bikeSelect.value;

    return (
      "Hello Wheelhouse, I'd like to book a repair.\n" +
      `Name: ${fields.name.value}\n` +
      `Phone: ${fields.phone.value}\n` +
      `Bike type: ${bikeType}\n` +
      `Need: ${fields.need.value}`
    );
  }
);

/* ---------- Form 2: quick question ---------- */

setUpWhatsAppForm(
  "question-form",
  {
    "q-name": "Please enter your name",
    question: "Please type your question",
  },
  function (fields) {
    return (
      "Hello Wheelhouse, I have a question.\n" +
      `Name: ${fields["q-name"].value}\n` +
      `Question: ${fields.question.value}`
    );
  }
);
