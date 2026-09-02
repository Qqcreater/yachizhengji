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
          </div>
        </div>
        <div class="hero-visual">
          <div class="medical-icons">

            <!-- ① 白色大牙+粉色牙龈带 -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico1tooth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F0E8F8"/>
                  </linearGradient>
                  <linearGradient id="ico1gum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFC8DC"/><stop offset="100%" stop-color="#FFA0C0"/>
                  </linearGradient>
                  <linearGradient id="ico1wire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E0E8F0"/><stop offset="100%" stop-color="#A0B0C0"/>
                  </linearGradient>
                  <linearGradient id="ico1bracket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F0F0F8"/><stop offset="100%" stop-color="#C0C8D8"/>
                  </linearGradient>
                  <radialGradient id="ico1hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.8"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 粉色牙龈带 -->
                <path d="M10 52 Q40 46 70 52 Q68 60 60 60 Q50 58 40 58 Q30 58 20 60 Q12 60 10 52Z"
                      fill="url(#ico1gum)" stroke="#FF80B0" stroke-width="0.8"/>
                <!-- 白色大门牙 -->
                <path d="M28 14 Q24 10 32 8 Q40 6 48 8 Q56 10 52 14 Q54 30 48 42 Q44 48 40 42 Q36 48 32 42 Q26 30 28 14Z"
                      fill="url(#ico1tooth)" stroke="#D8B8E8" stroke-width="1"/>
                <path d="M28 14 Q24 10 32 8 Q40 6 48 8 Q56 10 52 14 Q54 30 48 42 Q44 48 40 42 Q36 48 32 42 Q26 30 28 14Z"
                      fill="url(#ico1hl)" opacity="0.6"/>
                <!-- 中央托槽 -->
                <rect x="35" y="22" width="10" height="5" rx="1.5" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.5"/>
                <rect x="36.5" y="24" width="7" height="1" rx="0.3" fill="#4A5560"/>
                <!-- 弓丝 -->
                <path d="M22 24 L35 24 M45 24 L58 24" fill="none" stroke="url(#ico1wire)" stroke-width="1.6" stroke-linecap="round"/>
                <!-- 左右托槽 -->
                <rect x="20" y="22" width="6" height="4" rx="1" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <rect x="54" y="22" width="6" height="4" rx="1" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <!-- 牙根 -->
                <path d="M34 48 L36 62 L40 62 L40 48Z" fill="url(#ico1tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <path d="M44 48 L44 62 L48 62 L50 48Z" fill="url(#ico1tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 高光 -->
                <ellipse cx="38" cy="14" rx="4" ry="2" fill="white" opacity="0.7"/>
              </svg>
            </span>

            <!-- ② 蓝色音符 -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico2note" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#2563EB"/>
                  </linearGradient>
                  <linearGradient id="ico2stem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#1D4ED8"/>
                  </linearGradient>
                  <radialGradient id="ico2hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.5"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 音符头1（左下椭圆） -->
                <ellipse cx="22" cy="58" rx="9" ry="6.5" fill="url(#ico2note)" stroke="#1E40AF" stroke-width="1" transform="rotate(-20 22 58)"/>
                <ellipse cx="22" cy="58" rx="9" ry="6.5" fill="url(#ico2hl)" transform="rotate(-20 22 58)"/>
                <!-- 音符头2（右下椭圆） -->
                <ellipse cx="50" cy="54" rx="8" ry="6" fill="url(#ico2note)" stroke="#1E40AF" stroke-width="0.8" transform="rotate(-20 50 54)"/>
                <ellipse cx="50" cy="54" rx="8" ry="6" fill="url(#ico2hl)" transform="rotate(-20 50 54)"/>
                <!-- 音符杆1 -->
                <rect x="29.5" y="18" width="3" height="42" fill="url(#ico2stem)" rx="1"/>
                <!-- 音符杆2 -->
                <rect x="56" y="18" width="2.5" height="38" fill="url(#ico2stem)" rx="1"/>
                <!-- 顶部连接横梁 -->
                <path d="M29.5 18 L58.5 18 L58.5 24 L29.5 24Z" fill="url(#ico2note)" stroke="#1E40AF" stroke-width="0.6"/>
                <!-- 第二根横梁（十六分音符感） -->
                <path d="M29.5 26 L58.5 26 L58.5 30 L29.5 30Z" fill="url(#ico2note)" stroke="#1E40AF" stroke-width="0.5" opacity="0.85"/>
                <!-- 高光 -->
                <ellipse cx="20" cy="56" rx="3" ry="1.5" fill="white" opacity="0.5" transform="rotate(-20 20 56)"/>
                <ellipse cx="48" cy="52" rx="2.5" ry="1.2" fill="white" opacity="0.4" transform="rotate(-20 48 52)"/>
              </svg>
            </span>

            <!-- ③ 牙列卡片+牙龈 -->
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
                    <stop offset="0%" stop-color="white" stop-opacity="0.7"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 上排牙龈带 -->
                <path d="M8 22 Q40 14 72 22 Q70 30 62 30 Q52 28 40 28 Q28 28 18 30 Q10 30 8 22Z"
                      fill="url(#ico3gum)" stroke="#FF80B0" stroke-width="0.8"/>
                <!-- 上排7颗牙 -->
                <ellipse cx="12" cy="32" rx="3.5" ry="5.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="21" cy="30" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="31" cy="29" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="40" cy="28" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="49" cy="29" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="59" cy="30" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="68" cy="32" rx="3.5" ry="5.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 高光 -->
                <ellipse cx="40" cy="28" rx="4.5" ry="7" fill="url(#ico3hl)"/>
                <ellipse cx="31" cy="29" rx="4.2" ry="6.5" fill="url(#ico3hl)"/>
                <!-- 7个托槽 -->
                <rect x="9" y="31" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="18" y="30" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="28" y="29" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="37" y="28" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="46" y="29" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="56" y="30" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="65" y="31" width="6" height="2.5" rx="0.8" fill="url(#ico3bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <!-- 上排弓丝 -->
                <path d="M12 32.5 L21 32 L31 31.5 L40 31 L49 31.5 L59 32 L68 32.5" fill="none" stroke="url(#ico3wire)" stroke-width="1.2" stroke-linecap="round"/>
                <!-- 下排牙龈带 -->
                <path d="M8 58 Q40 66 72 58 Q70 50 62 50 Q52 52 40 52 Q28 52 18 50 Q10 50 8 58Z"
                      fill="url(#ico3gum)" stroke="#FF80B0" stroke-width="0.8"/>
                <!-- 下排7颗牙 -->
                <ellipse cx="12" cy="50" rx="3.5" ry="5.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="21" cy="52" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="31" cy="53" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="40" cy="54" rx="4.5" ry="7" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="49" cy="53" rx="4.2" ry="6.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="59" cy="52" rx="4" ry="6" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="68" cy="50" rx="3.5" ry="5.5" fill="url(#ico3tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 下排弓丝 -->
                <path d="M12 49.5 Q40 56 68 49.5" fill="none" stroke="url(#ico3wire)" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </span>

            <!-- ④ 粉色底座牙列模型 -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico4base" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFD0E0"/><stop offset="100%" stop-color="#FFB0C8"/>
                  </linearGradient>
                  <linearGradient id="ico4tooth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F4E8F8"/>
                  </linearGradient>
                  <linearGradient id="ico4bracket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F0F0F8"/><stop offset="100%" stop-color="#C0C8D8"/>
                  </linearGradient>
                  <linearGradient id="ico4wire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E0E8F0"/><stop offset="100%" stop-color="#A0B0C0"/>
                  </linearGradient>
                  <radialGradient id="ico4hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.6"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 粉色U形底座 -->
                <path d="M8 54 Q8 70 40 70 Q72 70 72 54 Q72 48 66 48 Q66 60 40 60 Q14 60 14 48 Q8 48 8 54Z"
                      fill="url(#ico4base)" stroke="#FF90B0" stroke-width="0.8"/>
                <path d="M8 54 Q8 70 40 70 Q72 70 72 54 Q72 48 66 48 Q66 60 40 60 Q14 60 14 48 Q8 48 8 54Z"
                      fill="url(#ico4hl)"/>
                <!-- 上排牙龈 -->
                <path d="M14 22 Q40 16 66 22 Q64 28 58 28 Q50 26 40 26 Q30 26 22 28 Q16 28 14 22Z"
                      fill="url(#ico4base)" stroke="#FF90B0" stroke-width="0.6" opacity="0.6"/>
                <!-- 上排5颗牙 -->
                <ellipse cx="20" cy="30" rx="3.8" ry="5.5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="30" cy="28" rx="4" ry="6" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="40" cy="27" rx="4.2" ry="6.5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="50" cy="28" rx="4" ry="6" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="60" cy="30" rx="3.8" ry="5.5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 高光 -->
                <ellipse cx="40" cy="27" rx="4.2" ry="6.5" fill="url(#ico4hl)"/>
                <!-- 上排5个托槽 -->
                <rect x="17" y="29" width="6" height="2.2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="27" y="28" width="6" height="2.2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="37" y="27" width="6" height="2.2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="47" y="28" width="6" height="2.2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="57" y="29" width="6" height="2.2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <!-- 上排弓丝 -->
                <path d="M20 30.5 L30 30 L40 29.5 L50 30 L60 30.5" fill="none" stroke="url(#ico4wire)" stroke-width="1.2" stroke-linecap="round"/>
                <!-- 下排5颗牙（底座上方） -->
                <ellipse cx="20" cy="44" rx="3.8" ry="5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="30" cy="43" rx="4" ry="5.5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="40" cy="42" rx="4.2" ry="6" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="50" cy="43" rx="4" ry="5.5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <ellipse cx="60" cy="44" rx="3.8" ry="5" fill="url(#ico4tooth)" stroke="#D8B8E8" stroke-width="0.6"/>
                <!-- 下排5个托槽 -->
                <rect x="17" y="43" width="6" height="2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="27" y="42" width="6" height="2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="37" y="41" width="6" height="2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="47" y="42" width="6" height="2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <rect x="57" y="43" width="6" height="2" rx="0.8" fill="url(#ico4bracket)" stroke="#A0A8B8" stroke-width="0.3"/>
                <!-- 下排弓丝 -->
                <path d="M20 44.5 Q40 48 60 44.5" fill="none" stroke="url(#ico4wire)" stroke-width="1.2" stroke-linecap="round"/>
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
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 800px;
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
