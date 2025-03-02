<template>
    <div class="container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h1 class="logo">ChallengeHub</h1>
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">🏠 Accueil</router-link>
          <router-link to="/profile" class="nav-item">👤 Profil</router-link>
        </nav>
        <button class="nav-item logout" @click="logout">🔴 Déconnexion</button>
      </aside>
  
      <!-- Main Content -->
      <main class="main-content">
        <div class="card">
          <h2>Créez votre défi personnalisé</h2>
          
          <form @submit.prevent="createChallenge" class="challenge-form">
            <div class="form-group">
              <label for="nom">Nom</label>
              <input v-model="challenge.name" type="text" id="nom" placeholder="Nom du défi" required />
            </div>
  
            <div class="form-group">
              <label for="categorie">Catégorie</label>
              <select v-model="challenge.category" id="categorie" required>
                <option value="" disabled>Sélectionnez une catégorie</option>
                <option value="sports">Sports et Fitness</option>
                <option value="nutrition">Nutrition</option>
                <option value="programmation">Programmation</option>
                <option value="langues">Langues</option>
                <option value="skills">Skills</option>
              </select>
            </div>
  
            <div class="form-group">
              <label for="engagement">Engagement quotidien</label>
              <input v-model="challenge.engagement" type="text" id="engagement" placeholder="Tâche quotidienne" required />
            </div>
  
            <div class="form-group">
              <label for="duree">Durée</label>
              <div class="duration-slider">
                <input v-model="challenge.duration" type="range" id="duree" min="1" max="100" />
                <span class="duration-display">{{ challenge.duration }} jours</span>
              </div>
            </div>
  
            <div class="form-group">
              <label for="description">Description</label>
              <textarea v-model="challenge.description" id="description" placeholder="Décrivez votre défi" required></textarea>
            </div>
  
            <button type="submit" class="btn-create">Créer</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success">{{ successMessage }}</p>
          </form>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        challenge: {
          name: "",
          category: "",
          engagement: "",
          duration: 50,
          description: ""
        },
        errorMessage: "",
        successMessage: ""
      };
    },
    methods: {
      async createChallenge() {
        try {
          const res = await fetch("http://localhost:5000/create-challenge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.challenge)
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            this.errorMessage = data.message;
          } else {
            this.successMessage = "Défi créé avec succès!";
            this.resetForm();
          }
        } catch (error) {
          console.error("Error creating challenge:", error);
          this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        }
      },
      resetForm() {
        this.challenge = {
          name: "",
          category: "",
          engagement: "",
          duration: 50,
          description: ""
        };
      },
      logout() {
        this.$router.push("/signin");
      }
    }
  };
  </script>
  
  <style scoped>
  @import "../assets/creation.css";
  .error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  .success {
    color: green;
    font-size: 14px;
    margin-top: 10px;
  }
  </style>
  