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
      autocrop: '口腔图像分类与姿态识别',
      dentalQA: '牙齿智能问答',
      medicalReport: '检验报告',
      login: '登录',
      register: '注册',
      welcome: '欢迎，',
      logout: '退出登录',
    },
    // 检验报告
    report: {
      pageTitle: '检验报告',
      pageDesc: '基于您的检查结果生成的口腔医学检验报告',
      title: '口腔医学检验报告',
      noStampValid: '未盖章无效',
      name: '姓名',
      age: '年龄',
      bloodType: '血型',
      visitTime: '检查时间',
      clinicalDx: '临床诊断',
      course: '主要诊治经过',
      advice: '医学建议',
      doctor: '医生',
      aiDoctor: 'AI 辅助诊断系统',
      stamp: '公章',
      download: '下载报告',
      print: '打印报告',
      rendering: '生成中...',
      needLogin: '请先登录以查看检验报告',
      backHome: '返回首页',
      noData: '暂无检查记录，请先完成至少一项检查',
    },
    // 顶部导航
    topNav: {
      home: '首页',
      digitalCapability: '数字化能力',
      contactUs: '联系我们',
      console: '控制台',
      cephalometricDropdown: '🩻 头颅侧位片17关键点识别',
      panoramicDropdown: '🔬 曲面断层片轮廓分割',
      autocropDropdown: '📷 口腔图像分类与姿态识别',
      langZh: '简体中文',
      langEn: 'English',
    },
    // 首页
    home: {
      heroTitle: 'AI驱动的智能医疗诊断平台',
      heroDesc: '基于深度学习的医疗影像分析系统，为您提供专业、准确的健康评估服务',
      cephalometricBtn: '头颅侧位片检测',
      panoramicBtn: '曲面断层片轮廓分割',
      autocropBtn: '口腔图像分类与姿态识别',
      coreFeatures: '核心功能',
      cephalometricTitle: '头颅侧位片分析',
      cephalometricDesc: 'AI自动识别正畸标志点，精准定位关键解剖结构',
      panoramicTitle: '曲面断层片轮廓分割',
      panoramicDesc: 'AI自动分割曲面断层影像轮廓，完成口腔全景片分析研判',
      autocropTitle: '口腔图像分类与姿态识别',
      autocropDesc: 'AI自动裁剪口腔影像并识别图像分类与拍摄姿态参数',
      dentalQATitle: '牙齿智能问答',
      dentalQADesc: '基于 DeepSeek 大模型的口腔健康智能问答助手',
      statPatients: '服务患者',
      statAccuracy: '诊断准确率',
      statDoctors: '专业医生',
      footer: '© 2024 爱乐慕 i Little Miracle | 版权所有',
    },
    // 牙齿智能问答页面
    qa: {
      pageTitle: '牙齿智能问答',
      pageDesc: '基于 DeepSeek 大模型，为您解答牙齿与口腔健康相关问题',
      inputPlaceholder: '请输入您的问题，例如：智齿发炎怎么办？',
      send: '发送',
      sending: '思考中…',
      clear: '清空对话',
      greeting: '您好！我是牙齿健康智能助手 🦷，可以为您解答龋齿、牙周、正畸、种植等口腔相关问题。请注意：我的回答仅供参考，不能替代专业医生的诊断。',
      errorMsg: '抱歉，回答生成失败，请稍后重试。',
      suggest1: '智齿一定要拔吗？',
      suggest2: '刷牙的正确方法是什么？',
      suggest3: '儿童换牙期需要注意什么？',
      suggest4: '牙龈出血是什么原因？',
      disclaimer: 'AI 生成内容仅供参考，不能替代专业医疗建议，如有不适请及时就医。',
      attachImage: '上传图片',
      imageFormatError: '仅支持 JPG / PNG / GIF / WebP 格式图片',
      imageTooLarge: '图片大小不能超过 30MB',
      defaultImageQuestion: '请帮我分析这张图片的问题',
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
      preprocessTip: '请上传无手持、无胶片边框的纯 X 光底片',
      preprocessSubTip: '裁剪掉手掌和外框后再上传，可提高识别成功率',
      cropHint: '已自动框选X光片区域，可拖动虚线框调整（右下角圆点缩放），开始分析时将自动裁剪后再识别',
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
    // 口腔图像分类与姿态识别页面
    autocrop: {
      pageTitle: '口腔图像分类与姿态识别',
      pageDesc: '上传口腔X光影像，AI自动裁剪图像并识别图像分类与姿态参数',
      originalImage: '原始图片',
      uploadHint: '点击或拖拽上传口腔X光影像',
      uploadPlaceholder: '点击或拖拽上传口腔X光影像',
      uploadSubHint: '支持 JPG / PNG 格式',
      clickToViewLarge: '🔍 点击查看大图',
      clickPreviewToView: '点击预览图查看大图',
      startAnalysis: '开始分析',
      reAnalyze: '重新分析',
      analyzing: '分析中...',
      reSelect: '重新选择',
      resultTitle: '识别结果',
      resultPlaceholder: '识别结果将显示在这里',
      pleaseUpload: '请上传图片并开始分析',
      croppedImage: '校正后影像',
      correctedImage: '校正后影像',
      classification: '图像分类',
      poseParams: '姿态识别参数',
      noData: '暂无数据',
      scrollZoom: '滚轮缩放',
      dragPan: '拖拽平移',
      // 新版演示页布局
      infoPanelTitle: '检测信息',
      correctedImageLabel: '校正后影像',
      labelName: '检测标签',
      labelVal: '标签值',
      confidence: '标签置信度',
      overallConfidence: '总体置信度',
      poseName: '姿态',
      poseVal: '姿态值',
      originalSize: '原始尺寸',
      detectArea: '检测区域',
      rotateAction: '旋转操作',
      noDetection: '未检测到目标',
      processComplete: '处理完成',
      // 姿态/校正信息面板
      correctionPanelTitle: '校正信息',
      detectedPose: '检测姿态',
      rotationCorrection: '旋转校正',
      flipAction: '翻转操作',
      noCorrectionNeeded: '无需校正，图像方向正确',
      correctionSource: '校正来源',
      sourceBackend: '后端',
      sourceFrontend: '前端',
      sourceManual: '人工',
      confirmManualWarn: '检测置信度较低，建议人工确认校正结果。如需微调，请使用下方按钮。',
      poseLabels: {
        x_head: '左侧位（X光头颅侧位）',
        panoramic: '曲面断层片',
        periapical: '根尖片',
        bitewing: '咬合翼片',
        cephalometric: '头颅侧位片',
        pa: '后前位片',
        upper: '上颌',
        lower: '下颌',
        left: '左侧',
        right: '右侧',
        frontal: '正面位',
        lateral: '侧面位',
        normal: '正常方向',
        upside_down: '倒置',
        rotated: '已旋转',
      },
      rotateActions: {
        '0': '不旋转',
        '90': '顺时针 90°',
        '180': '旋转 180°',
        '270': '逆时针 90°（顺时针 270°）',
        rotate90: '顺时针 90°',
        rotate180: '旋转 180°',
        rotate270: '逆时针 90°（顺时针 270°）',
        roate90: '顺时针 90°',
        roate180: '旋转 180°',
        roate270: '逆时针 90°（顺时针 270°）',
        cw90: '顺时针 90°',
        ccw90: '逆时针 90°',
        flip_h: '水平翻转',
        flip_v: '垂直翻转',
        flipH: '水平翻转',
        flipV: '垂直翻转',
        horizontal: '水平翻转',
        vertical: '垂直翻转',
        vflip: '垂直翻转',
        hflip: '水平翻转',
      },
      // 手动微调 + 置信度提示（v2.1 增强）
      manualAdjust: '人工微调',
      rotateLeft: '逆时针 90°',
      rotateRight: '顺时针 90°',
      flipHorizontal: '水平翻转',
      flipVertical: '垂直翻转',
      resetCorrection: '重置',
      lowConfidence: '识别置信度较低',
      lowConfidenceWarn: '检测置信度 {val}，低于阈值 {threshold}，可能存在方向识别错误（尤其是全景片上下颚颠倒）。请人工确认校正结果，必要时使用下方按钮微调。',
      highConfidence: '识别置信度高',
      highConfidenceOk: '检测置信度 {val}，高于阈值 {threshold}，结果可信。',
      moderateConfidence: '识别置信度中等',
      moderateConfidenceOk: '检测置信度 {val}，建议人工核对校正结果。',
      confidenceThreshold: 0.75,
      ok: '确定',
      cancel: '取消',
      close: '关闭',
    },
  },
  en: {
    // 侧边栏
    sidebar: {
      moduleTitle: 'Modules',
      home: 'Home',
      cephalometric: 'Cephalometric Analysis',
      panoramic: 'Panoramic Contour Segmentation',
      autocrop: 'Oral Image Classification & Pose',
      dentalQA: 'Dental AI Q&A',
      medicalReport: 'Medical Report',
      login: 'Login',
      register: 'Register',
      welcome: 'Welcome, ',
      logout: 'Logout',
    },
    // 检验报告
    report: {
      pageTitle: 'Medical Report',
      pageDesc: 'Oral medical report generated based on your examination results',
      title: 'Oral Medical Report',
      noStampValid: 'Invalid without stamp',
      name: 'Name',
      age: 'Age',
      bloodType: 'Blood Type',
      visitTime: 'Examination Time',
      clinicalDx: 'Clinical Diagnosis',
      course: 'Treatment Course',
      advice: 'Medical Advice',
      doctor: 'Doctor',
      aiDoctor: 'AI Assisted Diagnosis System',
      stamp: 'Official Seal',
      download: 'Download Report',
      print: 'Print Report',
      rendering: 'Rendering...',
      needLogin: 'Please log in to view the medical report',
      backHome: 'Back to Home',
      noData: 'No examination records found, please complete at least one examination first',
    },
    // 顶部导航
    topNav: {
      home: 'Home',
      digitalCapability: 'Digital Capability',
      contactUs: 'Contact Us',
      console: 'Console',
      cephalometricDropdown: '🩻 Cephalometric 17 Key Points',
      panoramicDropdown: '🔬 Panoramic Contour Segmentation',
      autocropDropdown: '📷 Oral Image Classification & Pose',
      langZh: '简体中文',
      langEn: 'English',
    },
    // 首页
    home: {
      heroTitle: 'AI-Powered Intelligent Medical Diagnosis Platform',
      heroDesc: 'Deep learning-based medical image analysis system, providing professional and accurate health assessment',
      cephalometricBtn: 'Cephalometric Analysis',
      panoramicBtn: 'Panoramic Contour Segmentation',
      autocropBtn: 'Oral Image Classification & Pose',
      coreFeatures: 'Core Features',
      cephalometricTitle: 'Cephalometric Analysis',
      cephalometricDesc: 'AI auto-detects orthodontic landmarks, precisely locating key anatomical structures',
      panoramicTitle: 'Panoramic Contour Segmentation',
      panoramicDesc: 'AI auto-segments panoramic radiograph contours, completing dental panoramic analysis',
      autocropTitle: 'Oral Image Classification & Pose',
      autocropDesc: 'AI auto-crops oral images and recognizes image classification and capture pose parameters',
      dentalQATitle: 'Dental AI Q&A',
      dentalQADesc: 'Oral health assistant powered by DeepSeek large language model',
      statPatients: 'Patients Served',
      statAccuracy: 'Diagnostic Accuracy',
      statDoctors: 'Professional Doctors',
      footer: '© 2024 i Little Miracle | All Rights Reserved',
    },
    // Dental AI Q&A page
    qa: {
      pageTitle: 'Dental AI Q&A',
      pageDesc: 'Powered by DeepSeek, answering your dental and oral health questions',
      inputPlaceholder: 'Type your question, e.g., What should I do about an inflamed wisdom tooth?',
      send: 'Send',
      sending: 'Thinking…',
      clear: 'Clear Chat',
      greeting: 'Hello! I am your dental health assistant 🦷. I can answer questions about cavities, periodontal care, orthodontics, implants and more. Note: my answers are for reference only and cannot replace a professional diagnosis.',
      errorMsg: 'Sorry, failed to generate an answer. Please try again later.',
      suggest1: 'Do wisdom teeth always need extraction?',
      suggest2: 'What is the correct way to brush teeth?',
      suggest3: 'What to pay attention to during children tooth replacement?',
      suggest4: 'What causes bleeding gums?',
      disclaimer: 'AI-generated content is for reference only and cannot replace professional medical advice. Please seek medical care if feeling unwell.',
      attachImage: 'Image',
      imageFormatError: 'Only JPG / PNG / GIF / WebP images are supported',
      imageTooLarge: 'Image size cannot exceed 30MB',
      defaultImageQuestion: 'Please analyze the problem in this image',
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
      preprocessTip: 'Upload a pure X-ray film without hands or frame borders',
      preprocessSubTip: 'Crop out hands and borders before uploading for better accuracy',
      cropHint: 'X-ray region auto-detected. Drag the dashed box to adjust (bottom-right dot to resize); it will be cropped automatically before analysis',
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
    // 口腔图像分类与姿态识别页面
    autocrop: {
      pageTitle: 'Oral Image Classification & Pose Recognition',
      pageDesc: 'Upload oral X-ray image, AI auto-crops and recognizes image classification and pose parameters',
      originalImage: 'Original Image',
      uploadHint: 'Click or drag to upload oral X-ray image',
      uploadPlaceholder: 'Click or drag to upload oral X-ray image',
      uploadSubHint: 'Supports JPG / PNG format',
      clickToViewLarge: '🔍 Click to view large image',
      clickPreviewToView: 'Click preview to view large image',
      startAnalysis: 'Start Analysis',
      reAnalyze: 'Re-analyze',
      analyzing: 'Analyzing...',
      reSelect: 'Re-select',
      resultTitle: 'Analysis Result',
      resultPlaceholder: 'Analysis result will be displayed here',
      pleaseUpload: 'Please upload an image and start analysis',
      croppedImage: 'Cropped Image',
      correctedImage: 'Corrected Image',
      classification: 'Image Classification',
      poseParams: 'Pose Parameters',
      noData: 'No data',
      scrollZoom: 'Scroll to Zoom',
      dragPan: 'Drag to Pan',
      infoPanelTitle: 'Detection Info',
      correctedImageLabel: 'Corrected Image',
      labelName: 'Label',
      labelVal: 'Label Value',
      confidence: 'Label Confidence',
      overallConfidence: 'Overall Confidence',
      poseName: 'Pose',
      poseVal: 'Pose Value',
      originalSize: 'Original Size',
      detectArea: 'Detection Area',
      rotateAction: 'Rotation Action',
      noDetection: 'No target detected',
      processComplete: 'Processing Complete',
      // Correction info panel
      correctionPanelTitle: 'Correction Info',
      detectedPose: 'Detected Pose',
      rotationCorrection: 'Rotation Correction',
      flipAction: 'Flip Action',
      noCorrectionNeeded: 'No correction needed, image is correctly oriented',
      correctionSource: 'Correction Source',
      sourceBackend: 'Backend',
      sourceFrontend: 'Frontend',
      sourceManual: 'Manual',
      confirmManualWarn: 'Detection confidence is low. Please manually verify the correction result. Use the buttons below to fine-tune.',
      poseLabels: {
        x_head: 'Left Lateral (X-ray Cephalometric)',
        panoramic: 'Panoramic',
        periapical: 'Periapical',
        bitewing: 'Bitewing',
        cephalometric: 'Cephalometric',
        pa: 'PA View',
        upper: 'Upper',
        lower: 'Lower',
        left: 'Left',
        right: 'Right',
        frontal: 'Frontal',
        lateral: 'Lateral',
        normal: 'Normal Orientation',
        upside_down: 'Upside Down',
        rotated: 'Rotated',
      },
      rotateActions: {
        '0': 'No rotation',
        '90': 'Clockwise 90°',
        '180': 'Rotate 180°',
        '270': 'Counter-clockwise 90° (CW 270°)',
        rotate90: 'Clockwise 90°',
        rotate180: 'Rotate 180°',
        rotate270: 'Counter-clockwise 90° (CW 270°)',
        roate90: 'Clockwise 90°',
        roate180: 'Rotate 180°',
        roate270: 'Counter-clockwise 90° (CW 270°)',
        cw90: 'Clockwise 90°',
        ccw90: 'Counter-clockwise 90°',
        flip_h: 'Horizontal Flip',
        flip_v: 'Vertical Flip',
        flipH: 'Horizontal Flip',
        flipV: 'Vertical Flip',
        horizontal: 'Horizontal Flip',
        vertical: 'Vertical Flip',
        vflip: 'Vertical Flip',
        hflip: 'Horizontal Flip',
      },
      // Manual adjust + confidence hint (v2.1 enhancement)
      manualAdjust: 'Manual Adjust',
      rotateLeft: 'Counter-clockwise 90°',
      rotateRight: 'Clockwise 90°',
      flipHorizontal: 'Flip Horizontal',
      flipVertical: 'Flip Vertical',
      resetCorrection: 'Reset',
      lowConfidence: 'Low Recognition Confidence',
      lowConfidenceWarn: 'Detection confidence {val} is below threshold {threshold}. The orientation may be misidentified (especially panoramic with upper/lower jaw reversed). Please verify the correction manually and use the buttons below to fine-tune if needed.',
      highConfidence: 'High Recognition Confidence',
      highConfidenceOk: 'Detection confidence {val} is above threshold {threshold}. Result is trustworthy.',
      moderateConfidence: 'Moderate Recognition Confidence',
      moderateConfidenceOk: 'Detection confidence {val}. Please manually verify the correction result.',
      confidenceThreshold: 0.75,
      ok: 'OK',
      cancel: 'Cancel',
      close: 'Close',
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
