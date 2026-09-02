<template>
  <div class="contact-container">
    <TopNav />

    <header class="page-header">
      <h1>联系我们</h1>
      <p>我们期待听到您的声音</p>
    </header>

    <main class="contact-main">
      <div class="content-wrapper">
        <div class="left-panel">
          <div class="panel-header">
            <h2>留言提交</h2>
            <p class="hint">填写以下表单，我们会尽快回复您</p>
          </div>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">姓名 <span class="required">*</span></label>
              <input 
                id="name" 
                v-model="form.name" 
                type="text" 
                placeholder="请输入您的姓名"
                class="form-input"
              />
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">邮箱 <span class="required">*</span></label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                placeholder="请输入您的邮箱"
                class="form-input"
              />
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="subject">留言主题 <span class="required">*</span></label>
              <select id="subject" v-model="form.subject" class="form-select">
                <option value="" disabled>请选择留言主题</option>
                <option value="general">一般咨询</option>
                <option value="technical">技术支持</option>
                <option value="cooperation">合作机会</option>
                <option value="feedback">问题反馈</option>
                <option value="other">其他</option>
              </select>
              <span v-if="errors.subject" class="error-text">{{ errors.subject }}</span>
            </div>

            <div class="form-group">
              <label for="message">消息内容 <span class="required">*</span></label>
              <textarea 
                id="message" 
                v-model="form.message" 
                rows="5" 
                placeholder="请输入您的留言内容"
                class="form-textarea"
              ></textarea>
              <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
            </div>

            <button type="submit" class="btn btn-primary">
              发送信息
            </button>
          </form>
        </div>

        <div class="right-panel">
          <div class="panel-header">
            <h2>联系方式</h2>
          </div>

          <div class="contact-info">
            <div class="info-item">
              <span class="info-icon">📧</span>
              <div class="info-content">
                <h3>电子邮箱</h3>
                <p class="info-desc">我们通常会在24小时内回复您的邮件</p>
                <p class="info-value">bq86795729@qq.com</p>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">📍</span>
              <div class="info-content">
                <h3>单位地址</h3>
                <p class="info-value">广东东软学院</p>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">🕐</span>
              <div class="info-content">
                <h3>工作时间</h3>
                <div class="work-time">
                  <p>周一至周五: 9:00 - 18:00</p>
                  <p>周六: 10:00 - 16:00</p>
                  <p>周日: 休息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showSuccess" class="success-modal" @click="closeSuccess">
      <div class="success-content" @click.stop>
        <span class="success-icon">✓</span>
        <h3>发送成功</h3>
        <p>感谢您的留言，我们会尽快回复！</p>
        <button class="btn btn-secondary" @click="closeSuccess">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import TopNav from '../components/TopNav.vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const showSuccess = ref(false)

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = () => {
  let isValid = true
  
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''
  
  if (!form.name.trim()) {
    errors.name = '请输入姓名'
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.email = '请输入邮箱'
    isValid = false
  } else if (!validateEmail(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  if (!form.subject) {
    errors.subject = '请选择留言主题'
    isValid = false
  }
  
  if (!form.message.trim()) {
    errors.message = '请输入留言内容'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    showSuccess.value = true
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>

<style scoped>
.contact-container {
  width: 100vw;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 24px;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.contact-main {
  flex: 1;
  padding: 40px 24px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.left-panel,
.right-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.panel-header {
  margin-bottom: 24px;
}

.panel-header h2 {
  margin: 0 0 6px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.panel-header .hint {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #dc2626;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.25s, box-shadow 0.25s;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.error-text {
  color: #dc2626;
  font-size: 12px;
}

.btn {
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e8eaed;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 10px;
}

.info-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-desc {
  margin: 0 0 6px 0;
  color: #999;
  font-size: 13px;
}

.info-value {
  margin: 0;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
}

.work-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.work-time p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.success-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.success-icon {
  display: inline-block;
  width: 64px;
  height: 64px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  font-size: 32px;
  line-height: 64px;
  margin-bottom: 16px;
}

.success-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.success-content p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 26px;
  }
  
  .contact-main {
    padding: 24px 16px;
  }
}
</style>