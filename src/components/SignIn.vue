<template>
  <div class="container">
    <div class="left_pannel">
      <h1>ChallengeHub</h1>
      <!-- Champ pour l'email ou le nom d'utilisateur -->
      <input
        type="text"
        v-model="usernameOrEmail"
        name="usernameOrEmail"
        placeholder="E-mail ou Nom d'utilisateur"
        required
      />
      <!-- Champ pour le mot de passe -->
      <input
        type="password"
        v-model="password"
        name="password"
        placeholder="Mot de passe"
        required
      />
      <button class="btn1" @click="handleSignIn">Se connecter</button>

      <!-- Message d'erreur affiché si nécessaire -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
    <div class="right_pannel">
      <div class="cercle"></div>
      <div class="cercle1"></div>
      <h3>Heureux de vous accueillir</h3>
      <p>
        <span>Chaque défi est une opportunité de grandir.</span>
        <span>Rejoignez-nous et commencez votre aventure dès aujourd’hui</span>
      </p>
      <router-link to="/signup" class="btn">S'inscrire</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  data() {
    return {
      usernameOrEmail: '',  // Le champ pour email ou nom d'utilisateur
      password: '',          // Le mot de passe
      errorMessage: '',      // Variable pour afficher les messages d'erreur
    };
  },
  methods: {
    async handleSignIn() {
      // Réinitialiser le message d'erreur avant chaque tentative
      this.errorMessage = '';

      // Vérifier que l'email ou nom d'utilisateur et mot de passe sont remplis
      if (!this.usernameOrEmail || !this.password) {
        this.errorMessage = "Email ou Nom d'utilisateur et mot de passe sont requis.";
        return;
      }

      // Envoie des données à la route d'authentification
      try {
        const res = await fetch('http://localhost:3000/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Envoi de l'email ou nom d'utilisateur et du mot de passe
            username: this.usernameOrEmail,  // Ici, le backend peut accepter username ou email
            email: this.usernameOrEmail,     // Le même champ est envoyé pour username ou email
            motdepasse: this.password,       // Le mot de passe
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Si la réponse n'est pas OK, afficher l'erreur du backend
          this.errorMessage = data.message || "Une erreur s'est produite lors de la connexion.";
        } else {
          alert('Connexion réussie!');
          // Redirection vers une autre page si la connexion réussie
          // this.$router.push('/accueil');
        }
      } catch (error) {
        // Gérer les erreurs liées à la requête, comme une perte de connexion réseau
        console.error('Erreur lors de la connexion:', error);
        this.errorMessage = "Erreur de connexion. Veuillez réessayer plus tard.";
      }
    },
  },
};
</script>

<style scoped src="../assets/style1.css"></style>
