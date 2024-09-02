import userModel from '../dao/models/userModel.js';
import { UserDTO } from '../dao/DTOs/usersDTO.js';
import CustomError from './customError.js';
import EErrors from './enums.js';
import { generateUserErrorInfo } from './info.js';


// Crea un nuevo usuario
async function createUser(createUserDTO) {
  const { first_name, last_name, email, age } = createUserDTO;

  if (!first_name || !last_name || !email) {
    throw CustomError.createError({
      name: "User creation error",
      cause: generateUserErrorInfo(createUserDTO),
      message: "Error trying to create user",
      code: EErrors.INVALID_TYPES_ERROR
    });
  }

  const user = new userModel(createUserDTO);
  await user.save();
  return new UserDTO(user);
}

// Devuelve todos los usuarios registrados
async function getAllUsers() {
  const users = await userModel.find();
  return users.map(user => new UserDTO(user));
}

// Devuelve un usuario dado su Id
async function getUserById(uid) {
  const user = await userModel.findById(uid);
  return user ? new UserDTO(user) : null;
}

// Elimina un usuario dado su Id
async function deleteUserById(uid) {
  const user = await userModel.findByIdAndDelete(uid);
  return user ? new UserDTO(user) : null;
}

// Cambia el rol del usuario dado su Id
async function changeUserRole(uid, newRole) {
  const user = await userModel.findByIdAndUpdate(uid, { role: newRole }, { new: true });
  return user ? new UserDTO(user) : null;
}

// Actualiza el modelo User con los documentos cargados
async function updateUserDocuments(uid, documents) {
  return await userModel.findByIdAndUpdate(
    uid,
    { $push: { documents: { $each: documents } } },
    { new: true }
  );
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  changeUserRole,
  updateUserDocuments,
};
