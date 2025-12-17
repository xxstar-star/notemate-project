// 获取页面元素
const addButton = document.getElementById('add-btn');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const tagsInput = document.getElementById('note-tags');
const notesContainer = document.getElementById('notes-container');
const totalNotesSpan = document.getElementById('total-notes');
const searchInput = document.getElementById('search-input');

let notes = []; // 存储所有笔记数据

// 为添加按钮添加点击事件监听器
addButton.addEventListener('click', function() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);

    // 简单验证
    if (!title || !content) {
        alert('请填写标题和内容！');
        return;
    }

    // 创建笔记对象
    const newNote = {
        id: Date.now(), // 简单的时间戳作为唯一ID
        title,
        content,
        tags,
        createdAt: new Date().toLocaleDateString('zh-CN')
    };

    // 添加到笔记数组
    notes.push(newNote);
    
    // 更新显示
    renderNotes();
    
    // 清空输入框
    titleInput.value = '';
    contentInput.value = '';
    tagsInput.value = '';

    console.log('新笔记已添加:', newNote);
});

// 渲染笔记列表的函数
function renderNotes(filteredNotes = null) {
    const notesToRender = filteredNotes || notes;
    
    // 更新笔记总数
    totalNotesSpan.textContent = notes.length;
    
    if (notesToRender.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>没有找到相关笔记</p>
            </div>
        `;
        return;
    }

    notesContainer.innerHTML = notesToRender.map(note => `
        <div class="note-card" data-note-id="${note.id}">
            <h4>
                ${note.title}
                <span class="date">${note.createdAt}</span>
            </h4>
            <p>${note.content}</p>
            ${note.tags.length > 0 ? `
                <div class="tags">
                    ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="note-actions">
                <button class="delete-btn" title="删除笔记">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="edit-btn" title="编辑笔记">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');

    // 添加删除功能
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = parseInt(this.closest('.note-card').dataset.noteId);
            deleteNote(noteId);
        });
    });
}

// 删除笔记函数
function deleteNote(noteId) {
    if (confirm('确定要删除这条笔记吗？')) {
        notes = notes.filter(note => note.id !== noteId);
        renderNotes();
        console.log('笔记已删除:', noteId);
    }
}

// 搜索功能
searchInput.addEventListener('input', function() {
    const keyword = this.value.toLowerCase().trim();
    
    if (!keyword) {
        renderNotes();
        return;
    }

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword) ||
        note.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    
    renderNotes(filteredNotes);
});

// 初始化显示
renderNotes();