<template>
  <div class="container">
    <div class="left_page">
      <div class="cercle"></div>
      <div class="cercle2"></div>
      <h3>Bienvenue à nouveau !</h3>
      <p>
        <span>Pour garder le lien avec nous,</span>
        <span>connectez-vous avec vos informations personnelles</span>
      </p>
      <!-- Si tu utilises Vue Router, l'inscription va ici -->
      <router-link to="/signin" class="btn1">Se connecter</router-link>
    </div>
    <div class="right_page">
      <h3>Créer un compte</h3>
      <input 
        type="text" 
        v-model="nom" 
        name="nom" 
        placeholder="Nom" 
        required 
      />
      <input 
        type="text" 
        v-model="prenom" 
        name="prenom" 
        placeholder="Prénom" 
        required 
      />
      <input 
        type="text" 
        v-model="username" 
        name="username" 
        placeholder="Nom d'utilisateur" 
        required 
      />
      <input 
        type="email" 
        v-model="email" 
        name="email" 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        v-model="motdepasse" 
        name="password" 
        placeholder="Mot de passe" 
        required 
      />
      <input 
        type="password" 
        v-model="password2" 
        name="password2" 
        placeholder="Confirmer le mot de passe" 
        required 
      />
      <!-- Affichage du message d'erreur si besoin -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button class="btn" @click="handleSignUp">S'inscrire</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nom: "",
      prenom: "",
      username: "",
      email: "",
      motdepasse: "",
      password2: "",
      errorMessage: "", // Stocke les messages d'erreur
    };
  },
  methods: {
    async handleSignUp() {
      // Validation si les mots de passe correspondent
      if (this.motdepasse !== this.password2) {
        this.errorMessage = "Les mots de passe ne correspondent pas.";
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            motdepasse: this.motdepasse,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          this.errorMessage = data.message; // Affiche l'erreur si l'email/username existe
        } else {
          alert("Inscription réussie !");
          this.$router.push("/signin"); // Redirection vers la page de connexion
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        this.errorMessage = "Une erreur est survenue, veuillez réessayer.";
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  width: 300px;
  margin: auto;
  padding: 20px;
}
.error {
  color: red;
  font-size: 14px;
}
</style>

<!-- Utilise ton CSS existant -->
<style scoped src="../assets/style.css"></style>
