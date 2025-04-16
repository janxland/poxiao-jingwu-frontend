import { MockAdapter } from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';

// 设置中文区域
faker.locale = 'zh_CN';  // Changed from faker.setLocale('zh_CN')
// 生成随机ID
const generateRandomId = () => {
  return faker.string.alphanumeric(24);
};

// 生成随机手机号
const generateRandomPhone = () => {
  return `1${faker.number.int({ min: 3, max: 9 })}${faker.string.numeric(9)}`;
};

// 生成随机身份证号
const generateRandomIdNumber = () => {
  // 生成随机的18位身份证号
  const areaCode = faker.location.zipCode('#####');
  const birthYear = faker.date.birthdate({ min: 1960, max: 2000, mode: 'year' }).getFullYear();
  const birthMonth = String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0');
  const birthDay = String(faker.number.int({ min: 1, max: 28 })).padStart(2, '0');
  const sequence = faker.string.numeric(3);
  const checkCode = faker.string.alphanumeric(1).toUpperCase();
  
  return `${areaCode}${birthYear}${birthMonth}${birthDay}${sequence}${checkCode}`;
};

// 生成随机微信ID
const generateRandomWxId = () => {
  return `wxid_${faker.string.alphanumeric(9)}`;
};

// 生成随机网络账号ID
const generateRandomNetworkId = () => {
  const prefix = faker.helpers.arrayElement(['用户', '小', '大', '老', '京城', '沪上', '粤', '川']);
  const suffix = faker.person.lastName();
  return `${prefix}${suffix}`;
};

// 生成随机地址
const generateRandomAddress = () => {
  return faker.location.city() + faker.location.street() + faker.location.buildingNumber();
};

// 生成随机学历
const generateRandomEducation = () => {
  return faker.helpers.arrayElement(['初中', '高中', '中专', '大专', '本科', '硕士', '博士', '未知']);
};

// 生成随机星座
const generateRandomZodiac = () => {
  return faker.helpers.arrayElement(['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']);
};

// 生成随机敏感词
const generateRandomSensitiveKeywords = () => {
  const keywords = [
    '转账', '贷款', '借钱', '还钱', '欠款', '利息', '投资', '理财', 
    '赌博', '博彩', '彩票', '赌场', '赌钱', '赢钱', '输钱',
    '毒品', '货源', '白粉', '冰毒', '摇头丸', '大麻', 
    '走私', '偷渡', '假证', '假钞', '洗钱', '黑钱',
    '枪支', '弹药', '军火', '炸药', '爆炸物',
    '色情', '小姐', '一夜情', '援交', '服务',
    '诈骗', '骗钱', '骗局', '套路', '圈套',
    '黑客', '攻击', '入侵', '病毒', '木马',
    '偷税', '漏税', '逃税', '避税', '税务',
    '非法集资', '传销', '直销', '拉人头', '下线',
    '内幕', '消息', '股票', '内部', '暴涨'
  ];
  
  const count = faker.number.int({ min: 0, max: 5 });
  return faker.helpers.arrayElements(keywords, count);
};

// 生成随机活跃时段
const generateRandomActivePeriods = () => {
  const periods = ['凌晨', '早上', '上午', '中午', '下午', '傍晚', '晚上', '深夜', '工作日', '周末', '节假日'];
  const count = faker.number.int({ min: 1, max: 3 });
  return faker.helpers.arrayElements(periods, count);
};

// 生成随机交通方式
const generateRandomTransport = () => {
  const transport = ['私家车', '公交车', '地铁', '出租车', '网约车', '高铁', '飞机', '自行车', '电动车', '步行'];
  const count = faker.number.int({ min: 1, max: 3 });
  return faker.helpers.arrayElements(transport, count);
};

// 生成随机住宿地点
const generateRandomLodging = () => {
  const lodging = [
    `${faker.location.city()}${faker.company.name()}酒店`,
    `${faker.location.city()}${faker.company.name()}宾馆`,
    `${faker.location.city()}${faker.company.name()}民宿`,
    `${faker.location.city()}${faker.company.name()}公寓`
  ];
  const count = faker.number.int({ min: 0, max: 2 });
  return faker.helpers.arrayElements(lodging, count);
};

// 生成随机娱乐偏好
const generateRandomEntertainment = () => {
  const entertainment = ['KTV', '电影', '游戏', '运动', '健身', '旅游', '购物', '美食', '读书', '音乐', '舞蹈', '绘画', '摄影', '钓鱼', '棋牌', '麻将', '赌博'];
  const count = faker.number.int({ min: 0, max: 4 });
  return faker.helpers.arrayElements(entertainment, count);
};

// 生成随机交互主题
const generateRandomInteractionTopics = () => {
  const topics = ['投资', '旅行', '工作', '学习', '家庭', '健康', '娱乐', '购物', '美食', '运动', '时事', '政治', '科技', '艺术', '文化', '宗教', '哲学', '心理', '情感', '社交'];
  const count = faker.number.int({ min: 0, max: 3 });
  return faker.helpers.arrayElements(topics, count);
};

// 生成随机通信渠道使用情况
const generateRandomChannelsUsage = () => {
  const channels = {
    '手机': faker.number.int({ min: 0, max: 200 }),
    '短信': faker.number.int({ min: 0, max: 100 }),
    '微信': faker.number.int({ min: 0, max: 300 }),
    'QQ': faker.number.int({ min: 0, max: 100 }),
    '邮件': faker.number.int({ min: 0, max: 50 }),
    '电报': faker.number.int({ min: 0, max: 30 }),
    'WhatsApp': faker.number.int({ min: 0, max: 20 })
  };
  
  // 随机选择2-4个通信渠道
  const selectedChannels = {};
  const channelKeys = Object.keys(channels);
  const selectedKeys = faker.helpers.arrayElements(channelKeys, faker.number.int({ min: 2, max: 4 }));
  
  selectedKeys.forEach(key => {
    selectedChannels[key] = channels[key];
  });
  
  return selectedChannels;
};

// 生成随机非法风险
const generateRandomIllegalRisks = () => {
  const risks = [
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人通过${faker.helpers.arrayElement(['支付宝', '微信', '银行卡'])}转账向账号X支付${faker.number.int({ min: 1, max: 10 })}万元，涉及电信网络诈骗活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人在${faker.location.city()}${faker.location.street()}进行可疑交易，疑似毒品交易`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人在${faker.location.city()}${faker.location.street()}与多名嫌疑人会面，疑似组织犯罪活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人通过${faker.helpers.arrayElement(['支付宝', '微信', '银行卡'])}收款${faker.number.int({ min: 1, max: 10 })}万元，资金来源不明`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人在${faker.location.city()}${faker.location.street()}与境外人员接触，疑似间谍活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人在${faker.location.city()}${faker.location.street()}进行可疑交易，疑似走私活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人在${faker.location.city()}${faker.location.street()}与多名嫌疑人会面，疑似传销活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人通过${faker.helpers.arrayElement(['支付宝', '微信', '银行卡'])}转账向账号X支付${faker.number.int({ min: 1, max: 10 })}万元，疑似赌博活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人在${faker.location.city()}${faker.location.street()}进行可疑交易，疑似非法集资活动`,
    `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，嫌疑人通过${faker.helpers.arrayElement(['支付宝', '微信', '银行卡'])}收款${faker.number.int({ min: 1, max: 10 })}万元，疑似洗钱活动`
  ];
  
  const count = faker.number.int({ min: 0, max: 3 });
  return faker.helpers.arrayElements(risks, count);
};

// 生成随机关系类型
const generateRandomRelationType = () => {
  return faker.helpers.arrayElement([
    '转账关系', '同行关系', '同住关系', '通话关系', '短信关系', '微信关系', 
    '亲属关系', '朋友关系', '同事关系', '上下级关系', '师生关系', '同学关系',
    '商业关系', '供应商关系', '客户关系', '合作关系', '竞争关系', '敌对关系',
    '情侣关系', '夫妻关系', '前任关系', '暧昧关系', '单相思关系',
    '债权债务关系', '借贷关系', '担保关系', '抵押关系', '质押关系',
    '犯罪关系', '共犯关系', '从犯关系', '主犯关系', '教唆关系', '帮助关系',
    '上下游关系', '同伙关系', '同案关系', '同监关系', '同狱关系',
    '举报关系', '投诉关系', '控告关系', '诉讼关系', '调解关系',
    '同房间', '同车辆', '同航班', '同车次', '同船次', '同酒店'
  ]);
};

// 生成随机关系详情
const generateRandomRelationDetail = (relationType) => {
  const details = {
    '转账关系': [
      `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，通过${faker.helpers.arrayElement(['支付宝', '微信', '银行卡'])}转账${faker.number.int({ min: 1, max: 10 })}次，共计${faker.number.int({ min: 1000, max: 100000 })}元`,
      `备注为'${faker.helpers.arrayElement(['借款', '还账', '投资', '分红', '报销', '工资', '红包', '礼金', '赔偿', '赎金'])}'`
    ],
    '同行关系': [
      `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，共同乘坐${faker.helpers.arrayElement(['飞机', '高铁', '汽车', '出租车', '网约车'])}前往${faker.location.city()}`,
      `行程持续${faker.number.int({ min: 1, max: 10 })}天，期间有${faker.number.int({ min: 1, max: 10 })}次共同活动`
    ],
    '同住关系': [
      `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}至${faker.date.recent({ days: 300 }).toISOString().split('T')[0]}，共同入住${faker.location.city()}${faker.company.name()}酒店${faker.number.int({ min: 1, max: 5 })}次`,
      `使用${faker.helpers.arrayElement(['统一身份证登记', '不同身份证登记'])}，房号${faker.helpers.arrayElement(['相同', '相邻'])}`
    ],
    '通话关系': [
      `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}至${faker.date.recent({ days: 300 }).toISOString().split('T')[0]}，通话${faker.number.int({ min: 1, max: 100 })}次，总时长${faker.number.int({ min: 10, max: 1000 })}分钟`,
      `通话频率为${faker.helpers.arrayElement(['每天', '每周', '每月', '不定期'])}，通话时间集中在${faker.helpers.arrayElement(['早上', '中午', '下午', '晚上', '深夜'])}`
    ],
    '微信关系': [
      `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}至${faker.date.recent({ days: 300 }).toISOString().split('T')[0]}，微信聊天${faker.number.int({ min: 1, max: 1000 })}次，发送消息${faker.number.int({ min: 10, max: 10000 })}条`,
      `聊天内容涉及${faker.helpers.arrayElement(['工作', '生活', '情感', '金钱', '交易', '犯罪', '政治', '宗教', '色情', '赌博', '毒品'])}`
    ]
  };
  
  // 如果没有特定类型的详情，生成通用详情
  if (!details[relationType]) {
    return [
      `${faker.date.recent({ days: 365 }).toISOString().split('T')[0]}，${faker.lorem.sentence()}`,
      `${faker.date.recent({ days: 300 }).toISOString().split('T')[0]}，${faker.lorem.sentence()}`
    ];
  }
  
  return details[relationType];
};

// 生成随机消息交换
const generateRandomMessageExchange = (source, target) => {
  const count = faker.number.int({ min: 3, max: 10 });
  const messages = [];
  
  for (let i = 0; i < count; i++) {
    const sender = faker.helpers.arrayElement([source, target]);
    const receiver = sender === source ? target : source;
    
    messages.push({
      sender,
      receiver,
      content: faker.lorem.sentence(),
      time: faker.date.recent({ days: 365 }).toISOString()
    });
  }
  
  return messages;
};

// 生成随机节点
const generateRandomNode = (isFullInfo = false) => {
  const id = isFullInfo ? generateRandomIdNumber() : generateRandomPhone();
  const networkAccountId = generateRandomNetworkId();
  
  // 基本信息
  const node = {
    id,
    label: {
      oneID: isFullInfo ? generateRandomPhone() : id,
      UnionID: isFullInfo ? generateRandomWxId() : ""
    },
    properties: {
      name: isFullInfo ? faker.person.fullName() : "",
      network_account_id: networkAccountId,
      network_account_name: networkAccountId.substring(networkAccountId.length - 2),
      nicknames: isFullInfo ? [faker.person.lastName() + faker.helpers.arrayElement(['哥', '弟', '姐', '妹'])] : [networkAccountId.substring(networkAccountId.length - 2)],
      phone: isFullInfo ? generateRandomPhone() : id
    }
  };
  
  // 如果需要完整信息，添加更多属性
  if (isFullInfo) {
    Object.assign(node.properties, {
      gender: faker.helpers.arrayElement(['男', '女']),
      age: String(faker.number.int({ min: 18, max: 70 })),
      place_of_origin: faker.location.city(),
      zodiac: generateRandomZodiac(),
      education: generateRandomEducation(),
      id_number: id,
      phone2: faker.helpers.arrayElement([generateRandomPhone(), ""]),
      holder_number: faker.helpers.arrayElement([generateRandomPhone(), ""]),
      document_type: "身份证",
      document_number: id,
      device_type: faker.helpers.arrayElement(['手机', '平板', '电脑']),
      phone_brand: faker.helpers.arrayElement(['iPhone', '华为', '小米', 'OPPO', 'vivo', '三星']),
      device_model: faker.helpers.arrayElement(['iPhone 13', 'iPhone 14', 'Mate 40', 'P40', 'Mi 12', 'Find X5']),
      "IMEI/MEID": faker.helpers.arrayElement([faker.string.numeric(15), ""]),
      IMSI: faker.helpers.arrayElement([faker.string.numeric(15), ""]),
      ICCID: faker.helpers.arrayElement([faker.string.numeric(19), ""]),
      permanent_address: generateRandomAddress(),
      temporary_address: faker.helpers.arrayElement([generateRandomAddress(), ""]),
      marital_status: faker.helpers.arrayElement(['未婚', '已婚', '离异', '丧偶']),
      has_children: faker.datatype.boolean(),
      family_structure: faker.helpers.arrayElement(['核家庭', '大家庭', '单亲家庭', '重组家庭']),
      family_criminal_records: faker.helpers.arrayElement([["配偶曾涉赌"], ["父亲曾涉毒"], ["兄弟曾涉盗窃"], []]),
      illegal_risks: generateRandomIllegalRisks(),
      consumption_level: faker.helpers.arrayElement([`${faker.number.int({ min: 1, max: 100 })}万元`, ""]),
      has_car: faker.datatype.boolean(),
      has_house: faker.datatype.boolean(),
      has_loan: faker.datatype.boolean(),
      loan_types: faker.helpers.arrayElement([["消费贷款", "汽车贷款"], ["房贷"], ["经营贷款"], []]),
      transaction_count: faker.number.int({ min: 0, max: 500 }),
      expenditure_frequency: faker.helpers.arrayElement(['频繁', '中等', '较少', '极少']),
      transaction_categories: faker.helpers.arrayElements(['餐饮', '购物', '娱乐', '交通', '住宿', '医疗', '教育', '通信', '金融'], faker.number.int({ min: 0, max: 5 })),
      overdue_record_count: faker.number.int({ min: 0, max: 10 }),
      abnormal_transaction_count: faker.number.int({ min: 0, max: 5 }),
      sleep_pattern: faker.helpers.arrayElement(['22:00-06:00', '23:00-07:00', '00:00-08:00', '01:00-09:00', '不规律']),
      common_transport: generateRandomTransport(),
      travel_frequency: faker.number.int({ min: 0, max: 50 }),
      mobility: faker.helpers.arrayElement(['固定', '流动', '高度流动']),
      lodging_frequency: faker.number.int({ min: 0, max: 30 }),
      common_lodging: generateRandomLodging(),
      shopping_habits: faker.helpers.arrayElement(['网购为主', '线下为主', '网购线下结合', '每月初大额消费', '节假日消费', '不规律消费']),
      payment_method: faker.helpers.arrayElement(['支付宝', '微信', '银行卡', '现金', '信用卡']),
      entertainment_preferences: generateRandomEntertainment(),
      communication_frequency: faker.number.int({ min: 0, max: 500 }),
      channels_usage: generateRandomChannelsUsage(),
      total_duration: faker.number.int({ min: 0, max: 10000 }),
      average_duration: faker.number.int({ min: 0, max: 60 }),
      sensitive_keywords: generateRandomSensitiveKeywords(),
      active_duration: faker.helpers.arrayElement(['1小时', '2小时', '3小时', '4小时', '5小时', '全天', '不规律']),
      active_periods: generateRandomActivePeriods(),
      interaction_topics: generateRandomInteractionTopics(),
      interaction_count: faker.number.int({ min: 0, max: 25 }),
      network_info: [
        {
          "WIFI名称": `${faker.company.name()}WiFi`,
          "MAC地址": `${faker.string.hexadecimal({ length: 12, casing: 'mixed', prefix: '' }).match(/.{1,2}/g).join(':')}`,
          "连接时间": faker.date.recent({ days: 30 }).toISOString().replace('T', ' ').substring(0, 19)
        }
      ]
    });
  }
  
  return node;
};

// 生成随机关系
const generateRandomRelationship = (source, target) => {
  const relationType = generateRandomRelationType();
  
  return {
    source,
    target,
    type: relationType,
    properties: {
      relation_detail: generateRandomRelationDetail(relationType),
      interaction_count: faker.number.int({ min: 1, max: 25 })
    }
  };
};

// 生成随机图数据
const generateRandomGraphData = (nodeCount = 50, edgeCount = 100) => {
  // 生成节点
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(generateRandomNode(i < nodeCount * 0.3)); // 30%的节点有完整信息
  }
  
  // 生成边
  const edges = [];
  const messageExchanges = [];
  
  for (let i = 0; i < edgeCount; i++) {
    const sourceIndex = faker.number.int({ min: 0, max: nodes.length - 1 });
    let targetIndex;
    do {
      targetIndex = faker.number.int({ min: 0, max: nodes.length - 1 });
    } while (targetIndex === sourceIndex);
    
    const source = nodes[sourceIndex].id;
    const target = nodes[targetIndex].id;
    
    // 检查是否已存在相同的边
    const edgeExists = edges.some(edge => 
      (edge.source === source && edge.target === target) || 
      (edge.source === target && edge.target === source)
    );
    
    if (!edgeExists) {
      edges.push(generateRandomRelationship(source, target));
      
      // 为部分边生成消息交换
      if (faker.datatype.boolean()) {
        const messages = generateRandomMessageExchange(source, target);
        messageExchanges.push(...messages);
      }
    }
  }
  
  return {
    graph_data: {
      nodes,
      relationships: edges,
      message_exchange: messageExchanges
    }
  };
};

// 模拟知识图谱数据
const mockGraphData = generateRandomGraphData(50, 100);

// 转换为前端需要的格式
const convertToFrontendFormat = (data) => {
  const nodes = data.graph_data.nodes.map(node => ({
    id: node.id,
    name: node.properties.name || node.properties.network_account_id,
    label: JSON.stringify(node.label),
    belongName: "test",
    belongPhone: "1111",
    ...node.properties
  }));
  
  const edges = data.graph_data.relationships.map(rel => ({
    id: null,
    source: rel.source,
    target: rel.target,
    type: rel.type,
    relation_detail: rel.properties.relation_detail,
    interaction_count: rel.properties.interaction_count
  }));
  
  return { nodes, edges };
};

const frontendGraphData = convertToFrontendFormat(mockGraphData);

// 导出这些函数以便直接使用
export { generateRandomGraphData, convertToFrontendFormat, frontendGraphData };

// 获取前端格式的图数据
export function getFrontendGraphData() {
  return frontendGraphData;
}

export default function(mock) {
  // 确保 mock 对象存在
  if (!mock) {
    console.error('Mock adapter is undefined');
    return;
  }
  
  // 获取知识图谱数据
  mock.onGet('/api/knowledge-graph/data').reply(200, {
    code: 200,
    data: frontendGraphData,
    message: '获取知识图谱数据成功'
  });
  
  // 根据手机号获取知识图谱数据
  mock.onGet(new RegExp('/api/knowledge-graph/data/.*')).reply(200, {
    code: 200,
    data: frontendGraphData,
    message: '获取知识图谱数据成功'
  });
}