<template>
  <div class="report-container">
    <header class="page-header">
      <h1>{{ t('report.pageTitle') }}</h1>
      <p>{{ t('report.pageDesc') }}</p>
    </header>

    <main class="report-main">
      <!-- 工具栏（不进入下载区域） -->
      <div class="report-toolbar no-print">
        <button class="tool-btn primary" :disabled="downloading || !hasAnySection" @click="downloadPng">
          <span v-if="downloading" class="loading-spinner"></span>
          {{ downloading ? t('report.rendering') : t('report.download') }}
        </button>
        <button class="tool-btn" :disabled="!hasAnySection" @click="printReport">
          {{ t('report.print') }}
        </button>
      </div>

      <!-- 未登录提示 -->
      <div v-if="!user.isLogin" class="report-empty no-print">
        <span class="empty-icon">🔐</span>
        <p>{{ t('report.needLogin') }}</p>
        <button class="tool-btn primary" @click="$router.push('/')">{{ t('report.backHome') }}</button>
      </div>

      <!-- 无检查记录提示 -->
      <div v-else-if="!hasAnySection" class="report-empty no-print">
        <span class="empty-icon">📋</span>
        <p>{{ t('report.noData') }}</p>
      </div>

      <!-- ===== 诊断证明书（A4 版式，模仿传统医疗文书） ===== -->
      <div v-else class="paper-wrap">
        <div class="report-paper" ref="paperRef">
          <h1 class="report-title">{{ t('report.title') }}</h1>

          <div class="report-no">
            <span>NO：{{ reportNo }}</span>
            <span>（{{ t('report.noStampValid') }}）</span>
          </div>
          <div class="thick-line"></div>

          <div class="info-line">
            <span class="info-item">{{ t('report.name') }}：{{ user.fullName || '-' }}</span>
            <span class="info-item">{{ t('report.age') }}：{{ user.age || '-' }}</span>
            <span class="info-item">{{ t('report.bloodType') }}：{{ user.bloodType || '-' }}</span>
          </div>

          <div class="info-line">
            <span class="info-item">{{ t('report.visitTime') }}：{{ visitTime }}</span>
          </div>

          <div class="section">
            <div class="section-label">{{ t('report.clinicalDx') }}：</div>
            <div class="section-text">
              <p v-for="(line, i) in clinicalDxLines" :key="i">{{ line }}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-label">{{ t('report.course') }}：</div>
            <div class="section-text">
              <p v-for="(line, i) in courseLines" :key="i">{{ line }}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-label">{{ t('report.advice') }}：</div>
            <div class="section-text">
              <p v-for="(line, i) in adviceLines" :key="i">{{ line }}</p>
            </div>
          </div>

          <div class="doctor-line">{{ t('report.doctor') }}：{{ t('report.aiDoctor') }}</div>

          <div class="stamp-area">
            <div class="stamp">{{ t('report.stamp') }}</div>
            <div class="date-line">{{ todayStr }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '../i18n/index.js'
import html2canvas from 'html2canvas'
import { getUserInfo, getReportSections } from '../utils/medicalReport.js'

const user = ref({})
const sections = ref({})
const paperRef = ref(null)
const downloading = ref(false)

// 报告编号：SC + 时间戳后 8 位，每次进入页面生成
const reportNo = `SC${String(Date.now()).slice(-8)}`

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
})

const hasAnySection = computed(() => Object.keys(sections.value).length > 0)

// 检查时间：取最近一次分析时间
const visitTime = computed(() => {
  const times = Object.values(sections.value).map(s => s.time).filter(Boolean)
  if (times.length === 0) return '-'
  return times.sort().at(-1)
})

const SECTION_NAMES = {
  cephalometric: '头颅侧位片识别',
  panoramic: '曲面断层片轮廓分割',
  autocrop: '口腔图像分类与姿态识别',
}

// 临床诊断：各检查结论汇总
const clinicalDxLines = computed(() => {
  const lines = []
  const s = sections.value
  if (s.cephalometric) {
    lines.push(`头颅侧位片共识别正畸标志点 ${s.cephalometric.itemCount} 个，点位定位完整。`)
  }
  if (s.panoramic) {
    lines.push(`曲面断层片共检出牙齿 ${s.panoramic.total} 颗（恒牙 ${s.panoramic.permanent} 颗、乳牙 ${s.panoramic.deciduous} 颗），牙位标注完整。`)
  }
  if (s.autocrop) {
    lines.push(`口腔图像分类与姿态识别完成：影像姿态「${s.autocrop.poseLabel}」，检出分类信息 ${s.autocrop.rows?.length ?? 0} 项。`)
  }
  return lines.length ? lines : ['-']
})

// 主要诊治经过：按检查时间逐条列出
const courseLines = computed(() => {
  const lines = []
  const s = sections.value
  if (s.cephalometric) {
    lines.push(`${s.cephalometric.time}：行「${SECTION_NAMES.cephalometric}」检查，AI 自动识别 17 关键点并完成头影测量标注。`)
  }
  if (s.panoramic) {
    lines.push(`${s.panoramic.time}：行「${SECTION_NAMES.panoramic}」检查，AI 自动分割恒牙/乳牙轮廓，返回轮廓、中心点、牙号与分类。`)
  }
  if (s.autocrop) {
    lines.push(`${s.autocrop.time}：行「${SECTION_NAMES.autocrop}」检查，AI 自动裁剪口腔影像并识别图像分类与拍摄姿态参数。`)
  }
  return lines.length ? lines : ['-']
})

// 医学建议：按检查结果动态生成
const adviceLines = computed(() => {
  const lines = []
  const s = sections.value
  if (s.panoramic && s.panoramic.deciduous > 0) {
    lines.push('影像提示混合牙列（含乳牙），建议关注乳恒牙替换进展，必要时进行咬合诱导评估。')
  }
  if (s.panoramic && s.panoramic.total < 28) {
    lines.push('检出的恒牙数目少于 28 颗，可能存在先天缺牙、阻生或已拔除等情况，建议结合临床口内检查确认。')
  }
  if (s.cephalometric) {
    lines.push('如需正畸治疗评估，请携带本报告咨询正畸专科医生，结合临床检查制定方案。')
  }
  lines.push('保持良好口腔卫生习惯，早晚正确刷牙并使用牙线，每 6-12 个月进行一次口腔检查。')
  lines.push('本报告由 AI 辅助生成，仅供临床参考，不能替代执业医师诊断。')
  return lines
})

const downloadPng = async () => {
  if (!paperRef.value || downloading.value) return
  downloading.value = true
  try {
    const canvas = await html2canvas(paperRef.value, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `SmileCenter检验报告_${user.value.fullName || reportNo}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    console.error('[Report] 生成图片失败:', e)
    alert('报告生成失败，请重试')
  } finally {
    downloading.value = false
  }
}

const printReport = () => window.print()

onMounted(() => {
  user.value = getUserInfo()
  sections.value = getReportSections()
})
</script>

<style scoped>
.report-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 22px 28px 14px;
  background: white;
  border-bottom: 1px solid #e8eaed;
  flex-shrink: 0;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 22px;
  color: #1a1a2e;
}

.page-header p {
  margin: 0;
  font-size: 13px;
  color: #888;
}

.report-main {
  flex: 1;
  padding: 16px 28px 32px;
}

/* 工具栏 */
.report-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.tool-btn {
  padding: 9px 20px;
  border: 1px solid #dfe3ee;
  border-radius: 8px;
  background: white;
  color: #556;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.tool-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  font-weight: 600;
}

.tool-btn.primary:hover:not(:disabled) {
  opacity: 0.92;
  color: white;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.report-empty {
  background: white;
  border-radius: 14px;
  padding: 60px 20px;
  text-align: center;
  color: #889;
}

.empty-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.report-empty .tool-btn {
  margin-top: 16px;
}

/* 纸张容器 */
.paper-wrap {
  display: flex;
  justify-content: center;
}

/* ===== 诊断证明书 A4 纸样式（模仿传统医疗文书） ===== */
.report-paper {
  width: 794px; /* A4 宽度 @96dpi */
  min-height: 1000px;
  background: white;
  padding: 70px 76px;
  box-sizing: border-box;
  font-family: 'SimSun', 'Songti SC', 'STSong', serif;
  color: #111;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.report-title {
  margin: 24px 0 40px;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 4px;
}

.report-no {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
  font-size: 15px;
  margin-bottom: 6px;
}

.thick-line {
  height: 4px;
  background: #111;
  margin-bottom: 34px;
}

.info-line {
  display: flex;
  gap: 36px;
  font-size: 17px;
  margin-bottom: 26px;
}

.info-item {
  white-space: nowrap;
}

.section {
  margin-bottom: 30px;
}

.section-label {
  font-size: 17px;
  margin-bottom: 10px;
}

.section-text {
  min-height: 90px;
  font-size: 15px;
  line-height: 2;
}

.section-text p {
  margin: 0 0 6px;
}

.doctor-line {
  font-size: 17px;
  margin: 44px 0 30px;
}

.stamp-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 26px;
  margin-top: 40px;
  padding-right: 30px;
}

.stamp {
  font-size: 19px;
  letter-spacing: 8px;
}

.date-line {
  font-size: 16px;
  letter-spacing: 2px;
}

/* 打印：只保留报告纸内容 */
@media print {
  .no-print {
    display: none !important;
  }

  .report-paper {
    box-shadow: none;
    border-radius: 0;
    width: 100%;
    padding: 40px 50px;
  }

  .page-header {
    display: none;
  }

  .report-main {
    padding: 0;
  }
}

/* 窄屏适配 */
@media (max-width: 900px) {
  .report-paper {
    width: 100%;
    padding: 40px 28px;
  }

  .info-line {
    flex-wrap: wrap;
    gap: 14px;
  }
}
</style>
