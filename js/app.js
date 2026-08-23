// ==================== 网球王子公式书网站主应用 ====================

class TenipuriApp {
    constructor() {
        this.currentView = 'characters'; // characters | schools
        this.currentCharacter = 'echizen';
        this.currentBookIndex = 0;
        this.editingData = null;
        
        this.init();
    }

    init() {
        this.renderHeader();
        this.renderMain();
        this.renderToolbar();
        this.bindEvents();
    }

    // ==================== 渲染 ====================

    renderHeader() {
        const header = document.createElement('header');
        header.className = 'manga-header';
        header.innerHTML = `
            <div class="header-title">
                テニスの王子様
                <span class="ruby">TENNIS NO OUJISAMA</span>
            </div>
            <nav class="nav-tabs">
                <button class="nav-tab active" data-view="characters">キャラクター</button>
                <button class="nav-tab" data-view="schools">学校紹介</button>
            </nav>
        `;
        document.body.appendChild(header);
    }

    renderMain() {
        const main = document.createElement('main');
        main.className = 'main-content';
        main.id = 'main-content';
        document.body.appendChild(main);
        
        this.renderCharacterView();
    }

    renderCharacterView() {
        const main = document.getElementById('main-content');
        const char = db.getCharacter(this.currentCharacter);
        const versions = Object.keys(char.versions);
        
        main.innerHTML = `
            <div class="character-selector" style="margin-bottom: 1rem;">
                <select id="char-select" style="padding: 0.5rem; font-family: inherit; border: 2px solid #000;">
                    ${db.getAllCharacters().map(c => 
                        `<option value="${c.id}" ${c.id === this.currentCharacter ? 'selected' : ''}>${c.displayName}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="character-comparison">
                <div class="comparison-header">
                    <span class="book-version ${this.currentBookIndex === 0 ? 'active' : ''}">${versions[0]}</span>
                    <span class="vs-divider">⇄</span>
                    <span class="book-version ${this.currentBookIndex === 1 ? 'active' : ''}">${versions[1] || '未登録'}</span>
                </div>
                
                <button class="slider-nav prev" id="prev-panel">◀</button>
                <button class="slider-nav next" id="next-panel">▶</button>
                
                <div class="comparison-slider" id="comparison-slider">
                    ${versions.map((bookId, idx) => this.renderCharacterPanel(char, bookId, idx)).join('')}
                </div>
            </div>
        `;

        // 滑块定位
        const slider = document.getElementById('comparison-slider');
        slider.scrollLeft = this.currentBookIndex * slider.clientWidth;
    }

    renderCharacterPanel(char, bookId, index) {
        const version = char.versions[bookId];
        const fields = version.fixedFields;
        const isEditing = this.editingData && this.editingData.bookId === bookId;
        
        return `
            <div class="character-panel" data-book="${bookId}" data-index="${index}">
                <div class="character-visual">
                    <div class="character-image-placeholder" id="char-img-${bookId}">
                        [${char.displayName} ${bookId}]
                        <br>画像アップロード
                    </div>
                    <input type="file" class="hidden-input" id="img-upload-${bookId}" accept="image/*">
                    <button class="image-upload-btn" onclick="document.getElementById('img-upload-${bookId}').click()">
                        📷 画像
                    </button>
                    
                    <div class="character-quote">
                        ${version.notes || '「まだまだだね」'}
                    </div>
                </div>
                
                <div class="profile-card">
                    <div class="profile-header">
                        <h2>${char.displayName}</h2>
                        <span class="school-badge">${db.getSchool(char.schoolId)?.name || '不明'}</span>
                    </div>
                    
                    <form class="profile-form" data-book="${bookId}">
                        <!-- 固定字段 -->
                        <div class="profile-section">
                            <div class="section-title">基本プロフィール</div>
                            <div class="profile-grid">
                                ${Object.entries(fields).map(([key, field]) => `
                                    <div class="profile-item ${field.type === 'textarea' ? 'full-width' : ''}">
                                        <label>${field.label}</label>
                                        ${this.renderFieldInput(key, field, isEditing)}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- 自定义字段 -->
                        <div class="profile-section">
                            <div class="section-title">追加情報</div>
                            <div id="custom-fields-${bookId}">
                                ${version.customFields.map((cf, i) => `
                                    <div class="custom-field-row">
                                        <input type="text" placeholder="項目名" value="${cf.label}" ${isEditing ? '' : 'readonly'}>
                                        <input type="text" placeholder="内容" value="${cf.value}" ${isEditing ? '' : 'readonly'}>
                                        ${isEditing ? `<button type="button" class="btn-icon" onclick="app.removeCustomField('${bookId}', ${i})">×</button>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                            ${isEditing ? `
                                <button type="button" class="btn-icon" onclick="app.addCustomField('${bookId}')" style="margin-top: 0.5rem;">＋ 追加</button>
                            ` : ''}
                        </div>
                        
                        <!-- 操作按钮 -->
                        <div class="profile-section" style="display: flex; gap: 1rem; justify-content: flex-end;">
                            ${isEditing ? `
                                <button type="button" class="toolbar-btn" onclick="app.saveEdit('${bookId}')">💾 保存</button>
                                <button type="button" class="toolbar-btn" onclick="app.cancelEdit()">✕ キャンセル</button>
                            ` : `
                                <button type="button" class="toolbar-btn" onclick="app.startEdit('${bookId}')">✏️ 編集</button>
                            `}
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderFieldInput(key, field, isEditing) {
        const value = field.value || '';
        const readonly = isEditing ? '' : 'readonly';
        
        switch (field.type) {
            case 'select':
                const options = field.options.map(o => 
                    `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`
                ).join('');
                return `<select name="${key}" ${readonly} ${!isEditing ? 'disabled' : ''}>${options}</select>`;
            case 'textarea':
                return `<textarea name="${key}" rows="3" ${readonly}>${value}</textarea>`;
            default:
                return `<input type="text" name="${key}" value="${value}" placeholder="${field.label}" ${readonly}>`;
        }
    }

    renderSchoolsView() {
        const main = document.getElementById('main-content');
        const schools = db.getAllSchools();
        
        main.innerHTML = `
            <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; border-bottom: 3px solid #000; padding-bottom: 0.5rem;">
                学校紹介
            </h2>
            <div class="schools-grid">
                ${schools.map(s => `
                    <div class="school-card" data-school="${s.id}">
                        <div class="school-header">
                            <div class="school-name">${s.name}</div>
                            <div class="school-name-en">${s.nameEn}</div>
                        </div>
                        <div class="school-body">
                            <div class="school-preview">[学校画像]</div>
                            <div class="school-info-item">
                                <span>創立</span>
                                <span>${s.established}</span>
                            </div>
                            <div class="school-info-item">
                                <span>部員数</span>
                                <span>${s.tennisCourt}</span>
                            </div>
                            <div class="school-info-item">
                                <span>モットー</span>
                                <span>${s.motto}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSchoolDetail(schoolId) {
        const school = db.getSchool(schoolId);
        if (!school) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'school-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="app.closeModal()">×</button>
                
                <div style="padding: 2rem;">
                    <h2 style="font-size: 2rem; border-bottom: 4px solid #000; padding-bottom: 1rem; margin-bottom: 2rem;">
                        ${school.name}
                        <span style="font-size: 0.5em; display: block; color: #666; margin-top: 0.3rem;">${school.nameEn}</span>
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <h3 style="border-left: 4px solid #000; padding-left: 1rem; margin-bottom: 1rem;">基本情報</h3>
                            <div class="school-info-item"><span>創立年</span><span>${school.established}</span></div>
                            <div class="school-info-item"><span>所在地</span><span>${school.location}</span></div>
                            <div class="school-info-item"><span>校訓</span><span>${school.motto}</span></div>
                            <div class="school-info-item"><span>制服</span><span>${school.uniform}</span></div>
                            <div class="school-info-item"><span>寮</span><span>${school.dormitory}</span></div>
                        </div>
                        <div>
                            <h3 style="border-left: 4px solid #000; padding-left: 1rem; margin-bottom: 1rem;">テニス部</h3>
                            <div class="school-info-item"><span>コート数</span><span>${school.tennisCourt}</span></div>
                            <div class="school-info-item"><span>施設</span><span>${school.facilities.join('、')}</span></div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="border-left: 4px solid #000; padding-left: 1rem; margin-bottom: 1rem;">年間行事</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${school.annualEvents.map(e => `<span style="padding: 0.3rem 0.8rem; border: 2px solid #000; font-size: 0.85rem;">${e}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="border-left: 4px solid #000; padding-left: 1rem; margin-bottom: 1rem;">部活動</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${school.clubActivities.map(c => `<span style="padding: 0.3rem 0.8rem; border: 2px solid #000; font-size: 0.85rem;">${c}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="border-left: 4px solid #000; padding-left: 1rem; margin-bottom: 1rem;">著名な卒業生・在校生</h3>
                        <p>${school.notableAlumni.join('、')}</p>
                    </div>
                    
                    <div style="margin-top: 2rem; padding: 1rem; background: #f0f0f0; border: 2px solid #000;">
                        <h3 style="margin-bottom: 0.5rem;">学校紹介</h3>
                        <p style="line-height: 1.8;">${school.description}</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    renderToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'data-toolbar';
        toolbar.innerHTML = `
            <button class="toolbar-btn" onclick="app.exportData()">
                📤 エクスポート
            </button>
            <button class="toolbar-btn" onclick="document.getElementById('import-file').click()">
                📥 インポート
            </button>
            <input type="file" class="hidden-input" id="import-file" accept=".json" onchange="app.importData(this)">
            <button class="toolbar-btn" onclick="app.addNewCharacter()">
                ➕ 新規キャラ
            </button>
        `;
        document.body.appendChild(toolbar);
    }

    // ==================== 事件处理 ====================

    bindEvents() {
        // 导航切换
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-tab')) {
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                
                if (this.currentView === 'schools') {
                    this.renderSchoolsView();
                } else {
                    this.renderCharacterView();
                }
            }
            
            // 学校卡片点击
            if (e.target.closest('.school-card')) {
                const schoolId = e.target.closest('.school-card').dataset.school;
                this.renderSchoolDetail(schoolId);
            }
            
            // 滑块导航
            if (e.target.id === 'prev-panel') {
                this.navigateSlider(-1);
            }
            if (e.target.id === 'next-panel') {
                this.navigateSlider(1);
            }
        });

        // 角色选择
        document.addEventListener('change', (e) => {
            if (e.target.id === 'char-select') {
                this.currentCharacter = e.target.value;
                this.currentBookIndex = 0;
                this.renderCharacterView();
            }
        });

        // 滑块滚动同步
        document.addEventListener('scroll', (e) => {
            if (e.target.id === 'comparison-slider') {
                const slider = e.target;
                this.currentBookIndex = Math.round(slider.scrollLeft / slider.clientWidth);
                this.updateBookIndicator();
            }
        }, true);
    }

    navigateSlider(direction) {
        const slider = document.getElementById('comparison-slider');
        const newIndex = Math.max(0, Math.min(
            Object.keys(db.getCharacter(this.currentCharacter).versions).length - 1,
            this.currentBookIndex + direction
        ));
        
        slider.scrollTo({
            left: newIndex * slider.clientWidth,
            behavior: 'smooth'
        });
        this.currentBookIndex = newIndex;
        this.updateBookIndicator();
    }

    updateBookIndicator() {
        document.querySelectorAll('.book-version').forEach((el, i) => {
            el.classList.toggle('active', i === this.currentBookIndex);
        });
    }

    // ==================== 编辑功能 ====================

    startEdit(bookId) {
        const char = db.getCharacter(this.currentCharacter);
        this.editingData = {
            bookId,
            data: JSON.parse(JSON.stringify(char.versions[bookId]))
        };
        this.renderCharacterView();
    }

    cancelEdit() {
        this.editingData = null;
        this.renderCharacterView();
    }

    saveEdit(bookId) {
        const form = document.querySelector(`.profile-form[data-book="${bookId}"]`);
        if (!form) return;
        
        const char = db.getCharacter(this.currentCharacter);
        const version = char.versions[bookId];
        
        // 更新固定字段
        const formData = new FormData(form);
        for (const [key, field] of Object.entries(version.fixedFields)) {
            const value = formData.get(key);
            if (value !== null) {
                field.value = value;
            }
        }
        
        // 更新自定义字段
        const customRows = form.querySelectorAll('.custom-field-row');
        version.customFields = Array.from(customRows).map(row => ({
            label: row.children[0].value,
            value: row.children[1].value
        })).filter(cf => cf.label || cf.value);
        
        db.updateCharacterVersion(this.currentCharacter, bookId, version);
        this.editingData = null;
        this.renderCharacterView();
    }

    addCustomField(bookId) {
        const container = document.getElementById(`custom-fields-${bookId}`);
        const row = document.createElement('div');
        row.className = 'custom-field-row';
        row.innerHTML = `
            <input type="text" placeholder="項目名">
            <input type="text" placeholder="内容">
            <button type="button" class="btn-icon" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(row);
    }

    removeCustomField(bookId, index) {
        const char = db.getCharacter(this.currentCharacter);
        char.versions[bookId].customFields.splice(index, 1);
        this.renderCharacterView();
    }

    // ==================== 数据导入导出 ====================

    exportData() {
        const data = db.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tenipuri-fanbook-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    importData(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm('既存のデータを上書きしますか？')) {
                    db.importData(data);
                    this.currentCharacter = db.getAllCharacters()[0]?.id || 'echizen';
                    this.renderCharacterView();
                    alert('データをインポートしました');
                }
            } catch (err) {
                alert('インポートに失敗しました: ' + err.message);
            }
        };
        reader.readAsText(file);
        input.value = '';
    }

    addNewCharacter() {
        const name = prompt('キャラクター名を入力してください:');
        if (!name) return;
        
        const id = 'char_' + Date.now();
        const versions = {};
        
        // 创建空白版本
        ['10.5', '20.5'].forEach(bookId => {
            versions[bookId] = db.createVersionData({});
        });
        
        db.createCharacter(id, name, versions, 'seigaku');
        this.currentCharacter = id;
        this.renderCharacterView();
    }

    closeModal() {
        document.getElementById('school-modal')?.remove();
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TenipuriApp();
});

