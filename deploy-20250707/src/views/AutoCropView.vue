<template>
  <div class="autocrop-container">
    <TopNav />

    <header class="page-header">
      <h1>{{ t('autocrop.pageTitle') }}</h1>
      <p>{{ t('autocrop.pageDesc') }}</p>
    </header>

    <main class="autocrop-main">
      <div class="content-wrapper">
        <!-- ===== 左侧：原始图片上传 ===== -->
        <div class="left-panel">
          <div class="panel-header">
            <h2>{{ t('autocrop.originalImage') }}</h2>
            <p class="hint">{{ t('autocrop.uploadHint') }}</p>
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
              <p>{{ t('autocrop.uploadPlaceholder') }}</p>
              <p class="sub-hint">{{ t('autocrop.uploadSubHint') }}</p>
            </div>
            <div
              v-else
              class="thumb-container"
              @click.stop="openOriginalPreview"
            >
              <img
                :src="uploadedImage"
                class="preview-image"
                :alt="t('autocrop.originalImage')"
              />
              <div class="thumb-overlay">
                <span>{{ t('autocrop.clickToViewLarge') }}</span>
              </div>
            </div>
          </div>

          <div class="zoom-tip" v-if="uploadedImage">
            <span>{{ t('autocrop.clickPreviewToView') }}</span>
          </div>

          <div class="button-group">
            <button
              class="btn btn-primary"
              :disabled="!uploadedImage || isAnalyzing"
              @click="startAnalysis"
            >
              <span v-if="isAnalyzing" class="loading-spinner"></span>
              {{ isAnalyzing ? t('autocrop.analyzing') : (analysisDone ? t('autocrop.reAnalyze') : t('autocrop.startAnalysis')) }}
            </button>
            <button
              class="btn btn-secondary"
              :disabled="!uploadedImage"
              @click="resetAll"
            >
              {{ t('autocrop.reSelect') }}
            </button>
          </div>
        </div>

        <!-- ===== 右侧：识别结果（参考官方 2d/image-correction 演示页） ===== -->
        <div class="right-panel">
          <div class="panel-header">
            <h2>{{ t('autocrop.resultTitle') }}</h2>
            <p class="hint" v-if="!analysisDone">{{ t('autocrop.pleaseUpload') }}</p>
            <p class="hint" v-else>{{ t('autocrop.resultTitle') }}</p>
          </div>

          <!-- 校正信息卡片（绿色高亮） -->
          <div v-if="analysisDone && correctionInfo.hasCorrection" class="correction-panel" :class="`correction-panel-${confidenceLevel}`">
            <div class="correction-panel-title">
              <span class="correction-panel-icon">🎯</span>
              <span>{{ t('autocrop.correctionPanelTitle') }}</span>
              <span class="correction-source-badge">
                <span v-if="correctionInfo.correctedByBackend">{{ t('autocrop.sourceBackend') }}</span>
                <span v-else-if="userOverride">{{ t('autocrop.sourceManual') }}</span>
                <span v-else>{{ t('autocrop.sourceFrontend') }}</span>
              </span>
            </div>
            <div v-if="confidenceLevel === 'low' || confidenceLevel === 'moderate'" class="correction-confidence-warn">
              <span class="correction-warn-icon">⚠️</span>
              <span v-if="confidenceLevel === 'low'">{{ tp('autocrop.lowConfidenceWarn', { val: (minConfidence * 100).toFixed(1) + '%', threshold: (CONFIDENCE_THRESHOLD * 100).toFixed(0) + '%' }) }}</span>
              <span v-else>{{ tp('autocrop.moderateConfidenceOk', { val: (minConfidence * 100).toFixed(1) + '%' }) }}</span>
            </div>
            <div class="correction-rows">
              <div class="correction-row">
                <span class="correction-row-label">📌 {{ t('autocrop.detectedPose') }}</span>
                <span class="correction-row-value">{{ correctionInfo.poseLabel || correctionInfo.poseRaw || '-' }}</span>
              </div>
              <div v-if="correctionInfo.rotateText" class="correction-row">
                <span class="correction-row-label">🔄 {{ t('autocrop.rotationCorrection') }}</span>
                <span class="correction-row-value">{{ correctionInfo.rotateText }}</span>
              </div>
              <div v-if="correctionInfo.flipText" class="correction-row">
                <span class="correction-row-label">↔️ {{ t('autocrop.flipAction') }}</span>
                <span class="correction-row-value">{{ correctionInfo.flipText }}</span>
              </div>
            </div>
            <!-- 人工微调按钮（仅在结果已生成时显示） -->
            <div class="manual-adjust">
              <div class="manual-adjust-title">🛠️ {{ t('autocrop.manualAdjust') }}</div>
              <div class="manual-adjust-buttons">
                <button class="adjust-btn" :title="t('autocrop.rotateLeft')" @click="manualRotate(-90)">↺ {{ t('autocrop.rotateLeft') }}</button>
                <button class="adjust-btn" :title="t('autocrop.rotateRight')" @click="manualRotate(90)">↻ {{ t('autocrop.rotateRight') }}</button>
                <button class="adjust-btn" :title="t('autocrop.flipHorizontal')" @click="manualFlipH">↔️ {{ t('autocrop.flipHorizontal') }}</button>
                <button class="adjust-btn" :title="t('autocrop.flipVertical')" @click="manualFlipV">↕️ {{ t('autocrop.flipVertical') }}</button>
                <button class="adjust-btn adjust-btn-reset" :title="t('autocrop.resetCorrection')" @click="manualReset">↺ {{ t('autocrop.resetCorrection') }}</button>
              </div>
            </div>
          </div>
          <div v-else-if="analysisDone && !correctionInfo.hasCorrection" class="correction-panel correction-panel-ok" :class="`correction-panel-${confidenceLevel}`">
            <div class="correction-panel-title">
              <span class="correction-panel-icon">✅</span>
              <span>{{ t('autocrop.correctionPanelTitle') }}</span>
            </div>
            <div v-if="confidenceLevel === 'high'" class="correction-confidence-ok">
              <span>👍</span>
              <span>{{ tp('autocrop.highConfidenceOk', { val: (minConfidence * 100).toFixed(1) + '%', threshold: (CONFIDENCE_THRESHOLD * 100).toFixed(0) + '%' }) }}</span>
            </div>
            <div class="correction-ok-text">{{ t('autocrop.noCorrectionNeeded') }}</div>
            <!-- 人工微调按钮（即便无校正也提供，方便用户微调） -->
            <div class="manual-adjust">
              <div class="manual-adjust-title">🛠️ {{ t('autocrop.manualAdjust') }}</div>
              <div class="manual-adjust-buttons">
                <button class="adjust-btn" :title="t('autocrop.rotateLeft')" @click="manualRotate(-90)">↺ {{ t('autocrop.rotateLeft') }}</button>
                <button class="adjust-btn" :title="t('autocrop.rotateRight')" @click="manualRotate(90)">↻ {{ t('autocrop.rotateRight') }}</button>
                <button class="adjust-btn" :title="t('autocrop.flipHorizontal')" @click="manualFlipH">↔️ {{ t('autocrop.flipHorizontal') }}</button>
                <button class="adjust-btn" :title="t('autocrop.flipVertical')" @click="manualFlipV">↕️ {{ t('autocrop.flipVertical') }}</button>
                <button class="adjust-btn adjust-btn-reset" :title="t('autocrop.resetCorrection')" @click="manualReset">↺ {{ t('autocrop.resetCorrection') }}</button>
              </div>
            </div>
          </div>

          <!-- 上半：浅蓝检测信息面板 -->
          <div v-if="analysisDone" class="info-panel">
            <div class="info-panel-title">
              <span class="info-panel-icon">📋</span>
              <span>{{ t('autocrop.infoPanelTitle') }}</span>
            </div>
            <div class="info-rows">
              <div v-for="(row, idx) in infoRows" :key="idx" class="info-row">
                <span class="info-row-label">{{ row.label }}</span>
                <span class="info-row-value" :class="{ 'info-row-value-highlight': row.highlight }">{{ row.value }}</span>
              </div>
              <div v-if="infoRows.length === 0" class="info-row-empty">
                {{ t('autocrop.noData') }}
              </div>
            </div>
          </div>
          <div v-else class="info-panel info-panel-empty">
            <div class="info-panel-title">
              <span class="info-panel-icon">📋</span>
              <span>{{ t('autocrop.infoPanelTitle') }}</span>
            </div>
            <div class="info-panel-empty-hint">{{ t('autocrop.pleaseUpload') }}</div>
          </div>

          <!-- 下半：校正后影像预览 -->
          <div class="corrected-section">
            <div class="corrected-label">
              <span>🖼️</span>
              <span>{{ t('autocrop.correctedImage') }}</span>
            </div>
            <div class="result-area" :class="{ filled: analysisDone && resultImage }">
              <div v-if="!resultImage" class="result-placeholder">
                <span class="result-icon">📷</span>
                <p>{{ t('autocrop.resultPlaceholder') }}</p>
              </div>
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
                </div>
                <div class="thumb-overlay">
                  <span>{{ t('autocrop.clickToViewLarge') }}</span>
                </div>
              </div>
            </div>
            <div class="zoom-tip" v-if="resultImage">
              <span>{{ t('autocrop.clickPreviewToView') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 底部：处理完成绿色提示栏 ===== -->
      <transition name="fade">
        <div v-if="analysisDone && !isAnalyzing" class="success-banner">
          <span class="success-icon">✓</span>
          <span class="success-text">{{ t('autocrop.processComplete') }}</span>
        </div>
      </transition>
    </main>

    <!-- ===== 低置信度警告弹窗 ===== -->
    <div v-if="showLowConfidenceModal" class="confidence-modal-mask" @click.self="dismissLowConfidenceModal">
      <div class="confidence-modal">
        <div class="confidence-modal-header">
          <span class="confidence-modal-icon">⚠️</span>
          <h3>{{ modalTitle }}</h3>
        </div>
        <div class="confidence-modal-body">
          <p>{{ modalMessage }}</p>
        </div>
        <div class="confidence-modal-footer">
          <button class="confidence-modal-btn" @click="dismissLowConfidenceModal">{{ t('autocrop.ok') }}</button>
        </div>
      </div>
    </div>

    <!-- ===== 大图弹窗 ===== -->
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
          <div class="preview-image-wrapper" :style="previewStyle">
            <img
              :src="previewMode === 'original' ? uploadedImage : resultImage"
              class="preview-img"
            />
          </div>
        </div>
        <div class="preview-tip">
          <span>{{ t('autocrop.scrollZoom') }}</span>
          <span>|</span>
          <span>{{ t('autocrop.dragPan') }}</span>
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
/**
 * 代理路径说明：
 * - 统一使用 /openapi 前缀走 Vite 同源代理（vite.config.js 中 /openapi → openapi-lab.ilmsmile.com.cn，无 rewrite）
 * - 同源请求，无 CORS 预检问题
 * - FormData 传 File 原图，浏览器自动生成 multipart boundary
 * - 字段名 img，传原生 File 对象
 */
const API_CONFIG = {
  endpoint: '/openapi/v1/2d/autocrop',
  apiKey: SHARED_API_KEY,
  timeout: SHARED_TIMEOUT_MS,
}

const fileInput = ref(null)
const uploadedImage = ref('')
const originalFile = ref(null)
const resultImage = ref('')
const isAnalyzing = ref(false)
const analysisDone = ref(false)
const resultImgRef = ref(null)
const apiResponse = ref(null)

// ===== 分类 & 姿态参数列表 =====
// 旧的两段式 list 已弃用；改为单条 infoRows 数组，渲染成信息面板行
const infoRows = ref([])
const classificationList = ref([]) // 保留旧字段以防模板回退
const poseList = ref([])

// ===== 校正信息（用于右侧高亮卡片 + 实际生成校正图）=====
// 结构：
//   {
//     hasCorrection: bool,    // 是否需要校正
//     poseRaw: string,        // 后端原始姿态字段
//     poseLabel: string,      // 翻译后的中文姿态名
//     rotateDeg: 0|90|180|270,// 顺时针旋转角度
//     flipH: bool,            // 水平翻转
//     flipV: bool,            // 垂直翻转
//     rotateText: string,     // 「顺时针 90°」之类可读文本
//     flipText: string,       // 「水平翻转」之类可读文本
//     correctedByBackend: bool// 后端是否直接返回了图像
//   }
const correctionInfo = ref({
  hasCorrection: false,
  poseRaw: '',
  poseLabel: '',
  rotateDeg: 0,
  flipH: false,
  flipV: false,
  rotateText: '',
  flipText: '',
  correctedByBackend: false,
})

// ===== 置信度（用于高/低置信度提示）=====
// 来源：取 pose_val / label_val / overall_confidence 中的最小值
const minConfidence = ref(null) // 0~1
const confidenceLevel = ref('') // '' | 'low' | 'moderate' | 'high'
// 阈值（从 i18n 读取；兜底 0.75）
const CONFIDENCE_THRESHOLD = 0.75

// ===== 人工微调（独立于后端识别结果）=====
// 每次点击按钮，对 currentResultImage 做一次旋转/翻转，叠加到 correctionInfo 上
// userOverride 标记当前 resultImage 来自人工微调
const userOverride = ref(false)
const showLowConfidenceModal = ref(false)
const modalDismissed = ref(false) // 用户已确认低置信度，不再弹窗
const modalTitle = ref('')
const modalMessage = ref('')

const currentParams = ref({ rotateDeg: 0, flipH: false, flipV: false })

const getCurrentResultSrc = () => resultImage.value || uploadedImage.value

// ===== 弹窗缩放/拖拽 =====
const previewOpen = ref(false)
const previewMode = ref('result')
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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// ===== 上传 =====
const handleUploadAreaClick = () => {
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
  analysisDone.value = false
  classificationList.value = []
  poseList.value = []
  infoRows.value = []
  apiResponse.value = null
  correctionInfo.value = {
    hasCorrection: false,
    poseRaw: '',
    poseLabel: '',
    rotateDeg: 0,
    flipH: false,
    flipV: false,
    rotateText: '',
    flipText: '',
    correctedByBackend: false,
  }
  minConfidence.value = null
  confidenceLevel.value = ''
  userOverride.value = false
  showLowConfidenceModal.value = false
  modalDismissed.value = false
  currentParams.value = { rotateDeg: 0, flipH: false, flipV: false }
}

const onResultImageLoad = () => {
  // placeholder for future use
}

// ===== 解析接口返回 =====
// 容错策略：兼容多种后端返回结构（code/r、success/data、顶层、嵌套 result 字段等）
// 输出三类数据：
//   1. resultImage  —— 校正/裁剪后图像（base64 / data URL / http URL）
//   2. infoRows     —— 平铺的 {label, value} 列表，按官方演示页风格渲染
//   3. classificationList / poseList  —— 兼容旧版模板的分组卡片（保留供回退）
const parseResponse = async (data) => {
  classificationList.value = []
  poseList.value = []
  infoRows.value = []

  if (!data) return

  // ===== 1. 业务码校验 =====
  // 多种后端风格：code:0、code:200、success:true、status:'ok'、code:'0'
  const businessCode = data.code
  const isOk =
    data.success === true ||
    data.status === 'ok' ||
    (typeof businessCode === 'number' && (businessCode === 0 || businessCode === 200)) ||
    businessCode === '0' ||
    businessCode === '200' ||
    data.ok === true

  if (!isOk) {
    // 业务错误码，不进入数据解析；提取可读消息后抛出，由外层 alert
    let msg = ''
    if (typeof data.r === 'string') msg = data.r
    else if (data.r && typeof data.r === 'object') {
      msg = data.r.msg || data.r.message || data.r.error || JSON.stringify(data.r)
    } else if (typeof data.msg === 'string') {
      msg = data.msg
    } else if (typeof data.message === 'string') {
      msg = data.message
    } else {
      msg = '处理失败'
    }
    throw new Error(msg)
  }

  // ===== 2. 提取真实数据 result =====
  // 兼容：{code, r} / {code, data} / 顶层就是数据 / 嵌套 result 字段
  let result = data
  if (data.r !== undefined) {
    result = data.r
  } else if (data.data !== undefined) {
    result = data.data
  } else if (data.result !== undefined) {
    result = data.result
  }

  if (typeof result === 'string') {
    // result 本身就是一个 base64 图像
    resultImage.value = result.startsWith('data:image') ? result : `data:image/jpeg;base64,${result}`
    infoRows.value = []
    return
  }

  if (typeof result !== 'object' || result === null) return

  // ===== 3. 解析校正参数（从 result 提取旋转/翻转/姿态）=====
  // 后端接口可能用以下任一字段：
  //   pose / pose_val           —— 姿态类型 + 置信度
  //   rotate / rotation         —— 旋转操作（0/90/180/270 或 "rotate90"/"roate90"）
  //   flip / flip_h / flip_v    —— 翻转操作
  //   correct_action            —— 校正动作字符串（兼容）
  // 兼容后端拼写错误 "roate90"
  const params = parseCorrectionParams(result)
  // 按姿态类型区分校正逻辑：全景片与侧位片对旋转/翻转的容忍度不同
  // panoramic（曲面断层片）：上颚在下颚之上是正常方向；颠倒后需要旋转 180°
  // x_head（侧位片）：左右方向固定，颠倒后需旋转 180°
  // 这里先记录到 params，由校正函数内部按姿态应用
  correctionInfo.value = params
  currentParams.value = {
    rotateDeg: params.rotateDeg,
    flipH: params.flipH,
    flipV: params.flipV,
  }

  // ===== 4. 提取校正后图像 =====
  // 关键：优先使用后端直接返回的校正后图像（最准确），没有再用前端 Canvas
  const imageKeys = ['corrected_image', 'correctedImage', 'cropped_image', 'cropImage', 'croppedImage', 'output', 'output_image', 'outputImage', 'result_image', 'resultImage', 'image', 'img', 'base64']
  let croppedImg = null
  for (const k of imageKeys) {
    if (result[k] && typeof result[k] === 'string') {
      croppedImg = result[k]
      break
    }
  }
  if (!croppedImg) {
    // 兜底：扫描 result 内任意字符串，若像 base64 图像（很长且为 base64 字符）就当作图
    for (const [k, v] of Object.entries(result)) {
      if (typeof v === 'string' && v.length > 1000 && /^[A-Za-z0-9+/=]+$/.test(v.slice(0, 100))) {
        croppedImg = v
        break
      }
    }
  }
  if (croppedImg) {
    if (croppedImg.startsWith('http')) {
      resultImage.value = croppedImg
    } else if (croppedImg.startsWith('data:image')) {
      resultImage.value = croppedImg
    } else {
      // 探测 MIME：纯 base64 默认按 jpeg 处理
      resultImage.value = `data:image/jpeg;base64,${croppedImg}`
    }
    // 后端直接返回了图像 → 标记为 backend 提供
    correctionInfo.value = { ...params, correctedByBackend: true }
  } else if (uploadedImage.value) {
    // 后端没返回图像 → 前端根据姿态/旋转/翻转参数用 Canvas 校正原图
    if (params.hasCorrection) {
      try {
        const corrected = await applyImageCorrection(uploadedImage.value, params)
        resultImage.value = corrected
      } catch (e) {
        console.warn('⚠️ [AutoCrop] Canvas 校正失败，回退到原图：', e)
        resultImage.value = uploadedImage.value
      }
    } else {
      // 无需校正（正常方向），resultImage 仍展示，使用原图
      resultImage.value = uploadedImage.value
    }
  }

  // ===== 4.5 计算置信度 + 触发低置信度弹窗 =====
  calcConfidence(result)
  if (confidenceLevel.value === 'low' && !modalDismissed.value) {
    modalTitle.value = t('autocrop.lowConfidence')
    modalMessage.value = tp('autocrop.lowConfidenceWarn', {
      val: (minConfidence.value * 100).toFixed(1) + '%',
      threshold: (CONFIDENCE_THRESHOLD * 100).toFixed(0) + '%',
    })
    showLowConfidenceModal.value = true
  }

  // ===== 5. 提取检测信息 =====
  // 收集所有可显示字段为扁平行（按官方演示页的检测信息面板风格）
  const rows = []

  // 优先级 1: classification 嵌套对象
  const classObj = result.classification || result.classify || result.cls || result.class_info || result.classInfo
  if (classObj && typeof classObj === 'object') {
    for (const [k, v] of Object.entries(classObj)) {
      if (v === null || v === undefined) continue
      rows.push({ label: prettifyKey(k, 'classification'), value: formatValue(v) })
    }
  }
  // 兼容 classObj 直接是字符串（"x_head" / "panoramic"）
  if (typeof classObj === 'string') {
    rows.push({ label: t('autocrop.labelName'), value: classObj })
  }

  // 优先级 2: label / label_val 顶层
  if (result.label !== undefined && result.label !== null && result.label !== '') {
    rows.push({ label: t('autocrop.labelName'), value: String(result.label) })
  }
  if (result.label_val !== undefined && result.label_val !== null && result.label_val !== -1) {
    rows.push({ label: t('autocrop.labelVal'), value: formatValue(result.label_val) })
  }

  // 优先级 3: 各种置信度字段
  const confKeys = ['confidence', 'conf', 'score', 'p', 'probability', 'class_confidence', 'classConfidence']
  for (const k of confKeys) {
    if (result[k] !== undefined && result[k] !== null && result[k] !== -1) {
      rows.push({ label: t('autocrop.confidence'), value: formatPercent(result[k]) })
      break
    }
  }

  // 优先级 4: 总体置信度
  const overallConfKeys = ['overall_confidence', 'overallConfidence', 'total_confidence', 'totalConfidence']
  for (const k of overallConfKeys) {
    if (result[k] !== undefined && result[k] !== null && result[k] !== -1) {
      rows.push({ label: t('autocrop.overallConfidence'), value: formatPercent(result[k]) })
      break
    }
  }

  // 优先级 5: 姿态字段
  const poseKeys = ['pose', 'posture', 'attitude', 'rotation', 'angle']
  let poseHandled = false
  for (const k of poseKeys) {
    const v = result[k]
    if (v === undefined || v === null || v === '') continue
    if (typeof v === 'object') {
      // 嵌套 pose 对象
      for (const [pk, pv] of Object.entries(v)) {
        if (pv === null || pv === undefined || pv === '') continue
        rows.push({ label: prettifyKey(pk, 'pose'), value: formatValue(pv) })
      }
    } else {
      rows.push({ label: t('autocrop.poseName'), value: formatValue(v) })
    }
    poseHandled = true
  }
  if (result.pose_val !== undefined && result.pose_val !== null && result.pose_val !== -1) {
    rows.push({ label: t('autocrop.poseVal'), value: formatValue(result.pose_val) })
  }

  // 优先级 6: 原始尺寸
  if (result.size || result.image_size || result.imageSize || result.original_size || result.originalSize) {
    const sz = result.size || result.image_size || result.imageSize || result.original_size || result.originalSize
    const w = sz.w ?? sz.width ?? sz[0] ?? ''
    const h = sz.h ?? sz.height ?? sz[1] ?? ''
    if (w && h) {
      rows.push({ label: t('autocrop.originalSize'), value: `${w} × ${h}` })
    }
  }

  // 优先级 7: bbox 检测区域
  if (Array.isArray(result.bbox) && result.bbox.length >= 4) {
    const b = result.bbox
    // 兼容 [x1, y1, x2, y2] 格式
    rows.push({ label: t('autocrop.detectArea'), value: `左上角: (${b[0]}, ${b[1]}), 右下角: (${b[2]}, ${b[3]})` })
  } else if (Array.isArray(result.bbox) && result.bbox.length === 0) {
    // bbox 为空数组
    rows.push({ label: t('autocrop.detectArea'), value: t('autocrop.noDetection') })
  } else if (typeof result.bbox === 'object' && result.bbox !== null) {
    // bbox 是对象 {x1, y1, x2, y2}
    const b = result.bbox
    if (b.x1 !== undefined && b.x2 !== undefined) {
      rows.push({ label: t('autocrop.detectArea'), value: `左上角: (${b.x1}, ${b.y1}), 右下角: (${b.x2}, ${b.y2})` })
    }
  }

  // 优先级 8: 旋转操作
  if (result.rotate !== undefined || result.rotation !== undefined || result.correct_action !== undefined || result.correctAction !== undefined) {
    const r = result.rotate ?? result.rotation ?? result.correct_action ?? result.correctAction
    rows.push({ label: t('autocrop.rotateAction'), value: formatValue(r) })
  }

  // 优先级 9: 兜底 - 遍历 result 其它字段，把未归类的字符串/数字也显示
  const knownKeys = new Set([
    'image', 'img', 'cropped_image', 'cropImage', 'croppedImage',
    'corrected_image', 'correctedImage', 'output', 'output_image', 'outputImage',
    'result_image', 'resultImage', 'base64',
    'classification', 'classify', 'cls', 'class_info', 'classInfo',
    'label', 'label_val', 'labelVal',
    'confidence', 'conf', 'score', 'p', 'probability', 'class_confidence', 'classConfidence',
    'overall_confidence', 'overallConfidence', 'total_confidence', 'totalConfidence',
    'pose', 'posture', 'attitude', 'rotation', 'angle', 'pose_val', 'poseVal',
    'size', 'image_size', 'imageSize', 'original_size', 'originalSize',
    'bbox', 'rotate', 'correct_action', 'correctAction',
    'code', 'r', 'data', 'result', 'msg', 'message', 'error', 'status', 'success', 'ok',
  ])
  for (const [k, v] of Object.entries(result)) {
    if (knownKeys.has(k)) continue
    if (v === null || v === undefined) continue
    if (typeof v === 'object') continue // 嵌套对象不重复展平
    if (typeof v === 'string' && v.length > 500) continue // 跳过超长字符串（可能是图像）
    if (typeof v === 'string' && (v.startsWith('http') || v.startsWith('data:image'))) continue
    rows.push({ label: prettifyKey(k), value: formatValue(v) })
  }

  infoRows.value = rows

  // 兼容旧模板：同时填充 classificationList / poseList 供回退渲染
  for (const row of rows) {
    if (row.label.includes(t('autocrop.poseName').slice(0, 1)) || /姿态|pose|角度|angle|rotate|旋转/i.test(row.label)) {
      poseList.value.push(row)
    } else {
      classificationList.value.push(row)
    }
  }
}

const formatValue = (v) => {
  if (v === null || v === undefined) return '-'
  if (typeof v === 'number') {
    return Number.isInteger(v) ? String(v) : v.toFixed(2)
  }
  if (typeof v === 'boolean') return v ? '是' : '否'
  return String(v)
}

const formatPercent = (v) => {
  if (typeof v !== 'number') return String(v)
  // 假设后端返回 0~1 之间的小数；如果是 0~100 直接显示
  if (v <= 1) return (v * 100).toFixed(1) + '%'
  return v.toFixed(1) + '%'
}

// 把后端 key 翻译成中文 label（官方演示页风格）
const prettifyKey = (key, group) => {
  const map = {
    'label': t('autocrop.labelName'),
    'label_val': t('autocrop.labelVal'),
    'name': t('autocrop.labelName'),
    'type': t('autocrop.labelName'),
    'class': t('autocrop.labelName'),
    'confidence': t('autocrop.confidence'),
    'conf': t('autocrop.confidence'),
    'p': t('autocrop.confidence'),
    'score': t('autocrop.confidence'),
    'probability': t('autocrop.confidence'),
    'overall_confidence': t('autocrop.overallConfidence'),
    'total_confidence': t('autocrop.overallConfidence'),
    'pose': t('autocrop.poseName'),
    'posture': t('autocrop.poseName'),
    'rotation': t('autocrop.poseName'),
    'angle': t('autocrop.poseName'),
    'rotate': t('autocrop.rotateAction'),
    'flip': t('autocrop.rotateAction'),
    'bbox': t('autocrop.detectArea'),
    'size': t('autocrop.originalSize'),
    'width': '宽度',
    'height': '高度',
  }
  if (map[key]) return map[key]
  // 未知 key：转大驼峰为可读字符串
  return key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
}

// ===== 解析校正参数 =====
// 从后端 result 提取：姿态类型、旋转角度、是否需要翻转
// 兼容字段：pose / rotate / rotation / flip / flip_h / flip_v / correct_action / correctAction
// 后端常见拼写错误："roate90"（实际是 rotate90），需要兼容
const parseCorrectionParams = (result) => {
  const info = {
    hasCorrection: false,
    poseRaw: '',
    poseLabel: '',
    rotateDeg: 0,
    flipH: false,
    flipV: false,
    rotateText: '',
    flipText: '',
    correctedByBackend: false,
  }
  if (!result || typeof result !== 'object') return info

  // ----- 1. 姿态类型 / 标签 -----
  // 优先级：pose > posture > attitude
  const rawPose =
    result.pose ??
    result.posture ??
    result.attitude ??
    result.label ??
    ''
  info.poseRaw = String(rawPose).trim()
  if (info.poseRaw) {
    // 优先用 i18n poseLabels 映射，找不到则原样展示
    const translated = t(`autocrop.poseLabels.${info.poseRaw}`)
    info.poseLabel = translated && translated !== `autocrop.poseLabels.${info.poseRaw}`
      ? translated
      : info.poseRaw
  }

  // ----- 2. 旋转角度 -----
  // 字段：rotate / rotation / correct_action / correctAction
  // 值可能是数字 0/90/180/270，或字符串 "rotate90" / "roate90" / "0" / "90" 等
  const rawRotate = result.rotate ?? result.rotation ?? result.correct_action ?? result.correctAction
  if (rawRotate !== undefined && rawRotate !== null && rawRotate !== '') {
    const deg = normalizeRotateDeg(rawRotate)
    if (deg !== null) {
      info.rotateDeg = deg
    }
  }
  // 兼容：从 pose 字符串里也尝试解析（如 "roate90"）
  if (info.rotateDeg === 0 && info.poseRaw) {
    const fromPose = extractRotateFromString(info.poseRaw)
    if (fromPose !== null) {
      info.rotateDeg = fromPose
    }
  }

  // ----- 3. 翻转 -----
  // 字段：flip / flip_h / flip_v / flipH / flipV
  const flipVal = result.flip
  if (typeof flipVal === 'string') {
    const f = flipVal.toLowerCase()
    if (f === 'h' || f === 'horizontal' || f === 'flip_h' || f === 'fliph') info.flipH = true
    else if (f === 'v' || f === 'vertical' || f === 'flip_v' || f === 'flipv') info.flipV = true
    else if (f === 'both' || f === 'hv' || f === 'vh') { info.flipH = true; info.flipV = true }
  } else if (typeof flipVal === 'boolean' && flipVal) {
    // 布尔 true 视为水平翻转
    info.flipH = true
  }
  // 单独的 flip_h / flip_v
  if (result.flip_h === true || result.flipH === true) info.flipH = true
  if (result.flip_v === true || result.flipV === true) info.flipV = true

  // ----- 4. 生成可读文本 + 判定是否需要校正 -----
  if (info.rotateDeg !== 0) {
    info.rotateText = lookupRotateAction(info.rotateDeg) || `顺时针 ${info.rotateDeg}°`
  }
  if (info.flipH && info.flipV) {
    info.flipText = '水平翻转 + 垂直翻转'
  } else if (info.flipH) {
    info.flipText = '水平翻转'
  } else if (info.flipV) {
    info.flipText = '垂直翻转'
  }

  info.hasCorrection = info.rotateDeg !== 0 || info.flipH || info.flipV
  return info
}

// 把各种后端 rotate 字段值规范化为 0/90/180/270
const normalizeRotateDeg = (raw) => {
  if (raw === null || raw === undefined || raw === '') return null
  // 数字
  if (typeof raw === 'number') {
    if (raw === 0 || raw === 90 || raw === 180 || raw === 270 || raw === -90 || raw === -180 || raw === -270) {
      // 负数转为正向
      const normalized = ((raw % 360) + 360) % 360
      return normalized
    }
    return null
  }
  // 字符串
  const s = String(raw).toLowerCase().trim()
  if (!s) return null
  // 纯数字字符串
  if (/^-?\d+$/.test(s)) {
    return normalizeRotateDeg(parseInt(s, 10))
  }
  // 提取数字部分
  const numMatch = s.match(/-?\d+/)
  if (numMatch) {
    return normalizeRotateDeg(parseInt(numMatch[0], 10))
  }
  // 关键字
  if (s === 'cw' || s === 'cw90' || s === 'clockwise' || s === 'clockwise90' || s === 'right') return 90
  if (s === 'ccw' || s === 'ccw90' || s === 'counter_clockwise' || s === 'counterclockwise' || s === 'left') return 270
  if (s === 'flip' || s === 'flip180' || s === 'turn') return 180
  return null
}

// 从字符串中提取旋转角度（用于兼容 "roate90" 这种拼写错误）
const extractRotateFromString = (str) => {
  if (!str) return null
  // 仅当字符串本身不是姿态标签时尝试提取角度
  // 常见姿态词（x_head, panoramic 等）不应当被误判为旋转
  const knownPoseWords = ['x_head', 'panoramic', 'periapical', 'bitewing', 'cephalometric', 'pa', 'upper', 'lower', 'left', 'right', 'frontal', 'lateral', 'normal', 'upside_down', 'rotated']
  if (knownPoseWords.includes(str.toLowerCase())) return null
  return normalizeRotateDeg(str)
}

// 查表或 i18n 拿旋转的可读文本
const lookupRotateAction = (deg) => {
  const keys = [String(deg), `rotate${deg}`, `roate${deg}`]
  for (const k of keys) {
    const txt = t(`autocrop.rotateActions.${k}`)
    if (txt && txt !== `autocrop.rotateActions.${k}`) return txt
  }
  return ''
}

// ===== Canvas 校正变换 =====
// 根据校正参数对原图做旋转 + 翻转，输出 data URL
const applyImageCorrection = (srcUrl, params) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const { rotateDeg, flipH, flipV } = params
        const w = img.naturalWidth
        const h = img.naturalHeight
        // 旋转 90/270 时画布尺寸要交换
        const swap = rotateDeg === 90 || rotateDeg === 270
        const canvas = document.createElement('canvas')
        canvas.width = swap ? h : w
        canvas.height = swap ? w : h
        const ctx = canvas.getContext('2d')
        // 白色背景，避免透明 PNG 背景变黑
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 变换矩阵：先平移到画布中心 → 旋转 → 翻转 → 平移回去
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        // 旋转（顺时针为正角）
        if (rotateDeg) {
          ctx.rotate((rotateDeg * Math.PI) / 180)
        }
        // 翻转
        if (flipH && flipV) {
          ctx.scale(-1, -1)
        } else if (flipH) {
          ctx.scale(-1, 1)
        } else if (flipV) {
          ctx.scale(1, -1)
        }
        // 把原图绘制到中心（旋转/翻转后坐标系已变，这里用 -w/2,-h/2）
        ctx.drawImage(img, -w / 2, -h / 2)
        ctx.restore()

        // 输出 JPEG，体积小
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        resolve(dataUrl)
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = (e) => reject(new Error('校正时图片加载失败'))
    img.src = srcUrl
  })
}

// ===== 置信度计算 =====
// 取 pose_val / label_val / overall_confidence 等字段中所有合法 0~1 数值的最小值
// 0~1 区间外的值按比例归一化（>1 视为百分比）
const calcConfidence = (result) => {
  if (!result || typeof result !== 'object') {
    minConfidence.value = null
    confidenceLevel.value = ''
    return
  }
  const candidates = []
  const keys = [
    'pose_val', 'poseVal',
    'label_val', 'labelVal',
    'p',
    'confidence', 'conf', 'score', 'probability',
    'class_confidence', 'classConfidence',
    'overall_confidence', 'overallConfidence',
    'total_confidence', 'totalConfidence',
  ]
  for (const k of keys) {
    const v = result[k]
    if (typeof v === 'number' && isFinite(v) && v >= 0) {
      // 0~1 视为概率；>1 视为百分比（除以 100）
      const norm = v > 1 ? v / 100 : v
      candidates.push(norm)
    }
  }
  if (candidates.length === 0) {
    minConfidence.value = null
    confidenceLevel.value = ''
    return
  }
  // 取最小值（最差置信度决定风险等级）
  const min = Math.min(...candidates)
  minConfidence.value = min
  if (min < CONFIDENCE_THRESHOLD * 0.7) {
    // 远低于阈值（如 0.5）→ 高度风险
    confidenceLevel.value = 'low'
  } else if (min < CONFIDENCE_THRESHOLD) {
    // 略低于阈值 → 中度风险
    confidenceLevel.value = 'moderate'
  } else {
    confidenceLevel.value = 'high'
  }
}

// ===== 人工微调按钮 =====
// 对当前 resultImage（不是原图）做旋转/翻转
// 这样多次点击可以叠加操作
const manualRotate = async (deltaDeg) => {
  if (!resultImage.value) return
  // 顺时针 += deltaDeg（deltaDeg 正数=顺时针，负数=逆时针）
  const newDeg = ((currentParams.value.rotateDeg + deltaDeg) % 360 + 360) % 360
  currentParams.value = {
    ...currentParams.value,
    rotateDeg: newDeg,
  }
  await applyManualCorrection()
}

const manualFlipH = async () => {
  if (!resultImage.value) return
  currentParams.value = {
    ...currentParams.value,
    flipH: !currentParams.value.flipH,
  }
  await applyManualCorrection()
}

const manualFlipV = async () => {
  if (!resultImage.value) return
  currentParams.value = {
    ...currentParams.value,
    flipV: !currentParams.value.flipV,
  }
  await applyManualCorrection()
}

const manualReset = async () => {
  if (!uploadedImage.value) return
  // 重置回初始：使用后端返回的图（如有）或原图
  const baseSrc = correctionInfo.value.correctedByBackend && resultImage.value
    ? resultImage.value
    : uploadedImage.value
  // 注意：这里"重置"指的是回到后端校正后的初始图（不是原图）
  // 如果没有后端图，则使用 correctionInfo 中的初始参数对原图再校正一次
  try {
    if (correctionInfo.value.correctedByBackend) {
      // 后端有图，重新走一次后端图（这里简化：直接保留 resultImage 不变）
      // 实际上更合理的做法是使用 resultImage 作为基准，但需要先备份
      // 这里直接走"回到后端初始校正"的逻辑
      const backendImg = await getBackendBaseImage()
      if (backendImg) {
        resultImage.value = backendImg
      }
    } else {
      // 重新应用原始 correctionInfo 对原图校正
      const fresh = await applyImageCorrection(uploadedImage.value, {
        rotateDeg: correctionInfo.value.rotateDeg,
        flipH: correctionInfo.value.flipH,
        flipV: correctionInfo.value.flipV,
      })
      resultImage.value = fresh
    }
    currentParams.value = {
      rotateDeg: correctionInfo.value.rotateDeg,
      flipH: correctionInfo.value.flipH,
      flipV: correctionInfo.value.flipV,
    }
    userOverride.value = false
  } catch (e) {
    console.warn('⚠️ [AutoCrop] 重置失败：', e)
  }
}

// 从 apiResponse 重新取后端返回的图像
const getBackendBaseImage = async () => {
  if (!apiResponse.value) return null
  const result = apiResponse.value.r ?? apiResponse.value.data ?? apiResponse.value
  if (typeof result !== 'object' || result === null) return null
  const imageKeys = ['corrected_image', 'correctedImage', 'cropped_image', 'cropImage', 'croppedImage', 'output', 'output_image', 'outputImage', 'result_image', 'resultImage', 'image', 'img', 'base64']
  for (const k of imageKeys) {
    if (result[k] && typeof result[k] === 'string') {
      const v = result[k]
      if (v.startsWith('http') || v.startsWith('data:image')) return v
      return `data:image/jpeg;base64,${v}`
    }
  }
  return null
}

// 应用当前 currentParams 到 resultImage（生成新的 resultImage）
const applyManualCorrection = async () => {
  const baseSrc = getCurrentResultSrc()
  if (!baseSrc) return
  try {
    const corrected = await applyImageCorrection(baseSrc, {
      rotateDeg: currentParams.value.rotateDeg,
      flipH: currentParams.value.flipH,
      flipV: currentParams.value.flipV,
    })
    resultImage.value = corrected
    userOverride.value = true
    // 同步 correctionInfo 状态
    correctionInfo.value = {
      ...correctionInfo.value,
      hasCorrection: currentParams.value.rotateDeg !== 0 || currentParams.value.flipH || currentParams.value.flipV,
      rotateDeg: currentParams.value.rotateDeg,
      flipH: currentParams.value.flipH,
      flipV: currentParams.value.flipV,
      rotateText: currentParams.value.rotateDeg !== 0
        ? (lookupRotateAction(currentParams.value.rotateDeg) || `顺时针 ${currentParams.value.rotateDeg}°`)
        : '',
      flipText: (currentParams.value.flipH && currentParams.value.flipV) ? '水平翻转 + 垂直翻转'
        : currentParams.value.flipH ? '水平翻转'
        : currentParams.value.flipV ? '垂直翻转'
        : '',
    }
  } catch (e) {
    console.warn('⚠️ [AutoCrop] 人工微调失败：', e)
  }
}

// 关闭低置信度弹窗（用户已确认）
const dismissLowConfidenceModal = () => {
  showLowConfidenceModal.value = false
  modalDismissed.value = true
}

// ===== 调接口（统一标准模板）=====
const startAnalysis = async () => {
  if (!originalFile.value) {
    alert(t('autocrop.pleaseUpload'))
    return
  }
  if (isAnalyzing.value) return

  isAnalyzing.value = true
  analysisDone.value = false
  resultImage.value = ''
  classificationList.value = []
  poseList.value = []
  infoRows.value = []
  correctionInfo.value = {
    hasCorrection: false,
    poseRaw: '',
    poseLabel: '',
    rotateDeg: 0,
    flipH: false,
    flipV: false,
    rotateText: '',
    flipText: '',
    correctedByBackend: false,
  }
  minConfidence.value = null
  confidenceLevel.value = ''
  userOverride.value = false
  showLowConfidenceModal.value = false
  modalDismissed.value = false
  currentParams.value = { rotateDeg: 0, flipH: false, flipV: false }

  try {
    const result = await callOpenApi({
      endpoint: API_CONFIG.endpoint,
      file: originalFile.value,
      apiKey: API_CONFIG.apiKey,
      timeoutMs: API_CONFIG.timeout,
      pageType: 'autocrop',
    })

    if (result.ok && result.data) {
      const data = result.data
      apiResponse.value = data
      await parseResponse(data)
      analysisDone.value = true
      console.log('✓ [AutoCrop] 识别完成')
    } else if (result.errClass) {
      alert(formatErrorMessage(result.errClass))
    } else {
      alert('接口返回格式异常')
    }
  } catch (error) {
    console.error('=== [AutoCrop] 处理失败 ===', error)
    // 如果是 parseResponse 抛出的业务错误（有 message），直接展示
    if (error?.message) {
      alert(`${error.message}\n\n建议：请确认上传的是标准口腔X光影像（JPEG/PNG格式）`)
    } else {
      alert('API调用失败，请检查网络连接或接口配置')
    }
  } finally {
    isAnalyzing.value = false
    console.log('✅ [AutoCrop] finally executed, isAnalyzing reset to false')
  }
}

const resetAll = () => {
  uploadedImage.value = ''
  originalFile.value = null
  resetAnalysis()
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.autocrop-container {
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

.autocrop-main {
  flex: 1;
  padding: 16px;
  padding-bottom: 80px; /* 给底部绿色提示栏留出空间 */
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
  min-height: 700px;
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
  border-color: #667eea;
  background: #f5f5ff;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
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
  min-height: 320px;
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

/* ===== 校正后影像（参考官方 2d/image-correction 演示页） ===== */
.corrected-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.corrected-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  flex-shrink: 0;
}

.corrected-label span { display: inline-block; }

.info-row-value-highlight {
  color: #c026d3;
  font-weight: 700;
}

/* ===== 校正信息面板（绿色高亮） ===== */
.correction-panel {
  background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #6ee7b7;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
}

.correction-panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #047857;
  margin-bottom: 10px;
}

.correction-panel-icon { font-size: 14px; }

.correction-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.correction-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  padding: 4px 0;
  border-bottom: 1px dashed #6ee7b7;
}

.correction-row:last-child {
  border-bottom: none;
}

.correction-row-label {
  color: #065f46;
  flex-shrink: 0;
  font-weight: 500;
}

.correction-row-value {
  color: #064e3b;
  font-weight: 700;
  text-align: right;
  word-break: break-all;
}

.correction-panel-ok {
  background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.correction-panel-ok .correction-panel-title {
  color: #15803d;
}

.correction-ok-text {
  color: #15803d;
  font-size: 13px;
  padding: 4px 0;
  text-align: center;
}

/* 校正来源徽章 */
.correction-source-badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  color: #047857;
  border: 1px solid #6ee7b7;
}

.correction-confidence-warn {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  background: rgba(254, 243, 199, 0.7);
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.correction-warn-icon { flex-shrink: 0; }

.correction-confidence-ok {
  display: flex;
  gap: 6px;
  align-items: center;
  background: rgba(220, 252, 231, 0.7);
  border: 1px solid #86efac;
  color: #166534;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 10px;
}

/* 置信度等级：低/中/高 */
.correction-panel-low {
  background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%) !important;
  border-color: #fbbf24 !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15) !important;
}

.correction-panel-low .correction-panel-title { color: #92400e; }
.correction-panel-low .correction-row-label { color: #78350f; }
.correction-panel-low .correction-row-value { color: #451a03; }
.correction-panel-low .correction-source-badge {
  background: rgba(255, 255, 255, 0.8);
  color: #92400e;
  border-color: #fbbf24;
}

.correction-panel-moderate {
  background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #6ee7b7;
}

.correction-panel-high {
  background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #6ee7b7;
}

/* ===== 人工微调按钮 ===== */
.manual-adjust {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #6ee7b7;
}

.correction-panel-low .manual-adjust {
  border-top-color: #fbbf24;
}

.manual-adjust-title {
  font-size: 12px;
  font-weight: 600;
  color: #047857;
  margin-bottom: 8px;
}

.correction-panel-low .manual-adjust-title { color: #92400e; }

.manual-adjust-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.adjust-btn {
  background: white;
  border: 1px solid #6ee7b7;
  color: #047857;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-align: center;
}

.adjust-btn:hover {
  background: #ecfdf5;
  border-color: #10b981;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
}

.adjust-btn-reset {
  grid-column: 1 / -1;
  background: #f9fafb;
  border-color: #d1d5db;
  color: #4b5563;
}

.adjust-btn-reset:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.correction-panel-low .adjust-btn {
  border-color: #fbbf24;
  color: #92400e;
}

.correction-panel-low .adjust-btn:hover {
  background: #fef3c7;
  border-color: #f59e0b;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.2);
}

/* ===== 低置信度弹窗 ===== */
.confidence-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confidence-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 460px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.25s ease;
}

@keyframes modalSlideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.confidence-modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px 0;
}

.confidence-modal-icon {
  font-size: 28px;
  color: #f59e0b;
}

.confidence-modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #92400e;
}

.confidence-modal-body {
  padding: 12px 20px 16px;
}

.confidence-modal-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
}

.confidence-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 18px;
}

.confidence-modal-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.confidence-modal-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* ===== 浅蓝检测信息面板 ===== */.info-panel {
  background: linear-gradient(180deg, #eef5ff 0%, #e6f0fc 100%);
  border: 1px solid #d6e4fb;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.info-panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 10px;
}

.info-panel-icon { font-size: 14px; }

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  padding: 4px 0;
  border-bottom: 1px dashed #d6e4fb;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row-label {
  color: #4a5568;
  flex-shrink: 0;
  font-weight: 500;
}

.info-row-value {
  color: #1a202c;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.info-row-empty {
  color: #a0aec0;
  font-size: 13px;
  text-align: center;
  padding: 12px 0;
}

.info-panel-empty {
  background: #fafafa;
  border-color: #e8e8e8;
  text-align: center;
}

.info-panel-empty .info-panel-title {
  color: #999;
  justify-content: center;
}

.info-panel-empty-hint {
  color: #bbb;
  font-size: 13px;
  padding: 16px 0;
}

/* ===== 底部绿色处理完成提示栏 ===== */
.success-banner {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: white;
  padding: 12px 28px;
  border-radius: 28px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  z-index: 100;
  user-select: none;
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.success-text { white-space: nowrap; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

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
}
</style>
