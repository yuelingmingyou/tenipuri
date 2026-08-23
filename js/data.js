// ==================== 网球王子公式书数据管理 ====================

const DB_NAME = 'tenipuri_fanbook';
const DB_VERSION = 1;

// 固定字段模板（所有角色共有，预填可修改）
const FIXED_FIELDS_TEMPLATE = {
    // 基本信息
    name: { label: '名前', value: '', type: 'text' },
    nameKana: { label: 'ふりがな', value: '', type: 'text' },
    birthday: { label: '生年月日', value: '', type: 'text' },
    height: { label: '身長', value: '', type: 'text', unit: 'cm' },
    weight: { label: '体重', value: '', type: 'text', unit: 'kg' },
    bloodType: { label: '血液型', value: '', type: 'select', options: ['A', 'B', 'O', 'AB', '不明'] },
    
    // 网球相关
    playStyle: { label: 'プレースタイル', value: '', type: 'text' },
    dominantHand: { label: '利き腕', value: '', type: 'select', options: ['右', '左', '両手'] },
    racket: { label: 'ラケット', value: '', type: 'text' },
    shoes: { label: 'シューズ', value: '', type: 'text' },
    
    // 个人喜好
    favoriteFood: { label: '好きな食べ物', value: '', type: 'text' },
    hobby: { label: '趣味', value: '', type: 'text' },
    favoriteColor: { label: '好きな色', value: '', type: 'text' },
    favoriteType: { label: '好みのタイプ', value: '', type: 'text' },
    
    // 学业家庭
    strongSubject: { label: '得意科目', value: '', type: 'text' },
    family: { label: '家族構成', value: '', type: 'text' },
    fatherOccupation: { label: '父の職業', value: '', type: 'text' }
};

// 学校数据模板
const SCHOOL_TEMPLATE = {
    id: '',
    name: '',
    nameEn: '',
    established: '',
    motto: '',
    location: '',
    uniform: '',
    dormitory: '',
    facilities: [],
    tennisCourt: '',
    annualEvents: [],
    clubActivities: [],
    notableAlumni: [],
    description: ''
};

// 数据管理类
class TenipuriDatabase {
    constructor() {
        this.characters = new Map();
        this.schools = new Map();
        this.books = new Map(); // 公式书版本
        this.loadFromLocalStorage();
    }

    // 初始化默认数据
    initDefaultData() {
        // 公式书版本
        this.books.set('10.5', { id: '10.5', name: '10.5', year: 2002, title: 'テニスの王子様 10.5' });
        this.books.set('20.5', { id: '20.5', name: '20.5', year: 2003, title: 'テニスの王子様 20.5' });
        this.books.set('30.5', { id: '30.5', name: '30.5', year: 2004, title: 'テニスの王子様 30.5' });
        this.books.set('40.5', { id: '40.5', name: '40.5', year: 2005, title: 'テニスの王子様 40.5' });

        // 学校数据
        const schools = [
            {
                id: 'seigaku',
                name: '青春学園',
                nameEn: 'SEISHO GAKUEN',
                established: '1925年',
                motto: '最強',
                location: '東京都',
                uniform: '白地に紺のライン',
                dormitory: 'あり（部員のみ）',
                facilities: ['テニスコート8面', '屋内練習場', 'トレーニングルーム'],
                tennisCourt: '8面（硬式・軟式各4面）',
                annualEvents: ['春のテニス大会', '夏合宿', '秋の強化試合'],
                clubActivities: ['テニス部', 'サッカー部', 'バスケ部', '野球部'],
                notableAlumni: ['手塚国光', '大石秀一郎'],
                description: '都内有数の進学校でありながら、テニス部は全国レベルの強豪校。'
            },
            {
                id: 'hyotei',
                name: '氷帝学園',
                nameEn: 'HYOTEI GAKUEN',
                established: '1918年',
                motto: '勝利への執念',
                location: '東京都',
                uniform: 'グレーのブレザー',
                dormitory: 'あり（全寮制）',
                facilities: ['テニスコート20面', '屋内テニスドーム', 'プール', 'ジム'],
                tennisCourt: '20面（全国最多クラス）',
                annualEvents: ['氷帝祭', 'テニス部選抜戦', '海外遠征'],
                clubActivities: ['テニス部', '乗馬部', 'ヨット部', 'ゴルフ部'],
                notableAlumni: ['跡部景吾', '忍足侑士'],
                description: '超名門校。テニス部員は200名を超え、厳しい選抜制度を持つ。'
            },
            {
                id: 'rikkai',
                name: '立海大附属',
                nameEn: 'RIKKAI DAI FUZOKU',
                established: '1920年',
                motto: '常勝立海',
                location: '神奈川県',
                uniform: '黒の詰襟',
                dormitory: 'あり',
                facilities: ['テニスコート12面', '屋内練習場', '体育館'],
                tennisCourt: '12面',
                annualEvents: ['立海大祭', '強化合宿', '関東大会予選'],
                clubActivities: ['テニス部', '剣道部', '柔道部', '陸上競技部'],
                notableAlumni: ['幸村精市', '真田弦一郎'],
                description: '関東大会連覇、全国大会二連覇の最強校。'
            },
            {
                id: 'shitenhoji',
                name: '四天宝寺',
                nameEn: 'SHITENHOJI',
                established: '1915年',
                motto: '楽しめ！',
                location: '大阪府',
                uniform: '白地に紫のライン',
                dormitory: 'なし（通学）',
                facilities: ['テニスコート10面', '屋内練習場', '相撲場'],
                tennisCourt: '10面',
                annualEvents: ['天王寺祭', '浪速の陣', '関西大会'],
                clubActivities: ['テニス部', '相撲部', '落語研究会', '漫才部'],
                notableAlumni: ['白石蔵ノ介', '千歳千里'],
                description: '大阪の名門。テニス部のモットーは「楽しめ！」。'
            },
            {
                id: 'fudomine',
                name: '不動峰',
                nameEn: 'FUDOMINE',
                established: '1960年',
                motto: '努力は必ず報われる',
                location: '東京都',
                uniform: '赤のジャージ',
                dormitory: 'なし',
                facilities: ['テニスコート4面', 'グラウンド'],
                tennisCourt: '4面',
                annualEvents: ['峰祭', '強化練習'],
                clubActivities: ['テニス部', 'サッカー部', 'バレー部'],
                notableAlumni: ['橘桔平', '神尾アキラ'],
                description: '元不良校だったが、橘の入学以降テニス部が急成長。'
            },
            {
                id: 'yamabuki',
                name: '山吹中学',
                nameEn: 'YAMABUKI',
                established: '1940年',
                motto: 'スポーツ万能',
                location: '東京都',
                uniform: '黄色のブレザー',
                dormitory: 'なし',
                facilities: ['テニスコート6面', '野球場', 'サッカーグラウンド'],
                tennisCourt: '6面',
                annualEvents: ['山吹祭', 'スポーツ大会'],
                clubActivities: ['テニス部', '野球部', 'サッカー部', 'バスケ部'],
                notableAlumni: ['千石清純', '亜久津仁'],
                description: 'スポーツ万能校。テニス部は「天才」千石を中心に個性派揃い。'
            },
            {
                id: 'rokaku',
                name: '六角中学',
                nameEn: 'ROKAKU',
                established: '1935年',
                motto: '自然体',
                location: '千葉県',
                uniform: '緑のジャージ',
                dormitory: 'なし',
                facilities: ['テニスコート5面', 'グラウンド', 'テニスの壁'],
                tennisCourt: '5面（テニスの壁あり）',
                annualEvents: ['六角祭', '海合宿'],
                clubActivities: ['テニス部', 'サーフィン部', '釣り部'],
                notableAlumni: ['佐伯虎次郎', '黒羽春風'],
                description: '海沿いの学校。テニスの壁で独自の練習法を持つ。'
            },
            {
                id: 'josei',
                name: '聖ルドルフ',
                nameEn: 'ST. RUDOLPH',
                established: '1950年',
                motto: 'データは全てを語る',
                location: '東京都',
                uniform: '紺のブレザー',
                dormitory: 'あり',
                facilities: ['テニスコート4面', 'コンピュータールーム'],
                tennisCourt: '4面',
                annualEvents: ['聖ルドルフ祭', 'データテニス発表会'],
                clubActivities: ['テニス部', 'コンピューター部', '将棋部'],
                notableAlumni: ['観月はじめ', '不二裕太'],
                description: 'データテニスを重視する進学校。観月の分析力が武器。'
            }
        ];

        schools.forEach(s => this.schools.set(s.id, s));

        // 默认角色数据 - 越前龙马
        this.createCharacter('echizen', '越前リョーマ', {
            '10.5': this.createVersionData({
                name: '越前リョーマ',
                nameKana: 'えちぜんりょうま',
                birthday: '12月24日',
                height: '151',
                weight: '50',
                bloodType: 'O',
                playStyle: 'オールラウンダー',
                dominantHand: '左',
                racket: 'BRIDGESTONE (DYNABEAM GRANDEA)',
                shoes: 'FILA (MARK PHILIPPOUSSIS MID)',
                favoriteFood: '焼き魚、お茶漬け、ポンデリング',
                hobby: '寝ること',
                favoriteColor: '銀',
                favoriteType: '不明',
                strongSubject: '化学、体育、英語',
                family: '父、母、猫（カルピン）',
                fatherOccupation: '元プロテニス選手'
            }),
            '20.5': this.createVersionData({
                name: '越前リョーマ',
                nameKana: 'えちぜんりょうま',
                birthday: '12月24日',
                height: '152',
                weight: '50',
                bloodType: 'O',
                playStyle: 'オールラウンダー',
                dominantHand: '左',
                racket: 'BRIDGESTONE (DYNABEAM GRANDEA)',
                shoes: 'FILA (MARK PHILIPPOUSSIS MID)',
                favoriteFood: '焼き魚、お茶漬け',
                hobby: '寝ること、テニス',
                favoriteColor: '銀',
                favoriteType: '気になる人',
                strongSubject: '化学、体育、英語',
                family: '父、母、猫（カルピン）',
                fatherOccupation: '寺の住職（元プロテニス選手）'
            })
        }, 'seigaku');

        // 跡部景吾
        this.createCharacter('atobe', '跡部景吾', {
            '10.5': this.createVersionData({
                name: '跡部景吾',
                nameKana: 'あとべけいご',
                birthday: '10月4日',
                height: '175',
                weight: '62',
                bloodType: 'A',
                playStyle: 'オールラウンダー',
                dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)',
                shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'ステーキ、シチュー',
                hobby: '囲碁、西洋棋',
                favoriteColor: '金、黒',
                favoriteType: '気品ある女性',
                strongSubject: '全科目',
                family: '父、母、祖父',
                fatherOccupation: '会社経営者'
            }),
            '20.5': this.createVersionData({
                name: '跡部景吾',
                nameKana: 'あとべけいご',
                birthday: '10月4日',
                height: '177',
                weight: '63',
                bloodType: 'A',
                playStyle: 'オールラウンダー',
                dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)',
                shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'フレンチ、イタリアン',
                hobby: 'フィギュアスケート観戦',
                favoriteColor: '金、銀',
                favoriteType: '優雅で気高い女性',
                strongSubject: '全科目',
                family: '父、母、祖父',
                fatherOccupation: '財閥総帥'
            })
        }, 'hyotei');

        this.saveToLocalStorage();
    }

    createVersionData(fieldValues) {
        const data = JSON.parse(JSON.stringify(FIXED_FIELDS_TEMPLATE));
        for (const [key, value] of Object.entries(fieldValues)) {
            if (data[key]) {
                data[key].value = value;
            }
        }
        return {
            fixedFields: data,
            customFields: [],
            notes: '',
            images: []
        };
    }

    createCharacter(id, displayName, versions, schoolId) {
        this.characters.set(id, {
            id,
            displayName,
            schoolId,
            versions,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return this.characters.get(id);
    }

    getCharacter(id) {
        return this.characters.get(id);
    }

    getCharacterVersions(id) {
        const char = this.characters.get(id);
        return char ? Object.keys(char.versions) : [];
    }

    updateCharacterVersion(charId, bookId, versionData) {
        const char = this.characters.get(charId);
        if (!char) return false;
        char.versions[bookId] = versionData;
        char.updatedAt = Date.now();
        this.saveToLocalStorage();
        return true;
    }

    getSchool(id) {
        return this.schools.get(id);
    }

    getAllSchools() {
        return Array.from(this.schools.values());
    }

    getAllCharacters() {
        return Array.from(this.characters.values());
    }

    // 导入导出
    exportData() {
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            characters: Array.from(this.characters.entries()),
            schools: Array.from(this.schools.entries()),
            customData: this.customData || {}
        };
    }

    importData(data) {
        if (data.characters) {
            this.characters = new Map(data.characters);
        }
        if (data.schools) {
            this.schools = new Map(data.schools);
        }
        if (data.customData) {
            this.customData = data.customData;
        }
        this.saveToLocalStorage();
        return true;
    }

    saveToLocalStorage() {
        try {
            const data = this.exportData();
            localStorage.setItem(DB_NAME, JSON.stringify(data));
        } catch (e) {
            console.error('保存失败:', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem(DB_NAME);
            if (saved) {
                const data = JSON.parse(saved);
                this.importData(data);
                return true;
            }
        } catch (e) {
            console.error('读取失败:', e);
        }
        return false;
    }
}

// 全局数据库实例
const db = new TenipuriDatabase();

// 如果没有数据，初始化默认数据
if (db.characters.size === 0) {
    db.initDefaultData();
}

// 导出
window.tenipuriDB = db;
window.FIXED_FIELDS_TEMPLATE = FIXED_FIELDS_TEMPLATE;

