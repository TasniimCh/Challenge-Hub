const pool = require('../db');

const participationController = {
  Modification: async (req, res) => {
    const { idchall } = req.params;
    const { userID, status } = req.body;
    const client = await pool.connect();
    
    // Validate status input
    if (status !== "ongoing" && status !== "stopped") {
      return res.status(403).json({
        message: 'Status change must be ongoing or stopped'
      });
    }
    
    try {
      await client.query('BEGIN');

      // Check if the user is participating in the challenge
      const challengeCheck = await client.query(
        `SELECT * FROM participation 
         WHERE idchallenge = $1 AND idutilisateur = $2`,
        [idchall, userID]
      );

      if (challengeCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(403).json({ 
          message: 'You are not participating in that challenge' 
        });
      }

      // Update the status for the user's participation
      const updatedstatus = await client.query(
        `UPDATE participation SET
           statut = COALESCE($1, statut)
         WHERE idchallenge = $2 AND idutilisateur = $3
         RETURNING *`,
        [status, idchall, userID]
      );

      await client.query('COMMIT');

      res.status(200).json({
        message: 'Status updated successfully',
        defi: updatedstatus.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release();
    }
  },
  classement: async (req, res) => {
    const { idchall } = req.params;
    try {
      // Check if any participation records exist for the challenge
      const findchall = await pool.query(
        `SELECT * FROM participation
         WHERE idchallenge = $1`,
        [idchall]
      );
      
      if (findchall.rows.length === 0) {
        return res.status(403).json({ message: 'There is no challenge with that id' });
      }
      
      // Retrieve and sort users by their progress (counting the number of true values)
      const ranking = await pool.query(
        `SELECT idutilisateur,
                (SELECT COUNT(*) FROM unnest(progress) AS p WHERE p = true) AS progress_count
         FROM participation
         WHERE idchallenge = $1 AND statut IN ('ongoing', 'finished')
         ORDER BY progress_count DESC`,
        [idchall]
      );
      
      return res.status(200).json(ranking.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } 
};

module.exports = participationController;
