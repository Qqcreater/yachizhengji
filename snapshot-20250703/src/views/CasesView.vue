<template>
  <div class="cases-container">
    <header class="cases-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">📋</div>
          <h1>病例管理系统</h1>
        </div>
        <nav class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/diagnosis" class="nav-link">诊断中心</a>
          <a href="/cases" class="nav-link active">病例管理</a>
          <a href="/about" class="nav-link">关于我们</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="page-header">
        <h2>我的病例</h2>
        <button class="primary-btn" @click="showAddModal = true">添加病例</button>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索病例编号、疾病名称..." 
          class="search-input"
        />
        <select v-model="filterStatus" class="filter-select">
          <option value="all">全部状态</option>
          <option value="pending">待诊断</option>
          <option value="diagnosed">已诊断</option>
          <option value="follow-up">随访中</option>
        </select>
      </div>

      <div class="cases-list">
        <div 
          v-for="caseItem in filteredCases" 
          :key="caseItem.id" 
          class="case-card"
          @click="viewCase(caseItem)"
        >
          <div class="case-header">
            <div class="case-id">病例编号：{{ caseItem.id }}</div>
            <span :class="['status-badge', caseItem.status]">{{ getStatusText(caseItem.status) }}</span>
          </div>
          <div class="case-info">
            <div class="case-patient">
              <span class="label">患者：</span>{{ caseItem.patientName }}
            </div>
            <div class="case-disease">
              <span class="label">诊断：</span>{{ caseItem.disease || '待诊断' }}
            </div>
            <div class="case-date">
              <span class="label">日期：</span>{{ caseItem.date }}
            </div>
          </div>
          <div class="case-actions">
            <button class="action-btn edit-btn" @click.stop="editCase(caseItem)">编辑</button>
            <button class="action-btn delete-btn" @click.stop="deleteCase(caseItem.id)">删除</button>
          </div>
        </div>
      </div>

      <div v-if="filteredCases.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无病例记录</p>
      </div>
    </main>

    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑病例' : '添加病例' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>患者姓名</label>
              <input type="text" v-model="formData.patientName" class="form-input" />
            </div>
            <div class="form-group">
              <label>年龄</label>
              <input type="number" v-model="formData.age" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>性别</label>
              <select v-model="formData.gender" class="form-input">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label>联系电话</label>
              <input type="tel" v-model="formData.phone" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>症状描述</label>
            <textarea v-model="formData.symptoms" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>诊断结果</label>
            <input type="text" v-model="formData.disease" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="saveCase">{{ isEditing ? '保存修改' : '添加病例' }}</button>
        </div>
      </div>
    </div>

    <div v-if="selectedCase" class="modal-overlay" @click="selectedCase = null">
      <div class="modal-content view-modal" @click.stop>
        <div class="modal-header">
          <h3>病例详情</h3>
          <button class="close-btn" @click="selectedCase = null">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>患者信息</h4>
            <div class="detail-row">
              <span class="detail-label">姓名：</span>{{ selectedCase.patientName }}
            </div>
            <div class="detail-row">
              <span class="detail-label">年龄：</span>{{ selectedCase.age }}岁
            </div>
            <div class="detail-row">
              <span class="detail-label">性别：</span>{{ selectedCase.gender }}
            </div>
            <div class="detail-row">
              <span class="detail-label">电话：</span>{{ selectedCase.phone }}
            </div>
          </div>
          <div class="detail-section">
            <h4>病情信息</h4>
            <div class="detail-row">
              <span class="detail-label">症状：</span>{{ selectedCase.symptoms }}
            </div>
            <div class="detail-row">
              <span class="detail-label">诊断：</span>{{ selectedCase.disease || '待诊断' }}
            </div>
            <div class="detail-row">
              <span class="detail-label">日期：</span>{{ selectedCase.date }}
            </div>
            <div class="detail-row">
              <span class="detail-label">状态：</span><span :class="['status-badge', selectedCase.status]">{{ getStatusText(selectedCase.status) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="primary-btn" @click="selectedCase = null">关闭</button>
        </div>
      </div>
    </div>

    <footer class="cases-footer">
      <p>© 2024 智能医疗诊断平台 | 病例管理系统</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('all')
const showAddModal = ref(false)
const isEditing = ref(false)
const selectedCase = ref(null)

const formData = reactive({
  patientName: '',
  age: '',
  gender: '男',
  phone: '',
  symptoms: '',
  disease: ''
})

const cases = ref([
  {
    id: 'CASE-2024-001',
    patientName: '张三',
    age: 35,
    gender: '男',
    phone: '13800138001',
    symptoms: '头痛、发热3天，体温最高38.5℃，伴有轻微咳嗽',
    disease: '普通感冒',
    date: '2024-01-15',
    status: 'diagnosed'
  },
  {
    id: 'CASE-2024-002',
    patientName: '李四',
    age: 28,
    gender: '女',
    phone: '13900139002',
    symptoms: '胸闷、心悸一周，活动后加重',
    disease: '待诊断',
    date: '2024-01-14',
    status: 'pending'
  },
  {
    id: 'CASE-2024-003',
    patientName: '王五',
    age: 52,
    gender: '男',
    phone: '13700137003',
    symptoms: '关节疼痛、肿胀，持续两周',
    disease: '类风湿关节炎',
    date: '2024-01-10',
    status: 'follow-up'
  },
  {
    id: 'CASE-2024-004',
    patientName: '赵六',
    age: 45,
    gender: '女',
    phone: '13600136004',
    symptoms: '持续失眠、焦虑，伴有头痛',
    disease: '焦虑症',
    date: '2024-01-08',
    status: 'diagnosed'
  }
])

const filteredCases = computed(() => {
  return cases.value.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         (item.disease && item.disease.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesFilter = filterStatus.value === 'all' || item.status === filterStatus.value
    return matchesSearch && matchesFilter
  })
})

const getStatusText = (status) => {
  const statusMap = {
    pending: '待诊断',
    diagnosed: '已诊断',
    'follow-up': '随访中'
  }
  return statusMap[status] || status
}

const viewCase = (caseItem) => {
  selectedCase.value = caseItem
}

const editCase = (caseItem) => {
  isEditing.value = true
  Object.assign(formData, {
    patientName: caseItem.patientName,
    age: caseItem.age,
    gender: caseItem.gender,
    phone: caseItem.phone,
    symptoms: caseItem.symptoms,
    disease: caseItem.disease
  })
  showAddModal.value = true
}

const deleteCase = (id) => {
  if (confirm('确定要删除该病例吗？')) {
    const index = cases.value.findIndex(item => item.id === id)
    if (index > -1) {
      cases.value.splice(index, 1)
    }
  }
}

const saveCase = () => {
  if (!formData.patientName) {
    alert('请输入患者姓名')
    return
  }
  
  if (isEditing.value) {
    const caseItem = cases.value.find(item => item.patientName === formData.patientName)
    if (caseItem) {
      Object.assign(caseItem, formData)
    }
  } else {
    const newId = `CASE-${new Date().getFullYear()}-${String(cases.value.length + 1).padStart(3, '0')}`
    cases.value.push({
      id: newId,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: formData.disease ? 'diagnosed' : 'pending'
    })
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  isEditing.value = false
  Object.assign(formData, {
    patientName: '',
    age: '',
    gender: '男',
    phone: '',
    symptoms: '',
    disease: ''
  })
}
</script>

<style scoped>
.cases-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.cases-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.logo-section h1 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #667eea;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  color: #333;
  font-size: 1.8rem;
  margin: 0;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
}

.cases-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.case-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.case-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.case-id {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.diagnosed {
  background: #d4edda;
  color: #155724;
}

.status-badge.follow-up {
  background: #cce5ff;
  color: #004085;
}

.case-info {
  margin-bottom: 1rem;
}

.case-info div {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #555;
}

.case-info .label {
  color: #999;
}

.case-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn {
  background: #f0f0f0;
  color: #666;
}

.edit-btn:hover {
  background: #e0e0e0;
}

.delete-btn {
  background: #f8d7da;
  color: #721c24;
}

.delete-btn:hover {
  background: #f5c6cb;
}

.empty-state {
  text-align: center;
  padding: 4rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #999;
  font-size: 1.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.view-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.secondary-btn {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-btn:hover {
  background: #e0e0e0;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.detail-row {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

.detail-label {
  color: #999;
  margin-right: 0.5rem;
}

.cases-footer {
  background: #333;
  padding: 1.5rem;
  text-align: center;
  color: white;
  margin-top: 2rem;
}
</style>