// ==================== 网球王子公式书数据管理 - 完整修复版 ====================

const DB_NAME = 'tenipuri_fanbook_v2';

const FIXED_FIELDS_TEMPLATE = {
    name: { label: '名前', value: '', type: 'text' },
    nameKana: { label: 'ふりがな', value: '', type: 'text' },
    birthday: { label: '生年月日', value: '', type: 'text' },
    height: { label: '身長', value: '', type: 'text', unit: 'cm' },
    weight: { label: '体重', value: '', type: 'text', unit: 'kg' },
    bloodType: { label: '血液型', value: '', type: 'select', options: ['A', 'B', 'O', 'AB', '不明'] },
    playStyle: { label: 'プレースタイル', value: '', type: 'text' },
    dominantHand: { label: '利き腕', value: '', type: 'select', options: ['右', '左', '両手'] },
    racket: { label: 'ラケット', value: '', type: 'text' },
    shoes: { label: 'シューズ', value: '', type: 'text' },
    favoriteFood: { label: '好きな食べ物', value: '', type: 'text' },
    hobby: { label: '趣味', value: '', type: 'text' },
    favoriteColor: { label: '好きな色', value: '', type: 'text' },
    favoriteType: { label: '好みのタイプ', value: '', type: 'text' },
    strongSubject: { label: '得意科目', value: '', type: 'text' },
    family: { label: '家族構成', value: '', type: 'text' },
    fatherOccupation: { label: '父の職業', value: '', type: 'text' }
};

class TenipuriDatabase {
    constructor() {
        this.characters = new Map();
        this.schools = new Map();
        this.books = new Map();
        this.loadFromLocalStorage();
    }

    initDefaultData() {
        const defaultBooks = [
            { id: '10.5', name: '10.5', year: 2002, title: 'テニスの王子様 10.5', series: 'original' },
            { id: '20.5', name: '20.5', year: 2003, title: 'テニスの王子様 20.5', series: 'original' },
            { id: '30.5', name: '30.5', year: 2004, title: 'テニスの王子様 30.5', series: 'original' },
            { id: '40.5', name: '40.5', year: 2005, title: 'テニスの王子様 40.5', series: 'original' },
            { id: 'npo10.5', name: '新10.5', year: 2009, title: '新テニスの王子様 10.5', series: 'new' },
            { id: 'npo20.5', name: '新20.5', year: 2012, title: '新テニスの王子様 20.5', series: 'new' }
        ];
        
        defaultBooks.forEach(b => this.books.set(b.id, b));

        const schoolsData = [
            {
                id: 'seigaku', name: '青春学園', nameEn: 'SEISHO GAKUEN',
                color: '#2e5c3e', established: '1925年', motto: '最強',
                location: '東京都', uniform: '白地に紺のライン',
                dormitory: 'あり（部員のみ）',
                facilities: ['テニスコート8面', '屋内練習場', 'トレーニングルーム'],
                tennisCourt: '8面（硬式・軟式各4面）',
                annualEvents: [
                    { month: '4月', event: '入学式・新入生歓迎会' },
                    { month: '5月', event: '都大会予選' },
                    { month: '6月', event: '関東大会予選' },
                    { month: '7月', event: '全国大会予選・夏合宿' },
                    { month: '8月', event: '全国大会' },
                    { month: '9月', event: '秋の強化試合' },
                    { month: '10月', event: '文化祭' },
                    { month: '11月', event: '学園祭' }
                ],
                clubActivities: ['テニス部', 'サッカー部', 'バスケ部', '野球部', '陸上部'],
                notableAlumni: ['手塚国光', '大石秀一郎', '不二周助', '菊丸英二'],
                description: '都内有数の進学校でありながら、テニス部は全国レベルの強豪校。',
                images: [],
                maps: []
            },
            {
                id: 'hyotei', name: '氷帝学園', nameEn: 'HYOTEI GAKUEN',
                color: '#4a6741', established: '1918年', motto: '勝利への執念',
                location: '東京都', uniform: 'グレーのブレザー',
                dormitory: 'あり（全寮制）',
                facilities: ['テニスコート20面', '屋内テニスドーム', 'プール', 'ジム', '乗馬場'],
                tennisCourt: '20面（全国最多クラス）',
                annualEvents: [
                    { month: '4月', event: '入学式・テニス部入部テスト' },
                    { month: '5月', event: '氷帝祭・都大会' },
                    { month: '6月', event: '関東大会' },
                    { month: '7月', event: '夏合宿・全国大会予選' },
                    { month: '8月', event: '全国大会' },
                    { month: '9月', event: '海外遠征' },
                    { month: '10月', event: '体育祭' },
                    { month: '11月', event: '文化祭・テニス部選抜戦' }
                ],
                clubActivities: ['テニス部', '乗馬部', 'ヨット部', 'ゴルフ部', 'スキー部'],
                notableAlumni: ['跡部景吾', '忍足侑士', '向日岳人', '宍戸亮', '芥川慈郎', '滝萩之介', '樺地崇弘'],
                description: '超名門校。テニス部員は200名を超え、厳しい選抜制度を持つ。',
                images: [],
                maps: []
            },
            {
                id: 'rikkai', name: '立海大附属', nameEn: 'RIKKAI DAI FUZOKU',
                color: '#1a3a5c', established: '1920年', motto: '常勝立海',
                location: '神奈川県', uniform: '黒の詰襟',
                dormitory: 'あり',
                facilities: ['テニスコート12面', '屋内練習場', '体育館', 'プール'],
                tennisCourt: '12面',
                annualEvents: [
                    { month: '4月', event: '入学式' },
                    { month: '5月', event: '神奈川県大会' },
                    { month: '6月', event: '関東大会' },
                    { month: '7月', event: '全国大会・強化合宿' },
                    { month: '8月', event: 'インターハイ' },
                    { month: '9月', event: '秋季大会' },
                    { month: '10月', event: '体育祭' },
                    { month: '11月', event: '文化祭' }
                ],
                clubActivities: ['テニス部', '剣道部', '柔道部', '陸上競技部', '水泳部'],
                notableAlumni: ['幸村精市', '真田弦一郎', '柳蓮二', '柳生比呂士', '仁王雅治', '丸井ブン太', 'ジャッカル桑原'],
                description: '関東大会連覇、全国大会二連覇の最強校。',
                images: [],
                maps: []
            },
            {
                id: 'shitenhoji', name: '四天宝寺', nameEn: 'SHITENHOJI',
                color: '#5c3a7a', established: '1915年', motto: '楽しめ！',
                location: '大阪府', uniform: '白地に紫のライン',
                dormitory: 'なし（通学）',
                facilities: ['テニスコート10面', '屋内練習場', '相撲場', '落語寄席'],
                tennisCourt: '10面',
                annualEvents: [
                    { month: '4月', event: '入学式・お花見大会' },
                    { month: '5月', event: '大阪府大会' },
                    { month: '6月', event: '関西大会' },
                    { month: '7月', event: '全国大会予選' },
                    { month: '8月', event: '全国大会・夏祭り' },
                    { month: '9月', event: '浪速の陣（対抗戦）' },
                    { month: '10月', event: '体育祭' },
                    { month: '11月', event: '天王寺祭' }
                ],
                clubActivities: ['テニス部', '相撲部', '落語研究会', '漫才部', '大道芸部'],
                notableAlumni: ['白石蔵ノ介', '千歳千里', '石田銀', '忍足謙也', '遠山金太郎', '一氏ユウジ', '金色小春'],
                description: '大阪の名門。テニス部のモットーは「楽しめ！」。',
                images: [],
                maps: []
            },
            {
                id: 'fudomine', name: '不動峰', nameEn: 'FUDOMINE',
                color: '#8b2323', established: '1960年', motto: '努力は必ず報われる',
                location: '東京都', uniform: '赤のジャージ',
                dormitory: 'なし',
                facilities: ['テニスコート4面', 'グラウンド'],
                tennisCourt: '4面',
                annualEvents: [
                    { month: '4月', event: '入学式' },
                    { month: '5月', event: '都大会' },
                    { month: '6月', event: '関東大会予選' },
                    { month: '7月', event: '夏合宿' },
                    { month: '8月', event: '強化練習' },
                    { month: '9月', event: '秋季大会' },
                    { month: '10月', event: '峰祭' },
                    { month: '11月', event: '学園祭' }
                ],
                clubActivities: ['テニス部', 'サッカー部', 'バレー部', 'バスケ部'],
                notableAlumni: ['橘桔平', '神尾アキラ', '伊武深司', '石田鉄', '桜井雅也', '内村京介', '森辰徳'],
                description: '元不良校だったが、橘桔平の入学以降テニス部が急成長。',
                images: [],
                maps: []
            },
            {
                id: 'yamabuki', name: '山吹中学', nameEn: 'YAMABUKI',
                color: '#b8860b', established: '1940年', motto: 'スポーツ万能',
                location: '東京都', uniform: '黄色のブレザー',
                dormitory: 'なし',
                facilities: ['テニスコート6面', '野球場', 'サッカーグラウンド', '体育館'],
                tennisCourt: '6面',
                annualEvents: [
                    { month: '4月', event: '入学式・スポーツ大会' },
                    { month: '5月', event: '都大会' },
                    { month: '6月', event: '関東大会予選' },
                    { month: '7月', event: '夏合宿' },
                    { month: '8月', event: '強化キャンプ' },
                    { month: '9月', event: '秋季大会' },
                    { month: '10月', event: '体育祭' },
                    { month: '11月', event: '山吹祭' }
                ],
                clubActivities: ['テニス部', '野球部', 'サッカー部', 'バスケ部', '陸上部'],
                notableAlumni: ['千石清純', '亜久津仁', '室町十次', '南健太郎', '東方雅美', '新渡米稲吉', '喜多一馬'],
                description: 'スポーツ万能校。テニス部は「天才」千石清純を中心に個性派揃い。',
                images: [],
                maps: []
            },
            {
                id: 'rokaku', name: '六角中学', nameEn: 'ROKAKU',
                color: '#2f6b4f', established: '1935年', motto: '自然体',
                location: '千葉県', uniform: '緑のジャージ',
                dormitory: 'なし',
                facilities: ['テニスコート5面', 'グラウンド', 'テニスの壁', '海（近隣）'],
                tennisCourt: '5面（テニスの壁あり）',
                annualEvents: [
                    { month: '4月', event: '入学式・海開き' },
                    { month: '5月', event: '千葉県大会' },
                    { month: '6月', event: '関東大会予選' },
                    { month: '7月', event: '海合宿' },
                    { month: '8月', event: 'サーフィン大会' },
                    { month: '9月', event: '秋季大会' },
                    { month: '10月', event: '体育祭' },
                    { month: '11月', event: '六角祭' }
                ],
                clubActivities: ['テニス部', 'サーフィン部', '釣り部', 'ヨット部', '水泳部'],
                notableAlumni: ['佐伯虎次郎', '黒羽春風', '天根ヒカル', '木更津亮', '樹希彦', '首藤聡'],
                description: '海沿いの学校。テニスの壁で独自の練習法を持つ。',
                images: [],
                maps: []
            },
            {
                id: 'josei', name: '聖ルドルフ', nameEn: 'ST. RUDOLPH',
                color: '#4a4a6a', established: '1950年', motto: 'データは全てを語る',
                location: '東京都', uniform: '紺のブレザー',
                dormitory: 'あり',
                facilities: ['テニスコート4面', 'コンピュータールーム', '分析室'],
                tennisCourt: '4面',
                annualEvents: [
                    { month: '4月', event: '入学式・データ収集開始' },
                    { month: '5月', event: '都大会' },
                    { month: '6月', event: '関東大会予選' },
                    { month: '7月', event: '夏合宿・データ分析会' },
                    { month: '8月', event: '強化練習' },
                    { month: '9月', event: '秋季大会' },
                    { month: '10月', event: '聖ルドルフ祭' },
                    { month: '11月', event: 'データテニス発表会' }
                ],
                clubActivities: ['テニス部', 'コンピューター部', '将棋部', '囲碁部', '数学研究部'],
                notableAlumni: ['観月はじめ', '不二裕太', '柳沢慎也', '木更津淳'],
                description: 'データテニスを重視する進学校。',
                images: [],
                maps: []
            }
        ];
        
        schoolsData.forEach(s => this.schools.set(s.id, s));

        this.createAllCharacters();
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

    addCharacter(id, name, schoolId, versionsData) {
        const versions = {};
        for (const [bookId, fields] of Object.entries(versionsData)) {
            versions[bookId] = this.createVersionData(fields);
        }
        
        const firstVersion = Object.values(versionsData)[0] || {};
        
        this.characters.set(id, {
            id: id,
            displayName: name,
            nameKana: firstVersion.nameKana || '',
            schoolId: schoolId,
            versions: versions,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }

    createAllCharacters() {
        // 青春学园
        this.addCharacter('echizen', '越前リョーマ', 'seigaku', {
            '10.5': { birthday: '12月24日', height: '151', weight: '50', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'BRIDGESTONE (DYNABEAM GRANDEA)', shoes: 'FILA (MARK PHILIPPOUSSIS MID)',
                favoriteFood: '焼き魚、お茶漬け、ポンデリング', hobby: '寝ること',
                favoriteColor: '銀', favoriteType: '不明',
                strongSubject: '化学、体育、英語', family: '父、母、猫（カルピン）',
                fatherOccupation: '元プロテニス選手' },
            '20.5': { birthday: '12月24日', height: '152', weight: '50', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'BRIDGESTONE (DYNABEAM GRANDEA)', shoes: 'FILA (MARK PHILIPPOUSSIS MID)',
                favoriteFood: '焼き魚、お茶漬け', hobby: '寝ること、テニス',
                favoriteColor: '銀', favoriteType: '気になる人',
                strongSubject: '化学、体育、英語', family: '父、母、猫（カルピン）',
                fatherOccupation: '寺の住職（元プロテニス選手）' }
        });

        this.addCharacter('tezuka', '手塚国光', 'seigaku', {
            '10.5': { birthday: '10月7日', height: '179', weight: '58', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '鰻茶漬け', hobby: '登山、キャンプ',
                favoriteColor: '青緑', favoriteType: '努力家',
                strongSubject: '世界史', family: '父、母、祖父',
                fatherOccupation: '商社勤務' }
        });

        this.addCharacter('fuji', '不二周助', 'seigaku', {
            '10.5': { birthday: '2月29日', height: '167', weight: '53', bloodType: 'B',
                playStyle: 'カウンター', dominantHand: '右',
                racket: 'PRINCE (MICHAEL CHANG TITANIUM)', shoes: 'NIKE (NIKE READY AIR BISCAYNE MC)',
                favoriteFood: '辛いもの全般', hobby: 'カメラ、ビリヤード',
                favoriteColor: 'ベージュ', favoriteType: '気になる人',
                strongSubject: '古典', family: '父、母、姉、弟',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('oishi', '大石秀一郎', 'seigaku', {
            '10.5': { birthday: '4月30日', height: '175', weight: '55', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '梅干し', hobby: '料理、水族館めぐり',
                favoriteColor: '白', favoriteType: '家庭的な人',
                strongSubject: '英語', family: '父、母、妹',
                fatherOccupation: '公務員' }
        });

        this.addCharacter('kikumaru', '菊丸英二', 'seigaku', {
            '10.5': { birthday: '11月28日', height: '171', weight: '52', bloodType: 'A',
                playStyle: 'アクロバティックプレーヤー', dominantHand: '右',
                racket: 'DUNLOP (REVELATION PRO TOUR)', shoes: 'PUMA (CELL FACTOR)',
                favoriteFood: '焼きそばパン、ポッキー', hobby: '買い物、新しいもの探し',
                favoriteColor: '赤', favoriteType: '明るい人',
                strongSubject: '国語', family: '父、母、兄、姉、弟',
                fatherOccupation: '自営業' }
        });

        this.addCharacter('inui', '乾貞治', 'seigaku', {
            '10.5': { birthday: '6月3日', height: '184', weight: '62', bloodType: 'AB',
                playStyle: 'データテニス', dominantHand: '右',
                racket: 'PRINCE (GRAPHITE CHALLENGE)', shoes: 'PRINCE (OV-1)',
                favoriteFood: 'ドライフルーツ、スポーツドリンク', hobby: 'データ収集、自作ドリンク開発',
                favoriteColor: '黒', favoriteType: '真面目な人',
                strongSubject: '数学、物理', family: '父、母',
                fatherOccupation: '研究者' }
        });

        this.addCharacter('momoshiro', '桃城武', 'seigaku', {
            '10.5': { birthday: '7月23日', height: '170', weight: '58', bloodType: 'O',
                playStyle: 'パワープレーヤー', dominantHand: '右',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'ハンバーガー、チョコバナナ', hobby: 'バスケ、ギャンブル',
                favoriteColor: '赤', favoriteType: '元気な人',
                strongSubject: '体育', family: '父、母、弟、妹',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('kaido', '海堂薫', 'seigaku', {
            '10.5': { birthday: '5月11日', height: '173', weight: '57', bloodType: 'B',
                playStyle: 'カウンター', dominantHand: '右',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '山芋、梅干し', hobby: 'マラソン、動物（蛇）',
                favoriteColor: '青', favoriteType: '静かな人',
                strongSubject: '生物', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });

        // 氷帝
        this.addCharacter('atobe', '跡部景吾', 'hyotei', {
            '10.5': { birthday: '10月4日', height: '175', weight: '62', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'ステーキ、シチュー', hobby: '囲碁、西洋棋',
                favoriteColor: '金、黒', favoriteType: '気品ある女性',
                strongSubject: '全科目', family: '父、母、祖父',
                fatherOccupation: '会社経営者' },
            '20.5': { birthday: '10月4日', height: '177', weight: '63', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'フレンチ、イタリアン', hobby: 'フィギュアスケート観戦',
                favoriteColor: '金、銀', favoriteType: '優雅で気高い女性',
                strongSubject: '全科目', family: '父、母、祖父',
                fatherOccupation: '財閥総帥' }
        });

        this.addCharacter('oshitari', '忍足侑士', 'hyotei', {
            '10.5': { birthday: '10月15日', height: '178', weight: '64', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'スパゲッティ、ボルシチ', hobby: '読書、映画鑑賞',
                favoriteColor: '紺', favoriteType: '賢い人',
                strongSubject: '英語', family: '父、母、弟',
                fatherOccupation: '医者' }
        });

        this.addCharacter('gakuto', '向日岳人', 'hyotei', {
            '10.5': { birthday: '9月12日', height: '158', weight: '48', bloodType: 'B',
                playStyle: 'アクロバティックプレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'ラズベリー、パンケーキ', hobby: 'スケート、ダンス',
                favoriteColor: '赤', favoriteType: '小柄な人',
                strongSubject: '体育', family: '父、母、姉',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('shishido', '宍戸亮', 'hyotei', {
            '10.5': { birthday: '9月29日', height: '172', weight: '60', bloodType: 'B',
                playStyle: 'サーブ＆ボレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'コロッケ、ポテトサラダ', hobby: 'ビリヤード、ダーツ',
                favoriteColor: '紫', favoriteType: '付き合いのいい人',
                strongSubject: '社会', family: '父、母、兄',
                fatherOccupation: '自営業' }
        });

        this.addCharacter('akutagawa', '芥川慈郎', 'hyotei', {
            '10.5': { birthday: '5月5日', height: '160', weight: '49', bloodType: 'AB',
                playStyle: 'サーブ＆ボレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'モンブラン、クリームソーダ', hobby: '寝ること、テレビゲーム',
                favoriteColor: 'ベージュ', favoriteType: '明るい人',
                strongSubject: '体育', family: '父、母、妹',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('hiyoshi', '日吉若', 'hyotei', {
            '10.5': { birthday: '12月5日', height: '172', weight: '60', bloodType: 'AB',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'おでん、焼き鳥', hobby: '読書、チェス',
                favoriteColor: '黒', favoriteType: '勝ち気な人',
                strongSubject: '数学', family: '父、母',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('kabaji', '樺地崇弘', 'hyotei', {
            '10.5': { birthday: '1月3日', height: '190', weight: '85', bloodType: 'O',
                playStyle: 'パワープレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'ステーキ、ハンバーグ', hobby: '料理、園芸',
                favoriteColor: '茶色', favoriteType: '優しい人',
                strongSubject: '家庭科', family: '父、母、妹',
                fatherOccupation: '農家' }
        });

        this.addCharacter('taki', '滝萩之介', 'hyotei', {
            '10.5': { birthday: '9月29日', height: '167', weight: '58', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: '和食全般', hobby: '茶道、華道',
                favoriteColor: '緑', favoriteType: '日本的な人',
                strongSubject: '国語', family: '父、母',
                fatherOccupation: '会社員' }
        });

        // 立海大
        this.addCharacter('sanada', '真田弦一郎', 'rikkai', {
            '10.5': { birthday: '5月21日', height: '180', weight: '68', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: 'しょうゆラーメン', hobby: '剣道、書道',
                favoriteColor: '黒、銀', favoriteType: '清純な人',
                strongSubject: '国語、体育', family: '父、母、兄',
                fatherOccupation: '警察官' }
        });

        this.addCharacter('yukimura', '幸村精市', 'rikkai', {
            '10.5': { birthday: '3月5日', height: '175', weight: '61', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: '魚、野菜', hobby: '絵画、園芸',
                favoriteColor: '青', favoriteType: '健康な人',
                strongSubject: '美術', family: '父、母、祖母',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('yanagi', '柳蓮二', 'rikkai', {
            '10.5': { birthday: '6月4日', height: '181', weight: '67', bloodType: 'A',
                playStyle: 'データテニス', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: '人参ジュース', hobby: '読書、詩を書く',
                favoriteColor: '青', favoriteType: '文静な人',
                strongSubject: '全科目', family: '父、母、姉',
                fatherOccupation: '公務員' }
        });

        this.addCharacter('yagyuu', '柳生比呂士', 'rikkai', {
            '10.5': { birthday: '10月19日', height: '177', weight: '64', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: '紅茶、スコーン', hobby: 'ゴルフ、読書',
                favoriteColor: '紺', favoriteType: '淑やかな人',
                strongSubject: '英語', family: '父、母、弟',
                fatherOccupation: '会社経営者' }
        });

        this.addCharacter('niou', '仁王雅治', 'rikkai', {
            '10.5': { birthday: '12月4日', height: '175', weight: '62', bloodType: 'AB',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: '焼きそば', hobby: 'ボウリング、いたずら',
                favoriteColor: '白', favoriteType: '騙されやすい人（冗談）',
                strongSubject: '数学', family: '父、母、妹',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('marui', '丸井ブン太', 'rikkai', {
            '10.5': { birthday: '4月20日', height: '164', weight: '53', bloodType: 'B',
                playStyle: 'ネットプレーヤー', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: 'グミ、スナック菓子', hobby: 'ゲーム、お菓子作り',
                favoriteColor: '赤', favoriteType: '甘えん坊な人',
                strongSubject: '家庭科', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('jackal', 'ジャッカル桑原', 'rikkai', {
            '10.5': { birthday: '11月3日', height: '178', weight: '69', bloodType: 'O',
                playStyle: 'ディフェンス', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: 'コーヒー、パン', hobby: 'ドライブ、写真',
                favoriteColor: 'オレンジ', favoriteType: '明るい人',
                strongSubject: '理科', family: '父、母、姉',
                fatherOccupation: '自営業' }
        });

        this.addCharacter('kaidoh', '海堂薫', 'seigaku', {
            '10.5': { birthday: '5月11日', height: '173', weight: '57', bloodType: 'B',
                playStyle: 'カウンター', dominantHand: '右',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '山芋、梅干し', hobby: 'マラソン、動物（蛇）',
                favoriteColor: '青', favoriteType: '静かな人',
                strongSubject: '生物', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });

        // 四天宝寺
        this.addCharacter('shiraishi', '白石蔵ノ介', 'shitenhoji', {
            '10.5': { birthday: '4月14日', height: '178', weight: '64', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '豆腐、湯葉', hobby: 'ビリヤード、読書',
                favoriteColor: '白', favoriteType: '清純な人',
                strongSubject: '化学', family: '父、母、弟、妹',
                fatherOccupation: '医者' }
        });

        this.addCharacter('chitose', '千歳千里', 'shitenhoji', {
            '10.5': { birthday: '12月31日', height: '194', weight: '81', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'お好み焼き', hobby: '散歩、将棋',
                favoriteColor: '緑', favoriteType: '大人しい人',
                strongSubject: '国語', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('ishida', '石田銀', 'shitenhoji', {
            '10.5': { birthday: '1月25日', height: '189', weight: '82', bloodType: 'O',
                playStyle: 'パワープレーヤー', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'うどん、そば', hobby: '釣り、将棋',
                favoriteColor: '青', favoriteType: '素直な人',
                strongSubject: '数学', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('kenya', '忍足謙也', 'shitenhoji', {
            '10.5': { birthday: '3月17日', height: '177', weight: '63', bloodType: 'B',
                playStyle: 'アグレッシブベースライナー', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'たこ焼き、お好み焼き', hobby: 'ゲーム、カラオケ',
                favoriteColor: '黄', favoriteType: '楽しい人',
                strongSubject: '体育', family: '父、母、兄',
                fatherOccupation: '会社員' }
        });

        this.addCharacter('tooyama', '遠山金太郎', 'shitenhoji', {
            'npo10.5': { birthday: '4月1日', height: '155', weight: '45', bloodType: 'B',
                playStyle: '超攻撃型', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '焼肉、カレー', hobby: '探検、冒険',
                favoriteColor: '虹色', favoriteType: '元気な人',
                strongSubject: '体育', family: '父、母、兄、弟',
                fatherOccupation: '自営業' }
        });

        this.addCharacter('hitouji', '一氏ユウジ', 'shitenhoji', {
            '10.5': { birthday: '10月30日', height: '168', weight: '55', bloodType: 'AB',
                playStyle: 'トリックプレーヤー', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'たい焼き、わたあめ', hobby: '漫才、落語',
                favoriteColor: 'ピンク', favoriteType: '笑いのセンスがある人',
                strongSubject: '国語', family: '父、母、妹',
                fatherOccupation: '芸人' }
        });

        this.addCharacter('konjiki', '金色小春', 'shitenhoji', {
            '10.5': { birthday: '11月9日', height: '170', weight: '60', bloodType: 'B',
                playStyle: 'トリックプレーヤー', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'たこ焼き', hobby: '漫才、ボケ稽古',
                favoriteColor: '金', favoriteType: 'ツッコミが上手い人',
                strongSubject: '数学', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });

        // 不動峰
        this.addCharacter('tachibana', '橘桔平', 'fudomine', {
            '10.5': { birthday: '8月26日', height: '179', weight: '66', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '焼き鳥', hobby: 'バイク、ギター',
                favoriteColor: '黒', favoriteType: '家庭的な人',
                strongSubject: '理科', family: '父、母、妹',
                fatherOccupation: '自営業' }
        });

        this.addCharacter('kamio', '神尾アキラ', 'fudomine', {
            '10.5': { birthday: '8月26日', height: '165', weight: '52', bloodType: 'O',
                playStyle: 'スピードプレーヤー', dominantHand: '右',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZ
