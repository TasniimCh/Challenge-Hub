const express = require('express');
const authRoutes = require('../Back_end/routes/authRoutes'); // Importe authRoutes
const challengeRoutes = require('../Back_end/routes/challengeRoutes');
const cors=require('cors');
const app = express();

// Utiliser CORS pour autoriser les requêtes provenant de n'importe quelle origine

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/auth', authRoutes);
app.use('/challenges', challengeRoutes);
const PORT = process.env.PORT || 3000;
if(require.main=== module){
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports=app;