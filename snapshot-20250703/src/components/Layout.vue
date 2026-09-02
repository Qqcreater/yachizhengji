<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand-logo">
          <span class="brand-icon-wrap">
            <img src="/logo.png" class="brand-icon" alt="SmileCenter" />
          </span>
          <span class="brand-text">SmileCenter</span>
        </div>
      </div>

      <div class="auth-section" v-if="!isLogin">
        <button 
          :class="['auth-btn', { active: authModalType === 'login' }]"
          @click="openAuthModal('login')"
        >
          {{ t('sidebar.login') }}
        </button>
        <button 
          :class="['auth-btn', { active: authModalType === 'register' }]"
          @click="openAuthModal('register')"
        >
          {{ t('sidebar.register') }}
        </button>
      </div>

      <div class="user-section" v-else>
        <div class="user-info">
          <span class="welcome-text">{{ t('sidebar.welcome') }}{{ nickname }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          {{ t('sidebar.logout') }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <h3 class="nav-title">{{ t('sidebar.moduleTitle') }}</h3>
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.path">
            <router-link 
              :to="item.path"
              :class="['nav-item', { active: isActive(item.path) }]"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <p>v1.0.0</p>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>

    <LoginModal 
      v-if="showAuthModal"
      :type="authModalType"
      @close="closeAuthModal"
      @submit="handleAuthSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginModal from './LoginModal.vue'
import { t, getLang } from '../i18n/index.js'

const router = useRouter()
const route = useRoute()

const showAuthModal = ref(false)
const authModalType = ref('login')
const isLogin = ref(false)
const nickname = ref('')

const menuItems = computed(() => [
  { path: '/', name: t('sidebar.home'), icon: '🏠' },
  { path: '/cephalometric', name: t('sidebar.cephalometric'), icon: '🩻' },
  { path: '/panoramic', name: t('sidebar.panoramic'), icon: '🔬' },
])

onMounted(() => {
  const storedUser = localStorage.getItem('userInfo')
  if (storedUser) {
    try {
      const userInfo = JSON.parse(storedUser)
      if (userInfo.isLogin && userInfo.nickname) {
        isLogin.value = true
        nickname.value = userInfo.nickname
      }
    } catch (e) {
      console.error('Failed to parse user info:', e)
    }
  }
})

const isActive = (path) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}

const openAuthModal = (type) => {
  authModalType.value = type
  showAuthModal.value = true
}

const closeAuthModal = () => {
  showAuthModal.value = false
}

const handleAuthSubmit = (data) => {
  localStorage.setItem('userInfo', JSON.stringify({
    nickname: data.username,
    isLogin: true
  }))
  isLogin.value = true
  nickname.value = data.username
  showAuthModal.value = false
  alert(`${authModalType.value === 'login' ? t('sidebar.login') : t('sidebar.register')}成功！`)
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  isLogin.value = false
  nickname.value = ''
}
</script>

<style scoped>
.app-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: calc(100vw / 9);
  min-width: 160px;
  max-width: 200px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.brand-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  width: 130%;
  height: 130%;
  object-fit: cover;
  object-position: center 28%;
  display: block;
}

.brand-text {
  font-size: 21px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.3px;
}

.auth-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.auth-btn {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.auth-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.auth-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.user-info {
  padding: 10px 14px;
  text-align: center;
}

.welcome-text {
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.logout-btn {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.3);
  border-color: rgba(220, 38, 38, 0.5);
  color: #ffcccc;
}

.sidebar-nav {
  flex: 1;
  padding: 16px;
}

.nav-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px 0;
  padding-left: 8px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s;
  margin-bottom: 4px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  flex: 1;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer p {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }
  
  .brand-text,
  .nav-text,
  .nav-title,
  .auth-btn span,
  .sidebar-footer p {
    display: none;
  }
  
  .auth-section {
    flex-direction: row;
    justify-content: center;
    gap: 4px;
  }
  
  .auth-btn {
    padding: 8px;
    font-size: 0;
    flex: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-item {
    justify-content: center;
    padding: 12px;
  }
}
</style>