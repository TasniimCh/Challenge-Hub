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

// Fonction pour récupérer un challenge par son ID
const findChallengeByID = async (challengeID) => {
  return await pool.findChallengeByID(challengeID);
};

// Fonction pour récupérer les challenges d'un utilisateur
const findChallengesByUserID = async (userID) => {
  return await pool.findChallengesByUserID(userID);
};

// Fonction pour vérifier si un utilisateur participe à un challenge
const isUserParticipating = async (challengeID, userID) => {
    return await pool.checkUserParticipation(challengeID, userID);
};

// Fonction pour mettre à jour la progression d'un challenge
const updateChallengeProgress = async (challengeID, userID, day, completed) => {
    return await pool.updateChallengeProgress(challengeID, userID, day, completed);
};

module.exports = {
  signin,
  signup,
  findUserByID,
  updateChallenge,
  isChallengeCreator,
  deleteChallenge,
  findChallengeByID,
  findChallengesByUserID,
  isUserParticipating,
  updateChallengeProgress
};