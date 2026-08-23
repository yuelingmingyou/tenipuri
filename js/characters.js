// ==================== 角色预设数据 ====================

const CHARACTER_PRESETS = {
    // 青春学园
    'tezuka': {
        name: '手塚国光',
        school: 'seigaku',
        versions: {
            '10.5': {
                birthday: '10月7日', height: '179', weight: '58', bloodType: 'O',
                playStyle: 'オールラウンダー', dominantHand: '左',
                racket: 'MIZUNO (PRO LIGHT S-90)', shoes: 'MIZUNO (WAVE DUAL WIDE)',
                favoriteFood: '鰻茶漬け', hobby: '登山、キャンプ',
                favoriteColor: '青緑', favoriteType: '努力家',
                strongSubject: '世界史', family: '父、母、祖父',
                fatherOccupation: '商社勤務'
            }
        }
    },
    'fuji': {
        name: '不二周助',
        school: 'seigaku',
        versions: {
            '10.5': {
                birthday: '2月29日', height: '167', weight: '53', bloodType: 'B',
                playStyle: 'カウンター', dominantHand: '右',
                racket: 'PRINCE (MICHAEL CHANG TITANIUM)', shoes: 'NIKE (NIKE READY AIR BISCAYNE MC)',
                favoriteFood: '辛いもの全般', hobby: 'カメラ、ビリヤード',
                favoriteColor: 'ベージュ', favoriteType: '気になる人',
                strongSubject: '古典', family: '父、母、姉、弟',
                fatherOccupation: '会社員'
            }
        }
    },
    
    // 氷帝
    'sanada': {
        name: '真田弦一郎',
        school: 'rikkai',
        versions: {
            '10.5': {
                birthday: '5月21日', height: '180', weight: '68', bloodType: 'A',
                playStyle: 'オールラウンダー', dominantHand: '右',
                racket: 'YONEX (Muscle Power 99)', shoes: 'YONEX (POWER CUSHION 199)',
                favoriteFood: 'しょうゆラーメン', hobby: '剣道、書道',
                favoriteColor: '黒、銀', favoriteType: '清純な人',
                strongSubject: '国語、体育', family: '父、母、兄',
                fatherOccupation: '警察官'
            }
        }
    }
};

// 批量添加角色
function addPresetCharacters() {
    for (const [id, preset] of Object.entries(CHARACTER_PRESETS)) {
        if (!db.getCharacter(id)) {
            const versions = {};
            for (const [bookId, fields] of Object.entries(preset.versions)) {
                versions[bookId] = db.createVersionData(fields);
            }
            db.createCharacter(id, preset.name, versions, preset.school);
        }
    }
    db.saveToLocalStorage();
}

window.addPresetCharacters = addPresetCharacters;

