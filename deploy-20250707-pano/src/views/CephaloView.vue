<template>
  <div class="cephalo-container">
    <TopNav />

    <header class="page-header">
      <h1>{{ t('cephalometric.pageTitle') }}</h1>
      <p>{{ t('cephalometric.pageDesc') }}</p>
    </header>

    <main class="cephalo-main">
      <div class="content-wrapper">
        <div class="left-panel">
          <div class="panel-header">
            <h2>{{ t('cephalometric.originalImage') }}</h2>
            <p class="hint">{{ t('cephalometric.uploadedHint') }}</p>
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
              <p>{{ t('cephalometric.uploadPlaceholder') }}</p>
              <p class="sub-hint">{{ t('cephalometric.uploadSubHint') }}</p>
            </div>
            <img
              v-else
              :src="uploadedImage"
              class="preview-image"
              :alt="t('cephalometric.originalImage')"
            />
          </div>

          <div class="preprocess-tip" v-if="!uploadedImage">
            <span class="tip-icon">💡</span>
            <div class="tip-content">
              <p class="tip-main">{{ t('cephalometric.preprocessTip') }}</p>
              <p class="tip-sub">{{ t('cephalometric.preprocessSubTip') }}</p>
            </div>
          </div>

          <div class="button-group">
            <button
              class="btn btn-primary"
              :disabled="!uploadedImage || isAnalyzing"
              @click="startAnalysis"
            >
              <span v-if="isAnalyzing" class="loading-spinner"></span>
              {{ isAnalyzing ? t('cephalometric.analyzing') : (landmarks.length > 0 ? t('cephalometric.reAnalyze') : t('cephalometric.startAnalysis')) }}
            </button>
            <button
              class="btn btn-secondary"
              :disabled="!uploadedImage"
              @click="resetAll"
            >
              {{ t('cephalometric.reSelect') }}
            </button>
          </div>
        </div>

        <div class="right-panel">
          <div class="panel-header">
            <h2>{{ t('cephalometric.resultTitle') }}</h2>
            <p class="hint" v-if="!resultImage">{{ t('cephalometric.pleaseUpload') }}</p>
            <p class="hint" v-else>{{ t('cephalometric.resultTitle') }}</p>
          </div>

          <div class="result-area" :class="{ filled: resultImage }">
            <div v-if="!resultImage" class="result-placeholder">
              <span class="result-icon">🔬</span>
              <p>{{ t('cephalometric.resultPlaceholder') }}</p>
            </div>
            <div v-else class="result-container" @click="openPreview">
              <div class="image-wrapper" ref="imageWrapperRef">
                <img 
                  :src="resultImage" 
                  class="result-image" 
                  ref="resultImgRef" 
                  @load="onResultImageLoad"
                />
                <svg 
                  v-if="landmarks.length > 0 && displayReady"
                  class="landmarks-svg"
                  :viewBox="svgViewBox"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g v-for="(point, index) in landmarks" :key="point.label">
                    <circle 
                      :cx="getPointPosition(point.x, point.y).x" 
                      :cy="getPointPosition(point.x, point.y).y" 
                      :r="naturalWidth * 0.004" 
                      fill="#e53935"
                      stroke="#ffffff"
                      :stroke-width="naturalWidth * 0.003"
                    />
                    <text 
                      :x="getTextX(point.x, point.y, point.label, 'small')" 
                      :y="getTextY(point.x, point.y, point.label, 'small')" 
                      fill="none"
                      :font-size="naturalWidth * 0.025"
                      font-weight="300"
                      stroke="#ffffff"
                      :stroke-width="naturalWidth * 0.008"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >{{ point.label }}</text>
                    <text 
                      :x="getTextX(point.x, point.y, point.label, 'small')" 
                      :y="getTextY(point.x, point.y, point.label, 'small')" 
                      fill="#000000"
                      :font-size="naturalWidth * 0.025"
                      font-weight="300"
                    >{{ point.label }}</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div v-if="landmarks.length > 0" class="landmarks-list">
            <div class="table-header">
              <span>{{ t('cephalometric.pointName') }}</span>
              <span>{{ t('cephalometric.xCoord') }}</span>
              <span>{{ t('cephalometric.yCoord') }}</span>
            </div>
            <div class="table-body">
              <div 
                v-for="(point, index) in landmarks" 
                :key="index" 
                class="table-row"
              >
                <span class="landmark-label">{{ point.label }}</span>
                <span>{{ (point.x * 100).toFixed(1) }}%</span>
                <span>{{ (point.y * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

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
          <img :src="resultImage" class="preview-img" />
          <svg 
            v-if="landmarks.length > 0 && displayReady"
            class="preview-landmarks-svg"
            :viewBox="svgViewBox"
            preserveAspectRatio="xMidYMid meet"
          >
            <g v-for="(point, index) in landmarks" :key="point.label">
              <circle 
                :cx="getPointPosition(point.x, point.y).x" 
                :cy="getPointPosition(point.x, point.y).y" 
                :r="naturalWidth * 0.004" 
                fill="#e53935"
                stroke="#ffffff"
                :stroke-width="naturalWidth * 0.003"
              />
              <text 
                :x="getTextX(point.x, point.y, point.label, 'preview')" 
                :y="getTextY(point.x, point.y, point.label, 'preview')" 
                fill="none"
                :font-size="naturalWidth * 0.025"
                font-weight="300"
                stroke="#ffffff"
                :stroke-width="naturalWidth * 0.008"
                stroke-linecap="round"
                stroke-linejoin="round"
              >{{ point.label }}</text>
              <text 
                :x="getTextX(point.x, point.y, point.label, 'preview')" 
                :y="getTextY(point.x, point.y, point.label, 'preview')" 
                fill="#000000"
                :font-size="naturalWidth * 0.025"
                font-weight="300"
              >{{ point.label }}</text>
            </g>
          </svg>
        </div>
      </div>
      <div class="preview-tip">
        <span>{{ t('cephalometric.scrollZoom') }}</span>
        <span>|</span>
        <span>{{ t('cephalometric.dragPan') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import TopNav from '../components/TopNav.vue'
import { t } from '../i18n/index.js'
import { SHARED_API_KEY, SHARED_TIMEOUT_MS, callOpenApi, formatErrorMessage } from '../utils/openapi.js'

// ===== 接口配置 =====
const API_CONFIG = {
  endpoint: '/openapi/v1/x/hneck/p17',
  apiKey: SHARED_API_KEY,
  timeout: SHARED_TIMEOUT_MS,
  // hneck/p17 接口需要 cvm 参数（Cervical Vertebral Maturity，0=不评估）
  extraFields: { cvm: '0' },
}

const fileInput = ref(null)
const uploadedImage = ref('')
const originalFile = ref(null)
const resultImage = ref('')
const isAnalyzing = ref(false)
const resultImgRef = ref(null)
const imageWrapperRef = ref(null)

const naturalWidth = ref(800)
const naturalHeight = ref(1000)
const displayReady = ref(false)

const landmarks = ref([])

const imageDisplayInfo = ref({
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  displayWidth: 0,
  displayHeight: 0
})

// ===== 0.6cm 物理偏移常量 =====
// 1 inch = 2.54 cm，标准 CSS 像素密度 96 PPI
const LABEL_OFFSET_CM = 0.6
const CM_TO_INCH = 2.54
const SCREEN_PPI = 96

const cmToScreenPixels = (cm) => (cm / CM_TO_INCH) * SCREEN_PPI

// 当前图片在画布中的实际像素比例（图片像素 / 屏幕像素）
const smallDisplayScale = ref(1)
const previewBaseDisplayScale = ref(1)

const updateSmallDisplayScale = () => {
  if (resultImgRef.value && naturalWidth.value > 0) {
    const imgRect = resultImgRef.value.getBoundingClientRect()
    smallDisplayScale.value = imgRect.width / naturalWidth.value
  }
}

const updatePreviewBaseDisplayScale = () => {
  if (previewContainerRef.value && naturalWidth.value > 0) {
    const rect = previewContainerRef.value.getBoundingClientRect()
    previewBaseDisplayScale.value = Math.min(
      rect.width / naturalWidth.value,
      rect.height / naturalHeight.value
    )
  }
}

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

const getPointPosition = (normX, normY) => {
  return transNormPoint(normX, normY, naturalWidth.value, naturalHeight.value, naturalWidth.value, naturalHeight.value)
}

const previewOpen = ref(false)
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
  previewOpen.value = true
  previewScale.value = 1
  previewTranslateX.value = 0
  previewTranslateY.value = 0
  nextTick(() => {
    updatePreviewBaseDisplayScale()
  })
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
  
  const deltaX = e.clientX - dragStartX.value
  const deltaY = e.clientY - dragStartY.value
  
  previewTranslateX.value = dragStartTranslateX.value + deltaX
  previewTranslateY.value = dragStartTranslateY.value + deltaY
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && previewOpen.value) {
    closePreview()
  }
}

// ===== 标签方向配置（单位向量，所有点共享 0.6cm 物理偏移距离） =====
// 坐标系：正 X 向右，正 Y 向下；y 为负表示向上
const labelDirections = {
  'N':       { x: 0, y: -1 },        // 上方
  'S':       { x: 0, y: -1 },        // 上方
  'P':       { x: -1, y: 0 },        // 左方
  'O':       { x: 1, y: 0 },         // 右方
  'Po':      { x: 0.949, y: -0.316 }, // 右上方
  'Or':      { x: -1, y: 0 },        // 左方
  'Me':      { x: 0, y: 1 },         // 下方
  'Gn':      { x: -0.949, y: -0.316 }, // 左上方
  'ANS':     { x: 0.894, y: -0.447 }, // 右上方
  'PNS':     { x: -0.894, y: -0.447 }, // 左上方
  'Go':      { x: -1, y: 0 },        // 左方
  'Ar':      { x: -0.894, y: -0.447 }, // 左上方
  'UI':      { x: 0, y: 1 },         // 下方
  'LI':      { x: -0.949, y: -0.316 }, // 左上方
  'UIA':     { x: 0, y: -1 },        // 上方
  'LIA':     { x: 0.949, y: -0.316 }, // 右上方
  'A':       { x: 0.949, y: -0.316 }, // 右上方
  'B':       { x: 0.949, y: -0.316 }, // 右上方
  'MP':      { x: 1, y: 0 },         // 右方
  'Ruler':   { x: -0.707, y: -0.707 }, // 左上方
  'End_20mm':{ x: -0.707, y: 0.707 }  // 左下方
}

const normalizeVector = (v) => {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y)
  if (magnitude === 0) return { x: 0.707, y: -0.707 }
  return { x: v.x / magnitude, y: v.y / magnitude }
}

const getLabelDirection = (label, xPercent, yPercent) => {
  // 默认方向：右上方
  let dir = labelDirections[label] || { x: 0.707, y: -0.707 }

  // 边界保护：如果文字会超出画布，翻转对应方向分量
  if (xPercent < 10) {
    dir = { x: Math.abs(dir.x), y: dir.y }
  } else if (xPercent > 90) {
    dir = { x: -Math.abs(dir.x), y: dir.y }
  }

  if (yPercent < 10) {
    dir = { x: dir.x, y: Math.abs(dir.y) }
  } else if (yPercent > 90) {
    dir = { x: dir.x, y: -Math.abs(dir.y) }
  }

  return normalizeVector(dir)
}

// 0.6cm 物理偏移在当前显示比例下对应的 SVG（图片像素）偏移量
const getLabelOffsetSvg = (displayScale) => {
  const screenPixels = cmToScreenPixels(LABEL_OFFSET_CM)
  if (!displayScale || displayScale <= 0) return screenPixels
  return screenPixels / displayScale
}

const getTextPositionForScale = (x, y, label, displayScale) => {
  const pointX = x * naturalWidth.value
  const pointY = y * naturalHeight.value

  const xPercent = x * 100
  const yPercent = y * 100
  const dir = getLabelDirection(label, xPercent, yPercent)
  const offsetSvg = getLabelOffsetSvg(displayScale)

  const dx = dir.x * offsetSvg
  const dy = dir.y * offsetSvg

  let finalX = pointX + dx
  let finalY = pointY + dy

  // 边界保护：文字不能超出画布
  const fontSize = naturalWidth.value * 0.025
  const textWidth = label.length * fontSize * 0.6
  const textVisualTop = fontSize * 0.75
  const textVisualBottom = fontSize * 0.25
  const margin = 3

  if (finalX < margin) {
    finalX = margin
  } else if (finalX + textWidth > naturalWidth.value - margin) {
    finalX = naturalWidth.value - margin - textWidth
  }

  if (finalY - textVisualTop < margin) {
    finalY = margin + textVisualTop
  } else if (finalY + textVisualBottom > naturalHeight.value - margin) {
    finalY = naturalHeight.value - margin - textVisualBottom
  }

  return { x: finalX, y: finalY }
}

const getTextPosition = (x, y, label, context = 'small') => {
  const displayScale = context === 'preview'
    ? previewBaseDisplayScale.value * previewScale.value
    : smallDisplayScale.value
  return getTextPositionForScale(x, y, label, displayScale)
}

const getAdjustedPosition = (label, context = 'small') => {
  const list = context === 'preview' ? collisionAvoidancePreview.value : collisionAvoidanceSmall.value
  const adjusted = list.find(item => item.label === label)
  if (adjusted) {
    return { x: adjusted.x, y: adjusted.y }
  }
  return null
}

const getTextX = (x, y, label, context = 'small') => {
  const adjusted = getAdjustedPosition(label, context)
  if (adjusted) return adjusted.x
  return getTextPosition(x, y, label, context).x
}

const getTextY = (x, y, label, context = 'small') => {
  const adjusted = getAdjustedPosition(label, context)
  if (adjusted) return adjusted.y
  return getTextPosition(x, y, label, context).y
}

const computeCollisionAvoidance = (displayScale) => {
  if (landmarks.value.length < 2) return []

  const fontSize = naturalWidth.value * 0.025
  const margin = 3

  const positions = landmarks.value.map(point => {
    const pos = getTextPositionForScale(point.x, point.y, point.label, displayScale)
    return {
      label: point.label,
      x: pos.x,
      y: pos.y,
      width: point.label.length * fontSize * 0.6,
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
    if (adjusted[i].x < margin) {
      adjusted[i].x = margin
    } else if (adjusted[i].x + adjusted[i].width > naturalWidth.value - margin) {
      adjusted[i].x = naturalWidth.value - margin - adjusted[i].width
    }

    if (adjusted[i].y - fontSize * 0.75 < margin) {
      adjusted[i].y = margin + fontSize * 0.75
    } else if (adjusted[i].y + fontSize * 0.25 > naturalHeight.value - margin) {
      adjusted[i].y = naturalHeight.value - margin - fontSize * 0.25
    }
  }

  return adjusted
}

const collisionAvoidanceSmall = computed(() => computeCollisionAvoidance(smallDisplayScale.value))
const collisionAvoidancePreview = computed(() => computeCollisionAvoidance(previewBaseDisplayScale.value * previewScale.value))

onMounted(() => {
  console.log('=== 页面加载完成 ===')
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  updateSmallDisplayScale()
  if (previewOpen.value) {
    updatePreviewBaseDisplayScale()
  }
}

const handleUploadAreaClick = () => {
  if (uploadedImage.value) return
  if (fileInput.value) {
    fileInput.value.click()
  }
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
  landmarks.value = []
  displayReady.value = false
}

const onResultImageLoad = (e) => {
  if (!resultImgRef.value) return
  
  naturalWidth.value = e.target.naturalWidth
  naturalHeight.value = e.target.naturalHeight
  
  console.log('===== 图片加载完成 =====')
  console.log(`原始图片尺寸: ${naturalWidth.value} x ${naturalHeight.value}`)
  console.log(`当前标志点数量: ${landmarks.value.length}`)
  
  if (landmarks.value.length > 0) {
    console.log('===== 标志点详细信息 =====')
    landmarks.value.forEach(point => {
      const pixelX = point.x * naturalWidth.value
      const pixelY = point.y * naturalHeight.value
      console.log(`点位 ${point.label}: 归一化(${point.x.toFixed(4)}, ${point.y.toFixed(4)}), 原图像素(${pixelX.toFixed(1)}, ${pixelY.toFixed(1)})`)
    })
  }
  
  setTimeout(() => {
    if (imageWrapperRef.value && resultImgRef.value) {
      const rect = imageWrapperRef.value.getBoundingClientRect()
      const imgRect = resultImgRef.value.getBoundingClientRect()
      console.log('===== 容器尺寸信息 =====')
      console.log(`容器宽度: ${rect.width}, 容器高度: ${rect.height}`)
      console.log(`图片显示宽度: ${imgRect.width}, 图片显示高度: ${imgRect.height}`)
      console.log(`图片缩放比例: width=${(imgRect.width / naturalWidth.value).toFixed(4)}, height=${(imgRect.height / naturalHeight.value).toFixed(4)}`)
    }
    updateSmallDisplayScale()
    displayReady.value = true
  }, 150)
}

const startAnalysis = async () => {
  if (!originalFile.value) {
    alert('请先上传头颅侧位X光片')
    return
  }
  if (isAnalyzing.value) return

  isAnalyzing.value = true
  displayReady.value = false
  landmarks.value = []

  try {
    const result = await callOpenApi({
      endpoint: API_CONFIG.endpoint,
      file: originalFile.value,
      apiKey: API_CONFIG.apiKey,
      timeoutMs: API_CONFIG.timeout,
      extraFields: API_CONFIG.extraFields,
      pageType: 'cephalometric',
    })

    if (result.ok && result.data) {
      const data = result.data
      resultImage.value = uploadedImage.value
      landmarks.value = parseLandmarks(data.r, data.imgsize)
      
      if (landmarks.value.length === 0) {
        alert('识别成功，但未检测到有效标志点')
      } else {
        console.log(`✓ 识别成功，共解析 ${landmarks.value.length} 个标志点`)
      }
      
      await waitForImageLoad()
      
      console.log('===== 最终渲染坐标 =====')
      landmarks.value.forEach(point => {
        const pos = getPointPosition(point.x, point.y)
        console.log(`${point.label}: 归一化(${point.x.toFixed(6)}, ${point.y.toFixed(6)}), 渲染像素(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`)
      })
    } else if (result.errClass) {
      alert(formatErrorMessage(result.errClass))
    } else {
      alert('接口返回格式异常')
    }
  } catch (error) {
    console.error('=== API调用失败 ===', error)
    alert('API调用失败，请检查网络连接或接口配置')
  } finally {
    isAnalyzing.value = false
    console.log('✅ [Cephalo] finally executed, isAnalyzing reset to false')
  }
}

const parseLandmarks = (data, imgsize) => {
  if (!data) return []

  // 防御：r 字段是字符串（如 "none img"）时不进入对象遍历
  if (typeof data !== 'object' || Array.isArray(data)) return []

  const apiWidth = imgsize && Array.isArray(imgsize) && imgsize[0] ? imgsize[0] : 0
  const apiHeight = imgsize && Array.isArray(imgsize) && imgsize[1] ? imgsize[1] : 0

  console.log(`API处理尺寸: ${apiWidth} x ${apiHeight}`)

  const keys = Object.keys(data)
  console.log('parseLandmarks 待处理键:', keys)

  // 防御：r 可能为 {n:2, msg:"none img"} 等"无图"提示对象
  // 只有当至少一个 value 是数组时才当作标志点集合处理
  const hasArrayValue = keys.some(k => Array.isArray(data[k]))
  if (!hasArrayValue) {
    console.log('parseLandmarks: r 中无数组数据（可能为业务提示对象），原值:', JSON.stringify(data))
    return []
  }

  return keys.map(key => {
    try {
      const value = data[key]
      if (!Array.isArray(value) || value.length < 2) return null

      const coords = value[0]
      if (!Array.isArray(coords) || coords.length < 2) return null

      const x = parseFloat(coords[0])
      const y = parseFloat(coords[1])
      if (isNaN(x) || isNaN(y)) return null

      const confidence = value[1]
      console.log(`点位 ${key}: 坐标数组=${JSON.stringify(coords)}, 置信度=${confidence}`)

      let xPercent = 0
      let yPercent = 0

      if (x >= 100000) {
        xPercent = x / 100000000
      } else if (x > 1 && apiWidth > 0) {
        xPercent = x / apiWidth
      } else if (x >= 0 && x <= 1) {
        xPercent = x
      } else {
        xPercent = x
      }

      if (y >= 100000) {
        yPercent = y / 100000000
      } else if (y > 1 && apiHeight > 0) {
        yPercent = y / apiHeight
      } else if (y >= 0 && y <= 1) {
        yPercent = y
      } else {
        yPercent = y
      }

      console.log(`点位 ${key}: 转换后 xPercent=${xPercent.toFixed(6)}, yPercent=${yPercent.toFixed(6)}`)

      return {
        label: key,
        x: xPercent,
        y: yPercent
      }
    } catch (error) {
      console.error(`解析点位 ${key} 失败:`, error)
      return null
    }
  }).filter(item => item && item.x >= 0 && item.y >= 0 && item.x <= 1 && item.y <= 1)
}

const waitForImageLoad = () => {
  return new Promise((resolve) => {
    const checkImage = () => {
      if (resultImgRef.value && resultImgRef.value.complete) {
        setTimeout(() => {
          resolve()
        }, 100)
      } else {
        setTimeout(checkImage, 50)
      }
    }
    checkImage()
  })
}

const resetAll = () => {
  uploadedImage.value = ''
  originalFile.value = null
  resetAnalysis()
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.cephalo-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.cephalo-header {
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

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
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
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
}

.dropdown-btn:hover {
  color: #667eea;
  background: #f5f7fa;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: white;
  min-width: 180px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  border-radius: 8px;
  padding: 4px 0;
  border: 1px solid #e8eaed;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
}

.dropdown-content a:hover {
  background: #f5f7fa;
}

.lang-dropdown {
  position: relative;
}

.lang-btn {
  background: #f5f7fa;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
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
  min-width: 100px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  border-radius: 8px;
  padding: 4px 0;
  border: 1px solid #e8eaed;
}

.lang-dropdown:hover .lang-content {
  display: block;
}

.lang-content a {
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.lang-content a:hover {
  background: #f5f7fa;
}

.cephalo-main {
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
  box-sizing: border-box;
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
  border-color: #667eea;
  background: #fafaff;
}

.upload-area.has-image {
  cursor: default;
  border-style: solid;
  border-color: #e8e8e8;
  background: #f5f5f5;
  padding: 0;
}

.preprocess-tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  margin-bottom: 10px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  flex-shrink: 0;
}

.preprocess-tip .tip-icon {
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1.4;
}

.preprocess-tip .tip-content {
  flex: 1;
}

.preprocess-tip .tip-main {
  margin: 0;
  font-size: 13px;
  color: #614700;
  font-weight: 500;
  line-height: 1.4;
}

.preprocess-tip .tip-sub {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #8c6d1f;
  line-height: 1.4;
}

.file-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 14px;
}

.upload-placeholder p {
  color: #999;
  margin: 0;
  font-size: 14px;
}

.upload-placeholder .sub-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #bbb;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  object-fit: contain;
  object-position: center center;
}

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

.result-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.result-placeholder p {
  color: #999;
  margin: 4px 0;
  font-size: 13px;
}

.result-container {
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
  grid-template-columns: 1.2fr 1fr 1fr;
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
  grid-template-columns: 1.2fr 1fr 1fr;
  padding: 10px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
  color: #333;
  align-items: center;
}

.landmarks-list .table-row:last-child {
  border-bottom: none;
}

.landmark-label {
  font-weight: 500;
}

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

.preview-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

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

.preview-tip span {
  display: inline-block;
}

@media (max-width: 900px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .cephalo-header {
    padding: 10px 15px;
  }
  
  .cephalo-main {
    padding: 12px;
  }
}
</style>
