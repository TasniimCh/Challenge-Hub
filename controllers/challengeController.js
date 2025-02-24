const pool = require('../db');

const challengeController = {
  // Demande de suppression d'un challenge par son créateur
  requestDeleteChallenge: async (req, res) => {
    const { id } = req.params; // ID du challenge à supprimer
    const { iduser } = req.body; // ID du créateur

    try {
      // 1. Vérifier si l'utilisateur est bien le créateur du challenge
      const challenge = await pool.query(
        'SELECT * FROM challenge WHERE idchall = $1 AND createur = $2',
        [id, iduser]
      );

      if (challenge.rows.length === 0) {
        return res.status(403).json({ message: 'You are not the creator of this challenge or the challenge does not exist' });
      }

      // 2. Vérifier le statut de tous les participants (sauf le créateur)
      const participants = await pool.query(
        `SELECT statut FROM participation
         WHERE idchallenge = $1 AND idutilisateur != $2`, // Exclure le créateur
        [id, iduser]
      );

      // 3. Vérifier si tous les autres participants ont terminé
      const ongoingParticipants = participants.rows.filter(
        (participant) => participant.statut !== 'finished' && participant.statut !== 'stopped'
      );

      if (ongoingParticipants.length > 0) {
        return res.status(400).json({
          message: 'Cannot delete challenge. Some participants are still ongoing.',
          ongoingParticipants: ongoingParticipants.length,
        });
      }

      // 4. Supprimer complètement le challenge
      await pool.query('DELETE FROM participation WHERE idchallenge = $1', [id]); // Supprimer les participations
      await pool.query('DELETE FROM challenge WHERE idchall = $1', [id]); // Supprimer le challenge

      res.status(200).json({ message: 'Challenge successfully deleted.' });
    } catch (error) {
      console.error('Error during challenge deletion request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  Creation: async (req, res) => {
  const { userID, nom, Description, tache, duree, categorie } = req.body; // Ajout de 'categorie'
  const client = await pool.connect(); // Pour gérer la transaction

  try {
    await client.query('BEGIN'); // Début de la transaction

    // 1. Vérifier si l'utilisateur existe
    const userExists = await client.query(
      'SELECT * FROM utilisateur WHERE iduser = $1',
      [userID]
    );
    if (userExists.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'User not found' });
    }

    // 2. Insérer le nouveau challenge avec la catégorie
    const newdefi = await client.query(
      'INSERT INTO challenge (nom, description, dailytask, dure, createur, categorie) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nom, Description, tache, duree, userID, categorie] // Ajout de 'categorie'
    );

    // 3. Initialiser `progress` en fonction de la durée du challenge
    const progress = Array(duree).fill(false); // Tableau de `duree` éléments, tous à `false`

    // 4. Participer automatiquement le créateur au challenge avec `progress`
    const newparticipation = await client.query(
      `INSERT INTO participation (idutilisateur, idchallenge, statut, progress, date_debut)
       VALUES ($1, $2, 'ongoing', $3, NOW()) RETURNING *`,
      [userID, newdefi.rows[0].idchall, progress]
    );

    await client.query('COMMIT'); // Valider la transaction

    // Réponse en cas de succès
    res.status(201).json({
      message: 'Defi created successfully',
      defi: newdefi.rows[0],
      participation: {
        progress: newparticipation.rows[0].progress,
        date_debut: newparticipation.rows[0].date_debut,
        statut: newparticipation.rows[0].statut,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
    console.error('Error during creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release(); // Libérer le client
  }
},
  registerParticipant: async (req, res) => {
    const { id } = req.params; // ID du challenge
    const { iduser } = req.body; // ID de l'utilisateur qui s'inscrit
  
    try {
      // 1. Vérifier si le challenge existe et est ouvert aux inscriptions
      const challenge = await pool.query(
        'SELECT * FROM challenge WHERE idchall = $1 AND inscription_ouverte = TRUE',
        [id]
      );
  
      if (challenge.rows.length === 0) {
        return res.status(404).json({ message: 'Challenge not found or not open for registration' });
      }
  
      // 2. Vérifier si l'utilisateur existe
      const user = await pool.query(
        'SELECT * FROM utilisateur WHERE iduser = $1',
        [iduser]
      );
  
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // 3. Vérifier si l'utilisateur est déjà inscrit au challenge
      const existingParticipation = await pool.query(
        'SELECT * FROM participation WHERE idchallenge = $1 AND idutilisateur = $2',
        [id, iduser]
      );
  
      if (existingParticipation.rows.length > 0) {
        return res.status(400).json({ message: 'User is already registered for this challenge' });
      }
  
      // 4. Récupérer la durée du challenge
      const duree = challenge.rows[0].dure; // Supposons que `dure` est la durée en jours
  
      // 5. Initialiser `progress` avec un tableau de booléens de taille `duree`
      const progress = Array(duree).fill(false); // Tableau de `duree` éléments, tous à `false`
  
      // 6. Inscrire l'utilisateur au challenge
      const newParticipation = await pool.query(
        `INSERT INTO participation (idutilisateur, idchallenge, statut, progress, date_debut)
         VALUES ($1, $2, 'ongoing', $3, NOW()) RETURNING *`, // Utilisation du tableau `progress`
        [iduser, id, progress]
      );
  
      // Réponse en cas de succès
      res.status(201).json({
        message: 'User registered successfully for the challenge',
        participation: newParticipation.rows[0],
      });
    } catch (error) {
      console.error('Error during participant registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  Modification: async (req, res) => {
    const { idchall } = req.params;
    const { userID, nom, Description } = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Verify challenge ownership
      const challengeCheck = await client.query(
        `SELECT createur FROM challenge 
         WHERE idchall = $1 AND createur = $2`,
        [idchall, userID]
      );

      if (challengeCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(403).json({ 
          message: 'Challenge not found or unauthorized modification' 
        });
      }

      const updatedChallenge = await client.query(
        `UPDATE challenge SET
          nom = COALESCE($1, nom),
          description = COALESCE($2, description)
         WHERE idchall = $3
         RETURNING *`,
        [nom, Description, idchall]
      );
      

      await client.query('COMMIT');

      res.status(200).json({
        message: 'Challenge updated successfully',
        defi: updatedChallenge.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release();
    }
  }
  };

module.exports = challengeController;