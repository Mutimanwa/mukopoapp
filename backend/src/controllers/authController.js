import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import AuditLog from '../models/AuditLog.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// =========================
// INSCRIPTION
// =========================
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Tous les champs sont requis',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Le mot de passe doit faire au moins 6 caractères',
    });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Utilisateur existant',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Employe',
    });

    await AuditLog.create({
      action: 'REGISTER',
      userId: user._id,
      details: `Nouvel utilisateur inscrit : ${user.email}`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'Inscription réussie',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// CONNEXION
// =========================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email et mot de passe requis',
    });
  }

  try {
    // IMPORTANT : récupérer le champ password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe invalide',
      });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email ou mot de passe invalide',
      });
    }

    await AuditLog.create({
      action: 'LOGIN',
      userId: user._id,
      details: `Connexion de ${user.email}`,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'Connexion réussie',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
};