<template>
  <div class="diagnosis-container">
    <header class="diagnosis-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">🏥</div>
          <h1>智能医疗诊断平台</h1>
        </div>
        <nav class="nav-links">
          <a href="/" class="nav-link active">首页</a>
          <a href="/diagnosis" class="nav-link">诊断中心</a>
          <a href="/cases" class="nav-link">病例管理</a>
          <a href="/about" class="nav-link">关于我们</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="hero-section">
        <div class="hero-content">
          <h2>AI驱动的智能诊断助手</h2>
          <p>基于深度学习的医疗诊断系统，为您提供专业、准确的健康评估</p>
          <button class="primary-btn" @click="startDiagnosis">开始诊断</button>
        </div>
        <div class="hero-visual">
          <div class="health-icons">
            <span class="icon-item">❤️</span>
            <span class="icon-item">🧠</span>
            <span class="icon-item">🫁</span>
            <span class="icon-item">🦴</span>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h3>核心功能</h3>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="symptom-section" v-if="showSymptomForm">
        <h3>症状录入</h3>
        <div class="symptom-form">
          <div class="form-group">
            <label>选择您的症状：</label>
            <div class="symptom-tags">
              <span 
                v-for="symptom in availableSymptoms" 
                :key="symptom"
                :class="['symptom-tag', selectedSymptoms.includes(symptom) ? 'selected' : '']"
                @click="toggleSymptom(symptom)"
              >
                {{ symptom }}
              </span>
            </div>
          </div>
          <div class="form-group">
            <label>症状描述（选填）：</label>
            <textarea v-model="symptomDescription" placeholder="请详细描述您的症状..."></textarea>
          </div>
          <button class="primary-btn" @click="submitDiagnosis">提交诊断</button>
        </div>
      </div>

      <div class="result-section" v-if="showResult">
        <h3>诊断结果</h3>
        <div class="result-card">
          <div class="result-header">
            <div class="result-icon">{{ diagnosisResult.icon }}</div>
            <div class="result-title">{{ diagnosisResult.title }}</div>
          </div>
          <div class="result-content">
            <p><strong>可能疾病：</strong>{{ diagnosisResult.disease }}</p>
            <p><strong>匹配度：</strong><span class="match-rate">{{ diagnosisResult.matchRate }}</span></p>
            <p><strong>症状分析：</strong>{{ diagnosisResult.analysis }}</p>
            <p><strong>建议：</strong>{{ diagnosisResult.suggestion }}</p>
          </div>
          <div class="result-actions">
            <button class="primary-btn">预约挂号</button>
            <button class="secondary-btn">查看详细报告</button>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.patients }}</div>
            <div class="stat-label">服务患者</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.accuracy }}%</div>
            <div class="stat-label">诊断准确率</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.doctors }}</div>
            <div class="stat-label">专业医生</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.diseases }}</div>
            <div class="stat-label">覆盖病种</div>
          </div>
        </div>
      </div>
    </main>

    <footer class="diagnosis-footer">
      <p>© 2024 智能医疗诊断平台 | 版权所有</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const showSymptomForm = ref(false)
const showResult = ref(false)
const selectedSymptoms = ref([])
const symptomDescription = ref('')

const features = [
  { icon: '🔍', title: '智能诊断', description: '基于AI算法快速分析症状，提供准确诊断建议' },
  { icon: '📋', title: '病例管理', description: '完整记录就诊历史，便于跟踪治疗效果' },
  { icon: '👩⚕️', title: '专家咨询', description: '在线预约专家，获取专业医疗建议' },
  { icon: '💊', title: '用药指导', description: '智能用药提醒，确保用药安全' }
]

const availableSymptoms = [
  '头痛', '发热', '咳嗽', '乏力', '恶心', '胸闷', '关节痛', '失眠',
  '腹泻', '皮疹', '头晕', '呼吸困难', '心悸', '腹痛', '呕吐'
]

const stats = reactive({
  patients: '100万+',
  accuracy: 98.5,
  doctors: '500+',
  diseases: '2000+'
})

const diagnosisResult = reactive({
  icon: '✅',
  title: '诊断完成',
  disease: '普通感冒',
  matchRate: '95%',
  analysis: '根据您提供的症状（头痛、发热、咳嗽），系统分析结果显示您可能患有普通感冒。感冒通常由病毒引起，具有自限性。',
  suggestion: '建议多喝水、保证充足休息、避免劳累。如症状持续超过一周或加重，请及时就医。'
})

const startDiagnosis = () => {
  showSymptomForm.value = true
  showResult.value = false
}

const toggleSymptom = (symptom) => {
  const index = selectedSymptoms.value.indexOf(symptom)
  if (index > -1) {
    selectedSymptoms.value.splice(index, 1)
  } else {
    selectedSymptoms.value.push(symptom)
  }
}

const submitDiagnosis = () => {
  showResult.value = true
}
</script>

<style scoped>
.diagnosis-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.diagnosis-header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.logo-section h1 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #667eea;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.hero-content h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.hero-content p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.hero-visual {
  width: 300px;
  height: 300px;
}

.health-icons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.icon-item {
  font-size: 4rem;
  text-align: center;
  animation: float 3s ease-in-out infinite;
}

.icon-item:nth-child(2) { animation-delay: 0.5s; }
.icon-item:nth-child(3) { animation-delay: 1s; }
.icon-item:nth-child(4) { animation-delay: 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.features-section {
  margin-bottom: 2rem;
}

.features-section h3 {
  color: white;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.symptom-section,
.result-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.symptom-section h3,
.result-section h3 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.symptom-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.symptom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.symptom-tag {
  padding: 0.75rem 1.5rem;
  background: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.symptom-tag:hover {
  background: #e0e0e0;
}

.symptom-tag.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  resize: vertical;
  min-height: 100px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.result-card {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  padding: 2rem;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-icon {
  font-size: 3rem;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.result-content p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 0.75rem;
}

.match-rate {
  color: #28a745;
  font-weight: 700;
  font-size: 1.2rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.secondary-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-btn:hover {
  background: #667eea;
  color: white;
}

.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.diagnosis-footer {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  text-align: center;
  color: white;
}
</style>