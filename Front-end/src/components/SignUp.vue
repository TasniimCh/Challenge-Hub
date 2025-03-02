<template>
  <div class="container">
    <div class="left_page">
      <div class="cercle"></div>
      <div class="cercle2"></div>
      <h3>Bienvenue à nouveau !</h3>
      <p>
        <span>Pour garder le lien avec nous,</span>
        <span>connectez-vous avec vos informations personnelles</span>
      </p>
      <router-link to="/signin" class="btn1">Se connecter</router-link>
    </div>
    <div class="right_page">
      <h3>Créer un compte</h3>
      <input type="text" v-model="nom" name="nom" placeholder="Nom" required />
      <input type="text" v-model="prenom" name="prenom" placeholder="Prénom" required />
      <input type="text" v-model="username" name="username" placeholder="Nom d'utilisateur" required />
      <input type="email" v-model="email" name="email" placeholder="Email" required />
      <input type="password" v-model="motdepasse" name="motdepasse" placeholder="Mot de passe" required />
      <input type="password" v-model="password2" name="password2" placeholder="Confirmer le mot de passe" required />
      
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
      errorMessage: "",
    };
  },
  methods: {
    async handleSignUp() {
      this.errorMessage = "";

      // Vérification des champs vides
      if (!this.nom || !this.prenom || !this.username || !this.email || !this.motdepasse) {
        this.errorMessage = "Tous les champs sont obligatoires.";
        return;
      }

      // Vérification du format de l'email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.errorMessage = "L'adresse email est invalide.";
        return;
      }

      // Vérification de la longueur du mot de passe
      if (this.motdepasse.length < 6) {
        this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
        return;
      }

      // Vérification de la correspondance des mots de passe
      if (this.motdepasse !== this.password2) {
        this.errorMessage = "Les mots de passe ne correspondent pas.";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: this.nom,
            prenom: this.prenom,
            username: this.username,
            email: this.email,
            motdepasse: this.motdepasse, // Garder motdepasse pour correspondre au backend
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.errorMessage = data.message || "Erreur lors de l'inscription.";
        } else {
          alert("Inscription réussie !");
          this.$router.push("/signin");
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

<style scoped src="../assets/style.css"></style>
