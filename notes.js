// notes.js - 完整功能版
console.log('✅ notes.js 已加载');

let notes = []; // 存储所有笔记

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    
    // 从本地存储加载笔记
    loadNotes();
    
    // 设置事件监听
    setupEventListeners();
    
    // 显示笔记列表
    renderNotes();
});

// 从本地存储加载笔记
function loadNotes() {
    const savedNotes = localStorage.getItem('notemate-notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        console.log('从本地存储加载了', notes.length, '条笔记');
    }
    updateStats();
}

// 设置事件监听
function setupEventListeners() {
    // 新建笔记按钮
    const newNoteBtn = document.getElementById('new-note-btn');
    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', showNoteEditor);
    }
    
    // 保存笔记按钮
    const saveNoteBtn = document.getElementById('save-note-btn');
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', saveNote);
    }
    
    // 取消按钮
    const cancelBtn = document.getElementById('cancel-note-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideNoteEditor);
    }
}

// 显示编辑器
function showNoteEditor() {
    const editor = document.getElementById('note-editor');
    if (editor) {
        editor.style.display = 'block';
        console.log('编辑器已显示');
        
        // 清空编辑器内容
        document.getElementById('note-title-input').value = '';
        document.getElementById('note-content-input').value = '';
        document.getElementById('note-tags-input').value = '';
        
        // 自动聚焦到标题输入框
        document.getElementById('note-title-input').focus();
    }
}

// 隐藏编辑器
function hideNoteEditor() {
    const editor = document.getElementById('note-editor');
    if (editor) {
        editor.style.display = 'none';
    }
}

// 保存笔记
function saveNote() {
    console.log('开始保存笔记...');
    
    // 获取输入内容
    const title = document.getElementById('note-title-input').value.trim();
    const content = document.getElementById('note-content-input').value.trim();
    const tags = document.getElementById('note-tags-input').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // 验证
    if (!title || !content) {
        alert('请填写标题和内容！');
        return;
    }
    
    // 创建笔记对象
    const newNote = {
        id: Date.now(), // 唯一ID
        title: title,
        content: content,
        tags: tags,
        createdAt: new Date().toLocaleString('zh-CN'),
        isStarred: false
    };
    
    // 添加到笔记数组
    notes.unshift(newNote);
    
    // 保存到本地存储
    localStorage.setItem('notemate-notes', JSON.stringify(notes));
    
    console.log('笔记已保存:', newNote);
    
    // 更新界面
    hideNoteEditor();
    renderNotes();
    updateStats();
    //提示笔记保存成功
    console.log('✅ 笔记保存成功！标题:', title);
}

// 渲染笔记列表
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;
    
    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>还没有任何笔记</h3>
                <p>点击"新建笔记"开始记录你的第一个想法</p>
            </div>
        `;
        return;
    }
    
    // 生成笔记列表HTML
    notesList.innerHTML = notes.map(note => `
        <div class="note-item ${note.isStarred ? 'starred' : ''}" data-note-id="${note.id}">
            <div class="note-item-header">
                <h4 class="note-item-title">${escapeHtml(note.title)}</h4>
                <span class="note-item-date">${note.createdAt}</span>
            </div>
            <div class="note-item-content">
                ${escapeHtml(note.content)}
            </div>
            ${note.tags.length > 0 ? `
                <div class="note-item-tags">
                    ${note.tags.map(tag => `<span class="note-item-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}

            <div class="note-item-actions">
                <button class="edit-btn" onclick="editNote(${note.id})" title="编辑笔记">
                <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="star-btn" onclick="toggleStar(${note.id})" title="${note.isStarred ? '取消收藏' : '收藏'}">
                    <i class="${note.isStarred ? 'fas' : 'far'} fa-star"></i>
                </button>
                <button class="delete-btn" onclick="deleteNote(${note.id})" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 收藏/取消收藏功能
function toggleStar(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
        notes[noteIndex].isStarred = !notes[noteIndex].isStarred;
        localStorage.setItem('notemate-notes', JSON.stringify(notes));
        renderNotes();
        updateStats();
    }
}

// 更新统计信息
function updateStats() {
    const totalCount = document.getElementById('total-notes-count');
    const starredCount = document.getElementById('starred-notes-count');
    
    if (totalCount) totalCount.textContent = notes.length;
    if (starredCount) starredCount.textContent = notes.filter(note => note.isStarred).length;
}

// HTML转义函数
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
// 删除笔记功能
function deleteNote(noteId) {
    if (confirm('确定要删除这条笔记吗？删除后无法恢复。')) {
        // 从数组中移除该笔记
        notes = notes.filter(note => note.id !== noteId);
        
        // 更新本地存储
        localStorage.setItem('notemate-notes', JSON.stringify(notes));
        
        // 重新渲染界面
        renderNotes();
        updateStats();
        
        console.log('笔记已删除，ID:', noteId);
        
        // 可选：显示删除成功提示（非弹窗）
        showToast('笔记删除成功！', 'success');
    }
}
// 编辑笔记
function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // 填充编辑器
    document.getElementById('note-title-input').value = note.title;
    document.getElementById('note-content-input').value = note.content;
    document.getElementById('note-tags-input').value = note.tags.join(', ');
    
    // 显示编辑器
    document.getElementById('note-editor').style.display = 'block';
    
    // 修改保存按钮为更新按钮
    const saveBtn = document.getElementById('save-note-btn');
    saveBtn.textContent = '更新笔记';
    saveBtn.onclick = function() { updateNote(noteId); };
    
    // 滚动到编辑器
    document.getElementById('note-editor').scrollIntoView({ behavior: 'smooth' });
}

// 更新笔记 - 修正版
function updateNote(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) return;
    
    const title = document.getElementById('note-title-input').value.trim();
    const content = document.getElementById('note-content-input').value.trim();
    const tags = document.getElementById('note-tags-input').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !content) {
        alert('请填写标题和内容！');
        return;
    }
    
    // ✅ 正确写法：创建全新的笔记对象，保持原ID
    const updatedNote = {
        id: noteId,  // 保持原ID不变！
        title: title,
        content: content,
        tags: tags,
        isStarred: notes[noteIndex].isStarred,  // 保留收藏状态
        createdAt: notes[noteIndex].createdAt,  // 保留创建时间
        updatedAt: new Date().toLocaleString('zh-CN')
    };
    
    // 直接替换数组中的元素
    notes[noteIndex] = updatedNote;
    
    // 保存到本地存储
    localStorage.setItem('notemate-notes', JSON.stringify(notes));
    
    // 隐藏编辑器
    document.getElementById('note-editor').style.display = 'none';
    
    // 重新渲染
    renderNotes();
    updateStats();
    
    // 重置保存按钮
    const saveBtn = document.getElementById('save-note-btn');
    saveBtn.textContent = '保存笔记';
    saveBtn.onclick = saveNote;
}