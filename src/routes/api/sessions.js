import { response, Router } from "express";
import usersCollection from "../../dao/models/userModel.js";
import cartModel from "../../dao/models/cartModel.js";
import { createHash, generateResetToken } from "../../utils/utils.js";
import { sendResetEmail } from "../../services/emailService.js";
import passport from "passport";
import { CurrentUserDTO } from "../../dao/DTOs/usersDTO.js";

const router = Router();

// Router para registro de usuarios
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.get("/failregister", async (req, res) => {
  res.send({ error: "Error registering user!" });
});

// Router para login de usuarios
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({ status: "error", error: "Incomplete email or password" });
    }
    try {
      // Actualiza la ultima conexion en el login
      await usersCollection.findByIdAndUpdate(req.user._id, { last_connection: new Date() });

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
      };

      let cart = await cartModel.findOne({ user: req.user._id });
      if (!cart) {
        cart = await cartModel.create({ user: req.user._id, products: [] });
        await usersCollection.findByIdAndUpdate(req.user._id, { $push: { cart: { id: cart._id } } });
      }

      req.session.save(err => {
        if (err) {
          return res.status(500).send("Error saving session!");
        }
        res.redirect("/products");
      });
    } catch (err) {
      res.status(500).send("Error login user!");
    }
  }
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "Failed login!" });
});

// Router para logout de usuarios
router.post("/logout", async (req, res) => {
  const userId = req.user._id;

  try {
    // Actualiza la ultima conexion en el logout
    await usersCollection.findByIdAndUpdate(userId, { last_connection: new Date() });

    // Elimina los carritos del usuario al cerrar la sesion
    await cartModel.deleteMany({ user: userId });

    req.logout((err) => {
      if (err) {
        console.error("Error logging out!:", err);
        return res.status(500).send("Error signing out!");
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session!:", err);
          return res.status(500).send("Error signing out!");
        }
        res.clearCookie('connect.sid');
        res.redirect("/login");
      });
    });
  } catch (error) {
    console.log("Error during logout!:", error);
    res.status(500).send("Error signing out!");
  }
});


// Router para reestablecer contraseña
router.get("/request-reset", (req, res) => {
  res.render("requestReset");
});

// Router con formulario para ingresar email de reseteo
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  const token = generateResetToken();
  user.resetToken = token;
  await user.save();
  await sendResetEmail(user.email, token);
  res.json({ message: "Reset email sent!", redirect: "/login" });
});

// Router con el token generado para ingresar una nueva contraseña
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const user = await usersCollection.findOne({ resetToken: token });
  if (!user) {
    return res.status(400).send("Token invalid!");
  }
  res.render("resetPassword", { token });
});

// POST para reseteo de contraseña
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const user = await usersCollection.findOne({ resetToken: token });
  if (!user) {
    return res.status(400).send("Token invalid!");
  }
  user.password = createHash(password);
  user.resetToken = null;
  await user.save();
  res.redirect("/login");
});

// Login con Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// Login con Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/googlecallback", passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

// Current user
router.get("/current", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).send({ error: "User not authenticated!" });
  }
  const currentUserDTO = new CurrentUserDTO(req.session.user);
  res.send(currentUserDTO);
});

export default router;
