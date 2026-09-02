// ===== 轻量化 i18n 双语方案 =====
// 无需引入 vue-i18n，基于 Vue3 reactive 实现全局语言切换
// 语言选择存入 localStorage，下次打开自动沿用

import { reactive, computed } from 'vue'

const STORAGE_KEY = 'app-language'

// 默认语言：读取 localStorage，不存在则默认 zh
const getInitialLang = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'zh' || stored === 'en') return stored
  return 'zh'
}

const state = reactive({
  lang: getInitialLang()
})

// ===== 双语词条 =====
const messages = {
  zh: {
    // 侧边栏
    sidebar: {
      moduleTitle: '功能模块',
      home: '首页',
      cephalometric: '头颅侧位片识别',
      panoramic: '曲面断层片轮廓分割',
      login: '登录',
      register: '注册',
      welcome: '欢迎，',
      logout: '退出登录',
    },
    // 顶部导航
    topNav: {
      home: '首页',
      digitalCapability: '数字化能力',
      contactUs: '联系我们',
      console: '控制台',
      cephalometricDropdown: '🩻 头颅侧位片17关键点识别',
      panoramicDropdown: '🔬 曲面断层片轮廓分割',
      langZh: '简体中文',
      langEn: 'English',
    },
    // 首页
    home: {
      heroTitle: 'AI驱动的智能医疗诊断平台',
      heroDesc: '基于深度学习的医疗影像分析系统，为您提供专业、准确的健康评估服务',
      cephalometricBtn: '头颅侧位片检测',
      panoramicBtn: '曲面断层片轮廓分割',
      coreFeatures: '核心功能',
      cephalometricTitle: '头颅侧位片分析',
      cephalometricDesc: 'AI自动识别正畸标志点，精准定位关键解剖结构',
      panoramicTitle: '曲面断层片轮廓分割',
      panoramicDesc: 'AI自动分割曲面断层影像轮廓，完成口腔全景片分析研判',
      statPatients: '服务患者',
      statAccuracy: '诊断准确率',
      statDoctors: '专业医生',
      footer: '© 2024 爱乐慕 i Little Miracle | 版权所有',
    },
    // 头颅侧位片页面
    cephalometric: {
      pageTitle: '头颅侧位片识别',
      pageDesc: '上传头颅侧位X光片，AI自动识别头影测量标志点，输出点位坐标、标注绘图',
      originalImage: '原始图片',
      uploadedHint: '点击或拖拽上传头颅侧位片',
      uploadPlaceholder: '点击或拖拽上传头颅侧位片',
      uploadSubHint: '支持 JPG / PNG 格式',
      startAnalysis: '开始分析',
      reAnalyze: '重新分析',
      analyzing: '分析中...',
      reSelect: '重新选择',
      resultTitle: '识别结果',
      resultPlaceholder: '请上传图片并开始分析',
      pleaseUpload: '请上传图片并开始分析',
      landmarkList: '标志点列表',
      pointName: '点位名称',
      xCoord: 'X坐标',
      yCoord: 'Y坐标',
      scrollZoom: '滚轮缩放',
      dragPan: '拖拽平移',
    },
    // 曲面断层片页面
    panoramic: {
      pageTitle: '曲面断层片轮廓分割',
      pageDesc: '上传曲面断层片，AI 自动分割恒牙 / 乳牙轮廓，返回轮廓、中心点、牙号与分类',
      originalImage: '原始图片',
      uploadHint: '点击或拖拽上传曲面断层片',
      uploadPlaceholder: '点击或拖拽上传曲面断层片',
      uploadSubHint: '支持 JPG / PNG 格式',
      clickToViewLarge: '🔍 点击查看大图',
      clickPreviewToView: '点击预览图查看大图',
      toothLocate: '下方牙号可定位',
      startAnalysis: '开始分析',
      reAnalyze: '重新分析',
      analyzing: '分析中...',
      reSelect: '重新选择',
      resultTitle: '识别结果',
      resultPlaceholder: '识别结果将显示在这里',
      pleaseUpload: '请上传图片并开始分析',
      totalDetected: '共识别 {total} 颗牙（恒牙 {permanent} 颗，乳牙 {deciduous} 颗）',
      toothNo: '牙号',
      type: '分类',
      xCoord: 'X 坐标',
      yCoord: 'Y 坐标',
      permanent: '恒牙',
      deciduous: '乳牙',
      unclassified: '未分类',
      // 底部统计
      statsTitle: '检测总数统计',
      statsSubtitle: '恒牙 / 乳牙分类概览',
      totalLabel: '识别总数',
      permanentLabel: '恒牙',
      deciduousLabel: '乳牙',
      permanentGroupTitle: '恒牙牙号分组',
      permanentGroupSubtitle: '共 {count} 颗',
      deciduousGroupTitle: '乳牙牙号分组',
      deciduousGroupSubtitle: '共 {count} 颗',
      noPermanent: '未识别到恒牙',
      noDeciduous: '未识别到乳牙',
      scrollZoom: '滚轮缩放',
      dragPan: '拖拽平移',
    },
  },
  en: {
    // 侧边栏
    sidebar: {
      moduleTitle: 'Modules',
      home: 'Home',
      cephalometric: 'Cephalometric Analysis',
      panoramic: 'Panoramic Contour Segmentation',
      login: 'Login',
      register: 'Register',
      welcome: 'Welcome, ',
      logout: 'Logout',
    },
    // 顶部导航
    topNav: {
      home: 'Home',
      digitalCapability: 'Digital Capability',
      contactUs: 'Contact Us',
      console: 'Console',
      cephalometricDropdown: '🩻 Cephalometric 17 Key Points',
      panoramicDropdown: '🔬 Panoramic Contour Segmentation',
      langZh: '简体中文',
      langEn: 'English',
    },
    // 首页
    home: {
      heroTitle: 'AI-Powered Intelligent Medical Diagnosis Platform',
      heroDesc: 'Deep learning-based medical image analysis system, providing professional and accurate health assessment',
      cephalometricBtn: 'Cephalometric Analysis',
      panoramicBtn: 'Panoramic Contour Segmentation',
      coreFeatures: 'Core Features',
      cephalometricTitle: 'Cephalometric Analysis',
      cephalometricDesc: 'AI auto-detects orthodontic landmarks, precisely locating key anatomical structures',
      panoramicTitle: 'Panoramic Contour Segmentation',
      panoramicDesc: 'AI auto-segments panoramic radiograph contours, completing dental panoramic analysis',
      statPatients: 'Patients Served',
      statAccuracy: 'Diagnostic Accuracy',
      statDoctors: 'Professional Doctors',
      footer: '© 2024 i Little Miracle | All Rights Reserved',
    },
    // 头颅侧位片页面
    cephalometric: {
      pageTitle: 'Cephalometric Landmark Detection',
      pageDesc: 'Upload a cephalometric radiograph, AI auto-detects cephalometric landmarks, outputs point coordinates and annotation',
      originalImage: 'Original Image',
      uploadedHint: 'Click or drag to upload cephalometric radiograph',
      uploadPlaceholder: 'Click or drag to upload cephalometric radiograph',
      uploadSubHint: 'Supports JPG / PNG format',
      startAnalysis: 'Start Analysis',
      reAnalyze: 'Re-analyze',
      analyzing: 'Analyzing...',
      reSelect: 'Re-select',
      resultTitle: 'Analysis Result',
      resultPlaceholder: 'Please upload an image and start analysis',
      pleaseUpload: 'Please upload an image and start analysis',
      landmarkList: 'Landmark List',
      pointName: 'Point Name',
      xCoord: 'X Coord',
      yCoord: 'Y Coord',
      scrollZoom: 'Scroll to Zoom',
      dragPan: 'Drag to Pan',
    },
    // 曲面断层片页面
    panoramic: {
      pageTitle: 'Panoramic Contour Segmentation',
      pageDesc: 'Upload panoramic radiograph, AI auto-segments permanent / primary tooth contours, returns contours, center points, tooth numbers and classifications',
      originalImage: 'Original Image',
      uploadHint: 'Click or drag to upload panoramic radiograph',
      uploadPlaceholder: 'Click or drag to upload panoramic radiograph',
      uploadSubHint: 'Supports JPG / PNG format',
      clickToViewLarge: '🔍 Click to view large image',
      clickPreviewToView: 'Click preview to view large image',
      toothLocate: 'Tooth number below for locate',
      startAnalysis: 'Start Analysis',
      reAnalyze: 'Re-analyze',
      analyzing: 'Analyzing...',
      reSelect: 'Re-select',
      resultTitle: 'Analysis Result',
      resultPlaceholder: 'Analysis result will be displayed here',
      pleaseUpload: 'Please upload an image and start analysis',
      totalDetected: 'Total detected: {total} teeth ({permanent} permanent, {deciduous} primary)',
      toothNo: 'Tooth No.',
      type: 'Type',
      xCoord: 'X Coord',
      yCoord: 'Y Coord',
      permanent: 'Permanent',
      deciduous: 'Primary',
      unclassified: 'Unclassified',
      // 底部统计
      statsTitle: 'Detection Statistics',
      statsSubtitle: 'Permanent / Primary Overview',
      totalLabel: 'Total Detected',
      permanentLabel: 'Permanent',
      deciduousLabel: 'Primary',
      permanentGroupTitle: 'Permanent Tooth Group',
      permanentGroupSubtitle: '{count} teeth',
      deciduousGroupTitle: 'Primary Tooth Group',
      deciduousGroupSubtitle: '{count} teeth',
      noPermanent: 'No permanent teeth detected',
      noDeciduous: 'No primary teeth detected',
      scrollZoom: 'Scroll to Zoom',
      dragPan: 'Drag to Pan',
    },
  },
}

// ===== 核心 API =====

// 获取当前语言
const getLang = () => state.lang

// 设置语言（存入 localStorage）
const setLang = (lang) => {
  if (lang !== 'zh' && lang !== 'en') return
  state.lang = lang
  localStorage.setItem(STORAGE_KEY, lang)
}

// 获取翻译文本
const t = (key) => {
  const keys = key.split('.')
  let result = messages[state.lang]
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      // 回退到中文
      let fallback = messages.zh
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk]
        } else {
          return key
        }
      }
      return fallback
    }
  }
  return result
}

// 带参数的翻译（如 {total}, {permanent} 等）
const tp = (key, params) => {
  let text = t(key)
  if (typeof text !== 'string') return text
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
  }
  return text
}

// 计算属性：当前语言是否中文
const isZh = computed(() => state.lang === 'zh')

// 当前语言显示名称
const langDisplay = computed(() => state.lang === 'zh' ? '简体中文' : 'English')

export { state, getLang, setLang, t, tp, isZh, langDisplay, messages }
