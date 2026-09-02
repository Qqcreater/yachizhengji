// ===== 检验报告数据工具 =====
// 各识别功能在分析成功后调用 saveReportSection 将结果摘要存入 localStorage，
// 检验报告页（ReportView）读取后生成诊断证明书，避免引入全局状态库

const SECTIONS_KEY = 'medicalReportSections'
const USER_KEY = 'userInfo'

// 保存某个功能模块的识别结果（time 自动记录本次分析时间）
export const saveReportSection = (key, payload) => {
  try {
    const raw = localStorage.getItem(SECTIONS_KEY)
    const sections = raw ? JSON.parse(raw) : {}
    sections[key] = { ...payload, time: new Date().toLocaleString('zh-CN', { hour12: false }) }
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections))
  } catch (e) {
    console.warn('[Report] 保存识别结果失败:', e)
  }
}

// 读取全部识别结果 { cephalometric: {...}, panoramic: {...}, autocrop: {...} }
export const getReportSections = () => {
  try {
    const raw = localStorage.getItem(SECTIONS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// 读取登录用户信息（姓名/年龄/血型等）
export const getUserInfo = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
