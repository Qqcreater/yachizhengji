<template>
  <div class="qa-container">
    <header class="page-header">
      <h1>{{ t('qa.pageTitle') }}</h1>
      <p>{{ t('qa.pageDesc') }}</p>
    </header>

    <main class="qa-main">
      <div class="chat-card">
        <!-- 顶部工具栏 -->
        <div class="chat-toolbar">
          <span class="model-tag">DeepSeek</span>
          <button
            class="btn-clear"
            :disabled="isSending || realMessageCount === 0"
            @click="clearChat"
          >
            {{ t('qa.clear') }}
          </button>
        </div>

        <!-- 消息列表 -->
        <div class="chat-messages" ref="messagesRef">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['msg-row', msg.role === 'user' ? 'user-row' : 'ai-row']"
          >
            <div class="avatar" :class="{ 'user-avatar': msg.role === 'user' }">
              {{ msg.role === 'user' ? '🧑' : '🦷' }}
            </div>
            <div class="bubble">
              <img
                v-if="msg.imageDataUrl"
                :src="msg.imageDataUrl"
                class="msg-image"
                alt="uploaded"
                @click="previewImage(msg.imageDataUrl)"
              />
              <div v-if="msgContent(msg)" v-html="renderMarkdown(msgContent(msg))"></div>
            </div>
          </div>
          <!-- 思考中指示 -->
          <div v-if="isSending" class="msg-row ai-row">
            <div class="avatar">🦷</div>
            <div class="bubble typing-bubble">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- 快捷问题 -->
        <div class="suggest-row">
          <button
            v-for="q in suggestions"
            :key="q"
            class="suggest-chip"
            :disabled="isSending"
            @click="sendMessage(q)"
          >{{ q }}</button>
        </div>

        <!-- 待发送图片预览 -->
        <div v-if="attachedImage" class="attach-preview">
          <img :src="attachedImage.dataUrl" class="attach-thumb" alt="preview" />
          <div class="attach-info">
            <span class="attach-name">{{ attachedImage.name }}</span>
            <button class="attach-remove" :disabled="isSending" @click="attachedImage = null">✕</button>
          </div>
        </div>

        <!-- 输入区 -->
        <div
          class="chat-input-row"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            class="file-input"
            @change="handleImageSelect"
          />
          <button
            class="btn-attach"
            :disabled="isSending"
            :title="t('qa.attachImage')"
            @click="fileInputRef?.click()"
          >📎</button>
          <button
            class="btn-voice"
            :class="{ recording: isListening }"
            :disabled="isSending"
            :title="speechSupported ? (isListening ? t('qa.voiceStop') : t('qa.voiceStart')) : t('qa.voiceUnsupported')"
            @click="toggleVoice"
          >🎤</button>
          <textarea
            v-model="input"
            class="chat-input"
            :class="{ 'is-listening': isListening }"
            :placeholder="isListening ? t('qa.voiceListening') : t('qa.inputPlaceholder')"
            rows="2"
            @paste="handlePaste"
            @keydown.enter.exact.prevent="sendMessage()"
          ></textarea>
          <button
            class="btn-send"
            :disabled="(!input.trim() && !attachedImage) || isSending"
            @click="sendMessage()"
          >
            <span v-if="isSending" class="loading-spinner"></span>
            {{ isSending ? t('qa.sending') : t('qa.send') }}
          </button>
        </div>

        <p class="disclaimer">{{ t('qa.disclaimer') }}</p>
      </div>
    </main>

    <!-- 图片大图预览 -->
    <div v-if="previewUrl" class="img-preview-mask" @click="previewUrl = null">
      <img :src="previewUrl" class="img-preview-large" alt="preview" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { t, getLang } from '../i18n/index.js'

// ===== API 配置（集中管理）=====
// 通过 Vite 代理 /deepseek-proxy 转发到 https://api.deepseek.com，规避浏览器跨域限制
// deepseek-chat：纯文本对话；deepseek-v4-flash-vision-exp：带图片时使用（图片仅允许出现在 user 消息中）
const API_CONFIG = {
  endpoint: "/.netlify/functions/deepseek-proxy",
  apiKey: "",
  textModel: 'deepseek-chat',
  visionModel: 'deepseek-vl',
  timeoutMs: 120000,
  maxImageSize: 30 * 1024 * 1024,
}

// 系统提示词：约束模型以专业口腔健康助手身份回答
const SYSTEM_PROMPT = '你是专业、耐心的口腔健康科普助手。请围绕牙齿及口腔健康回答问题；若用户上传了图片，请结合图片内容进行分析。内容需科学准确、结构清晰、通俗易懂。涉及具体诊断或治疗方案时，须提醒用户咨询专业牙医。请使用与用户提问相同的语言回答。'

const input = ref('')
const isSending = ref(false)
const messagesRef = ref(null)
const fileInputRef = ref(null)
const attachedImage = ref(null) // { dataUrl, name }
const previewUrl = ref(null)

// ===== 语音输入（Web Speech API，Chrome / Edge 支持，需麦克风权限）=====
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
const speechSupported = !!SpeechRecognitionCtor
const isListening = ref(false)
let recognition = null
let voiceBaseText = '' // 本轮已确认的识别文本（中间结果实时追加显示）

const toggleVoice = () => {
  if (isListening.value) {
    // 第二次点击：停止录音，识别文字保留在输入框中
    recognition?.stop()
    return
  }
  if (!speechSupported) {
    alert(t('qa.voiceUnsupported'))
    return
  }
  recognition = new SpeechRecognitionCtor()
  recognition.lang = getLang() === 'en' ? 'en-US' : 'zh-CN'
  recognition.continuous = true // 持续录音，直到第二次点击手动停止
  recognition.interimResults = true

  // 以输入框已有内容为基础，语音识别结果追加在其后
  voiceBaseText = input.value.trim() ? input.value.replace(/\s*$/, '') + ' ' : ''

  recognition.onresult = (e) => {
    // 从 resultIndex 起处理：final 结果并入 base（仅处理一次，避免重复累加），
    // interim 为当前短语的临时结果，实时覆盖显示
    let interim = ''
    let finalText = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const transcript = e.results[i][0].transcript
      if (e.results[i].isFinal) finalText += transcript
      else interim += transcript
    }
    if (finalText) voiceBaseText += finalText
    input.value = voiceBaseText + interim
  }
  recognition.onerror = (e) => {
    isListening.value = false
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      alert(t('qa.voiceDenied'))
    } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
      console.warn('[DentalQA] 语音识别错误:', e.error)
    }
  }
  recognition.onend = () => {
    // 停止后状态复位，input 中的识别文字保留，供用户编辑或发送
    isListening.value = false
  }

  try {
    recognition.start()
    isListening.value = true
  } catch (err) {
    console.error('[DentalQA] 语音识别启动失败:', err)
    isListening.value = false
  }
}

onBeforeUnmount(() => {
  recognition?.stop()
})

// 消息列表：greeting 带 i18nKey 标记，仅用于展示，不参与 API 请求
const messages = ref([
  { role: 'assistant', i18nKey: 'qa.greeting', content: '' }
])

const suggestions = computed(() => [
  t('qa.suggest1'),
  t('qa.suggest2'),
  t('qa.suggest3'),
  t('qa.suggest4'),
])

const realMessageCount = computed(() =>
  messages.value.filter(m => !m.i18nKey).length
)

// 展示内容：i18n 消息动态取词条，普通消息取自身 content
const msgContent = (msg) => (msg.i18nKey ? t(msg.i18nKey) : msg.content)

// 轻量 Markdown 渲染：先转义 HTML 防注入，再处理常见格式
const renderMarkdown = (text) => {
  let s = String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>')          // 行内代码
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')  // 粗体
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>') // 斜体
  s = s.replace(/^#{1,4}\s+(.+)$/gm, '<strong>$1</strong>') // 标题
  s = s.replace(/^---+$/gm, '<hr/>')                        // 分割线
  s = s.replace(/^[-*]\s+(.+)$/gm, '• $1')                  // 无序列表
  return s.replace(/\n/g, '<br>')
}

// 校验并读取图片文件为 base64 dataURL
const loadImageFile = (file) => {
  if (!file) return
  if (!/^image\/(jpeg|png|gif|webp)$/.test(file.type)) {
    alert(t('qa.imageFormatError'))
    return
  }
  if (file.size > API_CONFIG.maxImageSize) {
    alert(t('qa.imageTooLarge'))
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    attachedImage.value = { dataUrl: ev.target.result, name: file.name || 'image' }
  }
  reader.readAsDataURL(file)
}

const handleImageSelect = (e) => {
  loadImageFile(e.target.files?.[0])
  e.target.value = ''
}

// 支持直接粘贴截图
const handlePaste = (e) => {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        e.preventDefault()
        loadImageFile(file)
      }
      break
    }
  }
}

const handleDrop = (e) => {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    loadImageFile(file)
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const previewImage = (url) => { previewUrl.value = url }

// 发送消息：带图片时自动切换视觉模型，finally 保证按钮状态复位
const sendMessage = async (presetText) => {
  const text = (typeof presetText === 'string' ? presetText : input.value).trim()
  const img = attachedImage.value
  if ((!text && !img) || isSending.value) return

  // 发送时若正在录音则停止
  if (isListening.value) recognition?.stop()

  input.value = ''
  attachedImage.value = null

  // 用户消息：图片 dataUrl 随消息保留用于展示
  messages.value.push({
    role: 'user',
    content: text || t('qa.defaultImageQuestion'),
    imageDataUrl: img?.dataUrl ?? null,
  })
  isSending.value = true
  scrollToBottom()

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs)

    // 构建多轮消息：历史中的图片降级为 [图片] 占位文本（避免旧图重复计费与格式限制），
    // 仅当前轮携带图片时使用视觉模型并以 content 数组传入
    const realMsgs = messages.value.filter(m => !m.i18nKey)
    const apiMessages = [{ role: 'system', content: SYSTEM_PROMPT }]
    realMsgs.forEach((m, idx) => {
      const isCurrentWithImage = m.imageDataUrl && idx === realMsgs.length - 1 && img
      if (isCurrentWithImage) {
        apiMessages.push({
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: m.imageDataUrl } },
            { type: 'text', text: m.content },
          ],
        })
      } else {
        apiMessages.push({
          role: m.role,
          content: (m.imageDataUrl ? '[图片]\n' : '') + m.content,
        })
      }
    })

    const res = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: img ? API_CONFIG.visionModel : API_CONFIG.textModel,
        messages: apiMessages,
        stream: false,
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${errText}`)
    }

    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content
    if (!reply) throw new Error('Empty response')

    messages.value.push({ role: 'assistant', content: reply })
  } catch (err) {
    console.error('[DentalQA] 请求失败:', err)
    messages.value.push({
      role: 'assistant',
      content: err?.name === 'AbortError'
        ? t('qa.errorMsg') + ' (timeout)'
        : t('qa.errorMsg'),
    })
  } finally {
    isSending.value = false
    scrollToBottom()
  }
}

// 清空对话：仅保留欢迎语
const clearChat = () => {
  if (isSending.value) return
  if (isListening.value) recognition?.stop()
  messages.value = [{ role: 'assistant', i18nKey: 'qa.greeting', content: '' }]
}
</script>

<style scoped>
.qa-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
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

.qa-main {
  flex: 1;
  min-height: 0;
  padding: 16px 28px 20px;
  display: flex;
}

.chat-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  overflow: hidden;
}

.chat-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f4;
}

.model-tag {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  padding: 3px 10px;
  border-radius: 20px;
}

.btn-clear {
  border: 1px solid #e0e3ea;
  background: white;
  color: #666;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover:not(:disabled) {
  color: #e05a5a;
  border-color: #e05a5a;
}

.btn-clear:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 16px;
  background: #fafbfd;
}

.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
}

.user-row {
  flex-direction: row-reverse;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.avatar.user-avatar {
  background: #e8ebf5;
}

.bubble {
  max-width: 72%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.bubble :deep(code) {
  background: rgba(102, 126, 234, 0.08);
  color: #556;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 13px;
}

.bubble :deep(hr) {
  border: none;
  border-top: 1px solid #e5e8f0;
  margin: 8px 0;
}

.ai-row .bubble {
  background: white;
  border: 1px solid #eceef3;
  color: #333;
  border-top-left-radius: 4px;
}

.user-row .bubble {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-top-right-radius: 4px;
}

.msg-image {
  display: block;
  max-width: 240px;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: zoom-in;
  object-fit: cover;
}

/* 思考中动画 */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 16px;
}

.typing-bubble .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b8bed4;
  animation: dotBounce 1.2s infinite ease-in-out;
}

.typing-bubble .dot:nth-child(2) { animation-delay: 0.15s; }
.typing-bubble .dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes dotBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-5px); opacity: 1; }
}

.suggest-row {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 10px 16px 0;
  flex-wrap: wrap;
}

.suggest-chip {
  border: 1px solid #dfe3ee;
  background: white;
  color: #556;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggest-chip:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.suggest-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 待发送图片预览 */
.attach-preview {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 16px 0;
  padding: 8px;
  border: 1px solid #e5e8f0;
  border-radius: 10px;
  background: #fafbfd;
}

.attach-thumb {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
}

.attach-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.attach-name {
  font-size: 12px;
  color: #667;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attach-remove {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #eef0f6;
  color: #889;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.attach-remove:hover:not(:disabled) {
  background: #e05a5a;
  color: white;
}

.chat-input-row {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 16px 6px;
}

.file-input {
  display: none;
}

.btn-attach {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border: 1px solid #dfe3ee;
  border-radius: 10px;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-attach:hover:not(:disabled) {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.btn-attach:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-voice {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border: 1px solid #dfe3ee;
  border-radius: 10px;
  background: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-voice:hover:not(:disabled) {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.btn-voice:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 录音中：麦克风周围持续红色高亮 + 脉冲扩散动画 */
.btn-voice.recording {
  border-color: #e05a5a;
  background: #e05a5a;
  box-shadow: 0 0 0 3px rgba(224, 90, 90, 0.25);
  animation: micPulse 1.3s ease-in-out infinite;
}

@keyframes micPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(224, 90, 90, 0.30); }
  50% { box-shadow: 0 0 0 9px rgba(224, 90, 90, 0); }
}

.chat-input.is-listening {
  border-color: #e05a5a;
  box-shadow: 0 0 0 3px rgba(224, 90, 90, 0.12);
}

.chat-input {
  flex: 1;
  resize: none;
  border: 1px solid #dfe3ee;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}

.btn-send {
  flex-shrink: 0;
  min-width: 84px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-send:hover:not(:disabled) {
  opacity: 0.92;
}

.btn-send:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.disclaimer {
  flex-shrink: 0;
  margin: 0;
  padding: 4px 16px 12px;
  text-align: center;
  font-size: 11px;
  color: #aab;
}

/* 图片大图预览遮罩 */
.img-preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: zoom-out;
}

.img-preview-large {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}
</style>
