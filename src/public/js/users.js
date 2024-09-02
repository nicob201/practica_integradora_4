// Logica para manejo y cambio de roles de usuarios
document.addEventListener("DOMContentLoaded", () => {
  const confirmRoleChangeButtons = document.querySelectorAll(".confirm-role-change");

  confirmRoleChangeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");

      if (!userId) {
        console.error("User ID is missing!");
        return;
      }

      const selectedRadio = document.querySelector(`input[name="role-${userId}"]:checked`);
      const selectedRole = selectedRadio ? selectedRadio.value : null;

      fetch(`/api/users/premium/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole: selectedRole }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Role Updated",
              timer: 2200,
              didClose: () => {
                location.reload();
              },
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed to Change Role",
              text: data.error,
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  });
});
