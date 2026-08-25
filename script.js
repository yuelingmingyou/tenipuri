// script.js
if(typeof Vue==='undefined'){
  document.body.innerHTML='<div style="color:#c00;padding:40px;text-align:center;font-family:monospace;">⚠️ Vue.js 読み込み失敗<br>ページを更新してください</div>';
  throw new Error('Vue not loaded');
}

const {createApp,ref,watch}=Vue;

// 字段定义
const singleVersionFields = [
  'class','birthday','birthTime','zodiac','bloodType',
  'footSize','eyesight','dominantHand',
  'family','fatherJob',
  'elementary','committee','badSubject','schoolPlace','allowance','dailyRoutine'
];
const multiVersionFields = [
  'height','weight','specialMoves','playStyle','racket','shoes',
  'hobby','motto','color','favoriteFood','favoriteBook','favoriteMusic',
  'type','dateSpot','wantNow','weakPoint',
  'goodSubject','otherSkills','tournamentRoutine','favoriteDay','wantTravel','gift'
];

const baseProfileLabels = {
  class:'クラス',birthday:'生年月日',birthTime:'出生時間',zodiac:'星座',
  bloodType:'血液型',height:'身長',weight:'体重',
  footSize:'足のサイズ',eyesight:'視力',dominantHand:'利き手',
  specialMoves:'必殺技',playStyle:'プレースタイル',
  racket:'ラケット',shoes:'シューズ',
  family:'家族構成',fatherJob:'父の職業',
  hobby:'趣味',motto:'座右の銘',color:'好きな色',
  favoriteFood:'好物',favoriteBook:'好きな本',favoriteMusic:'好きな音楽',
  type:'好みのタイプ',dateSpot:'デートしたい場所',
  wantNow:'今欲しいもの',weakPoint:'苦手なもの',
  elementary:'出身小学校',committee:'委員会',
  goodSubject:'得意科目',badSubject:'苦手科目',
  schoolPlace:'学校でよく行く場所',allowance:'お小遣いの使い道',
  dailyRoutine:'毎日必ずすること',
  otherSkills:'テニス以外の特技',tournamentRoutine:'大会中の日課',
  favoriteDay:'好きな記念日',wantTravel:'行きたい旅行先',
  gift:'大切な人へのプレゼント'
};

// 学校配色映射
const schoolColorMap = {
  'seigaku':'#1a4d8f',
  'hyotei':'#4a5568',
  'rikkai':'#b7791f',
  'st-rudolph':'#c53030',
  'rokaku':'#dd6b20',
  'yamabuki':'#48bb78',
  'shitenhoji':'#2b6cb0'
};

const createBaseProfile = () => {
  const profile = {};
  singleVersionFields.forEach(k => profile[k] = '');
  multiVersionFields.forEach(k => profile[k] = [{content:'',version:''}]);
  return profile;
};

const createPersonalitySections = () => [
  {title:'星座&血型',content:''},
  {title:'姓名相关',content:''},
  {title:'兴趣爱好',content:''}
];

createApp({
  setup(){
    const nav=ref('schools');
    const mapPreview=ref(null);

    // 学校数据
    const schools=ref(JSON.parse(localStorage.getItem('t_s')||'null')||[
      {id:'seigaku',name:'青春学園',captain:'手塚国光',motto:'質実剛健',schoolColor:'青/白',description:'東京都の伝統校。テニス部は全国常連。',events:[
        {month:'4月',name:'入学式'},{month:'4月',name:'始業式'},{month:'4月',name:'新入生歓迎会'},
        {month:'5月',name:'遠足'},{month:'5月',name:'中間考査'},
        {month:'6月',name:'交流会'},
        {month:'7月',name:'期末考査'},{month:'7月',name:'終業式'},
        {month:'9月',name:'始業式'},
        {month:'10月',name:'運動会'},{month:'10月',name:'修学旅行'},
        {month:'11月',name:'文化祭'},
        {month:'1月',name:'始業式'},
        {month:'2月',name:'期末考査'},
        {month:'3月',name:'卒業式'},{month:'3月',name:'終業式'}
      ]},
      {id:'hyotei',name:'氷帝学園',captain:'跡部景吾',motto:'勝てば官軍',schoolColor:'灰/紺',description:'名門私立。200名以上のテニス部員。',events:[]},
      {id:'rikkai',name:'立海大附属',captain:'幸村精市',motto:'常勝立海',schoolColor:'黄/黒',description:'王者立海大。全国大会連覇中。',events:[]},
      {id:'st-rudolph',name:'聖ルドルフ学院',captain:'観月はじめ',motto:'',schoolColor:'白/赤',description:'データテニスの名門。',events:[]},
      {id:'rokaku',name:'六角中学校',captain:'佐伯虎次郎',motto:'',schoolColor:'橙/黒',description:'海辺の学校。お好み焼きが有名。',events:[]},
      {id:'yamabuki',name:'山吹中学校',captain:'南健太郎',motto:'',schoolColor:'黄/緑',description:'ダブルスが強い。',events:[]},
      {id:'shitenhoji',name:'四天宝寺',captain:'白石蔵ノ介',motto:'',schoolColor:'紺/白',description:'大阪の強豪。お笑いテニス。',events:[]}
    ]);

    const chars=ref(JSON.parse(localStorage.getItem('t_c')||'[]'));
    const selSchool=ref(null);
    const selChar=ref(null);

    // 初始化示例数据
    if(!chars.value.length){
      chars.value.push({
        id:'r1',schoolId:'rikkai',name:'仁王雅治',
        baseProfile:{
          class:'3年B組14番',birthday:'12月4日',birthTime:'16:29',zodiac:'射手座',bloodType:'AB型',
          height:[{content:'175cm',version:'初期'},{content:'176cm',version:'NPO23.5'}],
          weight:[{content:'60kg',version:'NPO23.5'}],
          footSize:'27cm',eyesight:'右2.0 左2.0',dominantHand:'左手',
          specialMoves:[{content:'欺詐打法、幻影、同調',version:'氷立公式'}],
          playStyle:'全能型',racket:[{content:'Prince MORE POWER 1150 S',version:''}],shoes:[{content:'YONEX POWER CUSHION WIDE 271',version:''}],
          family:'父、母、姐、弟',fatherJob:'公司职员',
          hobby:'飞镖、21点',motto:'骑着黑色的白马向前后退',color:[{content:'蓝色',version:''}],
          favoriteFood:[{content:'烤肉',version:'NPO23.5'}],
          favoriteBook:[{content:'《欺诈师乐园》',version:'NPO23.5'}],
          favoriteMusic:'爵士',
          type:[{content:'擅长策略的人',version:'NPO23.5'}],
          dateSpot:[{content:'海',version:'NPO23.5'}],
          wantNow:[{content:'螺丝和螺丝刀',version:'NPO23.5'}],
          weakPoint:[{content:'炎热、蔬菜',version:'NPO23.5'}],
          elementary:'不详',committee:'无',
          goodSubject:[{content:'数学',version:'20周年'}],badSubject:'音乐',
          schoolPlace:'屋顶',allowance:'秘密',dailyRoutine:'预习和复习',
          otherSkills:[{content:'射击',version:'NPO23.5'}],
          tournamentRoutine:[{content:'补充糖和巧克力',version:'NPO23.5'}],
          favoriteDay:[{content:'新月之夜',version:'20周年'}],
          wantTravel:[{content:'巴特罗之家',version:'20周年'}],
          gift:[{content:'闪耀时刻',version:'20周年'}]
        },
        oneWord:{text:'性感☆艺人',by:'许斐刚'},
        personalitySections:[
          {title:'星座&血型',content:'射手座AB型。自由奔放，善于变通。'},
          {title:'姓名相关',content:'仁王源自网球俱乐部有人叫这个。'},
          {title:'兴趣爱好',content:'飞镖、21点、欺诈游戏。'}
        ],
        classmates:[
          {name:'柳生比吕士',desc:'配合仁王君的欺诈真是让我做不情愿的事情。'},
          {name:'丸井文太',desc:'仁王的惊吓口香糖无论多少次都会吓到我！'}
        ],
        dayRoutine:{school:[{time:'7:00',event:'起床・朝練'},{time:'8:30',event:'登校'},{time:'15:30',event:'部活'},{time:'22:00',event:'就寝'}],holiday:[{time:'9:00',event:'自主練'},{time:'14:00',event:'ゲーム'}]},
        sections:{personality:'',othersComments:[
          {author:'幸村精市',text:'仁王は頼もしい副部長だ。',source:'POT公式書20.5'},
          {author:'柳生比吕士',text:'あいつの変装は本物だ。',source:'pair puri vol.4'}
        ],anecdotes:'入学当初は欺诈で先輩を驚かせ、部活をサボろうとした。',selfIntro:[
          {q:'テニスを始めたきっかけは？',a:'面白そうだったから。',source:'40.5'}
        ]},
        interviewQA:[
          {q:'请说一下仁王名字的由来',a:'因为网球俱乐部有人叫这个，所以借用了。',source:'pair puri vol.4'},
          {q:'幻影のコツは？',a:'相手を観察することかな。',source:'NPO23.5'}
        ],
        itemsCheck:[
          {name:'デッキブラシ',desc:'部活後の掃除用'},
          {name:'変装道具',desc:'いつでも変装できるように'}
        ]
      });
    }

    // 数据迁移与初始化
    chars.value.forEach(c=>{
      if(!c.baseProfile) c.baseProfile = createBaseProfile();
      singleVersionFields.forEach(k=>{ if(!(k in c.baseProfile)) c.baseProfile[k] = ''; });
      multiVersionFields.forEach(k=>{ 
        if(!(k in c.baseProfile) || !Array.isArray(c.baseProfile[k])) c.baseProfile[k] = [{content:'',version:''}]; 
      });
      if(!c.oneWord) c.oneWord = {text:'',by:''};
      if(!c.personalitySections) c.personalitySections = createPersonalitySections();
      if(!c.classmates) c.classmates = [];
      if(!c.dayRoutine) c.dayRoutine = {school:[],holiday:[]};
      if(!c.sections) c.sections = {personality:'',othersComments:[],anecdotes:'',selfIntro:[]};
      if(!c.interviewQA) c.interviewQA = [];
      if(!c.itemsCheck) c.itemsCheck = [];
    });
    schools.value.forEach(s=>{ if(!s.events) s.events = []; });

    const getChars=(sid)=>chars.value.filter(c=>c.schoolId===sid);
    const getSchoolName=(sid)=>(schools.value.find(s=>s.id===sid)||{}).name||'';

    // 获取选手简介
    const getProfileBrief=(c)=>{
      const bp=c.baseProfile;
      if(!bp) return '';
      const parts=[];
      if(bp.class) parts.push(bp.class);
      if(bp.playStyle) parts.push(bp.playStyle);
      return parts.join(' · ') || 'NO DATA';
    };

    const addChar=(sid)=>{
      const n=prompt('新しい選手の名前を入力してください：');
      if(!n) return;
      chars.value.push({
        id:'c'+Date.now(),schoolId:sid,name:n,
        baseProfile: createBaseProfile(),
        oneWord:{text:'',by:''},
        personalitySections: createPersonalitySections(),
        classmates:[],
        dayRoutine:{school:[],holiday:[]},
        sections:{personality:'',othersComments:[],anecdotes:'',selfIntro:[]},
        interviewQA:[],
        itemsCheck:[]
      });
      save();
    };

    const save=()=>{
      localStorage.setItem('t_s',JSON.stringify(schools.value));
      localStorage.setItem('t_c',JSON.stringify(chars.value));
      // 使用更低调的保存提示
      const toast=document.createElement('div');
      toast.textContent='保存しました';
      toast.style.cssText='position:fixed;top:20px;right:20px;background:#000;color:#fff;padding:12px 24px;font-size:12px;font-weight:900;z-index:9999;border:4px solid #000;box-shadow:6px 6px 0 rgba(0,0,0,0.2);';
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(),1500);
    };

    // 自动保存
    watch([schools,chars],()=>{
      localStorage.setItem('t_s',JSON.stringify(schools.value));
      localStorage.setItem('t_c',JSON.stringify(chars.value));
    },{deep:true});

    const handleMapUpload = (event, school, field) => {
      const file = event.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        school[field] = e.target.result;
        save();
      };
      reader.readAsDataURL(file);
    };

    const openMapPreview = (src) => {
      if(src) mapPreview.value = src;
    };

    return{
      nav, schools, chars, selSchool, selChar,
      baseProfileLabels, singleVersionFields, multiVersionFields,
      schoolColorMap,
      getChars, getSchoolName, getProfileBrief, addChar, save,
      handleMapUpload, openMapPreview, mapPreview
    };
  }
}).mount('#app');

