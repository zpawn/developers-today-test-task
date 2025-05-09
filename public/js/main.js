const saveHolidays = document.querySelector("#save-holidays");
const countryForm = document.querySelector("#country-form");
const holidaysForm = document.querySelector("#save-holidays-form");

saveHolidays?.addEventListener('click', async (e) => {
  e.preventDefault();

  const countyInfoForm = new FormData(countryForm);
  const formData = new FormData(holidaysForm);
  const selectedHolidays = countyInfoForm.getAll('selectedHolidays[]');
  const _csrf = formData.get("_csrf");

  fetch("/save-holidays", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": _csrf,
    },
    body: JSON.stringify({ selectedHolidays }),
  })
  .then((res) => res.json())
  .then((data) => console.log(">>> then:", data))
  .catch((data) => console.log(">>> catch:", data));
})
