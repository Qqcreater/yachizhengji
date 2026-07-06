// ===== 共享 API 工具 =====
// 三个功能页面（cephalometric / panoramic / autocrop）复用本文件

export const SHARED_API_KEY = 'sk_q1nu8iormmvw_im_echgu7lttawqwzy7'
export const SHARED_TIMEOUT_MS = 30000

// ===== 错误码文案 =====
const ERROR_TITLES = {
  none_img: '未识别到有效 X 光影像',
  invalid_img: '图片文件无效或格式不支持',
  no_image: '未检测到图片内容',
  cannot_identify: '模型无法识别该影像',
  timeout: '请求超时',
  network: '网络异常',
  not_found: '接口地址不存在',
  invalid_param: '请求参数错误',
  unauthorized: 'API 密钥无效或已过期',
  server: '服务器内部错误',
  unknown: '识别失败',
}

const ERROR_DETAILS = {
  none_img: '请检查：\n1. 上传无手持、无多余边框的纯 X 光底片\n2. 图片清晰度足够（避免过暗、过曝）\n3. 图片格式为 JPEG / PNG\n4. 详情请见浏览器控制台',
  invalid_img: '请检查：\n1. 图片文件是否完整（重新导出一次）\n2. 格式为 JPEG / PNG / WEBP（避免 BMP / TIFF）\n3. 文件大小 < 10MB\n4. 详情请见浏览器控制台',
  not_found: '请检查：\n1. 接口 URL 是否与 openapi-lab 平台文档一致\n2. vite.config.js 代理配置（/openapi 前缀）\n3. 重启 vite dev server\n4. 详情请见浏览器控制台',
  unauthorized: '请检查：\n1. API 密钥是否正确（控制台 → API 密钥页面）\n2. 账户是否欠费 / 套餐到期\n3. 详情请见浏览器控制台',
  server: '请稍后重试；持续出现请联系后端。\n详情请见浏览器控制台',
  network: '请检查：\n1. 网络连接是否正常\n2. vite 代理配置（vite.config.js 中 /openapi）\n3. openapi-lab.ilmsmile.com.cn 是否可访问\n4. 详情请见浏览器控制台',
  timeout: '请求超过 15 秒未响应，请稍后重试。\n详情请见浏览器控制台',
  unknown: '请重试；持续出现请截图控制台日志给后端。\n详情请见浏览器控制台',
}

// ===== 把后端业务码 / HTTP 状态码归类为用户友好提示 =====
export function classifyError(errInfo) {
  const { status, bodyText, parsedJson, abortName, fetchFailed } = errInfo

  // 1. fetch 自身失败（断网 / CORS / 代理挂）
  if (abortName === 'AbortError') {
    return { code: 'timeout', title: ERROR_TITLES.timeout, detail: ERROR_DETAILS.timeout }
  }
  if (fetchFailed) {
    return { code: 'network', title: ERROR_TITLES.network, detail: ERROR_DETAILS.network }
  }

  // 2. HTTP 层
  if (status === 404) {
    return { code: 'not_found', title: ERROR_TITLES.not_found, detail: ERROR_DETAILS.not_found, raw: bodyText }
  }
  if (status === 401 || status === 403) {
    return { code: 'unauthorized', title: ERROR_TITLES.unauthorized, detail: ERROR_DETAILS.unauthorized, raw: bodyText }
  }
  if (status === 400) {
    return { code: 'invalid_param', title: ERROR_TITLES.invalid_param, detail: ERROR_DETAILS.invalid_img + '\n\n' + (bodyText || ''), raw: bodyText }
  }
  if (status >= 500) {
    return { code: 'server', title: ERROR_TITLES.server, detail: ERROR_DETAILS.server, raw: bodyText }
  }

  // 3. 业务层
  // 后端统一响应：{code:0, r:{...}} 成功；{code:-1, r:'none img'|'invalid img'|...} 业务错误
  if (parsedJson) {
    const code = parsedJson.code
    const r = parsedJson.r

    // 业务错误：code != 0 / undefined
    if (code === 0) {
      // code === 0 但 r 是字符串
      if (typeof r === 'string') {
        const lower = r.toLowerCase()
        if (/none\s*img|no\s*image|cannot.*identify|cannot.*detect/.test(lower)) {
          return { code: 'none_img', title: ERROR_TITLES.none_img, detail: ERROR_DETAILS.none_img + `\n\n后端响应：${r}` }
        }
        if (/invalid\s*img|invalid\s*image|invalid.*format|corrupt/.test(lower)) {
          return { code: 'invalid_img', title: ERROR_TITLES.invalid_img, detail: ERROR_DETAILS.invalid_img + `\n\n后端响应：${r}` }
        }
        return { code: 'unknown', title: '识别失败', detail: `后端响应：${r}\n\n` + ERROR_DETAILS.unknown }
      }
      // code === 0 且 r 是对象但无有效数据
      if (r && typeof r === 'object') {
        const arr = Array.isArray(r) ? r : Object.values(r)
        const hasData = Array.isArray(r) ? r.length > 0 : Object.keys(r).length > 0
        if (!hasData) {
          return { code: 'none_img', title: ERROR_TITLES.none_img, detail: ERROR_DETAILS.none_img }
        }
      }
      return null // code === 0 且 r 正常，由业务层继续
    }

    // code != 0
    const errMsg = (typeof r === 'string' ? r : '') || parsedJson.msg || parsedJson.message || parsedJson.error || '处理失败'
    const lower = errMsg.toLowerCase()
    if (/none\s*img|no\s*image/.test(lower)) {
      return { code: 'none_img', title: ERROR_TITLES.none_img, detail: ERROR_DETAILS.none_img + `\n\n后端响应：${errMsg}` }
    }
    if (/invalid\s*img|invalid.*format/.test(lower)) {
      return { code: 'invalid_img', title: ERROR_TITLES.invalid_img, detail: ERROR_DETAILS.invalid_img + `\n\n后端响应：${errMsg}` }
    }
    return { code: 'unknown', title: '分析失败', detail: `后端响应：${errMsg}\n\n` + ERROR_DETAILS.unknown }
  }

  return { code: 'unknown', title: ERROR_TITLES.unknown, detail: ERROR_DETAILS.unknown }
}

// ===== 弹窗格式化 =====
export function formatErrorMessage(errClass) {
  if (!errClass) return ''
  return `${errClass.title}\n\n${errClass.detail || ''}`
}

// ===== 通用 fetch 封装 =====
/**
 * 统一请求方法
 * @param {Object} opts
 * @param {string} opts.endpoint - 形如 /openapi/v1/...
 * @param {File|Blob} opts.file - 原图 File 对象
 * @param {string} opts.apiKey
 * @param {number} opts.timeoutMs
 * @param {string} [opts.fileField='img'] - FormData 文件字段名
 * @param {'file'|'base64'} [opts.fileMode='file'] - 'file' 传原生 File，'base64' 把 File 读成 base64 字符串再传
 * @param {Object} [opts.extraFields] - 额外 FormData 字段，如 {cvm: '0'}
 * @param {Function} [opts.beforeFetch] - 钩子，在 fetch 前调用
 * @returns {Promise<{ok:boolean, status:number, data?:any, errClass?:any, rawText?:string}>}
 */
export async function callOpenApi({ endpoint, file, apiKey = SHARED_API_KEY, timeoutMs = SHARED_TIMEOUT_MS, fileField = 'img', fileMode = 'file', extraFields = {}, beforeFetch }) {
  if (!file) {
    return { ok: false, errClass: { code: 'invalid_param', title: '未上传文件', detail: '请先选择图片后再发起识别请求。' } }
  }

  const formData = new FormData()

  // 根据 fileMode 决定如何序列化图像
  if (fileMode === 'base64') {
    // 部分后端（autocrop）期望 base64 字符串
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    formData.append(fileField, dataUrl)
  } else {
    // 默认：原生 File 对象
    formData.append(fileField, file, file.name || 'upload.jpg')
  }

  for (const [k, v] of Object.entries(extraFields || {})) {
    formData.append(k, v)
  }

  // 调试日志
  console.group('🚀 [OpenAPI] 发起识别请求')
  console.log('URL:', endpoint)
  console.log('Method:', 'POST')
  console.log('Headers:', { sk: apiKey })
  console.log('FormData 字段:')
  for (const [k, v] of formData.entries()) {
    if (v instanceof File || v instanceof Blob) {
      console.log(`  - ${k}: File(name=${v.name || '(blob)'}, size=${v.size}, type=${v.type || '(unknown)'})`)
    } else {
      console.log(`  - ${k}:`, v)
    }
  }
  console.groupEnd()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  if (typeof beforeFetch === 'function') {
    try { beforeFetch() } catch (_) {}
  }

  let response = null
  let fetchFailed = false
  let abortName = null
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { sk: apiKey },
      body: formData,
      signal: controller.signal,
    })
  } catch (e) {
    fetchFailed = true
    abortName = e?.name
    clearTimeout(timeoutId)
    console.error('❌ [OpenAPI] fetch 失败:', e)
    const errClass = classifyError({ fetchFailed, abortName })
    return { ok: false, errClass }
  }
  clearTimeout(timeoutId)

  // 打印响应基础信息
  console.group('📥 [OpenAPI] 收到响应')
  console.log('Status:', response.status, response.statusText)
  console.groupEnd()

  // HTTP 错误体
  if (!response.ok) {
    const rawText = await response.text().catch(() => '')
    let parsedJson = null
    try { parsedJson = JSON.parse(rawText) } catch (_) {}
    console.error('❌ [OpenAPI] HTTP 错误响应体:', rawText)
    const errClass = classifyError({ status: response.status, bodyText: rawText, parsedJson })
    return { ok: false, status: response.status, errClass, rawText }
  }

  // 业务响应
  let rawText = ''
  let data = null
  try {
    rawText = await response.text()
    data = rawText ? JSON.parse(rawText) : null
  } catch (e) {
    console.error('❌ [OpenAPI] 响应 JSON 解析失败:', e, rawText)
    return { ok: false, status: response.status, errClass: classifyError({ status: response.status, bodyText: rawText }), rawText }
  }
  console.log('✅ [OpenAPI] 响应数据:', data)

  // 业务错误检查
  const errClass = classifyError({ status: response.status, bodyText: rawText, parsedJson: data })
  if (errClass && data?.code !== 0) {
    return { ok: false, status: response.status, errClass, rawText, data }
  }
  // code === 0 但 r 是字符串（业务码归类为错误）
  if (errClass && data?.code === 0 && typeof data.r === 'string') {
    return { ok: false, status: response.status, errClass, rawText, data }
  }

  return { ok: true, status: response.status, data, rawText }
}
