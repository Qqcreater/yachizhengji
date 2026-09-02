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

            <!-- ① 带金属托槽+弓丝的正畸牙齿 -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico1bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F8E8FF"/><stop offset="100%" stop-color="#D8B4F8"/>
                  </linearGradient>
                  <linearGradient id="ico1tooth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F0ECF8"/>
                  </linearGradient>
                  <linearGradient id="ico1gum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFB8D0"/><stop offset="100%" stop-color="#FF90B0"/>
                  </linearGradient>
                  <linearGradient id="ico1bracket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F0F0F8"/><stop offset="100%" stop-color="#A0A8B8"/>
                  </linearGradient>
                  <linearGradient id="ico1wire" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E0E8F0"/><stop offset="100%" stop-color="#8090A0"/>
                  </linearGradient>
                  <radialGradient id="ico1hl" cx="0.3" cy="0.2" r="0.6">
                    <stop offset="0%" stop-color="white" stop-opacity="0.8"/><stop offset="100%" stop-color="white" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 背景圆角矩形 -->
                <rect x="4" y="4" width="72" height="72" rx="16" fill="url(#ico1bg)"/>
                <!-- 牙龈带 -->
                <path d="M14 28 Q40 22 66 28 Q64 36 56 36 Q48 34 40 34 Q32 34 24 36 Q16 36 14 28Z" fill="url(#ico1gum)" stroke="#FF80A8" stroke-width="0.8"/>
                <!-- 左门牙 -->
                <path d="M22 34 Q20 42 22 54 Q24 62 28 62 Q30 62 30 54 Q30 42 28 34Z" fill="url(#ico1tooth)" stroke="#D8C8E8" stroke-width="0.6"/>
                <!-- 右门牙 -->
                <path d="M34 34 Q32 42 34 54 Q36 62 40 62 Q42 62 42 54 Q42 42 40 34Z" fill="url(#ico1tooth)" stroke="#D8C8E8" stroke-width="0.6"/>
                <!-- 左尖牙 -->
                <path d="M46 34 Q44 44 46 56 Q48 63 52 60 Q52 50 50 34Z" fill="url(#ico1tooth)" stroke="#D8C8E8" stroke-width="0.6"/>
                <!-- 右磨牙 -->
                <path d="M56 36 Q54 46 56 56 Q60 60 62 56 Q62 46 60 36Z" fill="url(#ico1tooth)" stroke="#D8C8E8" stroke-width="0.6"/>
                <!-- 托槽（4颗） -->
                <rect x="22" y="38" width="6" height="4" rx="1" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <rect x="34" y="38" width="6" height="4" rx="1" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <rect x="46" y="40" width="6" height="4" rx="1" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <rect x="56" y="42" width="6" height="4" rx="1" fill="url(#ico1bracket)" stroke="#7A8694" stroke-width="0.4"/>
                <!-- 托槽槽沟 -->
                <rect x="23" y="39.5" width="4" height="1" fill="#4A5560"/>
                <rect x="35" y="39.5" width="4" height="1" fill="#4A5560"/>
                <rect x="47" y="41.5" width="4" height="1" fill="#4A5560"/>
                <rect x="57" y="43.5" width="4" height="1" fill="#4A5560"/>
                <!-- 弓丝 -->
                <path d="M16 40 L22 40 L28 40 L34 40 L40 40 L46 42 L52 42 L58 44 L64 44" fill="none" stroke="url(#ico1wire)" stroke-width="1.5" stroke-linecap="round"/>
                <!-- 高光 -->
                <ellipse cx="24" cy="40" rx="1.5" ry="0.6" fill="white" opacity="0.7"/>
                <ellipse cx="36" cy="40" rx="1.5" ry="0.6" fill="white" opacity="0.7"/>
              </svg>
            </span>

            <!-- ② 口扫仪/扫描仪（手柄+扫描头+光线） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico2bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#D8F8F0"/><stop offset="100%" stop-color="#80D8C8"/>
                  </linearGradient>
                  <linearGradient id="ico2body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F0F8FF"/><stop offset="100%" stop-color="#B0D0E8"/>
                  </linearGradient>
                  <linearGradient id="ico2head" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E0F0F8"/><stop offset="100%" stop-color="#80B8D8"/>
                  </linearGradient>
                  <linearGradient id="ico2light" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="100%" stop-color="#60D0B0" stop-opacity="0.3"/>
                  </linearGradient>
                  <radialGradient id="ico2glow" cx="0.5" cy="0.7" r="0.5">
                    <stop offset="0%" stop-color="#40E0B0" stop-opacity="0.4"/><stop offset="100%" stop-color="#40E0B0" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 背景圆角矩形 -->
                <rect x="4" y="4" width="72" height="72" rx="16" fill="url(#ico2bg)"/>
                <!-- 扫描光晕 -->
                <ellipse cx="40" cy="56" rx="24" ry="8" fill="url(#ico2glow)"/>
                <!-- 手柄（上部分） -->
                <rect x="34" y="8" width="12" height="22" rx="4" fill="url(#ico2body)" stroke="#7090A8" stroke-width="0.6"/>
                <!-- 手柄纹理 -->
                <line x1="36" y1="14" x2="44" y2="14" stroke="#90B0C8" stroke-width="0.4"/>
                <line x1="36" y1="18" x2="44" y2="18" stroke="#90B0C8" stroke-width="0.4"/>
                <!-- 连接颈 -->
                <rect x="36" y="28" width="8" height="6" fill="url(#ico2body)" stroke="#7090A8" stroke-width="0.4"/>
                <!-- 扫描头（倒梯形） -->
                <path d="M26 34 L54 34 L50 48 L30 48 Z" fill="url(#ico2head)" stroke="#60A0C0" stroke-width="0.6"/>
                <!-- 扫描头窗口 -->
                <rect x="30" y="38" width="20" height="6" rx="1" fill="#1A2A3A" opacity="0.3"/>
                <!-- 扫描光线（扇形） -->
                <path d="M30 44 L22 62 L26 64 L34 46Z" fill="url(#ico2light)"/>
                <path d="M36 46 L34 66 L38 66 L40 46Z" fill="url(#ico2light)"/>
                <path d="M44 46 L48 64 L52 62 L46 44Z" fill="url(#ico2light)"/>
                <!-- 扫描线（横线动画感） -->
                <line x1="24" y1="56" x2="56" y2="56" stroke="#40E0B0" stroke-width="1" opacity="0.6"/>
                <line x1="26" y1="60" x2="54" y2="60" stroke="#40E0B0" stroke-width="0.8" opacity="0.4"/>
                <!-- LED 指示灯 -->
                <circle cx="40" cy="12" r="1.5" fill="#40E0B0"/>
                <!-- 高光 -->
                <ellipse cx="38" cy="16" rx="2" ry="4" fill="white" opacity="0.4"/>
              </svg>
            </span>

            <!-- ③ 头影测量分析图表（网格+角度弧+SNA/ANB标注） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico3bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F8D8E8"/><stop offset="100%" stop-color="#E8A0C8"/>
                  </linearGradient>
                  <linearGradient id="ico3line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#FF6464"/><stop offset="100%" stop-color="#FFB060"/>
                  </linearGradient>
                  <linearGradient id="ico3line2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#6464FF"/><stop offset="100%" stop-color="#64B0FF"/>
                  </linearGradient>
                </defs>
                <!-- 背景圆角矩形 -->
                <rect x="4" y="4" width="72" height="72" rx="16" fill="url(#ico3bg)"/>
                <!-- 网格 -->
                <g stroke="rgba(255,255,255,0.3)" stroke-width="0.3" fill="none">
                  <line x1="14" y1="14" x2="14" y2="66"/>
                  <line x1="24" y1="14" x2="24" y2="66"/>
                  <line x1="34" y1="14" x2="34" y2="66"/>
                  <line x1="44" y1="14" x2="44" y2="66"/>
                  <line x1="54" y1="14" x2="54" y2="66"/>
                  <line x1="64" y1="14" x2="64" y2="66"/>
                  <line x1="12" y1="22" x2="66" y2="22"/>
                  <line x1="12" y1="32" x2="66" y2="32"/>
                  <line x1="12" y1="42" x2="66" y2="42"/>
                  <line x1="12" y1="52" x2="66" y2="52"/>
                  <line x1="12" y1="62" x2="66" y2="62"/>
                </g>
                <!-- 坐标轴 -->
                <line x1="12" y1="14" x2="12" y2="66" stroke="rgba(255,255,255,0.5)" stroke-width="0.6"/>
                <line x1="12" y1="66" x2="66" y2="66" stroke="rgba(255,255,255,0.5)" stroke-width="0.6"/>
                <!-- SN 基准线（黄色） -->
                <line x1="18" y1="26" x2="58" y2="26" stroke="#FFD060" stroke-width="1.2"/>
                <text x="56" y="24" font-size="4" fill="#FFD060" font-family="Arial">SN</text>
                <!-- SNA 线（红色） -->
                <line x1="22" y1="26" x2="38" y2="50" stroke="url(#ico3line)" stroke-width="1"/>
                <text x="30" y="42" font-size="3.5" fill="#FF6464" font-family="Arial" font-weight="bold">SNA</text>
                <!-- SNB 线（蓝色） -->
                <line x1="22" y1="26" x2="42" y2="56" stroke="url(#ico3line2)" stroke-width="1"/>
                <text x="40" y="52" font-size="3.5" fill="#6464FF" font-family="Arial" font-weight="bold">SNB</text>
                <!-- SNA 角度弧 -->
                <path d="M26 26 A 8 8 0 0 0 28 33" fill="none" stroke="#FF6464" stroke-width="0.6"/>
                <!-- SNB 角度弧 -->
                <path d="M28 26 A 10 10 0 0 0 31 35" fill="none" stroke="#6464FF" stroke-width="0.6"/>
                <!-- ANB 角度弧（填充） -->
                <path d="M28 33 A 8 8 0 0 1 31 35 L28 33Z" fill="#FF8060" opacity="0.3"/>
                <text x="30" y="36" font-size="3" fill="#FF8060" font-family="Arial">ANB</text>
                <!-- 标志点 S -->
                <circle cx="22" cy="26" r="2" fill="#FFD060" stroke="white" stroke-width="0.5"/>
                <text x="16" y="25" font-size="3.5" fill="#FFD060" font-family="Arial">S</text>
                <!-- 标志点 N -->
                <circle cx="54" cy="26" r="2" fill="#FFD060" stroke="white" stroke-width="0.5"/>
                <text x="50" y="32" font-size="3.5" fill="#FFD060" font-family="Arial">N</text>
                <!-- 标志点 A -->
                <circle cx="38" cy="50" r="2" fill="#FF6464" stroke="white" stroke-width="0.5"/>
                <text x="35" y="57" font-size="3.5" fill="#FF6464" font-family="Arial">A</text>
                <!-- 标志点 B -->
                <circle cx="42" cy="56" r="2" fill="#6464FF" stroke="white" stroke-width="0.5"/>
                <text x="44" y="62" font-size="3.5" fill="#6464FF" font-family="Arial">B</text>
                <!-- 底部数据条 -->
                <rect x="14" y="62" width="10" height="3" rx="1" fill="#FF6464" opacity="0.6"/>
                <rect x="26" y="62" width="14" height="3" rx="1" fill="#FFB060" opacity="0.6"/>
                <rect x="42" y="62" width="8" height="3" rx="1" fill="#6464FF" opacity="0.6"/>
              </svg>
            </span>

            <!-- ④ AI正畸方案设计（牙齿+脑回+电路纹路+火花） -->
            <span class="icon-svg">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ico4bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E8D8F8"/><stop offset="100%" stop-color="#C0A0E8"/>
                  </linearGradient>
                  <linearGradient id="ico4tooth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#F0E8F8"/>
                  </linearGradient>
                  <linearGradient id="ico4brain" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#FFB0D0"/><stop offset="100%" stop-color="#E090B0"/>
                  </linearGradient>
                  <linearGradient id="ico4circuit" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#60C0FF"/><stop offset="100%" stop-color="#A060E0"/>
                  </linearGradient>
                  <radialGradient id="ico4spark" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stop-color="#FFE060" stop-opacity="0.9"/><stop offset="100%" stop-color="#FFE060" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <!-- 背景圆角矩形 -->
                <rect x="4" y="4" width="72" height="72" rx="16" fill="url(#ico4bg)"/>
                <!-- 脑回纹理（左上区域） -->
                <path d="M14 16 Q18 12 24 14 Q28 16 26 20 Q24 24 28 26 Q32 28 28 32" fill="none" stroke="url(#ico4brain)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                <path d="M12 22 Q16 20 20 22 Q24 24 20 28" fill="none" stroke="url(#ico4brain)" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
                <!-- 电路纹路（右上区域） -->
                <path d="M52 12 L52 18 L58 18 L58 24 L54 24" fill="none" stroke="url(#ico4circuit)" stroke-width="0.8" stroke-linecap="round"/>
                <path d="M62 16 L58 16 L58 22 L64 22" fill="none" stroke="url(#ico4circuit)" stroke-width="0.8" stroke-linecap="round"/>
                <circle cx="52" cy="12" r="1" fill="#60C0FF"/>
                <circle cx="64" cy="22" r="1" fill="#A060E0"/>
                <circle cx="54" cy="24" r="1" fill="#60C0FF"/>
                <!-- 中央大牙 -->
                <path d="M28 30 Q26 20 36 18 Q44 18 50 22 Q54 28 52 36 Q50 46 44 52 Q40 54 36 52 Q30 46 28 36Z" fill="url(#ico4tooth)" stroke="#D0B0E0" stroke-width="0.8"/>
                <!-- 牙齿上的托槽 -->
                <rect x="36" y="30" width="10" height="4" rx="1" fill="#C0C8D8" stroke="#8A98A8" stroke-width="0.3"/>
                <rect x="37.5" y="31.5" width="7" height="1" fill="#5A6470"/>
                <!-- 弓丝 -->
                <path d="M24 32 L36 32 L46 32 L58 32" fill="none" stroke="#A0A8B8" stroke-width="1.2" stroke-linecap="round"/>
                <!-- 电路纹路连接到牙齿 -->
                <path d="M52 24 L48 28" fill="none" stroke="url(#ico4circuit)" stroke-width="0.6"/>
                <path d="M28 32 L20 32 L20 38" fill="none" stroke="url(#ico4circuit)" stroke-width="0.6"/>
                <circle cx="20" cy="38" r="1" fill="#60C0FF"/>
                <!-- 火花/灵感（右上） -->
                <circle cx="58" cy="14" r="4" fill="url(#ico4spark)"/>
                <path d="M58 10 L58 18 M54 14 L62 14 M55 11 L61 17 M61 11 L55 17" stroke="#FFE060" stroke-width="0.6" stroke-linecap="round" opacity="0.7"/>
                <!-- 火花（左下） -->
                <circle cx="20" cy="52" r="3" fill="url(#ico4spark)"/>
                <path d="M20 49 L20 55 M17 52 L23 52" stroke="#FFE060" stroke-width="0.5" stroke-linecap="round" opacity="0.6"/>
                <!-- AI 文字标识 -->
                <text x="34" y="44" font-size="5" fill="#8060A0" font-family="Arial" font-weight="bold" opacity="0.4">AI</text>
                <!-- 牙根 -->
                <path d="M34 50 L34 62 M40 50 L40 62 M44 50 L44 60" stroke="#D0B0E0" stroke-width="0.5" fill="none" opacity="0.5"/>
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