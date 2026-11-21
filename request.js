const form = document.querySelector("form");
const requestType = document.querySelector("#type");
const pickup = document.querySelector("#pickup");
const status = document.querySelector("#form-status");

requestType.addEventListener("change", () => {
  pickup.required = requestType.value === "preorder";
});

form.addEventListener("input", () => {
  status.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "Your sample request passed validation. This demo sends no orders.";
});
