<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ type === 'login' ? '登录' : '注册' }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>账号</label>
          <input 
            type="text" 
            v-model="form.username" 
            placeholder="请输入账号"
            required
          />
        </div>

        <div class="form-group">
          <label>密码</label>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="请输入密码"
            required
          />
        </div>

        <div v-if="type === 'register'" class="form-group">
          <label>确认密码</label>
          <input 
            type="password" 
            v-model="form.confirmPassword" 
            placeholder="请再次输入密码"
            required
          />
        </div>

        <button type="submit" class="submit-btn">
          {{ type === 'login' ? '登录' : '注册' }}
        </button>

        <div class="form-footer">
          <span v-if="type === 'login'">
            还没有账号？
            <button type="button" class="link-btn" @click="$emit('close'); $emit('switch')">注册</button>
          </span>
          <span v-else>
            已有账号？
            <button type="button" class="link-btn" @click="$emit('close'); $emit('switch')">登录</button>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'login'
  }
})

const emit = defineEmits(['close', 'submit', 'switch'])

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

watch(() => props.type, () => {
  form.username = ''
  form.password = ''
  form.confirmPassword = ''
})

const handleSubmit = () => {
  if (props.type === 'register' && form.password !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  emit('submit', {
    username: form.username,
    password: form.password
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e8e8e8;
  color: #666;
}

.modal-form {
  padding: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 15px;
  transition: border-color 0.25s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input::placeholder {
  color: #ccc;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  margin-bottom: 16px;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.link-btn:hover {
  text-decoration: underline;
}
</style>