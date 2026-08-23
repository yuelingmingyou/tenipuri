// 额外角色数据 - 简化版，避免语法错误

function loadAdditionalCharacters() {
    // 氷帝
    if (!db.getCharacter('oshitari')) {
        db.addCharacter('oshitari', '忍足侑士', 'hyotei', {
            '10.5': { birthday: '10月15日', height: '178', weight: '64', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'スパゲッティ、ボルシチ', hobby: '読書、映画鑑賞',
                favoriteColor: '紺', favoriteType: '賢い人',
                strongSubject: '英語', family: '父、母、弟',
                fatherOccupation: '医者' }
        });
    }

    if (!db.getCharacter('gakuto')) {
        db.addCharacter('gakuto', '向日岳人', 'hyotei', {
            '10.5': { birthday: '9月12日', height: '158', weight: '48', bloodType: 'B',
                playStyle: 'アクロバティックプレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'ラズベリー、パンケーキ', hobby: 'スケート、ダンス',
                favoriteColor: '赤', favoriteType: '小柄な人',
                strongSubject: '体育', family: '父、母、姉',
                fatherOccupation: '会社員' }
        });
    }

    if (!db.getCharacter('shishido')) {
        db.addCharacter('shishido', '宍戸亮', 'hyotei', {
            '10.5': { birthday: '9月29日', height: '172', weight: '60', bloodType: 'B',
                playStyle: 'サーブ＆ボレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'コロッケ、ポテトサラダ', hobby: 'ビリヤード、ダーツ',
                favoriteColor: '紫', favoriteType: '付き合いのいい人',
                strongSubject: '社会', family: '父、母、兄',
                fatherOccupation: '自営業' }
        });
    }

    if (!db.getCharacter('akutagawa')) {
        db.addCharacter('akutagawa', '芥川慈郎', 'hyotei', {
            '10.5': { birthday: '5月5日', height: '160', weight: '49', bloodType: 'AB',
                playStyle: 'サーブ＆ボレーヤー', dominantHand: '右',
                racket: 'HEAD (i.Prestige MID)', shoes: 'HEAD (C.Tech 1000)',
                favoriteFood: 'モンブラン、クリームソーダ', hobby: '寝ること、テレビゲーム',
                favoriteColor: 'ベージュ', favoriteType: '明るい人',
                strongSubject: '体育', family: '父、母、妹',
                fatherOccupation: '会社員' }
        });
    }

    // 立海大
    if (!db.getCharacter('yanagi')) {
        db.addCharacter('yanagi', '柳蓮二', 'rikkai', {
            '10.5': { birthday: '6月4日', height: '181', weight: '67', bloodType: 'A',
                playStyle: 'データテニス', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: '人参ジュース', hobby: '読書、詩を書く',
                favoriteColor: '青', favoriteType: '文静な人',
                strongSubject: '全科目', family: '父、母、姉',
                fatherOccupation: '公務員' }
        });
    }

    // 四天宝寺
    if (!db.getCharacter('chitose')) {
        db.addCharacter('chitose', '千歳千里', 'shitenhoji', {
            '10.5': { birthday: '12月31日', height: '194', weight: '81', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: 'お好み焼き', hobby: '散歩、将棋',
                favoriteColor: '緑', favoriteType: '大人しい人',
                strongSubject: '国語', family: '父、母、弟',
                fatherOccupation: '会社員' }
        });
    }

    // 新テニス
    if (!db.getCharacter('tooyama')) {
        db.addCharacter('tooyama', '遠山金太郎', 'shitenhoji', {
            'npo10.5': { birthday: '4月1日', height: '155', weight: '45', bloodType: 'B',
                playStyle: '超攻撃型', dominantHand: '右',
                racket: 'BABOLAT (PURE DRIVE)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '焼肉、カレー', hobby: '探検、冒険',
                favoriteColor: '虹色', favoriteType: '元気な人',
                strongSubject: '体育', family: '父、母、兄、弟',
                fatherOccupation: '自営業' }
        });
    }

    db.saveToLocalStorage();
}

window.loadAdditionalCharacters = loadAdditionalCharacters;

