// Logica para formulario de nueva contraseña
const resetButton = document.getElementById("reset-button");
if (resetButton) {
  document
    .getElementById("reset-button")
    .addEventListener("click", async function (event) {
      event.preventDefault();
      await Swal.fire({
        icon: "success",
        title: "Password Reset Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      document.querySelector("form").submit();
    });
}

// Logica para formulario de Reseteo de contraseña
const resetForm = document.getElementById("reset-form");

if (resetForm) {
  resetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get("email");

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Email sent!",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          if (data.redirect) {
            window.location.href = data.redirect;
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send email!",
          showConfirmButton: false,
          timer: 2000,
        });
      });
  });
}
