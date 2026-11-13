export const WARNING_CATEGORY_SWITCHES = ['驾驶安全', '作业安全', '设备异常', '位置预警'];
export const WARNING_TYPES = ['全部', '油位提醒', '高水温', '故障码', '离线设备', '长时间停机', '长时间怠速', '危险力矩', '蓄电池电压低', '超速', '长时间驻车'];
export const WARNING_SETTINGS = ['油位提醒', '高水温', '离线设备', '长时间停机', '长时间怠速', 'SOC过低', '危险力矩', '危险负载', '绝缘告警', '蓄电池电压低', '超速', '长时间驻车', '电机温度', '发动机转速', '主卷超载', '高液压油温', '故障码'];
export const WARNING_EVENTS = [
  { code: 'SY013NCC18558', type: '故障码', text: '过热', time: '2026-11-12 06:59:50' },
  { code: 'KT090AE22106', type: '故障码', text: '油门踏板1与油门踏板2的两倍的信号关系不可信', time: '2026-11-12 06:16:39' },
  { code: 'KT090AE22106', type: '故障码', text: '油门踏板1与油门踏板2的两倍的信号关系不可信', time: '2026-11-12 06:16:28' },
  { code: 'TH1056CB0495', type: '危险力矩', text: '力矩百分比大于90%，请关注。', time: '2026-11-11 20:24:58' },
];
export const SPEED_DEVICES = ['TNEST202607232146', 'HNGJ1241013005', 'HPGJ1241004180', 'HNGJ1241012842', 'HNGJ1241003685', 'HNGJ1241012718', 'HPGJ1041000683'];
export const BATTERY_DEVICES = ['AC0130CD0002', 'AC0160CC0541', 'KT090SE20279', 'KT090AE20124', 'KT105SE20770', 'KT090AE22106', 'HPZX2031002450'];

export interface ParameterConfig {
  devices: { code: string; name: string }[];
  prefix: string;
  suffix?: string;
  unit: string;
  initial: string;
  options: string[];
}
const craneDevices = ['TC4025CE0128', 'TC4060CF0501', 'TC4060CF0500', 'TC4025CE0123', 'TC4025CE0121', 'RC0090CF0612', 'TC4025CD0072'].map(code => ({ code, name: '汽车起重机' }));
export const PARAMETER_CONFIGS: Record<string, ParameterConfig> = {
  油位提醒: { devices: craneDevices, prefix: '燃油液位低于 ', unit: '%', initial: '5', options: ['5', '10'] },
  高水温: { devices: craneDevices, prefix: '冷却液温度高于 ', unit: '度', initial: '103', options: ['90', '95', '103'] },
  离线设备: { devices: craneDevices, prefix: '设备离线时间超过 ', unit: '小时', initial: '24', options: ['24', '48'] },
  长时间停机: { devices: craneDevices, prefix: '近 ', unit: '日', suffix: ' 未开机', initial: '3', options: ['3', '7'] },
  长时间怠速: {
    devices: [{ code: 'HSZX4541015671', name: '电动自卸车' }, { code: 'SY0758CC01278', name: '挖掘机' }, { code: 'SY0245CA53708', name: '挖掘机' }],
    prefix: '长时间怠速高于 ', unit: '分钟', initial: '10', options: ['5', '10'],
  },
  SOC过低: {
    devices: ['SW956E9CFB678', 'SW956E9CFB868', 'SW956E9CFD508', 'SW956ELCE0068', 'SW956ELCE0078', 'EV4601CD0172', 'EV4256CF0046'].map((code, index) => ({ code, name: index < 5 ? '电动装载机' : '纯电动牵引车' })),
    prefix: '电量低于 ', unit: '%', initial: '15', options: ['15'],
  },
  绝缘告警: { devices: ['EV4601CD0172', 'EV4256CF0046', 'EV4256CF0043', 'EV4256CF0040', 'EV4256CF0041'].map(code => ({ code, name: '纯电动牵引车' })), prefix: '高压绝缘阻值低于 ', unit: 'KΩ', initial: '200', options: ['200'] },
  危险负载: { devices: [], prefix: '', unit: '', initial: '', options: [] },
  危险力矩: { devices: [], prefix: '', unit: '', initial: '', options: [] },
  超速: { devices: SPEED_DEVICES.map(code => ({ code, name: '搅拌车' })), prefix: '设备车速高于 ', unit: 'km/h', initial: '60', options: ['30', '40', '60'] },
  蓄电池电压低: { devices: BATTERY_DEVICES.map((code, index) => ({ code, name: index < 2 ? '全路面起重机' : '矿用宽体自卸车' })), prefix: '蓄电池电压低于 ', unit: 'V', initial: '24', options: ['24'] },
};
