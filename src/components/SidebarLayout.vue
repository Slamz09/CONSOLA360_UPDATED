<template>
<div class="layout">
<!-- Fixed Logo -->
<div class="fixed-logo" @click="$router.push('/')">
<span class="logo-text">CONS</span><span class="logo-o"></span><span class="logo-text">LA</span>
</div>

<header class="navbar">
<div class="navbar-container">
<nav class="nav-menu">
<RouterLink to="/" class="nav-link" active-class="active">Risk 360</RouterLink>
<RouterLink to="/deal360" class="nav-link" active-class="active">Deal 360</RouterLink>
<RouterLink to="/legalhub" class="nav-link" active-class="active">Legal Hub</RouterLink>
<RouterLink to="/accounts" class="nav-link" active-class="active">Account Intelligence</RouterLink>
<RouterLink to="/support" class="nav-link" active-class="active">Support</RouterLink>
</nav>
<div class="nav-actions">
<button class="btn btn-ghost btn-small">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="11" cy="11" r="8"/>
<path d="m21 21-4.35-4.35"/>
</svg>
</button>
<button class="btn btn-ghost btn-small">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
<path d="M13.73 21a2 2 0 0 1-3.46 0"/>
</svg>
</button>
<div class="user-avatar">
<div class="avatar-circle"></div>
</div>
</div>
</div>
</header>

<main class="main-content">
<RouterView />
</main>
</div>
</template>

<script setup>
</script>

<style scoped>
.layout {
min-height: 100vh;
background-color: var(--bg-primary);
color: var(--text-primary);
}

/* Fixed Logo */
.fixed-logo {
position: fixed;
top: 1.5rem;
left: 2rem;
z-index: 9999;
cursor: pointer;
display: flex;
align-items: center;
font-family: 'Inter', sans-serif;
transition: opacity 0.2s ease;
}

.fixed-logo:hover {
opacity: 0.8;
}

.logo-text {
font-size: 1.5rem;
font-weight: 700;
color: #ffffff;
letter-spacing: -0.02em;
}

.fixed-logo .logo-o {
display: inline-block;
width: 16px;
height: 16px;
background: #7c3aed;
border-radius: 50%;
margin: 0 3px;
}

/* Navbar */
.navbar {
padding-top: 1rem;
padding-bottom: 0;
}

.navbar-container {
display: flex;
justify-content: center;
align-items: center;
padding: 1rem 2rem;
position: relative;
}

.nav-menu {
display: flex;
gap: 2rem;
}

.nav-link {
padding: 0.5rem 1rem;
color: var(--text-secondary);
text-decoration: none;
font-weight: 500;
transition: all 0.2s ease;
border-radius: 8px;
}

.nav-link:hover {
color: var(--text-primary);
background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
color: var(--primary-accent);
background: rgba(124, 58, 237, 0.1);
}

.nav-actions {
position: fixed;
top: 1.5rem;
right: 2rem;
display: flex;
align-items: center;
gap: 1rem;
z-index: 1000;
}

.user-avatar {
display: flex;
align-items: center;
}

.avatar-circle {
width: 32px;
height: 32px;
background: var(--gradient-primary);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-weight: 600;
font-size: 0.875rem;
}

.main-content {
padding-top: 0;
width: 100%;
padding-left: 2rem;
padding-right: 2rem;
}
</style>