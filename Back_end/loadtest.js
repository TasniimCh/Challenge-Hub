import('loadtest').then(({ default: loadtest }) => {
    const options = {
      url: 'http://localhost:3000/auth/signin',
      maxRequests: 3000,  // Nombre total de requêtes
      concurrency: 100,    // Nombre de requêtes simultanées
      method: 'POST',     // Type de requête
      contentType: 'application/json',
      body: JSON.stringify({
        username: 'inconue',
        motdepasse: '12345678'
      }),
      statusCallback: function (error, result) {
        if (error) {
          console.error('Erreur lors du test:', error);
        } else {
          console.log(`Requête ${result.requestIndex} : Code HTTP ${result.statusCode}`);
        }
      }
    };
  
    console.log('Début du test de charge sur /signin...');
    loadtest.loadTest(options, function (error, result) {
      if (error) {
        return console.error('Échec du test:', error);
      }
      console.log('Test terminé avec succès ! Résumé :', result);
    });
  
  }).catch(console.error);
  