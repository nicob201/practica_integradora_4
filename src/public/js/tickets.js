// Funcion para crear un ticket (fetch al backend)
async function createTicket(cartId) {
  try {
    const response = await fetch(`/api/tickets/${cartId}`, {
      method: "POST",
    });
    if (response.ok) {
      console.log("Ticket created successfully!");
    } else {
      console.error("Failed to create ticket!");
    }
  } catch (error) {
    console.error("Error creating ticket!:", error);
  }
}

// Selecciona todos los botones de purchase y llama a la funcion createTicket
document.querySelectorAll('button[id^="purchaseButton-"]').forEach((button) => {
  button.addEventListener("click", async function () {
    const cartId = button.getAttribute("data-id");
    await createTicket(cartId);
  });
});
