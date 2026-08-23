// ==================== 网球王子公式书网站 - 修复版 ====================

class TenipuriApp {
    constructor() {
        this.currentView = 'character';
        this.currentCharacter = 'echizen';
        this.currentBookId = '10.5';
        this.currentSchoolId = null;
        this.editingData = null;
        this.sidebarCollapsed = new Set();
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="app-container">
                ${this.renderSidebar()}
                <div class="main-area">
                    ${this.renderTopNav()}
                    <div class="content-wrapper" id="main-content">
                        ${this.renderCurrentView()}
                    </div>
                </div>
            </div>
            ${this.renderToolbar()}
        `;
        this.afterRender();
    }

    renderSidebar() {
        const groups = db.getCharactersBySchool();
        let html = '';
        
        for (const [schoolId, group] of groups) {
            const collapsed = this.sidebarCollapsed.has(schoolId);
            html += `
                <div class="school-group">
                    <button class="school-toggle ${collapsed ? 'collapsed' : ''}" data-school="${schoolId}">
                        <span>
                            <span class="school-icon ${schoolId}">${group.school.name.charAt(0)}</span>
                            ${group.school.name}
                        </span>
                        <span style="font-size: 0.75rem; opacity: 0.6;">${group.characters.length}人</span>
                    </button>
                    <div class="character-list ${collapsed ? 'collapsed' : ''}">
                        ${group.characters.map(char => `
                            <div class="character-item ${char.id === this.currentCharacter ? 'active' : ''}"
                                 data-character="${char.id}">
                                ${char.displayName}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return `
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-title">
                        公式書アーカイブ
                        <span class="ruby">OFFICIAL FANBOOK ARCHIVE</span>
                    </div>
                </div>
                ${html}
                <div class="sidebar-footer">
                    <button class="add-btn" id="add-character-btn">＋ 新規キャラクター</button>
                    <button class="add-btn" id="add-book-btn" style="margin-top: 0.5rem;">＋ 公式書バージョン追加</button>
                </div>
            </aside>
        `;
    }

    renderTopNav() {
        return `
            <nav class="top-nav">
                <span class="nav-logo">テニプリDB</span>
                <div class="nav-tabs">
                    <button class="nav-tab ${this.currentView === 'character' ? 'active' : ''}" data-view="character">キャラクター</button>
                    <button class="nav-tab ${this.currentView.startsWith('school') ? 'active' : ''}" data-view="school">学校紹介</button>
                </div>
            </nav>
        `;
    }

    renderCurrentView() {
        switch(this.currentView) {
            case 'character': return this.renderCharacterView();
            case 'school': return this.renderSchoolsView();
            case 'school-detail': return this.renderSchoolDetailView();
            default: return this.renderCharacterView();
        }
    }

    renderCharacterView() {
        const char = db.getCharacter(this.currentCharacter);
        if (!char) return '<div class="empty-state">キャラクターを選択してください</div>';
        
        const version = char.versions[this.currentBookId] || Object.values(char.versions)[0];
        const books = db.getAllBooks();
        
        return `
            <div class="character-page">
                <div class="book-tabs">
                    ${books.map(b => `
                        <button class="book-tab ${b.id === this.currentBookId ? 'active' : ''}" data-book="${b.id}">
                            ${b.name}${!char.versions[b.id] ? '（未登録）' : ''}
                        </button>
                    `).join('')}
                    <button class="add-book-btn" id="add-new-book" title="新規バージョン">＋</button>
                </div>
                
                <div class="image-gallery">
                    <div class="gallery-header">
                        <span class="gallery-title">📷 公式書画像 (${version.images.length}枚)</span>
                        <span style="font-size: 0.8rem; color: #666;">最大50枚まで</span>
                    </div>
                    <div class="gallery-grid" id="gallery-grid">
                        ${version.images.map((img, i) => `
                            <div class="gallery-item" data-image="${img.id}">
                                <img src="${img.dataUrl}" alt="${i+1}">
                                <span class="img-number">${i+1}</span>
                                <button class="img-delete" data-delete="${img.id}">×</button>
                            </div>
                        `).join('')}
                        <div class="gallery-upload" id="gallery-upload">
                            <span class="upload-icon">📷</span>
                            <span class="upload-text">画像を追加<br>（クリックまたはドラッグ）</span>
                        </div>
                    </div>
                    <input type="file" class="hidden-input" id="gallery-file-input" accept="image/*" multiple>
                </div>
                
                <div class="character-info">
                    <div class="visual-section">
                        <div class="main-visual" id="main-visual">
                            ${version.images[0] ? 
                                `<img src="${version.images[0].dataUrl}" alt="${char.displayName}">` :
                                `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;">[メインビジュアル]</div>`
                            }
                            <button class="visual-upload-btn" onclick="document.getElementById('main-visual-input').click()">メイン画像を設定</button>
                        </div>
                        <input type="file" class="hidden-input" id="main-visual-input" accept="image/*">
                        <div class="character-quote">${version.notes || '「まだまだだね」'}</div>
                    </div>
                    <div class="profile-section">
                        ${this.renderProfileForm(char, version)}
                    </div>
                </div>
            </div>
        `;
    }

    renderProfileForm(char, version) {
        const fields = version.fixedFields;
        const isEditing = this.editingData === this.currentBookId;
        
        let fieldsHtml = '';
        for (const [key, field] of Object.entries(fields)) {
            const fullWidth = field.type === 'textarea' ? 'full-width' : '';
            fieldsHtml += `
                <div class="field-item ${fullWidth}">
                    <span class="field-label">${field.label}</span>
                    <div class="field-value ${isEditing ? 'editing' : ''}">
                        ${isEditing ? this.renderEditField(key, field) : (field.value || '—')}
                    </div>
                </div>
            `;
        }
        
        let customHtml = '';
        for (let i = 0; i < version.customFields.length; i++) {
            const cf = version.customFields[i];
            customHtml += `
                <div class="custom-field-row">
                    ${isEditing ? `
                        <input type="text" name="custom-label-${i}" value="${cf.label}" placeholder="項目名">
                        <input type="text" name="custom-value-${i}" value="${cf.value}" placeholder="内容">
                        <button type="button" class="btn-icon remove-custom" data-index="${i}">×</button>
                    ` : `
                        <span style="min-width: 100px; font-weight: bold;">${cf.label}:</span>
                        <span>${cf.value}</span>
                    `}
                </div>
            `;
        }
        
        return `
            <div class="profile-header">
                <div>
                    <div class="profile-name">
                        ${char.displayName}
                        <span class="kana">${fields.nameKana.value || ''}</span>
                    </div>
                </div>
                <span class="profile-school-tag" style="background: ${db.getSchool(char.schoolId)?.color || '#666'}; color: #fff;">
                    ${db.getSchool(char.schoolId)?.name || '不明'}
                </span>
            </div>
            
            <form id="profile-form" data-book="${this.currentBookId}">
                <div class="fixed-fields">${fieldsHtml}</div>
                
                <div class="custom-section">
                    <div class="section-header">
                        <span class="section-title">追加情報</span>
                        ${isEditing ? `<button type="button" class="btn-small" id="add-custom-field">＋ 追加</button>` : ''}
                    </div>
                    <div class="custom-fields-list" id="custom-fields">
                        ${customHtml}
                        ${version.customFields.length === 0 && !isEditing ? '<span style="color: #999; font-size: 0.85rem;">追加情報はありません</span>' : ''}
                    </div>
                </div>
                
                <div class="edit-actions">
                    ${isEditing ? `
                        <button type="button" class="btn-small" id="save-profile">💾 保存</button>
                        <button type="button" class="btn-small" id="cancel-edit" style="background: #fff; color: #000;">✕ キャンセル</button>
                    ` : `
                        <button type="button" class="btn-small" id="edit-profile">✏️ 編集</button>
                    `}
                </div>
            </form>
        `;
    }

    renderEditField(key, field) {
        const value = field.value || '';
        if (field.type === 'select') {
            let options = '';
            for (const o of field.options) {
                options += `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`;
            }
            return `<select name="${key}">${options}</select>`;
        } else if (field.type === 'textarea') {
            return `<textarea name="${key}" rows="3">${value}</textarea>`;
        } else {
            return `<input type="text" name="${key}" value="${value}" placeholder="${field.label}">`;
        }
    }

    renderSchoolsView() {
        const schools = db.getAllSchools();
        
        return `
            <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; border-bottom: 3px solid #000; padding-bottom: 0.5rem;">学校紹介</h2>
            <div class="schools-grid">
                ${schools.map(s => `
                    <div class="school-card" data-school="${s.id}">
                        <div class="school-card-header" style="background: ${s.color};">
                            <div class="school-name">${s.name}</div>
                            <div class="school-name-en">${s.nameEn}</div>
                        </div>
                        <div class="school-card-body">
                            <div class="school-preview-img">
                                ${s.images[0] ? `<img src="${s.images[0].dataUrl}" alt="${s.name}">` : 
                                    `<div style="display:flex;align-items:center;justify-content:center;height:100%;">[学校画像]</div>`}
                            </div>
                            <div class="school-info-row"><span>創立</span><span>${s.established}</span></div>
                            <div class="school-info-row"><span>部員数</span><span>${s.tennisCourt}</span></div>
                            <div class="school-info-row"><span>モットー</span><span>${s.motto}</span></div>
                            <div class="school-info-row"><span>画像</span><span>${s.images.length}枚</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSchoolDetailView() {
        const school = db.getSchool(this.currentSchoolId);
        if (!school) return '<div class="empty-state">学校が見つかりません</div>';
        
        return `
            <div class="school-detail">
                <div class="school-detail-header" style="background: ${school.color};">
                    <div class="header-content">
                        <h1>${school.name}</h1>
                        <div class="school-name-en">${school.nameEn}</div>
                        <p class="motto">「${school.motto}」</p>
                    </div>
                </div>
                
                <div class="school-gallery-section">
                    <div class="gallery-header">
                        <span class="gallery-title">📷 学校公式書画像 (${school.images.length}枚)</span>
                        <button class="btn-small" onclick="document.getElementById('school-gallery-input').click()">＋ 画像追加</button>
                    </div>
                    <input type="file" class="hidden-input" id="school-gallery-input" accept="image/*" multiple>
                    <div class="school-gallery" id="school-gallery">
                        ${school.images.map(img => `
                            <div class="school-gallery-item" data-image="${img.id}">
                                <img src="${img.dataUrl}" alt="p.${img.pageNumber}">
                                <span class="page-number">p.${img.pageNumber}</span>
                                <button class="img-delete" data-delete="${img.id}" style="position:absolute;top:4px;right:4px;">×</button>
                            </div>
                        `).join('')}
                        <div class="gallery-upload" onclick="document.getElementById('school-gallery-input').click()">
                            <span class="upload-icon">📷</span>
                            <span class="upload-text">学校画像を追加<br>（最大100枚）</span>
                        </div>
                    </div>
                </div>
                
                <div class="school-info-grid">
                    <div class="info-block">
                        <h3>基本情報</h3>
                        <ul class="info-list">
                            <li>創立年: ${school.established}</li>
                            <li>所在地: ${school.location}</li>
                            <li>制服: ${school.uniform}</li>
                            <li>寮: ${school.dormitory}</li>
                        </ul>
                    </div>
                    <div class="info-block">
                        <h3>テニス部施設</h3>
                        <ul class="info-list">
                            <li>コート数: ${school.tennisCourt}</li>
                            ${school.facilities.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="school-timeline">
                    <div class="info-block" style="margin: 0 2rem 2rem;">
                        <h3>年間行事</h3>
                        ${school.annualEvents.map(e => `
                            <div class="timeline-item">
                                <span class="timeline-month">${e.month}</span>
                                <span class="timeline-content">${e.event}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="padding: 0 2rem 2rem;">
                    <div class="info-block">
                        <h3>所属キャラクター</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                            ${db.getAllCharacters()
                                .filter(c => c.schoolId === school.id)
                                .map(c => `
                                    <span class="profile-school-tag" style="cursor: pointer; background: ${school.color}; color: #fff;"
                                          onclick="app.switchCharacter('${c.id}')">
                                        ${c.displayName}
                                    </span>
                                `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderToolbar() {
        return `
            <div class="data-toolbar">
                <button class="toolbar-btn" id="export-btn">📤 エクスポート</button>
                <button class="toolbar-btn" id="import-btn">📥 インポート</button>
                <input type="file" class="hidden-input" id="import-file" accept=".json">
            </div>
        `;
    }

    bindEvents() {
        const self = this;
        
        document.addEventListener('click', function(e) {
            // 学校折叠
            if (e.target.closest('.school-toggle')) {
                const btn = e.target.closest('.school-toggle');
                const schoolId = btn.dataset.school;
                if (self.sidebarCollapsed.has(schoolId)) {
                    self.sidebarCollapsed.delete(schoolId);
                    btn.classList.remove('collapsed');
                    btn.nextElementSibling.classList.remove('collapsed');
                } else {
                    self.sidebarCollapsed.add(schoolId);
                    btn.classList.add('collapsed');
                    btn.nextElementSibling.classList.add('collapsed');
                }
            }
            
            // 角色选择
            if (e.target.closest('.character-item')) {
                self.switchCharacter(e.target.closest('.character-item').dataset.character);
            }
            
            // 导航
            if (e.target.matches('.nav-tab')) {
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                self.currentView = e.target.dataset.view;
                if (self.currentView === 'school') self.currentSchoolId = null;
                self.refreshMain();
            }
            
            // 学校卡片
            if (e.target.closest('.school-card')) {
                self.currentSchoolId = e.target.closest('.school-card').dataset.school;
                self.currentView = 'school-detail';
                self.refreshMain();
            }
            
            // 公式书标签
            if (e.target.matches('.book-tab')) {
                const bookId = e.target.dataset.book;
                const char = db.getCharacter(self.currentCharacter);
                if (!char.versions[bookId]) {
                    if (confirm(bookId + ' のデータを作成しますか？')) {
                        char.versions[bookId] = db.createVersionData({
                            name: char.displayName,
                            nameKana: char.nameKana || ''
                        });
                        db.saveToLocalStorage();
                    } else {
                        return;
                    }
                }
                self.currentBookId = bookId;
                self.editingData = null;
                self.refreshMain();
            }
            
            // 编辑
            if (e.target.matches('#edit-profile')) {
                self.editingData = self.currentBookId;
                self.refreshMain();
            }
            if (e.target.matches('#cancel-edit')) {
                self.editingData = null;
                self.refreshMain();
            }
            if (e.target.matches('#save-profile')) {
                self.saveProfile();
            }
            if (e.target.matches('#add-custom-field')) {
                self.addCustomField();
            }
            if (e.target.closest('.remove-custom')) {
                self.removeCustomField(parseInt(e.target.closest('.remove-custom').dataset.index));
            }
            
            // 删除图片
            if (e.target.closest('.img-delete')) {
                const imageId = e.target.closest('.img-delete').dataset.delete;
                if (confirm('この画像を削除しますか？')) {
                    db.removeImage(self.currentCharacter, self.currentBookId, imageId);
                    self.refreshMain();
                }
            }
            
            // 图片查看器
            if (e.target.closest('.gallery-item') && !e.target.closest('.img-delete')) {
                self.openImageViewer(e.target.closest('.gallery-item').dataset.image);
            }
            
            // 添加
            if (e.target.matches('#add-new-book') || e.target.matches('#add-book-btn')) {
                self.showAddBookModal();
            }
            if (e.target.matches('#add-character-btn')) {
                self.showAddCharacterModal();
            }
            
            // 导入导出
            if (e.target.matches('#export-btn')) {
                self.exportData();
            }
            if (e.target.matches('#import-btn')) {
                document.getElementById('import-file').click();
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target.matches('#gallery-file-input')) {
                self.handleGalleryUpload(e.target.files);
            }
            if (e.target.matches('#main-visual-input')) {
                self.handleMainVisualUpload(e.target.files[0]);
            }
            if (e.target.matches('#school-gallery-input')) {
                self.handleSchoolGalleryUpload(e.target.files);
            }
            if (e.target.matches('#import-file')) {
                self.importData(e.target);
            }
        });
    }

    afterRender() {
        const activeTab = document.querySelector('.book-tab.active');
        if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }

    switchCharacter(charId) {
        this.currentCharacter = charId;
        this.currentBookId = Object.keys(db.getCharacter(charId).versions)[0];
        this.editingData = null;
        this.currentView = 'character';
        this.render();
    }

    refreshMain() {
        document.getElementById('main-content').innerHTML = this.renderCurrentView();
        this.afterRender();
    }

    saveProfile() {
        const form = document.getElementById('profile-form');
        const char = db.getCharacter(this.currentCharacter);
        const version = char.versions[this.currentBookId];
        
        const formData = new FormData(form);
        for (const key of Object.keys(version.fixedFields)) {
            const value = formData.get(key);
            if (value !== null) version.fixedFields[key].value = value;
        }
        
        version.customFields = [];
        let i = 0;
        while (formData.has('custom-label-' + i)) {
            const label = formData.get('custom-label-' + i);
            const value = formData.get('custom-value-' + i);
            if (label || value) version.customFields.push({ label, value });
            i++;
        }
        
        db.updateCharacterVersion(this.currentCharacter, this.currentBookId, version);
        this.editingData = null;
        this.refreshMain();
    }

    addCustomField() {
        const container = document.getElementById('custom-fields');
        const index = container.querySelectorAll('.custom-field-row').length;
        const row = document.createElement('div');
        row.className = 'custom-field-row';
        row.innerHTML = `
            <input type="text" name="custom-label-${index}" placeholder="項目名">
            <input type="text" name="custom-value-${index}" placeholder="内容">
            <button type="button" class="btn-icon remove-custom" data-index="${index}">×</button>
        `;
        container.appendChild(row);
    }

    removeCustomField(index) {
        const container = document.getElementById('custom-fields');
        const rows = container.querySelectorAll('.custom-field-row');
        if (rows[index]) rows[index].remove();
        container.querySelectorAll('.custom-field-row').forEach((row, i) => {
            const labelInput = row.querySelector('input[name^="custom-label"]');
            const valueInput = row.querySelector('input[name^="custom-value"]');
            const btn = row.querySelector('.remove-custom');
            if (labelInput) labelInput.name = 'custom-label-' + i;
            if (valueInput) valueInput.name = 'custom-value-' + i;
            if (btn) btn.dataset.index = i;
        });
    }

    async handleGalleryUpload(files) {
        const char = db.getCharacter(this.currentCharacter);
        const version = char.versions[this.currentBookId];
        if (version.images.length + files.length > 50) {
            alert('画像は最大50枚までです');
            return;
        }
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            const dataUrl = await this.fileToDataUrl(file);
            db.addImage(this.currentCharacter, this.currentBookId, dataUrl);
        }
        this.refreshMain();
    }

    async handleMainVisualUpload(file) {
        if (!file) return;
        const dataUrl = await this.fileToDataUrl(file);
        db.addImage(this.currentCharacter, this.currentBookId, dataUrl);
        this.refreshMain();
    }

    async handleSchoolGalleryUpload(files) {
        const school = db.getSchool(this.currentSchoolId);
        if (school.images.length + files.length > 100) {
            alert('学校画像は最大100枚までです');
            return;
        }
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            const dataUrl = await this.fileToDataUrl(file);
            db.addSchoolImage(this.currentSchoolId, dataUrl);
        }
        this.refreshMain();
    }

    fileToDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    openImageViewer(imageId) {
        const char = db.getCharacter(this.currentCharacter);
        const version = char.versions[this.currentBookId];
        const images = version.images;
        let currentIndex = images.findIndex(img => img.id === imageId);
        
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.id = 'image-viewer';
        
        const updateViewer = (index) => {
            const img = images[index];
            let navHtml = '';
            if (index > 0) navHtml += `<button class="viewer-nav prev" data-nav="-1">◀</button>`;
            if (index < images.length - 1) navHtml += `<button class="viewer-nav next" data-nav="1">▶</button>`;
            
            viewer.querySelector('.viewer-content').innerHTML = `
                <button class="viewer-close" onclick="document.getElementById('image-viewer').remove()">×</button>
                ${navHtml}
                <img src="${img.dataUrl}" alt="${index + 1}">
                <span class="viewer-counter">${index + 1} / ${images.length}</span>
            `;
            viewer.dataset.current = index;
        };
        
        viewer.innerHTML = '<div class="viewer-content"></div>';
        document.body.appendChild(viewer);
        updateViewer(currentIndex);
        
        viewer.addEventListener('click', (e) => {
            if (e.target.matches('.viewer-nav')) {
                const newIndex = parseInt(viewer.dataset.current) + parseInt(e.target.dataset.nav);
                if (newIndex >= 0 && newIndex < images.length) updateViewer(newIndex);
            }
        });
    }

    showAddBookModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-box">
                <h2>新規公式書バージョン</h2>
                <div class="form-group">
                    <label>バージョンID（例: 50.5, npo30.5）</label>
                    <input type="text" id="new-book-id" placeholder="50.5">
                </div>
                <div class="form-group">
                    <label>表示名</label>
                    <input type="text" id="new-book-name" placeholder="50.5">
                </div>
                <div class="form-group">
                    <label>シリーズ</label>
                    <select id="new-book-series">
                        <option value="original">テニスの王子様</option>
                        <option value="new">新テニスの王子様</option>
                        <option value="other">その他</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>発行年（任意）</label>
                    <input type="number" id="new-book-year" placeholder="2005">
                </div>
                <div class="modal-actions">
                    <button class="btn-small" onclick="this.closest('.modal-overlay').remove()">キャンセル</button>
                    <button class="btn-small" id="confirm-add-book">追加</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('#confirm-add-book').addEventListener('click', () => {
            const id = document.getElementById('new-book-id').value;
            const name = document.getElementById('new-book-name').value || id;
            const series = document.getElementById('new-book-series').value;
            const year = parseInt(document.getElementById('new-book-year').value) || new Date().getFullYear();
            
            if (!id) { alert('IDを入力してください'); return; }
            
            db.addBook({ id: id, name: name, year: year, title: 'テニスの王子様 ' + name, series: series });
            modal.remove();
            this.render();
        });
    }

    showAddCharacterModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-box">
                <h2>新規キャラクター</h2>
                <div class="form-group">
                    <label>名前</label>
                    <input type="text" id="new-char-name" placeholder="越前リョーマ">
                </div>
                <div class="form-group">
                    <label>ふりがな</label>
                    <input type="text" id="new-char-kana" placeholder="えちぜんりょうま">
                </div>
                <div class="form-group">
                    <label>所属学校</label>
                    <select id="new-char-school">
                        ${db.getAllSchools().map(s => '<option value="' + s.id + '">' + s.name + '</option>').join('')}
                    </select>
                </div>
                <div class="modal-actions">
                    <button class="btn-small" onclick="this.closest('.modal-overlay').remove()">キャンセル</button>
                    <button class="btn-small" id="confirm-add-char">追加</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('#confirm-add-char').addEventListener('click', () => {
            const name = document.getElementById('new-char-name').value;
            const kana = document.getElementById('new-char-kana').value;
            const schoolId = document.getElementById('new-char-school').value;
            
            if (!name) { alert('名前を入力してください'); return; }
            
            const id = 'char_' + Date.now();
            const versions = {};
            db.getAllBooks().forEach(b => {
                versions[b.id] = db.createVersionData({ name: name, nameKana: kana });
            });
            
            db.addCharacter(id, name, schoolId, versions);
            modal.remove();
            this.currentCharacter = id;
            this.render();
        });
    }

    exportData() {
        const data = db.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tenipuri-fanbook-' + new Date().toISOString().split('T')[0] + '.json';
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
                if (confirm('既存のデータを上書きしますか？（現在のデータは失われます）')) {
                    db.importData(data);
                    this.currentCharacter = db.getAllCharacters()[0]?.id || 'echizen';
                    this.currentBookId = Object.keys(db.getCharacter(this.currentCharacter)?.versions || {})[0] || '10.5';
                    this.render();
                    alert('データをインポートしました');
                }
            } catch (err) {
                alert('インポートに失敗しました: ' + err.message);
            }
        };
        reader.readAsText(file);
        input.value = '';
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    if (window.loadAdditionalCharacters) loadAdditionalCharacters();
    app = new TenipuriApp();
});

