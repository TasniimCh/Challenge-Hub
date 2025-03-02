const pool = require('../db');  // Connexion à la base de données

// Fonction pour se connecter (sign-in)
const signin = async (email, password) => {
  return await pool.findUserByEmail(email, password);
};

// Fonction pour s'inscrire (sign-up)
const signup = async (userData) => {
  return await pool.createUser(userData);
};

// Fonction pour rechercher un utilisateur par son ID
const findUserByID = async (userID) => {
  return await pool.findUserByID(userID);
};

// Fonction pour mettre à jour un challenge
const updateChallenge = async (challengeID, challengeData) => {
  return await pool.updateChallengeByID(challengeID, challengeData);
};

// Fonction pour vérifier si un utilisateur est le créateur d'un challenge
const isChallengeCreator = async (challengeID, userID) => {
  return await pool.checkChallengeCreator(challengeID, userID);
};

// Fonction pour supprimer un challenge
const deleteChallenge = async (challengeID) => {
  return await pool.removeChallengeByID(challengeID);
};

module.exports = {
  signin,
  signup,
  findUserByID,
  updateChallenge,
  isChallengeCreator,
  deleteChallenge
};
