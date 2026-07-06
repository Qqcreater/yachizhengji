<template>
  <header class="top-nav">
    <div class="header-content">
      <div class="brand-logo">
        <router-link to="/" class="brand-link">
          <span class="brand-icon-wrap">
            <img src="/logo.png" class="brand-icon" alt="SmileCenter" />
          </span>
          <span class="brand-text">SmileCenter</span>
        </router-link>
      </div>

      <nav class="nav-menu">
        <router-link 
          to="/" 
          :class="['nav-item', { active: isActive('/') }]"
        >
          {{ t('topNav.home') }}
        </router-link>

        <div class="dropdown" ref="dropdownRef">
          <button 
            :class="['dropdown-btn', { active: dropdownOpen }]"
            @click.stop="toggleDropdown"
          >
            {{ t('topNav.digitalCapability') }}
            <span class="arrow">{{ dropdownOpen ? '▲' : '▼' }}</span>
          </button>
          <div 
            :class="['dropdown-content', { show: dropdownOpen }]"
          >
            <router-link 
              to="/cephalometric" 
              :class="['dropdown-item', { active: isActive('/cephalometric') }]"
              @click="closeDropdown"
            >
              {{ t('topNav.cephalometricDropdown') }}
            </router-link>
            <router-link 
              to="/panoramic" 
              :class="['dropdown-item', { active: isActive('/panoramic') }]"
              @click="closeDropdown"
            >
              {{ t('topNav.panoramicDropdown') }}
            </router-link>
            <router-link 
              to="/autocrop" 
              :class="['dropdown-item', { active: isActive('/autocrop') }]"
              @click="closeDropdown"
            >
              {{ t('topNav.autocropDropdown') }}
            </router-link>
          </div>
        </div>

        <router-link 
          to="/contact" 
          :class="['nav-item', { active: isActive('/contact') }]"
        >
          {{ t('topNav.contactUs') }}
        </router-link>
        <router-link 
          to="/console" 
          :class="['nav-item', { active: isActive('/console') }]"
        >
          {{ t('topNav.console') }}
        </router-link>
      </nav>

      <div class="lang-dropdown" ref="langDropdownRef">
        <button class="lang-btn" @click.stop="toggleLangDropdown">
          {{ langDisplay }} ▼
        </button>
        <div 
          :class="['lang-content', { show: langDropdownOpen }]"
        >
          <a 
            href="#" 
            :class="{ active: state.lang === 'zh' }"
            @click.stop="switchLang('zh')"
          >{{ t('topNav.langZh') }}</a>
          <a 
            href="#" 
            :class="{ active: state.lang === 'en' }"
            @click.stop="switchLang('en')"
          >{{ t('topNav.langEn') }}</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { t, setLang, getLang, state, langDisplay } from '../i18n/index.js'

const route = useRoute()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const langDropdownOpen = ref(false)
const langDropdownRef = ref(null)

const isActive = (path) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  langDropdownOpen.value = false
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const toggleLangDropdown = () => {
  langDropdownOpen.value = !langDropdownOpen.value
  dropdownOpen.value = false
}

const switchLang = (lang) => {
  setLang(lang)
  langDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
  if (langDropdownRef.value && !langDropdownRef.value.contains(event.target)) {
    langDropdownOpen.value = false
  }
}

const handleRouteChange = () => {
  dropdownOpen.value = false
  langDropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 12px 24px;
  flex-shrink: 0;
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.brand-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
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
  font-size: 28px;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.3px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.25s;
}

.nav-item:hover {
  color: #667eea;
  background: #f5f7fa;
}

.nav-item.active {
  color: #667eea;
  background: #f0f3ff;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.25s;
}

.dropdown-btn:hover {
  color: #667eea;
  background: #f5f7fa;
}

.dropdown-btn.active {
  color: #667eea;
  background: #f0f3ff;
}

.arrow {
  font-size: 12px;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: white;
  min-width: 220px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  border-radius: 8px;
  padding: 4px 0;
  border: 1px solid #e8eaed;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-content.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.25s;
}

.dropdown-item:hover {
  background: #f5f7fa;
}

.dropdown-item.active {
  background: #f0f3ff;
  color: #667eea;
}

.lang-dropdown {
  position: relative;
}

.lang-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.25s;
}

.lang-btn:hover {
  background: #e8eaed;
}

.lang-content {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  min-width: 120px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  border-radius: 8px;
  padding: 4px 0;
  border: 1px solid #e8eaed;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s, transform 0.2s;
}

.lang-content.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.lang-content a {
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: all 0.15s;
}

.lang-content a:hover {
  background: #f5f7fa;
}

.lang-content a.active {
  color: #667eea;
  font-weight: 600;
  background: #f0f3ff;
}

@media (max-width: 900px) {
  .nav-menu {
    display: none;
  }

  .top-nav {
    padding: 10px 15px;
  }
}
</style>