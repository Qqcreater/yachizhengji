<template>
  <div class="panoramic-container">
    <TopNav />

    <header class="page-header">
      <h1>{{ t('panoramic.pageTitle') }}</h1>
      <p>{{ t('panoramic.pageDesc') }}</p>
    </header>

    <main class="panoramic-main">
      <div class="content-wrapper">
        <div class="left-panel">
          <div class="panel-header">
            <h2>{{ t('panoramic.originalImage') }}</h2>
            <p class="hint">{{ t('panoramic.uploadHint') }}</p>
          </div>

          <div
            class="upload-area"
            :class="{ 'has-image': uploadedImage }"
            @click="handleUploadAreaClick"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png"
              class="file-input"
              @change="handleFileSelect"
            />
            <div v-if="!uploadedImage" class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <p>{{ t('panoramic.uploadPlaceholder') }}</p>
              <p class="sub-hint">{{ t('panoramic.uploadSubHint') }}</p>
            </div>
            <!-- 左侧小图静态预览 -->
            <div
              v-else
              class="thumb-container"
              @click.stop="openOriginalPreview"
            >
              <img
                :src="uploadedImage"
                class="preview-image"
                :alt="t('panoramic.originalImage')"
              />
              <div class="thumb-overlay">
                <span>{{ t('panoramic.clickToViewLarge') }}</span>
              </div>
            </div>
          </div>

          <div class="zoom-tip" v-if="uploadedImage">
            <span>{{ t('panoramic.clickPreviewToView') }}</span>
          </div>

          <div class="button-group">
            <button
              class="btn btn-primary"
              :disabled="!uploadedImage || isAnalyzing"
              @click="startAnalysis"
            >
              <span v-if="isAnalyzing" class="loading-spinner"></span>
              {{ isAnalyzing ? t('panoramic.analyzing') : (analysisDone ? t('panoramic.reAnalyze') : t('panoramic.startAnalysis')) }}
            </button>
            <button
              class="btn btn-secondary"
              :disabled="!uploadedImage"
              @click="resetAll"
            >
              {{ t('panoramic.reSelect') }}
            </button>
          </div>
        </div>

        <div class="right-panel">
          <div class="panel-header">
            <h2>{{ t('panoramic.resultTitle') }}</h2>
            <p class="hint" v-if="!analysisDone">{{ t('panoramic.pleaseUpload') }}</p>
            <p class="hint" v-else>
              {{ tp('panoramic.totalDetected', { total: teeth.length, permanent: permanentCount, deciduous: deciduousCount }) }}
            </p>
          </div>

          <div class="result-area" :class="{ filled: analysisDone }">
            <div v-if="!resultImage" class="result-placeholder">
              <span class="result-icon">🔬</span>
              <p>{{ t('panoramic.resultPlaceholder') }}</p>
            </div>
            <!-- 右侧小图静态预览 -->
            <div
              v-else
              class="thumb-container"
              @click.stop="openPreview"
            >
              <div class="image-wrapper">
                <img
                  :src="resultImage"
                  class="result-image"
                  ref="resultImgRef"
                  @load="onResultImageLoad"
                />
                <svg
                  v-if="teeth.length > 0 && displayReady"
                  class="landmarks-svg"
                  :viewBox="svgViewBox"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g v-for="tooth in teeth" :key="tooth.id">
                    <!-- 牙齿轮廓多边形 -->
                    <polygon
                      v-if="tooth.hasContour"
                      :points="getContourPoints(tooth.contour)"
                      :fill="getToothColor(tooth, 0.18)"
                      :stroke="getToothColor(tooth, 1)"
                      :stroke-width="naturalWidth * 0.0028"
                      stroke-linejoin="round"
                    />
                    <!-- 中心点 -->
                    <circle
                      v-if="hasCenter(tooth)"
                      :cx="getToothCenter(tooth).x"
                      :cy="getToothCenter(tooth).y"
                      :r="naturalWidth * 0.004"
                      :fill="getToothColor(tooth, 1)"
                      stroke="#ffffff"
                      :stroke-width="naturalWidth * 0.003"
                    />
                    <!-- 牙位编号展示前端自增序号 -->
                    <text
                      v-if="hasCenter(tooth)"
                      :x="getToothLabelPosition(tooth).x"
                      :y="getToothLabelPosition(tooth).y"
                      :font-size="naturalWidth * 0.022"
                      font-weight="600"
                      text-anchor="middle"
                      fill="none"
                      stroke="#ffffff"
                      :stroke-width="naturalWidth * 0.008"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >{{ tooth.displayIndex }}</text>
                    <text
                      v-if="hasCenter(tooth)"
                      :x="getToothLabelPosition(tooth).x"
                      :y="getToothLabelPosition(tooth).y"
                      :font-size="naturalWidth * 0.022"
                      font-weight="600"
                      text-anchor="middle"
                      :fill="getToothColor(tooth, 1)"
                    >{{ tooth.displayIndex }}</text>
                  </g>
                </svg>
              </div>
              <div class="thumb-overlay">
                <span>{{ t('panoramic.clickToViewLarge') }}</span>
              </div>
            </div>
          </div>

          <div class="zoom-tip" v-if="resultImage">
            <span>{{ t('panoramic.clickPreviewToView') }}</span>
            <span v-if="teeth.length > 0">|</span>
            <span v-if="teeth.length > 0">{{ t('panoramic.toothLocate') }}</span>
          </div>

          <!-- 牙位列表（纵向滚动） -->
          <div v-if="teeth.length > 0" class="landmarks-list">
            <div class="table-header">
              <span>{{ t('panoramic.toothNo') }}</span>
              <span>{{ t('panoramic.type') }}</span>
              <span>{{ t('panoramic.xCoord') }}</span>
              <span>{{ t('panoramic.yCoord') }}</span>
            </div>
            <div class="table-body">
              <div
                v-for="tooth in sortedTeeth"
                :key="tooth.id"
                class="table-row"
                :class="{ 'row-permanent': tooth.type === 'permanent', 'row-deciduous': tooth.type === 'deciduous' }"
                @click="focusToothInModal(tooth)"
              >
                <span class="landmark-label">
                  <span class="status-dot" :style="{ background: getToothColor(tooth, 1) }"></span>
                  {{ tooth.displayIndex }}
                </span>
                <span>
                  <span class="status-tag" :style="{ background: getToothColor(tooth, 0.15), color: getToothColor(tooth, 1), borderColor: getToothColor(tooth, 0.4) }">
                    {{ getTypeText(tooth.type) }}
                  </span>
                </span>
                <span>{{ (tooth.x * 100).toFixed(1) }}%</span>
                <span>{{ (tooth.y * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下方分析面板 -->
      <div v-if="analysisDone" class="bottom-panels">
        <!-- 统计卡 -->
        <div class="bottom-card stats-card">
          <div class="card-header">
            <span class="card-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">📊</span>
            <div>
              <h3>{{ t('panoramic.statsTitle') }}</h3>
              <p class="card-subtitle">{{ t('panoramic.statsSubtitle') }}</p>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-item stat-total">
              <div class="stat-value">{{ teeth.length }}</div>
              <div class="stat-label">{{ t('panoramic.totalLabel') }}</div>
            </div>
            <div class="stat-item stat-permanent">
              <div class="stat-value">{{ permanentCount }}</div>
              <div class="stat-label">{{ t('panoramic.permanentLabel') }}</div>
            </div>
            <div class="stat-item stat-deciduous">
              <div class="stat-value">{{ deciduousCount }}</div>
              <div class="stat-label">{{ t('panoramic.deciduousLabel') }}</div>
            </div>
          </div>
          <!-- 图例 -->
          <div class="legend">
            <div class="legend-item">
              <span class="legend-dot" style="background: #22C55E;"></span>
              <span>{{ t('panoramic.permanent') }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #F59E0B;"></span>
              <span>{{ t('panoramic.deciduous') }}</span>
            </div>
            <div class="legend-item" v-if="unknownCount > 0">
              <span class="legend-dot" style="background: #6B7280;"></span>
              <span>{{ t('panoramic.unclassified') }}</span>
            </div>
          </div>
        </div>

        <!-- 恒牙列表 -->
        <div class="bottom-card teeth-card permanent-card">
          <div class="card-header">
            <span class="card-icon" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);">🦷</span>
            <div>
              <h3>{{ t('panoramic.permanentGroupTitle') }}</h3>
              <p class="card-subtitle">{{ tp('panoramic.permanentGroupSubtitle', { count: permanentCount }) }}</p>
            </div>
          </div>
          <div v-if="permanentTeeth.length === 0" class="empty-teeth">
            <span class="empty-icon">—</span>
            <p>{{ t('panoramic.noPermanent') }}</p>
          </div>
          <div v-else class="teeth-grid permanent-grid">
            <div
              v-for="tooth in permanentTeeth"
              :key="tooth.id"
              class="tooth-chip permanent-chip"
              @click="focusToothInModal(tooth)"
            >
              <span class="chip-num">{{ tooth.displayIndex }}</span>
            </div>
          </div>
        </div>

        <!-- 乳牙列表 -->
        <div class="bottom-card teeth-card deciduous-card">
          <div class="card-header">
            <span class="card-icon" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">🦷</span>
            <div>
              <h3>{{ t('panoramic.deciduousGroupTitle') }}</h3>
              <p class="card-subtitle">{{ tp('panoramic.deciduousGroupSubtitle', { count: deciduousCount }) }}</p>
            </div>
          </div>
          <div v-if="deciduousTeeth.length === 0" class="empty-teeth">
            <span class="empty-icon">—</span>
            <p>{{ t('panoramic.noDeciduous') }}</p>
          </div>
          <div v-else class="teeth-grid deciduous-grid">
            <div
              v-for="tooth in deciduousTeeth"
              :key="tooth.id"
              class="tooth-chip deciduous-chip"
              @click="focusToothInModal(tooth)"
            >
              <span class="chip-num">{{ tooth.displayIndex }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 大图弹窗（原始图片 & 识别结果共用） -->
    <div v-if="previewOpen" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <button class="preview-close" @click="closePreview">×</button>
        <div
          class="preview-container"
          ref="previewContainerRef"
          @wheel.prevent="handleWheel"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >
          <div
            class="preview-image-wrapper"
            :style="previewStyle"
          >
            <img
              :src="previewMode === 'original' ? uploadedImage : resultImage"
              class="preview-img"
            />
            <svg
              v-if="previewMode === 'result' && teeth.length > 0 && displayReady"
              class="preview-landmarks-svg"
              :viewBox="svgViewBox"
              preserveAspectRatio="xMidYMid meet"
            >
              <g v-for="tooth in teeth" :key="tooth.id">
                <polygon
                  v-if="tooth.hasContour"
                  :points="getContourPoints(tooth.contour)"
                  :fill="getToothColor(tooth, 0.18)"
                  :stroke="getToothColor(tooth, 1)"
                  :stroke-width="naturalWidth * 0.0028"
                  stroke-linejoin="round"
                />
                <circle
                  v-if="hasCenter(tooth)"
                  :cx="getToothCenter(tooth).x"
                  :cy="getToothCenter(tooth).y"
                  :r="naturalWidth * 0.004"
                  :fill="getToothColor(tooth, 1)"
                  stroke="#ffffff"
                  :stroke-width="naturalWidth * 0.003"
                />
                <text
                  v-if="hasCenter(tooth)"
                  :x="getToothLabelPosition(tooth).x"
                  :y="getToothLabelPosition(tooth).y"
                  :font-size="naturalWidth * 0.022"
                  font-weight="600"
                  text-anchor="middle"
                  fill="none"
                  stroke="#ffffff"
                  :stroke-width="naturalWidth * 0.008"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >{{ tooth.displayIndex }}</text>
                <text
                  v-if="hasCenter(tooth)"
                  :x="getToothLabelPosition(tooth).x"
                  :y="getToothLabelPosition(tooth).y"
                  :font-size="naturalWidth * 0.022"
                  font-weight="600"
                  text-anchor="middle"
                  :fill="getToothColor(tooth, 1)"
                >{{ tooth.displayIndex }}</text>
              </g>
            </svg>
          </div>
        </div>
        <div class="preview-tip">
          <span>{{ t('panoramic.scrollZoom') }}</span>
          <span>|</span>
          <span>{{ t('panoramic.dragPan') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TopNav from '../components/TopNav.vue'
import { t, tp } from '../i18n/index.js'
import { SHARED_API_KEY, SHARED_TIMEOUT_MS, callOpenApi, formatErrorMessage } from '../utils/openapi.js'

// ===== 接口配置 =====
// 与 CephaloView 保持一致的配置结构，复用同一套 fetch 请求模板
const API_CONFIG = {
  // 官方曲面断层片轮廓分割接口（来自 openapi-lab 控制台 API 文档）
  endpoint: '/openapi/v1/x/toothless',
  apiKey: SHARED_API_KEY,
  timeout: SHARED_TIMEOUT_MS,
  // toothless 接口仅需 img 字段，无需额外参数
  // （已通过 API 直连测试验证：加/不加 sym 参数返回相同结果）
  extraFields: {},
}

const fileInput = ref(null)
const uploadedImage = ref('')
const originalFile = ref(null)
const resultImage = ref('')
const isAnalyzing = ref(false)
const analysisDone = ref(false)
const resultImgRef = ref(null)

const naturalWidth = ref(800)
const naturalHeight = ref(1000)
const displayReady = ref(false)
const teeth = ref([])
const apiResponse = ref(null)

// ===== 牙齿分类颜色 =====
const TYPE_COLORS = {
  permanent: '#22C55E',
  deciduous: '#F59E0B',
  unknown:   '#6B7280',
}

const getToothColor = (tooth, alpha = 1) => {
  const hex = TYPE_COLORS[tooth?.type] || TYPE_COLORS.unknown
  if (alpha >= 1) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const getTypeText = (type) => {
  const map = { permanent: t('panoramic.permanent'), deciduous: t('panoramic.deciduous'), unknown: t('panoramic.unclassified') }
  return map[type] || t('panoramic.unclassified')
}

// ===== 归一化坐标 -> 像素坐标 =====
const transNormPoint = (normX, normY, imgOriginW, imgOriginH, boxW, boxH) => {
  const scale = Math.min(boxW / imgOriginW, boxH / imgOriginH)
  const offsetX = (boxW - imgOriginW * scale) / 2
  const offsetY = (boxH - imgOriginH * scale) / 2
  let renderX = offsetX + normX * imgOriginW * scale
  let renderY = offsetY + normY * imgOriginH * scale
  renderX = Math.max(0, Math.min(boxW, renderX))
  renderY = Math.max(0, Math.min(boxH, renderY))
  return { x: renderX, y: renderY }
}

const svgViewBox = computed(() => {
  if (naturalWidth.value > 0 && naturalHeight.value > 0) {
    return `0 0 ${naturalWidth.value} ${naturalHeight.value}`
  }
  return '0 0 800 1000'
})

const getToothCenter = (tooth) => {
  if (typeof tooth.x === 'number' && typeof tooth.y === 'number') {
    return transNormPoint(tooth.x, tooth.y, naturalWidth.value, naturalHeight.value, naturalWidth.value, naturalHeight.value)
  }
  if (tooth.contour && tooth.contour.length > 0) {
    const sum = tooth.contour.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 })
    const cx = sum.x / tooth.contour.length
    const cy = sum.y / tooth.contour.length
    return transNormPoint(cx, cy, naturalWidth.value, naturalHeight.value, naturalWidth.value, naturalHeight.value)
  }
  return { x: 0, y: 0 }
}

const hasCenter = (tooth) => {
  return (typeof tooth.x === 'number' && typeof tooth.y === 'number') ||
         (tooth.contour && tooth.contour.length > 0)
}

// ===== 牙位编号偏移 & 防重叠 =====
const DEFAULT_DX = 3
const DEFAULT_DY = -3

const getBaseOffset = (xPercent, yPercent) => {
  const baseOffset = { x: DEFAULT_DX, y: DEFAULT_DY }
  if (xPercent < 10) baseOffset.x = 3
  else if (xPercent > 90) baseOffset.x = -3
  if (yPercent < 10) baseOffset.y = 3
  else if (yPercent > 90) baseOffset.y = -3
  return baseOffset
}

const collisionAvoidance = ref([])

const getToothLabelPosition = (tooth) => {
  const center = getToothCenter(tooth)
  const adjusted = collisionAvoidance.value.find(item => item.label === tooth.displayIndex)
  if (adjusted) return { x: adjusted.x, y: adjusted.y }

  const normX = center.x / naturalWidth.value
  const normY = center.y / naturalHeight.value
  const xPercent = normX * 100
  const yPercent = normY * 100

  const baseOffset = getBaseOffset(xPercent, yPercent)

  let finalX = center.x + baseOffset.x
  let finalY = center.y + baseOffset.y

  const fontSize = naturalWidth.value * 0.022
  const textWidth = (String(tooth.displayIndex)?.length || 1) * fontSize * 0.6
  const textVisualTop = fontSize * 0.75
  const margin = 3

  if (finalX < margin) finalX = margin
  else if (finalX + textWidth > naturalWidth.value - margin) {
    finalX = naturalWidth.value - margin - textWidth
  }

  if (finalY - textVisualTop < margin) finalY = margin + textVisualTop
  else if (finalY + fontSize * 0.25 > naturalHeight.value - margin) {
    finalY = naturalHeight.value - margin - fontSize * 0.25
  }

  return { x: finalX, y: finalY }
}

const updateCollisionAvoidance = () => {
  if (teeth.value.length < 2) {
    collisionAvoidance.value = []
    return
  }

  const fontSize = naturalWidth.value * 0.022
  const margin = 3

  const positions = teeth.value
    .filter(tooth => hasCenter(tooth))
    .map(tooth => {
      const pos = getToothLabelPosition(tooth)
      return {
        label: tooth.displayIndex,
        x: pos.x,
        y: pos.y,
        width: (String(tooth.displayIndex)?.length || 1) * fontSize * 0.6,
        height: fontSize
      }
    })

  const adjusted = [...positions]

  for (let i = 0; i < adjusted.length; i++) {
    for (let j = i + 1; j < adjusted.length; j++) {
      const dx = Math.abs(adjusted[i].x - adjusted[j].x)
      const dy = Math.abs(adjusted[i].y - adjusted[j].y)
      const minDistX = (adjusted[i].width + adjusted[j].width) / 2 + 1
      const minDistY = (adjusted[i].height + adjusted[j].height) / 2 + 1

      if (dx < minDistX && dy < minDistY) {
        const overlapX = minDistX - dx
        const overlapY = minDistY - dy

        const directionX = adjusted[i].x > adjusted[j].x ? 1 : -1
        const directionY = adjusted[i].y > adjusted[j].y ? 1 : -1

        adjusted[i].x += directionX * overlapX * 0.3
        adjusted[j].x -= directionX * overlapX * 0.3
        adjusted[i].y += directionY * overlapY * 0.2
        adjusted[j].y -= directionY * overlapY * 0.2
      }
    }
  }

  for (let i = 0; i < adjusted.length; i++) {
    if (adjusted[i].x < margin) adjusted[i].x = margin
    else if (adjusted[i].x + adjusted[i].width > naturalWidth.value - margin) {
      adjusted[i].x = naturalWidth.value - margin - adjusted[i].width
    }
    if (adjusted[i].y - fontSize * 0.75 < margin) adjusted[i].y = margin + fontSize * 0.75
    else if (adjusted[i].y + fontSize * 0.25 > naturalHeight.value - margin) {
      adjusted[i].y = naturalHeight.value - margin - fontSize * 0.25
    }
  }

  collisionAvoidance.value = adjusted
}

// ===== 牙齿轮廓多边形渲染 =====
const getContourPoints = (contour) => {
  if (!Array.isArray(contour) || contour.length === 0) return ''
  return contour
    .map(p => {
      const pos = transNormPoint(p.x, p.y, naturalWidth.value, naturalHeight.value, naturalWidth.value, naturalHeight.value)
      return `${pos.x.toFixed(2)},${pos.y.toFixed(2)}`
    })
    .join(' ')
}

// ===== 弹窗缩放/拖拽 =====
const previewOpen = ref(false)
const previewMode = ref('result') // 'original' | 'result'
const previewContainerRef = ref(null)
const previewScale = ref(1)
const previewTranslateX = ref(0)
const previewTranslateY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragStartTranslateX = ref(0)
const dragStartTranslateY = ref(0)

const previewStyle = computed(() => ({
  transform: `translate(${previewTranslateX.value}px, ${previewTranslateY.value}px) scale(${previewScale.value})`,
  transformOrigin: 'center center'
}))

const openPreview = () => {
  if (!resultImage.value) return
  previewMode.value = 'result'
  previewOpen.value = true
  previewScale.value = 1
  previewTranslateX.value = 0
  previewTranslateY.value = 0
}

const openOriginalPreview = () => {
  if (!uploadedImage.value) return
  previewMode.value = 'original'
  previewOpen.value = true
  previewScale.value = 1
  previewTranslateX.value = 0
  previewTranslateY.value = 0
}

const closePreview = () => {
  previewOpen.value = false
}

const handleWheel = (e) => {
  const container = previewContainerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.5, Math.min(5, previewScale.value * delta))

  const scaleDiff = newScale / previewScale.value
  previewTranslateX.value = mouseX - scaleDiff * (mouseX - previewTranslateX.value)
  previewTranslateY.value = mouseY - scaleDiff * (mouseY - previewTranslateY.value)
  previewScale.value = newScale
}

const handleMouseDown = (e) => {
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  dragStartTranslateX.value = previewTranslateX.value
  dragStartTranslateY.value = previewTranslateY.value
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  previewTranslateX.value = dragStartTranslateX.value + (e.clientX - dragStartX.value)
  previewTranslateY.value = dragStartTranslateY.value + (e.clientY - dragStartY.value)
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && previewOpen.value) closePreview()
}

// ===== 点击牙号 -> 弹窗定位并高亮 =====
const focusToothInModal = (tooth) => {
  if (!resultImage.value) return
  previewMode.value = 'result'
  previewOpen.value = true
  previewScale.value = 1
  previewTranslateX.value = 0
  previewTranslateY.value = 0

  setTimeout(() => {
    if (!previewContainerRef.value) return
    const center = getToothCenter(tooth)
    const rect = previewContainerRef.value.getBoundingClientRect()
    const scale = 2.5
    previewScale.value = scale
    previewTranslateX.value = rect.width / 2 - center.x * scale
    previewTranslateY.value = rect.height / 2 - center.y * scale
  }, 50)
}

// ===== 生命周期 =====
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// ===== 上传 =====
const handleUploadAreaClick = (e) => {
  if (uploadedImage.value) return
  if (fileInput.value) fileInput.value.click()
}

const handleDrop = (e) => {
  const files = e.dataTransfer.files
  if (files.length > 0) processFile(files[0])
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) processFile(files[0])
}

const processFile = (file) => {
  originalFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    resetAnalysis()
  }
  reader.readAsDataURL(file)
}

const resetAnalysis = () => {
  resultImage.value = ''
  teeth.value = []
  analysisDone.value = false
  displayReady.value = false
  collisionAvoidance.value = []
  apiResponse.value = null
}

const onResultImageLoad = (e) => {
  if (!resultImgRef.value) return
  naturalWidth.value = e.target.naturalWidth
  naturalHeight.value = e.target.naturalHeight

  setTimeout(() => {
    displayReady.value = true
    updateCollisionAvoidance()
  }, 150)
}

const waitForImageLoad = () => {
  return new Promise((resolve) => {
    const checkImage = () => {
      if (resultImgRef.value && resultImgRef.value.complete) {
        setTimeout(resolve, 100)
      } else {
        setTimeout(checkImage, 50)
      }
    }
    checkImage()
  })
}

// ===== 解析接口返回 =====
const ANATOMY_FILTER_ENABLED = ref(true)
const ANATOMY_TNAMES = new Set(['01', '02', '03'])
const isAnatomyStructure = (label) => ANATOMY_TNAMES.has(String(label))

const parseTeeth = (rawData) => {
  if (!rawData) return []

  // ===== 优先级链：从已知字段名提取牙齿数组 =====
  // toothless API 成功响应结构: {code:0, r:{_:"...", sym:[...]}}
  // sym 是牙齿数组，必须优先从 sym 字段取，不能 fallback 到对象遍历
  let teethArray = null

  if (Array.isArray(rawData)) {
    // r 本身就是数组
    teethArray = rawData
    console.log(`parseTeeth: rawData 是数组，共 ${teethArray.length} 项`)
  } else if (typeof rawData === 'object') {
    // 按优先级检查已知数组字段: sym > data > result > teeth > list > items
    for (const key of ['sym', 'data', 'result', 'teeth', 'list', 'items']) {
      if (Array.isArray(rawData[key])) {
        teethArray = rawData[key]
        console.log(`parseTeeth: 从字段 "${key}" 提取牙齿数组，共 ${teethArray.length} 项`)
        break
      }
    }

    // 如果没有已知数组字段，尝试从对象属性中提取（兼容旧格式：牙位号做 key）
    if (!teethArray) {
      const entries = Object.entries(rawData)
        .filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v))
      if (entries.length > 0) {
        teethArray = entries.map(([, v]) => v)
        console.log(`parseTeeth: 从对象属性提取牙齿数据，共 ${teethArray.length} 项`)
      }
    }
  }

  if (!teethArray || teethArray.length === 0) {
    console.log('parseTeeth: 未找到有效的牙齿数组，rawData =', JSON.stringify(rawData).substring(0, 200))
    return []
  }

  let parsed = teethArray.map((item, idx) => parseTooth(item, idx)).filter(Boolean)

  // 兜底过滤解剖结构误检（01/02/03）
  if (ANATOMY_FILTER_ENABLED.value) {
    parsed = parsed.filter(tooth => !isAnatomyStructure(tooth.label))
  }

  // ===== 序号重排：过滤后从 1 开始顺序递增 =====
  let seq = 1
  parsed.forEach(tooth => {
    tooth.displayIndex = seq++
  })

  return parsed
}

const parseTooth = (item, idx) => {
  if (!item || typeof item !== 'object') return null

  const label = String(item.tname ?? item.tno ?? item.id ?? item.label ?? `T${idx + 1}`)

  let toothType = 'unknown'
  if (item.type === 1 || item.type === '1') {
    toothType = 'permanent'
  } else if (item.type === 2 || item.type === '2') {
    toothType = 'deciduous'
  } else {
    const tnameNum = parseInt(label)
    if (!isNaN(tnameNum)) {
      if (tnameNum >= 11 && tnameNum <= 48) {
        toothType = 'permanent'
      } else if (tnameNum >= 51 && tnameNum <= 85) {
        toothType = 'deciduous'
      }
    }
  }

  const isTooth = item.isTooth !== 0 && item.isTooth !== false
  if (!isTooth) return null

  let cx = NaN, cy = NaN
  if (Array.isArray(item.cxy) && item.cxy.length >= 2) {
    cx = parseFloat(item.cxy[0])
    cy = parseFloat(item.cxy[1])
  }

  if ((isNaN(cx) || isNaN(cy)) && Array.isArray(item.bbox) && item.bbox.length >= 4) {
    cx = (parseFloat(item.bbox[0]) + parseFloat(item.bbox[2])) / 2
    cy = (parseFloat(item.bbox[1]) + parseFloat(item.bbox[3])) / 2
  }

  let outline = null
  if (Array.isArray(item.outline) && item.outline.length >= 3) {
    outline = item.outline.map(p => {
      if (Array.isArray(p) && p.length >= 2) return { x: parseFloat(p[0]), y: parseFloat(p[1]) }
      if (p && typeof p === 'object') return { x: parseFloat(p.x ?? p.X), y: parseFloat(p.y ?? p.Y) }
      return null
    }).filter(p => p && !isNaN(p.x) && !isNaN(p.y))
  }

  if ((isNaN(cx) || isNaN(cy)) && outline && outline.length > 0) {
    const sum = outline.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 })
    cx = sum.x / outline.length
    cy = sum.y / outline.length
  }

  if ((isNaN(cx) || isNaN(cy)) && (!outline || outline.length < 3)) return null

  const W = naturalWidth.value || 1
  const H = naturalHeight.value || 1
  const normClamp = (v) => Math.max(0, Math.min(1, isNaN(v) ? 0 : v))

  // ===== 坐标双单位自适应：>1 当绝对像素（需除以 W/H），<=1 当归一化 =====
  const adaptNorm = (val, dimension) => {
    if (isNaN(val)) return 0
    return val > 1 ? normClamp(val / dimension) : normClamp(val)
  }

  let centerNorm = null
  if (!isNaN(cx) && !isNaN(cy)) {
    centerNorm = { x: adaptNorm(cx, W), y: adaptNorm(cy, H) }
  }

  let outlineNorm = null
  if (outline && outline.length >= 3) {
    outlineNorm = outline.map(p => ({ x: adaptNorm(p.x, W), y: adaptNorm(p.y, H) }))
  }

  return {
    id: `tooth-${label}-${idx}`,
    label,
    displayIndex: 0,
    tname: label,
    type: toothType,
    x: centerNorm?.x ?? null,
    y: centerNorm?.y ?? null,
    contour: outlineNorm,
    hasContour: !!(outlineNorm && outlineNorm.length >= 3),
    area: item.area ?? null,
    bbox: item.bbox ?? null,
  }
}

// ===== 调接口（统一标准模板，与 CephaloView 对齐）=====
const startAnalysis = async () => {
  if (!originalFile.value) {
    alert(t('panoramic.pleaseUpload'))
    return
  }
  if (isAnalyzing.value) return

  // ===== 预检：排查前端文件传输异常 =====
  const file = originalFile.value
  console.group('🔍 [Panoramic] 预检')
  console.log('文件名:', file.name)
  console.log('文件大小:', (file.size / 1024).toFixed(1), 'KB')
  console.log('MIME类型:', file.type)
  console.log('是否 File 对象:', file instanceof File)
  console.groupEnd()

  if (!(file instanceof File)) {
    alert('【前端文件传输异常】\n\n上传对象不是标准 File 类型，请重新选择图片。\n\n当前类型：' + Object.prototype.toString.call(file))
    return
  }
  if (!file.type.startsWith('image/')) {
    alert('【前端文件传输异常】\n\n文件类型不是图片，请上传 JPEG 或 PNG 格式。\n\n当前类型：' + file.type)
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('【图片尺寸不达标】\n\n文件过大（>10MB），请压缩后重试。\n\n当前大小：' + (file.size / 1024 / 1024).toFixed(1) + ' MB')
    return
  }
  if (file.size < 1024) {
    alert('【图片尺寸不达标】\n\n文件过小（<1KB），可能已损坏，请重新导出图片。')
    return
  }

  isAnalyzing.value = true
  displayReady.value = false
  teeth.value = []
  analysisDone.value = false
  collisionAvoidance.value = []

  try {
    const result = await callOpenApi({
      endpoint: API_CONFIG.endpoint,
      file: originalFile.value,
      apiKey: API_CONFIG.apiKey,
      timeoutMs: API_CONFIG.timeout,
      extraFields: API_CONFIG.extraFields,
      pageType: 'panoramic',
    })

    if (result.ok && result.data) {
      const data = result.data
      apiResponse.value = data
      // toothless 成功响应: {code:0, r:{_:"...", sym:[...]}}
      // 优先从 r.sym 取牙齿数组，兼容 r 本身为数组/对象
      const rObj = data.r || data.data || data.result || {}
      
      if (!rObj || (Array.isArray(rObj) && rObj.length === 0) || (!Array.isArray(rObj) && Object.keys(rObj).length === 0)) {
        alert('接口未返回有效牙齿数据')
      } else {
        resultImage.value = uploadedImage.value
        await waitForImageLoad()
        teeth.value = parseTeeth(rObj)
        updateCollisionAvoidance()

        if (teeth.value.length === 0) {
          alert('解析后无有效牙齿数据')
        } else {
          analysisDone.value = true
          console.log(`✓ [Panoramic] 解析成功，共 ${teeth.value.length} 颗牙`)
        }
      }
    } else if (result.errClass) {
      // 区分三类报错：前端传输异常 / 图片不达标 / 参数缺失
      const errCode = result.errClass.code
      let msg = formatErrorMessage(result.errClass)
      
      if (errCode === 'invalid_data') {
        msg += '\n\n━━━ 排查建议 ━━━\n'
        msg += '1.【前端传输异常】按 F12 → Network → 查看请求体是否包含 File 文件（非 base64 字符串）\n'
        msg += '2.【图片不达标】曲面断层片需为标准全口全景X光片，灰度清晰、完整无遮挡\n'
        msg += '3.【参数缺失】当前仅传 img 字段（已验证 toothless 接口无需额外参数）\n\n'
        msg += '验证方案：登录 openapi-lab.ilmsmile.com.cn 后台，用同一张图片直接调用接口\n'
        msg += '- 若后台同样报 invalid data → 图片素材问题，更换标准曲面断层片\n'
        msg += '- 若后台返回正常 → 前端代码问题，检查 Network 请求体'
      }
      
      alert(msg)
    } else {
      alert('接口返回格式异常')
    }
  } catch (error) {
    console.error('=== [Panoramic] API调用失败 ===', error)
    alert('API调用失败，请检查网络连接或接口配置')
  } finally {
    isAnalyzing.value = false
    console.log('✅ [Panoramic] finally executed, isAnalyzing reset to false')
  }
}

const resetAll = () => {
  uploadedImage.value = ''
  originalFile.value = null
  resetAnalysis()
  if (fileInput.value) fileInput.value.value = ''
}

// ===== 计算属性 =====
const permanentCount = computed(() => teeth.value.filter(tooth => tooth.type === 'permanent').length)
const deciduousCount = computed(() => teeth.value.filter(tooth => tooth.type === 'deciduous').length)
const unknownCount = computed(() => teeth.value.filter(tooth => tooth.type === 'unknown').length)

const permanentTeeth = computed(() =>
  teeth.value
    .filter(tooth => tooth.type === 'permanent')
    .sort((a, b) => a.displayIndex - b.displayIndex)
)

const deciduousTeeth = computed(() =>
  teeth.value
    .filter(tooth => tooth.type === 'deciduous')
    .sort((a, b) => a.displayIndex - b.displayIndex)
)

const sortedTeeth = computed(() =>
  [...teeth.value].sort((a, b) => a.displayIndex - b.displayIndex)
)
</script>

<style scoped>
.panoramic-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px 24px;
  flex-shrink: 0;
}

.page-header h1 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.panoramic-main {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  box-sizing: border-box;
}

.content-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 20px;
  margin-bottom: 16px;
}

.left-panel,
.right-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.panel-header {
  margin-bottom: 16px;
  flex-shrink: 0;
}

.panel-header h2 {
  margin: 0 0 4px 0;
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.panel-header .hint {
  margin: 0;
  color: #999;
  font-size: 13px;
}

/* ===== 左侧上传区 ===== */
.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  margin-bottom: 8px;
  overflow: hidden;
  background: #fafafa;
  position: relative;
}

.upload-area:hover:not(.has-image) {
  border-color: #22C55E;
  background: #f0fdf4;
}

.upload-area.has-image {
  cursor: default;
  border-style: solid;
  border-color: #e8e8e8;
  background: #f5f5f5;
  padding: 0;
}

.file-input { display: none; }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon { font-size: 48px; margin-bottom: 14px; }

.upload-placeholder p {
  color: #999;
  margin: 0;
  font-size: 14px;
}

.sub-hint {
  font-size: 12px !important;
  color: #ccc !important;
  margin-top: 4px !important;
}

/* ===== 小图静态预览容器 ===== */
.thumb-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;
  user-select: none;
  overflow: hidden;
}

.thumb-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center center;
  border-radius: 10px;
}

.thumb-overlay {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.thumb-container:hover .thumb-overlay {
  opacity: 1;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  object-fit: contain;
  object-position: center center;
}

.zoom-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.zoom-tip span { display: inline-block; }

.button-group {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  min-height: 48px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #22C55E;
  color: #22C55E;
}

.btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== 右侧结果区 ===== */
.result-area {
  flex: 1;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fafafa;
  margin-bottom: 8px;
  transition: all 0.3s;
  position: relative;
  min-height: 380px;
}

.result-area.filled {
  border-style: solid;
  border-color: #e8e8e8;
  background: #f5f5f5;
}

.result-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.result-icon { font-size: 40px; margin-bottom: 10px; }

.result-placeholder p {
  color: #999;
  margin: 4px 0;
  font-size: 13px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center center;
  border-radius: 10px;
}

.landmarks-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* ===== 牙位列表（纵向滚动） ===== */
.landmarks-list {
  flex: 1;
  min-height: 0;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow: hidden;
}

.landmarks-list .table-header {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  padding: 10px 16px;
  font-size: 13px;
  background: #fafafa;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.landmarks-list .table-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.landmarks-list .table-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  padding: 10px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
  color: #333;
  align-items: center;
  transition: background 0.15s;
  cursor: pointer;
}

.landmarks-list .table-row:hover {
  background: #e8f5e9;
}

.landmarks-list .table-row.row-permanent {
  background: #f0fdf4;
}

.landmarks-list .table-row.row-deciduous {
  background: #fffbeb;
}

.landmarks-list .table-row:last-child { border-bottom: none; }

.landmark-label {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

/* ===== 底部面板 ===== */
.bottom-panels {
  display: grid;
  grid-template-columns: 0.9fr 1.3fr 1.3fr;
  gap: 16px;
  margin-top: 4px;
}

.bottom-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.card-subtitle {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #999;
}

/* 统计卡 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.stat-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-top: 3px solid #1890ff;
  border-radius: 8px;
  padding: 14px 10px;
  text-align: center;
}

.stat-total { border-top-color: #6366f1; }
.stat-total .stat-value { color: #6366f1; }

.stat-permanent { border-top-color: #22C55E; }
.stat-permanent .stat-value { color: #22C55E; }

.stat-deciduous { border-top-color: #F59E0B; }
.stat-deciduous .stat-value { color: #F59E0B; }

.stat-value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

/* 图例 */
.legend {
  display: flex;
  gap: 16px;
  padding: 10px 4px 0;
  border-top: 1px solid #f0f0f0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* 牙号分组列表 */
.teeth-card { display: flex; flex-direction: column; }

.permanent-card { border-top: 3px solid #22C55E; }
.deciduous-card { border-top: 3px solid #F59E0B; }

.teeth-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.tooth-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1.5px solid;
}

.permanent-chip {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.permanent-chip:hover {
  background: #22C55E;
  color: white;
  border-color: #22C55E;
  transform: translateY(-1px);
}

.deciduous-chip {
  background: #fffbeb;
  border-color: #fde68a;
  color: #d97706;
}

.deciduous-chip:hover {
  background: #F59E0B;
  color: white;
  border-color: #F59E0B;
  transform: translateY(-1px);
}

.empty-teeth {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.empty-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.empty-teeth p { margin: 0; font-size: 13px; }

/* ===== 弹窗 ===== */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  position: relative;
  width: 90%;
  height: 90%;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
}

.preview-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}

.preview-close:hover { background: rgba(255, 255, 255, 0.3); }

.preview-container {
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
}

.preview-landmarks-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.preview-tip {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 20px;
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.preview-tip span { display: inline-block; }

@media (max-width: 1100px) {
  .content-wrapper { grid-template-columns: 1fr; }
  .bottom-panels { grid-template-columns: 1fr; }
}
</style>