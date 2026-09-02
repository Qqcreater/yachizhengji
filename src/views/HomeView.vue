<template>
  <div class="home-container">
    <TopNav />

    <main class="home-main">
      <div class="hero-section">
        <div class="hero-content">
          <h1>{{ t('home.heroTitle') }}</h1>
          <p>{{ t('home.heroDesc') }}</p>
          <div class="hero-buttons">
            <a href="/cephalometric" class="primary-btn">{{ t('home.cephalometricBtn') }}</a>
            <a href="/panoramic" class="secondary-btn">{{ t('home.panoramicBtn') }}</a>
            <a href="/autocrop" class="secondary-btn">{{ t('home.autocropBtn') }}</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="medical-icons">

            <!-- ① 透明隐形牙套（Invisalign 风格） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico1tray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(180,220,255,0.55)"/><stop offset="100%" stop-color="rgba(120,180,240,0.45)"/>
                  </linearGradient>
                  <linearGradient id="ico1edge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#7BB8F0"/><stop offset="100%" stop-color="#3D7FCC"/>
                  </linearGradient>
                  <radialGradient id="ico1hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.8"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 隐形牙套外轮廓（上排 U 形） -->
                <path d="M10 24 Q14 14 26 12 Q40 10 54 12 Q66 14 70 24 Q72 38 64 50 Q56 56 50 52 Q44 50 40 50 Q36 50 30 52 Q24 56 16 50 Q8 38 10 24Z"
                      fill="url(#ico1tray)" stroke="url(#ico1edge)" stroke-width="1.6"/>
                <!-- 内侧高光 -->
                <path d="M10 24 Q14 14 26 12 Q40 10 54 12 Q66 14 70 24 Q72 38 64 50 Q56 56 50 52 Q44 50 40 50 Q36 50 30 52 Q24 56 16 50 Q8 38 10 24Z"
                      fill="url(#ico1hl)" opacity="0.6"/>
                <!-- 牙齿压痕槽（半透明高亮，模拟隐适美内壁的牙位） -->
                <ellipse cx="22" cy="30" rx="4" ry="6" fill="white" opacity="0.55"/>
                <ellipse cx="34" cy="28" rx="4.2" ry="6.5" fill="white" opacity="0.55"/>
                <ellipse cx="46" cy="28" rx="4.2" ry="6.5" fill="white" opacity="0.55"/>
                <ellipse cx="58" cy="30" rx="4" ry="6" fill="white" opacity="0.55"/>
                <!-- 边缘高光线 -->
                <path d="M14 24 Q18 16 28 14" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
                <path d="M52 14 Q62 16 66 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
                <!-- 标签点（隐适美附件位置） -->
                <circle cx="34" cy="34" r="1.4" fill="#3D7FCC" opacity="0.8"/>
                <circle cx="46" cy="34" r="1.4" fill="#3D7FCC" opacity="0.8"/>
              </svg>
            </span>

            <!-- ② 牙齿 + 红蓝正畸橡皮筋（O-ring/elastic） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico2tooth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F0E8F8"/>
                  </linearGradient>
                  <linearGradient id="ico2bracket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F0F0F8"/><stop offset="100%" stop-color="#B0BAC8"/>
                  </linearGradient>
                  <linearGradient id="ico2wire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E0E8F0"/><stop offset="100%" stop-color="#8A98A8"/>
                  </linearGradient>
                  <radialGradient id="ico2hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.85"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 中央大牙（带金属托槽） -->
                <path d="M30 18 Q28 10 36 9 Q42 8 48 10 Q54 10 54 18 Q56 30 50 42 Q44 48 40 42 Q36 48 30 42 Q24 30 30 18Z"
                      fill="url(#ico2tooth)" stroke="#D8B8E8" stroke-width="1"/>
                <path d="M30 18 Q28 10 36 9 Q42 8 48 10 Q54 10 54 18 Q56 30 50 42 Q44 48 40 42 Q36 48 30 42 Q24 30 30 18Z"
                      fill="url(#ico2hl)"/>
                <!-- 中央托槽 -->
                <rect x="35" y="24" width="10" height="5" rx="1.5" fill="url(#ico2bracket)" stroke="#7A8694" stroke-width="0.5"/>
                <rect x="36.5" y="26" width="7" height="1" rx="0.3" fill="#4A5560"/>
                <!-- 弓丝（弯折穿过托槽） -->
                <path d="M22 26 L36 26 M44 26 L58 26" fill="none" stroke="url(#ico2wire)" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="40" cy="26.5" r="1" fill="#5A6470"/>
                <!-- 左侧托槽 -->
                <rect x="20" y="24" width="6" height="4" rx="1" fill="url(#ico2bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <!-- 右侧托槽 -->
                <rect x="54" y="24" width="6" height="4" rx="1" fill="url(#ico2bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <!-- 红色橡皮筋（上排-下排牵引） -->
                <path d="M22 32 Q18 50 26 60" fill="none" stroke="#E84A4A" stroke-width="3" stroke-linecap="round"/>
                <path d="M58 32 Q62 50 54 60" fill="none" stroke="#E84A4A" stroke-width="3" stroke-linecap="round"/>
                <!-- 蓝色橡皮筋（II 类牵引，斜向） -->
                <path d="M22 32 Q40 48 58 32" fill="none" stroke="#3D7FCC" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0"/>
                <path d="M26 60 Q40 64 54 60" fill="none" stroke="#3D7FCC" stroke-width="2.5" stroke-linecap="round"/>
                <!-- 下排小牙（橡皮筋牵引目标） -->
                <ellipse cx="26" cy="62" rx="5" ry="4" fill="url(#ico2tooth)" stroke="#D8B8E8" stroke-width="0.5"/>
                <ellipse cx="54" cy="62" rx="5" ry="4" fill="url(#ico2tooth)" stroke="#D8B8E8" stroke-width="0.5"/>
                <!-- 牙根 -->
                <path d="M34 50 L36 68 L40 68 L40 50Z" fill="url(#ico2tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <path d="M44 50 L44 68 L48 68 L50 50Z" fill="url(#ico2tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 高光 -->
                <ellipse cx="38" cy="16" rx="4" ry="2" fill="white" opacity="0.7"/>
              </svg>
            </span>

            <!-- ③ 牙列模型+正畸弓丝+牵引钩（O 型曲/关闭曲） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico3gum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFC8DC"/><stop offset="100%" stop-color="#FFA0C0"/>
                  </linearGradient>
                  <linearGradient id="ico3tooth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F4E8F8"/>
                  </linearGradient>
                  <linearGradient id="ico3bracket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F0F0F8"/><stop offset="100%" stop-color="#C0C8D8"/>
                  </linearGradient>
                  <linearGradient id="ico3wire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E0E8F0"/><stop offset="100%" stop-color="#A0B0C0"/>
                  </linearGradient>
                  <radialGradient id="ico3hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.8"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 上排牙龈带 -->
                <path d="M10 22 Q40 14 70 22 Q68 30 60 30 Q50 28 40 28 Q30 28 20 30 Q12 30 10 22Z"
                      fill="url(#ico3gum)" stroke="#FF80B0" stroke-width="0.8"/>
                <!-- 上排6颗牙 -->
                <ellipse cx="14" cy="32" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="23" cy="30" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="32" cy="29" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="40" cy="29" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="48" cy="29" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="57" cy="30" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="66" cy="32" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 上排7颗托槽 -->
                <rect x="11" y="31" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="20" y="30" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="29" y="29" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="37" y="29" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="45" y="29" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="54" y="30" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="63" y="31" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <!-- 上排弓丝（含 O 型关闭曲） -->
                <path d="M14 32.5 L20 32 L28 31.5 L34 31 L46 31 L52 31.5 L60 32 L66 32.5" fill="none" stroke="url(#ico3wire)" stroke-width="1.2" stroke-linecap="round"/>
                <!-- O 型关闭曲（在两颗尖牙间） -->
                <circle cx="34" cy="29" r="2" fill="none" stroke="#5070A0" stroke-width="1.2"/>
                <circle cx="46" cy="29" r="2" fill="none" stroke="#5070A0" stroke-width="1.2"/>
                <!-- 牵引钩（power hook） -->
                <path d="M40 31 L40 36 L42 38 L40 40 L38 38 L40 36" fill="url(#ico3bracket)" stroke="#7A8694" stroke-width="0.5"/>
                <!-- 下排牙龈带 -->
                <path d="M10 58 Q40 66 70 58 Q68 50 60 50 Q50 52 40 52 Q30 52 20 50 Q12 50 10 58Z"
                      fill="url(#ico3gum)" stroke="#FF80B0" stroke-width="0.8"/>
                <!-- 下排6颗牙 -->
                <ellipse cx="14" cy="50" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="23" cy="52" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="32" cy="53" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="40" cy="53" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="48" cy="53" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="57" cy="52" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="66" cy="50" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 下排弓丝 -->
                <path d="M14 49.5 Q40 56 66 49.5" fill="none" stroke="url(#ico3wire)" stroke-width="1.2" stroke-linecap="round"/>
                <!-- 高光 -->
                <ellipse cx="32" cy="30" rx="2" ry="0.8" fill="white" opacity="0.7"/>
                <ellipse cx="32" cy="52" rx="2" ry="0.8" fill="white" opacity="0.7"/>
              </svg>
            </span>

            <!-- ④ 头影测量侧位片 + 标志点描记线（正畸诊断） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico4bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#3D5575"/><stop offset="100%" stop-color="#1E2A3D"/>
                  </linearGradient>
                  <linearGradient id="ico4skull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(220,230,245,0.85)"/><stop offset="100%" stop-color="rgba(180,200,220,0.65)"/>
                  </linearGradient>
                  <linearGradient id="ico4line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#FF6464"/><stop offset="100%" stop-color="#FFB060"/>
                  </linearGradient>
                </defs>
                <!-- X 光胶片底 -->
                <rect x="6" y="10" width="68" height="60" rx="4" fill="url(#ico4bg)" stroke="#506880" stroke-width="0.8"/>
                <!-- 胶片边框刻度 -->
                <line x1="10" y1="14" x2="10" y2="20" stroke="#7090A8" stroke-width="0.5"/>
                <line x1="10" y1="14" x2="14" y2="14" stroke="#7090A8" stroke-width="0.5"/>
                <line x1="70" y1="60" x2="70" y2="66" stroke="#7090A8" stroke-width="0.5"/>
                <line x1="66" y1="66" x2="70" y2="66" stroke="#7090A8" stroke-width="0.5"/>
                <!-- 侧位头颅轮廓（简化剪影） -->
                <path d="M40 14 Q24 16 20 30 Q18 40 22 48 Q24 56 28 60 Q32 64 40 64 L48 64 Q52 64 54 60 Q56 56 58 52 Q60 48 60 42 L60 30 Q56 22 50 18 Q44 14 40 14Z"
                      fill="url(#ico4skull)" stroke="#A8B8C8" stroke-width="0.8"/>
                <!-- 鼻梁/下颌线（深色） -->
                <path d="M40 18 Q38 28 36 36" fill="none" stroke="#506880" stroke-width="0.8" stroke-linecap="round"/>
                <path d="M40 18 Q42 26 44 34" fill="none" stroke="#506880" stroke-width="0.8" stroke-linecap="round"/>
                <path d="M30 60 Q36 62 44 62" fill="none" stroke="#506880" stroke-width="0.8" stroke-linecap="round"/>
                <!-- 牙列竖线（牙槽骨） -->
                <line x1="32" y1="44" x2="32" y2="58" stroke="#506880" stroke-width="0.5"/>
                <line x1="38" y1="46" x2="38" y2="60" stroke="#506880" stroke-width="0.5"/>
                <!-- 标志点 SNA / SNB / ANB 描记线（彩色正畸分析线） -->
                <line x1="38" y1="18" x2="48" y2="32" stroke="#FFB060" stroke-width="1" stroke-dasharray="2,1"/>
                <!-- SN 平面（基准线，黄色） -->
                <line x1="20" y1="20" x2="60" y2="20" stroke="#FFD060" stroke-width="1"/>
                <text x="60" y="18" font-size="4" fill="#FFD060" font-family="Arial">SN</text>
                <!-- 鼻根点 N -->
                <circle cx="40" cy="20" r="1.4" fill="#FFB060" stroke="white" stroke-width="0.4"/>
                <text x="42" y="19" font-size="3.5" fill="#FFB060" font-family="Arial">N</text>
                <!-- 蝶鞍点 S -->
                <circle cx="32" cy="20" r="1.4" fill="#FFB060" stroke="white" stroke-width="0.4"/>
                <text x="26" y="19" font-size="3.5" fill="#FFB060" font-family="Arial">S</text>
                <!-- 上牙槽座点 A -->
                <circle cx="36" cy="42" r="1.4" fill="#FF6464" stroke="white" stroke-width="0.4"/>
                <text x="37.5" y="45" font-size="3.5" fill="#FF6464" font-family="Arial">A</text>
                <!-- 下牙槽座点 B -->
                <circle cx="40" cy="54" r="1.4" fill="#60C0FF" stroke="white" stroke-width="0.4"/>
                <text x="41.5" y="57" font-size="3.5" fill="#60C0FF" font-family="Arial">B</text>
                <!-- 颏前点 Po -->
                <circle cx="48" cy="62" r="1.4" fill="#80FFA0" stroke="white" stroke-width="0.4"/>
                <text x="50" y="64" font-size="3.5" fill="#80FFA0" font-family="Arial">Po</text>
                <!-- 描记测量线 SNA / SNB -->
                <line x1="32" y1="20" x2="36" y2="42" stroke="#FF6464" stroke-width="0.6" stroke-dasharray="1.5,1"/>
                <line x1="32" y1="20" x2="40" y2="54" stroke="#60C0FF" stroke-width="0.6" stroke-dasharray="1.5,1"/>
                <line x1="32" y1="20" x2="48" y2="62" stroke="#80FFA0" stroke-width="0.6" stroke-dasharray="1.5,1"/>
                <!-- 角标（ANB 角） -->
                <path d="M34 30 A 8 8 0 0 0 38 36" fill="none" stroke="white" stroke-width="0.5"/>
                <!-- 角标（SNB 角） -->
                <path d="M33 25 A 12 12 0 0 0 37 50" fill="none" stroke="white" stroke-width="0.5" opacity="0.7"/>
                <!-- 角标（SNA 角） -->
                <path d="M33 22 A 18 18 0 0 0 35.5 40" fill="none" stroke="white" stroke-width="0.5" opacity="0.7"/>
              </svg>
            </span>

          </div>
        </div>
      </div>

      <div class="features-section">
        <h2>{{ t('home.coreFeatures') }}</h2>
        <div class="features-grid">
          <div class="feature-card" @click="goToCephalometric">
            <div class="feature-icon">🩻</div>
            <h3>{{ t('home.cephalometricTitle') }}</h3>
            <p>{{ t('home.cephalometricDesc') }}</p>
          </div>
          <div class="feature-card" @click="goToPanoramic">
            <div class="feature-icon">🔬</div>
            <h3>{{ t('home.panoramicTitle') }}</h3>
            <p>{{ t('home.panoramicDesc') }}</p>
          </div>
          <div class="feature-card" @click="goToAutocrop">
            <div class="feature-icon">📷</div>
            <h3>{{ t('home.autocropTitle') }}</h3>
            <p>{{ t('home.autocropDesc') }}</p>
          </div>
          <div class="feature-card" @click="goToDentalQA">
            <div class="feature-icon">💬</div>
            <h3>{{ t('home.dentalQATitle') }}</h3>
            <p>{{ t('home.dentalQADesc') }}</p>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-number">100万+</div>
          <div class="stat-label">{{ t('home.statPatients') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">98.5%</div>
          <div class="stat-label">{{ t('home.statAccuracy') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">500+</div>
          <div class="stat-label">{{ t('home.statDoctors') }}</div>
        </div>
      </div>
    </main>

    <footer class="home-footer">
      <p>{{ t('home.footer') }}</p>
    </footer>
  </div>
</template>

<script setup>
import TopNav from '../components/TopNav.vue'
import { useRouter } from 'vue-router'
import { t } from '../i18n/index.js'

const router = useRouter()

const goToCephalometric = () => {
  router.push('/cephalometric')
}

const goToPanoramic = () => {
  router.push('/panoramic')
}

const goToAutocrop = () => {
  router.push('/autocrop')
}

const goToDentalQA = () => {
  router.push('/dental-qa')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.home-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 12px 30px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  font-size: 20px;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover,
.nav-item.active {
  color: #667eea;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.dropdown-btn:hover {
  color: #667eea;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-radius: 8px;
  margin-top: 4px;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.dropdown-content a:hover {
  background: #f5f7fa;
}

.lang-dropdown {
  position: relative;
}

.lang-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.lang-btn:hover {
  background: #e8e8e8;
}

.lang-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  min-width: 90px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-radius: 8px;
  margin-top: 4px;
}

.lang-dropdown:hover .lang-content {
  display: block;
}

.lang-content a {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.lang-content a:hover {
  background: #f5f7fa;
}

.home-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 60px;
  margin-bottom: 40px;
  color: white;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 24px;
}

.hero-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.primary-btn {
  background: white;
  color: #667eea;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-visual {
  width: 300px;
  height: 300px;
}

.medical-icons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.medical-icons .icon-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

.medical-icons .icon-svg svg {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
}

.medical-icons .icon-svg:nth-child(2) { animation-delay: 0.5s; }
.medical-icons .icon-svg:nth-child(3) { animation-delay: 1s; }
.medical-icons .icon-svg:nth-child(4) { animation-delay: 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.features-section {
  margin-bottom: 40px;
}

.features-section h2 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.25s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 8px;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
}

.home-footer {
  background: #333;
  padding: 20px;
  text-align: center;
  color: white;
  margin-top: 40px;
}
</style>