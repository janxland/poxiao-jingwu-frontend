import { MockAdapter } from 'axios-mock-adapter';

// 模拟知识图谱数据
const mockGraphData = {
  nodes: [
    {
      id: "eb5925371be58caaaca53e1bedcb6afe",
      name: "七星海-空蛋油杆/群上粉",
      label: "{\"network_account_id\":\"user7157202858\"}",
      belongName: "test",
      belongPhone: "1111",
      gender: "未知",
      age: null,
      place_of_origin: null,
      zodiac: null,
      education: null,
      id_number: null,
      phone: null,
      network_account_id: "user7157202858",
      nicknames: ["七星海"],
      permanent_address: null,
      temporary_address: null,
      illegal_risks: [
        "2025-03-22T14:11:44，讨论电子烟燃料交易",
        "2025-03-22T20:28:02，涉及广告删除争议"
      ],
      consumption_level: null,
      has_car: null,
      has_house: null,
      has_loan: null,
      loan_types: [],
      transaction_count: null,
      expenditure_frequency: null,
      transaction_categories: [],
      overdue_record_count: null,
      abnormal_transaction_count: null,
      sleep_pattern: null,
      common_transport: [],
      travel_frequency: null,
      mobility: null,
      lodging_frequency: null,
      common_lodging: [],
      shopping_habits: null,
      payment_method: null,
      entertainment_preferences: [],
      communication_frequency: 13,
      channels_usage: "{\"微信\":13}",
      total_duration: null,
      average_duration: null,
      sensitive_keywords: ["空蛋油杆", "群上粉"],
      active_duration: "持续活跃",
      active_periods: ["夜间"],
      interaction_topics: ["电子烟设备交易", "群管理"]
    },
    {
      id: "fda5a69cfbb7e2fd1e472791ba1615da",
      name: "电子烟销售-老王",
      label: "{\"network_account_id\":\"user8823456789\"}",
      belongName: "test",
      belongPhone: "1111",
      gender: "男",
      age: "35",
      place_of_origin: "广东",
      zodiac: "天蝎座",
      education: "大专",
      id_number: null,
      phone: "13812345678",
      network_account_id: "user8823456789",
      nicknames: ["老王", "烟王"],
      permanent_address: "广东省深圳市南山区",
      temporary_address: null,
      illegal_risks: [
        "2025-03-20T09:15:22，组织非法电子烟销售",
        "2025-03-23T16:42:10，讨论规避监管方式"
      ],
      consumption_level: "12万元",
      has_car: true,
      has_house: true,
      has_loan: false,
      loan_types: [],
      transaction_count: 156,
      expenditure_frequency: "频繁",
      transaction_categories: ["电子设备", "餐饮", "娱乐"],
      overdue_record_count: 0,
      abnormal_transaction_count: 3,
      sleep_pattern: "23:00-07:00",
      common_transport: ["私家车"],
      travel_frequency: 8,
      mobility: "固定",
      lodging_frequency: 2,
      common_lodging: ["深圳湾大酒店"],
      shopping_habits: "线下为主",
      payment_method: "微信支付",
      entertainment_preferences: ["KTV", "酒吧"],
      communication_frequency: 45,
      channels_usage: "{\"微信\":35,\"电话\":10}",
      total_duration: 1200,
      average_duration: 15,
      sensitive_keywords: ["货源", "批发", "进货"],
      active_duration: "全天",
      active_periods: ["上午", "晚间"],
      interaction_topics: ["电子烟销售", "货源采购", "价格谈判"]
    },
    {
      id: "9c380b33883395b979817bfb020b2c0d",
      name: "魔叶-电子烟品牌",
      label: "{\"network_account_id\":\"moye_official\"}",
      belongName: "test",
      belongPhone: "1111",
      gender: "未知",
      age: null,
      place_of_origin: null,
      zodiac: null,
      education: null,
      id_number: null,
      phone: "4008123456",
      network_account_id: "moye_official",
      nicknames: ["魔叶", "MoYe"],
      permanent_address: "广东省深圳市龙华区",
      temporary_address: null,
      illegal_risks: [],
      consumption_level: null,
      has_car: null,
      has_house: null,
      has_loan: null,
      loan_types: [],
      transaction_count: null,
      expenditure_frequency: null,
      transaction_categories: [],
      overdue_record_count: null,
      abnormal_transaction_count: null,
      sleep_pattern: null,
      common_transport: [],
      travel_frequency: null,
      mobility: null,
      lodging_frequency: null,
      common_lodging: [],
      shopping_habits: null,
      payment_method: null,
      entertainment_preferences: [],
      communication_frequency: 5,
      channels_usage: "{\"微信\":5}",
      total_duration: null,
      average_duration: null,
      sensitive_keywords: ["电子烟", "官方"],
      active_duration: "工作时间",
      active_periods: ["白天"],
      interaction_topics: ["产品咨询", "售后服务"]
    },
    {
      id: "2242a380e5bc603a411869a74b4eb09b",
      name: "小李-批发商",
      label: "{\"network_account_id\":\"user9987654321\"}",
      belongName: "test",
      belongPhone: "1111",
      gender: "男",
      age: "28",
      place_of_origin: "湖北",
      zodiac: "双子座",
      education: "本科",
      id_number: null,
      phone: "13987654321",
      network_account_id: "user9987654321",
      nicknames: ["小李", "李哥"],
      permanent_address: "广东省广州市白云区",
      temporary_address: null,
      illegal_risks: [
        "2025-03-25T11:30:15，涉嫌非法交易电子烟",
        "2025-03-26T14:22:33，与他人发生财物纠纷"
      ],
      consumption_level: "8万元",
      has_car: true,
      has_house: false,
      has_loan: true,
      loan_types: ["经营贷款"],
      transaction_count: 98,
      expenditure_frequency: "中等",
      transaction_categories: ["电子设备", "交通", "餐饮"],
      overdue_record_count: 1,
      abnormal_transaction_count: 2,
      sleep_pattern: "01:00-09:00",
      common_transport: ["私家车", "高铁"],
      travel_frequency: 12,
      mobility: "流动",
      lodging_frequency: 6,
      common_lodging: ["如家酒店", "7天连锁"],
      shopping_habits: "线上线下结合",
      payment_method: "支付宝",
      entertainment_preferences: ["游戏", "电影"],
      communication_frequency: 32,
      channels_usage: "{\"微信\":25,\"电话\":7}",
      total_duration: 850,
      average_duration: 12,
      sensitive_keywords: ["批发", "货源", "价格"],
      active_duration: "不规律",
      active_periods: ["下午", "深夜"],
      interaction_topics: ["货物交易", "价格谈判", "物流安排"]
    },
    {
      id: "9a2017e971915931e1d5b1e04bef9885",
      name: "大刘-零售商",
      label: "{\"network_account_id\":\"user6543219876\"}",
      belongName: "test",
      belongPhone: "1111",
      gender: "男",
      age: "31",
      place_of_origin: "河南",
      zodiac: "金牛座",
      education: "高中",
      id_number: null,
      phone: "13765432198",
      network_account_id: "user6543219876",
      nicknames: ["大刘", "刘老板"],
      permanent_address: "广东省东莞市长安镇",
      temporary_address: null,
      illegal_risks: [
        "2025-03-26T14:22:33，与他人发生财物纠纷",
        "2025-03-27T09:15:40，涉嫌销售违禁电子烟"
      ],
      consumption_level: "10万元",
      has_car: true,
      has_house: true,
      has_loan: true,
      loan_types: ["房贷", "车贷"],
      transaction_count: 120,
      expenditure_frequency: "频繁",
      transaction_categories: ["电子设备", "餐饮", "服装"],
      overdue_record_count: 0,
      abnormal_transaction_count: 1,
      sleep_pattern: "00:00-08:00",
      common_transport: ["私家车"],
      travel_frequency: 5,
      mobility: "固定",
      lodging_frequency: 1,
      common_lodging: [],
      shopping_habits: "线下为主",
      payment_method: "微信支付",
      entertainment_preferences: ["KTV", "麻将"],
      communication_frequency: 28,
      channels_usage: "{\"微信\":20,\"电话\":8}",
      total_duration: 920,
      average_duration: 18,
      sensitive_keywords: ["货源", "进货", "价格"],
      active_duration: "全天",
      active_periods: ["上午", "晚间"],
      interaction_topics: ["货物采购", "价格谈判", "销售策略"]
    }
  ],
  edges: [
    {
      id: null,
      source: "fda5a69cfbb7e2fd1e472791ba1615da",
      target: "9c380b33883395b979817bfb020b2c0d",
      type: "举报目标",
      relation_detail: [
        "2025年3月24日组织成员讨论'干掉魔叶'并提供举报奖励",
        "2025年3月24日多次提及魔叶账号需清除"
      ],
      interaction_count: 6
    },
    {
      id: null,
      source: "2242a380e5bc603a411869a74b4eb09b",
      target: "9a2017e971915931e1d5b1e04bef9885",
      type: "财物纠纷",
      relation_detail: [
        "2025年3月26日争吵涉及货物抢夺及资金纠纷",
        "双方使用侮辱性语言并威胁对方"
      ],
      interaction_count: 28
    },
    {
      id: null,
      source: "eb5925371be58caaaca53e1bedcb6afe",
      target: "fda5a69cfbb7e2fd1e472791ba1615da",
      type: "供货关系",
      relation_detail: [
        "2025年3月22日讨论电子烟油杆供应事宜",
        "2025年3月23日确认发货数量及价格"
      ],
      interaction_count: 13
    },
    {
      id: null,
      source: "fda5a69cfbb7e2fd1e472791ba1615da",
      target: "2242a380e5bc603a411869a74b4eb09b",
      type: "批发关系",
      relation_detail: [
        "2025年3月25日商讨批发价格及数量",
        "2025年3月25日安排物流配送事宜"
      ],
      interaction_count: 22
    },
    {
      id: null,
      source: "2242a380e5bc603a411869a74b4eb09b",
      target: "eb5925371be58caaaca53e1bedcb6afe",
      type: "咨询关系",
      relation_detail: [
        "2025年3月21日咨询电子烟油杆规格参数",
        "2025年3月22日询问货源稳定性"
      ],
      interaction_count: 8
    },
    {
      id: null,
      source: "9a2017e971915931e1d5b1e04bef9885",
      target: "9c380b33883395b979817bfb020b2c0d",
      type: "投诉关系",
      relation_detail: [
        "2025年3月23日投诉魔叶产品质量问题",
        "2025年3月25日要求退款或换货"
      ],
      interaction_count: 4
    },
    {
      id: null,
      source: "eb5925371be58caaaca53e1bedcb6afe",
      target: "9c380b33883395b979817bfb020b2c0d",
      type: "竞争关系",
      relation_detail: [
        "2025年3月22日贬低魔叶产品质量",
        "2025年3月24日参与举报魔叶活动"
      ],
      interaction_count: 5
    }
  ]
};

export default function(mock: MockAdapter) {
  // 获取知识图谱数据
  mock.onGet('/api/knowledge-graph/data').reply(200, {
    code: 200,
    data: mockGraphData,
    message: '获取知识图谱数据成功'
  });
  
  // 获取知识图谱节点详情
  mock.onGet(new RegExp('/api/knowledge-graph/node/.*')).reply((config) => {
    const nodeId = config.url.split('/').pop();
    const node = mockGraphData.nodes.find(n => n.id === nodeId);
    
    if (node) {
      return [200, {
        code: 200,
        data: node,
        message: '获取节点详情成功'
      }];
    } else {
      return [404, {
        code: 404,
        data: null,
        message: '未找到节点信息'
      }];
    }
  });
  
  // 获取知识图谱边详情
  mock.onGet(new RegExp('/api/knowledge-graph/edge/.*')).reply((config) => {
    const params = new URLSearchParams(config.url.split('?')[1]);
    const source = params.get('source');
    const target = params.get('target');
    
    const edge = mockGraphData.edges.find(e => 
      e.source === source && e.target === target
    );
    
    if (edge) {
      return [200, {
        code: 200,
        data: edge,
        message: '获取关系详情成功'
      }];
    } else {
      return [404, {
        code: 404,
        data: null,
        message: '未找到关系信息'
      }];
    }
  });
  
  // 获取知识图谱统计信息
  mock.onGet('/api/knowledge-graph/stats').reply(200, {
    code: 200,
    data: {
      nodeCount: mockGraphData.nodes.length,
      edgeCount: mockGraphData.edges.length,
      nodeTypes: {
        "销售商": 2,
        "批发商": 1,
        "零售商": 1,
        "品牌": 1
      },
      edgeTypes: {
        "举报目标": 1,
        "财物纠纷": 1,
        "供货关系": 1,
        "批发关系": 1,
        "咨询关系": 1,
        "投诉关系": 1,
        "竞争关系": 1
      },
      riskLevels: {
        "高风险": 2,
        "中风险": 2,
        "低风险": 1
      }
    },
    message: '获取知识图谱统计信息成功'
  });
}