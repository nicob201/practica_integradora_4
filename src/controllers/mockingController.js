import { faker } from "@faker-js/faker";

// Funcion que genera 100 productos aleatorios
export function getMockProducts(req, res) {
  const mockProducts = [];

  for (let i = 0; i < 100; i++) {
    const product = {
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      thumbnail: faker.image.url(),
      code: faker.string.alphanumeric(10),
      status: true,
      stock: faker.number.int({ min: 1, max: 15 }),
    };

    mockProducts.push(product);
  }

  res.send({ status: "success", payload: mockProducts });
}
