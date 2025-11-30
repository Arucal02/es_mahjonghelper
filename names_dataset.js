// 从es_mahjong_helper_v51/data.js中提取的唯一成员名称数据集
// 用于新增役种时直接从该数据集选择人名，确保一致性
// 当前数据集成员总数: 54人

const uniqueNames = [
  // 按拼音首字母排序
  // B
  "巴日和",
  "白鸟蓝良（爱拉）",
  "冰鹰北斗",
  "冰鹰诚矢",
  // C
  "春川宙",
  // D
  "大神晃牙（狗）",
  "动物牌",
  // E
  "Esu（笑主）",
  // F
  "伏见弓弦",
  "风早巽",
  // G
  "鬼龙红郎",
  "高峯翠",
  // H
  "HiMERU（露）",
  "黑根棺",
  // J
  "姬宫桃李",
  // K
  "葵日向",
  "葵裕太（yuta-吐舌）",
  "Kanna（神无）",
  // L
  "濑名泉",
  "莲巳敬人",
  "礼濑真宵（麻油）",
  "泷维吹",
  "涟纯（连春）",
  "乱凪砂（ngs）",
  // M
  "明星昴流",
  "鸣上岚（姐）",
  "门章臣",
  // N
  "逆先夏目",
  "南云铁虎",
  "NiceP",
  // Q
  "青叶纺",
  "七种茨（ibr）",
  // R
  "仁兔成鸣",
  "日日树涉",
  "Raika（莱香）",
  // S
  "三毛缟斑（妈妈）",
  "深海奏汰（puka）",
  "神崎飒马",
  "守泽千秋",
  "朔间零",
  "朔间凛月（栗）",
  "守门人",
  // T
  "天城燐音",
  "天城一彩",
  "天祥院英智",
  "天满光",
  // X
  "仙石忍",
  // Y
  "Yume（梦梦）",
  "衣更真绪（毛）",
  "影片美伽（mika-咪）",
  "羽风薰",
  "游木真",
  "乙狩阿多尼斯",
  "樱河琥珀",
  "月永雷欧（leo）",
  // Z
  "斋宫宗",
  "真白友也",
  "紫之创",
  "朱樱司",
  "佐贺美阵",
  "椎名丹希（尼）"
];

// 统计数据集中的成员人数（当前共54人）
const totalMembers = uniqueNames.length; // 当前值: 54

// 旧的导出语句已删除，使用下面的统一导出

// 提供一个简单的函数来获取随机人名（可选功能）
function getRandomName() {
  return uniqueNames[Math.floor(Math.random() * uniqueNames.length)];
}

// 提供一个函数来按拼音排序人名（可选功能）
function sortNamesByPinyin() {
  return [...uniqueNames].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

// 提供一个函数来检查名字是否在数据集中（可选功能）
function isNameInDataset(name) {
  return uniqueNames.includes(name);
}

// 导出辅助函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    uniqueNames,
    totalMembers,
    getRandomName,
    sortNamesByPinyin,
    isNameInDataset
  };
}