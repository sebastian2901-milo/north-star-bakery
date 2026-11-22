"use strict";

const form = document.querySelector("form");
const fields = Object.fromEntries(
  ["name", "email", "type", "pickup", "details"].map((id) => [id, document.getElementById(id)])
);
const status = document.querySelector("#form-status");
const checks = {
  name: () => fields.name.value.trim() ? "" : "Enter your name.",
  email: () => !fields.email.value.trim() ? "Enter your email address." :
    fields.email.validity.typeMismatch ? "Enter an email like name@example.com." : "",
  type: () => fields.type.value ? "" : "Choose a request type.",
  pickup: () => fields.type.value === "preorder" && !fields.pickup.value ? "Choose a pickup date for your preorder." : "",
  details: () => fields.details.value.trim().length >= 10 ? "" : "Enter at least 10 characters with your item details or question."
};

function showError(id) {
  const field = fields[id];
  const message = checks[id]();
  const error = document.getElementById(`${id}-error`);
  error.textContent = message;
  error.hidden = !message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
  return !message;
}

function prefillFavorites() {
  if (new URLSearchParams(location.search).get("favorites") !== "1") return;
  const favorites = readFavorites();
  if (!favorites.length || fields.details.value) return;
  fields.type.value = "preorder";
  fields.details.value = `Interested in: ${favorites.map((id) => catalog[id]).join(", ")}.`;
}

prefillFavorites();
form.noValidate = true;
Object.entries(fields).forEach(([id, field]) => {
  const error = document.createElement("p");
  error.id = `${id}-error`;
  error.className = "field-error";
  error.hidden = true;
  field.after(error);
  field.setAttribute("aria-describedby", error.id);
});

form.addEventListener("input", (event) => {
  status.textContent = "";
  const id = event.target.id;
  if (Object.hasOwn(checks, id) && event.target.hasAttribute("aria-invalid")) showError(id);
  if (id === "type" && fields.pickup.hasAttribute("aria-invalid")) showError("pickup");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const invalid = Object.keys(checks).filter((id) => !showError(id));
  if (invalid.length) {
    status.textContent = "";
    fields[invalid[0]].focus();
    return;
  }
  status.textContent = "Your sample request passed validation. This demo sends no orders.";
});
