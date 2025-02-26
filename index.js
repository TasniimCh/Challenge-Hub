const express = require('express');
const authRoutes = require('./routes/authRoutes'); // Importe authRoutes
const challengeRoutes = require('./routes/challengeRoutes');
const participationRoutes = require('./routes/participationRoutes')
const cors = require('cors');
const app = express();

// Utiliser CORS pour autoriser les requêtes provenant de n'importe quelle origine
app.use(cors());

app.use(express.json());


app.use('/auth', authRoutes);
app.use('/challenges', challengeRoutes);
app.use('/patricipation',participationRoutes)

const PORT = process.env.PORT || 3000;
if(require.main=== module){
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports=app;