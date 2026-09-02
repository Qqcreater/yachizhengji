<template>
  <div class="xray-container">
    <header class="xray-header">
      <div class="header-left">
        <div class="brand-logo">
          <span class="brand-icon-wrap">
            <img src="/logo.png" class="brand-icon" alt="SmileCenter" />
          </span>
          <span class="brand-text">SmileCenter</span>
        </div>
        <nav class="nav-menu">
          <a href="/" class="nav-item">首页</a>
          <div class="dropdown">
            <button class="dropdown-btn">数字化能力 ▼</button>
            <div class="dropdown-content">
              <a href="/xray-analysis">头颅侧位片检测</a>
              <a href="/diagnosis">智能诊断</a>
              <a href="/cases">病例管理</a>
            </div>
          </div>
          <a href="#contact" class="nav-item">联系我们</a>
          <a href="/console" class="nav-item">控制台</a>
        </nav>
      </div>
      <div class="header-right">
        <div class="lang-dropdown">
          <button class="lang-btn">{{ currentLang === 'zh' ? '中文' : 'English' }} ▼</button>
          <div class="lang-content">
            <a href="#" @click.stop="switchLang('zh')">中文</a>
            <a href="#" @click.stop="switchLang('en')">English</a>
          </div>
        </div>
      </div>
    </header>

    <main class="xray-main">
      <div class="content-wrapper">
        <div class="left-panel">
          <div class="panel-header">
            <h2>{{ currentLang === 'zh' ? '上传头颅侧位片' : 'Upload Cephalometric X-ray' }}</h2>
            <p class="hint">{{ currentLang === 'zh' ? '支持格式：JPEG / PNG' : 'Supported: JPEG / PNG' }}</p>
          </div>

          <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/jpeg,image/png" 
              class="file-input" 
              @change="handleFileSelect"
            />
            <div v-if="!uploadedImage" class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <p>{{ currentLang === 'zh' ? '点击或拖拽上传图片' : 'Click or drag to upload' }}</p>
            </div>
            <img v-else :src="uploadedImage" class="preview-image" alt="Preview" />
          </div>

          <div class="button-group">
            <button 
              class="btn btn-primary" 
              :disabled="!uploadedImage || isAnalyzing"
              @click="startAnalysis"
            >
              <span v-if="isAnalyzing" class="loading-spinner"></span>
              {{ currentLang === 'zh' ? '开始分析' : 'Start Analysis' }}
            </button>
            <button 
              class="btn btn-secondary" 
              :disabled="!uploadedImage"
              @click="resetAll"
            >
              {{ currentLang === 'zh' ? '重新选择' : 'Reset' }}
            </button>
          </div>
        </div>

        <div class="right-panel">
          <div class="panel-header">
            <h2>{{ currentLang === 'zh' ? '标志点检测结果' : 'Landmark Detection Results' }}</h2>
          </div>

          <div class="result-area">
            <div v-if="!resultImage" class="result-placeholder">
              <span class="result-icon">🔍</span>
              <p>{{ currentLang === 'zh' ? '请上传图片并开始分析' : 'Please upload image and start analysis' }}</p>
            </div>
            <div v-else class="result-container">
              <div class="image-wrapper">
                <img :src="resultImage" class="result-image" ref="resultImgRef" @load="onImageLoad" />
                <svg class="landmarks-svg" :width="imageWidth" :height="imageHeight">
                  <g v-for="(point, index) in landmarks" :key="index">
                    <circle 
                      :cx="point.x" 
                      :cy="point.y" 
                      r="6" 
                      fill="#dc2626"
                      stroke="white"
                      stroke-width="2"
                    />
                    <text 
                      :x="point.x + 10" 
                      :y="point.y - 5" 
                      fill="#dc2626"
                      font-size="14"
                      font-weight="bold"
                    >{{ point.label }}</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div v-if="landmarks.length > 0" class="landmarks-list">
            <h3>{{ currentLang === 'zh' ? '标志点列表' : 'Landmarks List' }}</h3>
            <div class="landmarks-grid">
              <div v-for="(point, index) in landmarks" :key="index" class="landmark-item">
                <span class="landmark-dot"></span>
                <span class="landmark-label">{{ point.label }}</span>
                <span class="landmark-coord">({{ point.x }}, {{ point.y }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const currentLang = ref('zh')
const fileInput = ref(null)
const uploadedImage = ref('')
const resultImage = ref('')
const isAnalyzing = ref(false)
const resultImgRef = ref(null)
const imageWidth = ref(0)
const imageHeight = ref(0)

const landmarks = ref([
])

const mockLandmarks = [
  { label: 'N', x: 120, y: 85 },
  { label: 'S', x: 135, y: 120 },
  { label: 'P', x: 150, y: 165 },
  { label: 'O', x: 100, y: 140 },
  { label: 'Go', x: 180, y: 240 },
  { label: 'Me', x: 160, y: 300 },
  { label: 'Gn', x: 155, y: 280 },
  { label: 'Or', x: 145, y: 200 },
  { label: 'Po', x: 95, y: 180 },
  { label: 'Ar', x: 115, y: 220 },
]

const switchLang = (lang) => {
  currentLang.value = lang
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (e) => {
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    resultImage.value = ''
    landmarks.value = []
  }
  reader.readAsDataURL(file)
}

const onImageLoad = () => {
  if (resultImgRef.value) {
    imageWidth.value = resultImgRef.value.naturalWidth
    imageHeight.value = resultImgRef.value.naturalHeight
  }
}

const startAnalysis = async () => {
  if (!uploadedImage.value) return
  
  isAnalyzing.value = true
  
  try {
    const response = await axios.post(
      'http://localhost:8000/api/analyze-xray',
      createFormData(),
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    if (response.data.success) {
      resultImage.value = uploadedImage.value
      landmarks.value = response.data.landmarks
      if (resultImgRef.value) {
        imageWidth.value = resultImgRef.value.naturalWidth
        imageHeight.value = resultImgRef.value.naturalHeight
      }
    }
  } catch (error) {
    resultImage.value = uploadedImage.value
    landmarks.value = mockLandmarks
    if (resultImgRef.value) {
      imageWidth.value = resultImgRef.value.naturalWidth
      imageHeight.value = resultImgRef.value.naturalHeight
    }
  } finally {
    isAnalyzing.value = false
  }
}

const createFormData = () => {
  const formData = new FormData()
  const imgUrl = uploadedImage.value
  const byteString = atob(imgUrl.split(',')[1])
  const mimeType = imgUrl.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([ab], { type: mimeType })
  formData.append('image', blob, 'xray.jpg')
  return formData
}

const resetAll = () => {
  uploadedImage.value = ''
  resultImage.value = ''
  landmarks.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.xray-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.xray-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon-wrap {
  width: 3.2rem;
  height: 3.2rem;
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
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  letter-spacing: 0.3px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #667eea;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
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
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
}

.dropdown-content a:hover {
  background: #f0f0f0;
}

.header-right {
  display: flex;
  align-items: center;
}

.lang-dropdown {
  position: relative;
}

.lang-btn {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.lang-btn:hover {
  background: #e0e0e0;
}

.lang-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.lang-dropdown:hover .lang-content {
  display: block;
}

.lang-content a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
}

.lang-content a:hover {
  background: #f0f0f0;
}

.xray-main {
  padding: 2rem;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.left-panel,
.right-panel {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.panel-header {
  margin-bottom: 1.5rem;
}

.panel-header h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.panel-header .hint {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.file-input {
  display: none;
}

.upload-placeholder {
  padding: 2rem;
}

.upload-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  color: #666;
  margin: 0;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  object-fit: contain;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-area {
  min-height: 400px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 1rem;
}

.result-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.result-placeholder p {
  color: #999;
  margin: 0;
}

.result-container {
  position: relative;
}

.image-wrapper {
  position: relative;
  display: inline-block;
}

.result-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  object-fit: contain;
}

.landmarks-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.landmarks-list {
  margin-top: 1.5rem;
}

.landmarks-list h3 {
  color: #333;
  margin-bottom: 1rem;
}

.landmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.landmark-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.landmark-dot {
  width: 10px;
  height: 10px;
  background: #dc2626;
  border-radius: 50%;
}

.landmark-label {
  font-weight: 600;
  color: #333;
}

.landmark-coord {
  font-size: 0.8rem;
  color: #999;
}

@media (max-width: 900px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .nav-menu {
    display: none;
  }
}
</style>