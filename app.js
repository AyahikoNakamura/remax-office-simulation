const presets = {
  current: { fee: 0, ownerSalary: 90, rent: 35, officeFee: 0, adCoopFee: 0, officeStaff: 25, otherExpense: 130, salesEmployeeSalary: 0, generalExpense: 70, salesRoyaltyRate: 0, ownerTransaction: 1200, targetProfit: 0 },
  phase300: { fee: 80, ownerSalary: 30, rent: 20, officeFee: 10, adCoopFee: 3, officeStaff: 0, otherExpense: 10, salesEmployeeSalary: 0, generalExpense: 0, salesRoyaltyRate: 6, ownerTransaction: 500, targetProfit: 300 },
  phase500: { fee: 80, ownerSalary: 50, rent: 20, officeFee: 10, adCoopFee: 3, officeStaff: 0, otherExpense: 10, salesEmployeeSalary: 0, generalExpense: 0, salesRoyaltyRate: 6, ownerTransaction: 0, targetProfit: 500 },
  phase1000: { fee: 80, ownerSalary: 80, rent: 20, officeFee: 10, adCoopFee: 3, officeStaff: 30, otherExpense: 30, salesEmployeeSalary: 0, generalExpense: 0, salesRoyaltyRate: 6, ownerTransaction: 500, targetProfit: 1000 },
  phase3000: { fee: 80, ownerSalary: 100, rent: 40, officeFee: 10, adCoopFee: 3, officeStaff: 60, otherExpense: 100, salesEmployeeSalary: 0, generalExpense: 0, salesRoyaltyRate: 6, ownerTransaction: 0, targetProfit: 3000 },
};

const phasePlans = {
  current: {
    label: "従来の不動産会社",
    copy: "従来型（歩合・固定費）の不動産会社の収益構造を確認するページです。RE/MAXモデルとの比較用。初期値は0から入力します。",
    fixedAnnual: 0,
    deskAnnual: 0,
    pdfRevenue: 0,
    pdfCommissionSales: 0,
    pdfPerAgent: 0,
  },
  phase300: {
    label: "利益300万円",
    copy: "新規独立・未経験の立ち上げモデル。まずは5名体制で黒字化と利益300万円を狙います。",
    fixedAnnual: 696,
    deskAnnual: 180,
    pdfRevenue: 1396,
    pdfCommissionSales: 1216,
    pdfPerAgent: 1582,
  },
  phase500: {
    label: "利益500万円",
    copy: "Ag中心で固定費を軽くしたモデル。少人数でも利益率を高く見せやすいフェーズです。",
    fixedAnnual: 216,
    deskAnnual: 180,
    pdfRevenue: 1184,
    pdfCommissionSales: 1004,
    pdfPerAgent: 2007,
  },
  phase1000: {
    label: "利益1,000万円",
    copy: "10名体制でオフィス経営が事業として見え始める成長期モデルです。",
    fixedAnnual: 1656,
    deskAnnual: 480,
    pdfRevenue: 4812,
    pdfCommissionSales: 4332,
    pdfPerAgent: 3906,
  },
  phase3000: {
    label: "利益3,000万円",
    copy: "15名以上の採用を前提に、採用力と生産性で大きな利益を狙う拡大期モデルです。",
    fixedAnnual: 1716,
    deskAnnual: 900,
    pdfRevenue: 12536,
    pdfCommissionSales: 11546,
    pdfPerAgent: 7130,
  },
};
// RE/MAX本部ロイヤリティ（売上対比・既定6%）。事業前提のロイヤリティ入力欄から同期され、
// 全てのRE/MAX計算（エージェント手数料控除・本部送金・粗利計算）に反映される。
let remaxRoyaltyRate = 6;
const headOfficeMonthlyFeeMan = 0.8;
const defaultAgentRanks = [
  { rank: "A", note: "宅建取引士のみ", monthlyFeeYen: 84000, licensedRate: 80, unlicensedRate: null, thresholdMan: 1500, bonusLicensedRate: 90, bonusUnlicensedRate: null },
  { rank: "B", note: "宅建取引士のみ", monthlyFeeYen: 64000, licensedRate: 70, unlicensedRate: null, thresholdMan: 1000, bonusLicensedRate: 80, bonusUnlicensedRate: null },
  { rank: "C", note: "標準ランク", monthlyFeeYen: 34000, licensedRate: 60, unlicensedRate: 50, thresholdMan: 500, bonusLicensedRate: 70, bonusUnlicensedRate: null },
  { rank: "D", note: "契約初年度のみ", monthlyFeeYen: 14000, licensedRate: 50, unlicensedRate: 40, thresholdMan: 300, bonusLicensedRate: 60, bonusUnlicensedRate: null },
];
const currentRankCompensationDefaults = [
  { rank: "固定給型", payType: "固定給＋低歩合", fixedSalaryYen: 250000, commissionRate: 10, bonusMonths: 0, welfareRate: 16 },
  { rank: "標準型", payType: "固定給＋標準歩合", fixedSalaryYen: 200000, commissionRate: 15, bonusMonths: 0, welfareRate: 16 },
  { rank: "歩合重視型", payType: "固定給＋高歩合", fixedSalaryYen: 180000, commissionRate: 30, bonusMonths: 0, welfareRate: 16 },
  { rank: "店長型", payType: "固定給＋賞与", fixedSalaryYen: 350000, commissionRate: 0, bonusMonths: 3, welfareRate: 16 },
];
const agentRankCommissionRates = { A: 80, B: 70, C: 60, D: 50 };
const agentRankOptions = Object.keys(agentRankCommissionRates);
const agentLicenseOptions = ["宅建士（専任）", "宅建士", "無"];
const phaseRankPlans = {
  current: [
    { count: 5, annualTransactionMan: 1300 },      // 一括査定型の主力：固定給型(25万/10%)5名・1人1,300万手数料
    { count: 0, annualTransactionMan: 0 },         // 標準型
    { count: 0, annualTransactionMan: 0 },         // 歩合重視型
    { count: 0, annualTransactionMan: 0 },         // 店長型
  ],
  phase300: [
    { count: 0, annualTransactionMan: 0 },
    { count: 0, annualTransactionMan: 0 },
    { count: 0, annualTransactionMan: 0 },
    { count: 0, annualTransactionMan: 0 },
  ],
  phase500: [
    { count: 0, annualTransactionMan: 0 },
    { count: 0, annualTransactionMan: 0 },
    { count: 5, annualTransactionMan: 869 },
    { count: 0, annualTransactionMan: 0 },
  ],
  phase1000: [
    { count: 2, annualTransactionMan: 1300 },
    { count: 3, annualTransactionMan: 900 },
    { count: 5, annualTransactionMan: 400 },
    { count: 3, annualTransactionMan: 56 },
  ],
  phase3000: [
    { count: 10, annualTransactionMan: 1500 },
    { count: 5, annualTransactionMan: 1000 },
    { count: 5, annualTransactionMan: 500 },
    { count: 5, annualTransactionMan: 88 },
  ],
};
const phaseQuickRankPlans = {
  phase300: [
    { count: 0, annualTransactionMan: 0 },
    { count: 0, annualTransactionMan: 0 },
    { count: 5, annualTransactionMan: 293 },
    { count: 0, annualTransactionMan: 0 },
  ],
};
const currentSalesPlanPresets = [
  { label: "固定給型", index: 0, count: 5, annualTransactionMan: 1300 },   // リード型・人数多め・中生産性
  { label: "標準型", index: 1, count: 4, annualTransactionMan: 1500 },     // 標準
  { label: "歩合重視型", index: 2, count: 3, annualTransactionMan: 1900 }, // 少数精鋭・高生産性
  { label: "店長型", index: 3, count: 3, annualTransactionMan: 1400 },     // 店長型・固定給高め・中生産性
];
// 経営タイプ × 報酬タイプ の実態スタッフィング（人数 × 1人あたり年間仲介手数料・万円）。
// 固定費は経営タイプで決まり、それに合う人数・手数料に調整。
// 一括査定型＝集客費が重く薄利／属人型＝集客費が軽く高利益、という対比になる。
const salesPlanByManagement = {
  ikkatsu: [
    { count: 5, annualTransactionMan: 1300 },  // 固定給＋低歩合（リード型の主役）
    { count: 4, annualTransactionMan: 1500 },  // 固定給＋標準歩合
    { count: 3, annualTransactionMan: 2100 },  // 固定給＋高歩合
    { count: 3, annualTransactionMan: 1800 },  // 固定給＋賞与（店長型）
  ],
  zokujin: [
    { count: 4, annualTransactionMan: 1000 },  // 固定給＋低歩合
    { count: 4, annualTransactionMan: 1000 },  // 固定給＋標準歩合
    { count: 3, annualTransactionMan: 1600 },  // 固定給＋高歩合（属人型の主役）
    { count: 2, annualTransactionMan: 1600 },  // 固定給＋賞与（店長型）
  ],
};
// 従来の不動産会社の2つの経営タイプ（事業前提＋社長手数料＋採用計画を一括適用）
const managementTypePresets = {
  ikkatsu: {
    label: "一括査定型", sub: "リード・仕組み依存",
    values: { ownerSalary: 90, rent: 35, officeFee: 0, adCoopFee: 0, officeStaff: 25, otherExpense: 130, generalExpense: 70, salesRoyaltyRate: 0, ownerTransaction: 1200, targetProfit: 0 },
    planIndex: 0, count: 4, perCommission: 1300,   // 固定給型(25万/10%)×4名
  },
  zokujin: {
    label: "属人型", sub: "人脈・紹介依存",
    values: { ownerSalary: 100, rent: 35, officeFee: 0, adCoopFee: 0, officeStaff: 25, otherExpense: 50, generalExpense: 70, salesRoyaltyRate: 0, ownerTransaction: 2000, targetProfit: 0 },
    planIndex: 2, count: 4, perCommission: 1700,   // 歩合重視型(18万/30%)×4名
  },
};
let activeManagementType = "ikkatsu";
let activeSalesPlanIndex = 0;   // タイプ別売上計画で選択中の報酬タイプ（ボタン強調用・既定=固定給型）
const defaultRankPlan = phaseRankPlans.phase300;
const agentRanks = defaultAgentRanks.map((rank) => ({ ...rank }));
const currentRankCompensations = currentRankCompensationDefaults.map((rank) => ({ ...rank }));
const rankPlan = defaultRankPlan.map((plan) => ({ ...plan }));

const ids = ["fee", "ownerSalary", "rent", "officeFee", "adCoopFee", "officeStaff", "otherExpense", "salesEmployeeSalary", "generalExpense", "salesRoyaltyRate", "ownerTransaction", "targetProfit"];
const inputs = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
let activePreset = "current";
const cloneRows = (rows) => rows.map((row) => ({ ...row }));
const createInitialPresetState = (name) => ({
  values: { ...(presets[name] || presets.phase300) },
  rankPlan: cloneRows(phaseRankPlans[name] || phaseRankPlans.phase300),
  agentRanks: cloneRows(defaultAgentRanks),
  currentRankCompensations: cloneRows(currentRankCompensationDefaults),
});
const presetStates = Object.fromEntries(Object.keys(presets).map((name) => [name, createInitialPresetState(name)]));
let actualSummaryState = null;
let activeActualPeriodKey = "last12";
let expenseSummaryState = null;
let agentRegistrySummaryState = null;
const actualSalesStorageKey = "remaxActualSalesRows";
const registeredAgentsStorageKey = "remaxRegisteredAgents";
const headOfficePaymentStorageKey = "remaxHeadOfficePaymentSettings";
const seminarModeStorageKey = "remaxSeminarMode";
let actualSalesRows = [];
let registeredAgents = [];
let headOfficePaymentSettings = null;
let accountingPdfState = {
  profitLoss: false,
  subAccounts: false,
  agentBilling: false,
  trendYears: new Set(),
};

const accountingYears = {
  2024: {
    label: "2024年",
    note: "月次損益計算書（年間推移）",
    profitLoss: {
      sales: 17816710,
      costOfSales: 11771267,
      grossProfit: 6045443,
      sellingGeneralAdmin: 6344860,
      operatingProfit: -299417,
      monthlyOperatingSum: -310417,
    },
    monthly: [
      { month: "2024年01月", sales: 390546, costOfSales: 430322, grossProfit: -39776, sellingGeneralAdmin: 554818, operatingProfit: -594594 },
      { month: "2024年02月", sales: 456092, costOfSales: 487723, grossProfit: -31631, sellingGeneralAdmin: 355872, operatingProfit: -387503 },
      { month: "2024年03月", sales: 2204669, costOfSales: 622059, grossProfit: 1582610, sellingGeneralAdmin: 519809, operatingProfit: 1062801 },
      { month: "2024年04月", sales: 1145428, costOfSales: 966341, grossProfit: 179087, sellingGeneralAdmin: 770084, operatingProfit: -590997 },
      { month: "2024年05月", sales: 990742, costOfSales: 965482, grossProfit: 25260, sellingGeneralAdmin: 613311, operatingProfit: -588051 },
      { month: "2024年06月", sales: 949729, costOfSales: 750110, grossProfit: 199619, sellingGeneralAdmin: 593381, operatingProfit: -393762 },
      { month: "2024年07月", sales: 3272646, costOfSales: 1374130, grossProfit: 1898516, sellingGeneralAdmin: 661609, operatingProfit: 1236907 },
      { month: "2024年08月", sales: 688458, costOfSales: 633528, grossProfit: 54930, sellingGeneralAdmin: 441414, operatingProfit: -386484 },
      { month: "2024年09月", sales: 1810165, costOfSales: 1991982, grossProfit: -181817, sellingGeneralAdmin: 636014, operatingProfit: -817831 },
      { month: "2024年10月", sales: 1372277, costOfSales: 835240, grossProfit: 537037, sellingGeneralAdmin: 406106, operatingProfit: 130931 },
      { month: "2024年11月", sales: 1946639, costOfSales: 1252358, grossProfit: 694281, sellingGeneralAdmin: 417183, operatingProfit: 277098 },
      { month: "2024年12月", sales: 2578319, costOfSales: 1461992, grossProfit: 1116327, sellingGeneralAdmin: 375259, operatingProfit: 741068 },
    ],
  },
  2025: {
    label: "2025年",
    note: "損益計算書・補助科目・AG請求表",
    profitLoss: {
      sales: 25649129,
      costOfSales: 12261167,
      grossProfit: 13387962,
      sellingGeneralAdmin: 14301909,
      operatingProfit: -913947,
      netProfit: -913947,
    },
    monthly: [
      { month: "2025年01月", sales: 1269640, costOfSales: 944729, grossProfit: 324911, sellingGeneralAdmin: 1036298, operatingProfit: -711387 },
      { month: "2025年02月", sales: 378911, costOfSales: 357157, grossProfit: 21754, sellingGeneralAdmin: 1038048, operatingProfit: -1016294 },
      { month: "2025年03月", sales: 1761093, costOfSales: 988476, grossProfit: 772617, sellingGeneralAdmin: 932694, operatingProfit: -160077 },
      { month: "2025年04月", sales: 1774459, costOfSales: 704733, grossProfit: 1069726, sellingGeneralAdmin: 1062651, operatingProfit: 7075 },
      { month: "2025年05月", sales: 1130321, costOfSales: 702830, grossProfit: 427491, sellingGeneralAdmin: 1036904, operatingProfit: -609413 },
      { month: "2025年06月", sales: 2438723, costOfSales: 1391113, grossProfit: 1047610, sellingGeneralAdmin: 1320207, operatingProfit: -272597 },
      { month: "2025年07月", sales: 2834819, costOfSales: 1600085, grossProfit: 1234734, sellingGeneralAdmin: 1293534, operatingProfit: -58800 },
      { month: "2025年08月", sales: 660183, costOfSales: 1042855, grossProfit: -382672, sellingGeneralAdmin: 1282327, operatingProfit: -1664999 },
      { month: "2025年09月", sales: 2059819, costOfSales: 1032943, grossProfit: 1026876, sellingGeneralAdmin: 1029026, operatingProfit: -2150 },
      { month: "2025年10月", sales: 3518111, costOfSales: 1714372, grossProfit: 1803739, sellingGeneralAdmin: 872595, operatingProfit: 931144 },
      { month: "2025年11月", sales: 2858092, costOfSales: 1574036, grossProfit: 1284056, sellingGeneralAdmin: 1120705, operatingProfit: 163351 },
      { month: "2025年12月", sales: 4964958, costOfSales: 207838, grossProfit: 4757120, sellingGeneralAdmin: 2276920, operatingProfit: 2480200 },
    ],
    revenueBreakdown: [
      { label: "エージェントフィー", amount: 2747646 },
      { label: "媒介報酬", amount: 21895142 },
      { label: "登録更新料", amount: 195000 },
      { label: "その他", amount: 321338 },
    ],
    remaxCostBreakdown: [
      { label: "RE/MAXコミッション", amount: 8789221 },
      { label: "RE/MAXエージェントフィー", amount: 705000 },
      { label: "RE/MAXブローカーフィー", amount: 680395 },
      { label: "RE/MAX広告協力金", amount: 180000 },
      { label: "RE/MAX重説・スタッフ手当", amount: 519277 },
    ],
    agentBilling: {
      feeTotal: 2882000,
      invoiceTotal: 3116226,
      agentMonths: 112,
      monthly: [
        { month: "2025年01月", fee: 246400, invoice: 258405 },
        { month: "2025年02月", fee: 246400, invoice: 264436 },
        { month: "2025年03月", fee: 246400, invoice: 249480 },
        { month: "2025年04月", fee: 246400, invoice: 256187 },
        { month: "2025年05月", fee: 234300, invoice: 276675 },
        { month: "2025年06月", fee: 256300, invoice: 283178 },
        { month: "2025年07月", fee: 278300, invoice: 323053 },
        { month: "2025年08月", fee: 278300, invoice: 322203 },
        { month: "2025年09月", fee: 212300, invoice: 223853 },
        { month: "2025年10月", fee: 212300, invoice: 223734 },
        { month: "2025年11月", fee: 212300, invoice: 219371 },
        { month: "2025年12月", fee: 212300, invoice: 215651 },
      ],
    },
  },
};
const accounting2025 = accountingYears[2025];

const agentBilling2025 = {
  note: "2025年エージェント請求表",
  startAgents: 10,
  endAgents: 9,
  agentMonths: 112,
  feeTotal: 2882000,
  invoiceTotal: 3116226,
  otherTotal: 234226,
  monthly: [
    { month: "2025年01月", agents: 10, ranks: { A: 1, B: 0, C: 3, D: 6 }, fee: 246400, other: 12005, invoice: 258405 },
    { month: "2025年02月", agents: 10, ranks: { A: 1, B: 0, C: 3, D: 6 }, fee: 246400, other: 18036, invoice: 264436 },
    { month: "2025年03月", agents: 10, ranks: { A: 1, B: 0, C: 3, D: 6 }, fee: 246400, other: 3080, invoice: 249480 },
    { month: "2025年04月", agents: 10, ranks: { A: 1, B: 0, C: 3, D: 6 }, fee: 246400, other: 9787, invoice: 256187 },
    { month: "2025年05月", agents: 9, ranks: { A: 1, B: 0, C: 3, D: 5 }, fee: 234300, other: 42375, invoice: 276675 },
    { month: "2025年06月", agents: 9, ranks: { A: 1, B: 0, C: 4, D: 4 }, fee: 256300, other: 26878, invoice: 283178 },
    { month: "2025年07月", agents: 9, ranks: { A: 1, B: 0, C: 5, D: 3 }, fee: 278300, other: 44753, invoice: 323053 },
    { month: "2025年08月", agents: 9, ranks: { A: 1, B: 0, C: 5, D: 3 }, fee: 278300, other: 43903, invoice: 322203 },
    { month: "2025年09月", agents: 9, ranks: { A: 0, B: 0, C: 5, D: 4 }, fee: 212300, other: 11553, invoice: 223853 },
    { month: "2025年10月", agents: 9, ranks: { A: 0, B: 0, C: 5, D: 4 }, fee: 212300, other: 11434, invoice: 223734 },
    { month: "2025年11月", agents: 9, ranks: { A: 0, B: 0, C: 5, D: 4 }, fee: 212300, other: 7071, invoice: 219371 },
    { month: "2025年12月", agents: 9, ranks: { A: 0, B: 0, C: 5, D: 4 }, fee: 212300, other: 3351, invoice: 215651 },
  ],
  agents: [
    { name: "杉田 美香", months: 12, rank: "D", fee: 145200, other: 613 },
    { name: "佐々木 貴美", months: 12, rank: "A/D", fee: 625200, other: 0 },
    { name: "藤森 匡紀", months: 12, rank: "C", fee: 409200, other: 40621 },
    { name: "ケンドール バラス", months: 12, rank: "D", fee: 145200, other: 5270 },
    { name: "保田 仁", months: 12, rank: "C", fee: 409200, other: 61248 },
    { name: "玉井 恭子", months: 12, rank: "C/D", fee: 299200, other: 16500 },
    { name: "青木 基博", months: 12, rank: "C/D", fee: 255200, other: 54723 },
    { name: "中村 邦広", months: 12, rank: "C", fee: 409200, other: 33000 },
    { name: "三浦 楓", months: 12, rank: "C", fee: 66000, other: 33000 },
    { name: "野原 仁美", months: 4, rank: "D", fee: 48400, other: 19286 },
  ],
};

const formatMan = (value) => `${Math.round(value).toLocaleString("ja-JP")}万円`;
const formatYen = (value) => `${Math.round(value).toLocaleString("ja-JP")}円`;
const formatPercent = (value) => value === null || Number.isNaN(value) ? "-" : `${value}%`;
const formatYenCompact = (value) => `${Math.round(value).toLocaleString("ja-JP")}円`;
const formatAnnualYen = (value) => `<span class="annual-amount">${Math.round(value).toLocaleString("ja-JP")}<small>円</small></span>`;
const formatAnnualNetYen = (value) => `<span class="annual-amount annual-amount--net">(${Math.round(value).toLocaleString("ja-JP")}<small>円</small>)</span>`;
const roundToOne = (value) => Math.round(value * 10) / 10;
const formatAgentEffectiveCommission = (value) => {
  const rate = Number(value);
  return Number.isFinite(rate) ? formatPercent(roundToOne(rate * (100 - remaxRoyaltyRate) / 100)) : "-";
};
const agentRateFields = new Set(["licensedRate", "unlicensedRate", "bonusLicensedRate", "bonusUnlicensedRate"]);
const effectiveAgentRate = (value) => {
  const rate = Number(value);
  return Number.isFinite(rate) ? roundToOne(rate * (100 - remaxRoyaltyRate) / 100) : value;
};
const baseAgentRateFromEffective = (value) => {
  const rate = Number(value);
  const netAfterRoyalty = 100 - remaxRoyaltyRate;
  return Number.isFinite(rate) && netAfterRoyalty > 0 ? roundToOne(rate / netAfterRoyalty * 100) : rate;
};
const formatCompact = (value) => Number(value).toLocaleString("ja-JP", {
  minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 1,
  maximumFractionDigits: 1,
});
const formatNumber = (value, digits = 1) => value.toLocaleString("ja-JP", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});
const normalizeNumericText = (value) => String(value ?? "")
  .replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
  .replace(/，/g, ",")
  .replace(/．/g, ".");
const parseFormattedNumber = (value) => Number(normalizeNumericText(value).replace(/,/g, "")) || 0;
const formatInputYen = (value) => Math.round(Number(value) || 0).toLocaleString("ja-JP");

function currentSalesFixedCostMan() {
  const total = currentRankCompensations.reduce((sum, rank, index) => {
    const plan = rankPlan[index] || { count: 0 };
    const fixedSalary = Math.max(0, Number(rank.fixedSalaryYen) || 0);
    const bonusMonthly = fixedSalary * Math.max(0, Number(rank.bonusMonths) || 0) / 12;
    const welfareRate = Math.max(0, Number(rank.welfareRate) || 0) / 100;
    return sum + (fixedSalary + bonusMonthly) * (1 + welfareRate) * (Math.max(0, Number(plan.count) || 0)) / 10000;
  }, 0);
  return roundToOne(total);
}

function ownerRoyaltyRate(values) {
  const rate = activePreset === "current" ? values.salesRoyaltyRate : remaxRoyaltyRate;
  return Math.min(100, Math.max(0, Number(rate) || 0));
}

function getValues() {
  const values = Object.fromEntries(ids.map((id) => [id, parseFormattedNumber(inputs[id].value)]));
  if (activePreset === "current") {
    values.salesEmployeeSalary = currentSalesFixedCostMan();
    inputs.salesEmployeeSalary.value = formatCompact(values.salesEmployeeSalary);
  }
  values.monthlyFixed = values.ownerSalary + values.rent + values.officeFee + values.adCoopFee + values.officeStaff + values.otherExpense + values.salesEmployeeSalary + values.generalExpense;
  // RE/MAXタブでは事業前提のロイヤリティ入力欄を本部ロイヤリティ(remaxRoyaltyRate)へ同期。
  // 従来タブは独自のロイヤリティ(values.salesRoyaltyRate)を使うため、既定6%に戻しておく。
  if (activePreset === "current") {
    remaxRoyaltyRate = 6;
  } else {
    const r = Number(values.salesRoyaltyRate);
    remaxRoyaltyRate = Number.isFinite(r) ? Math.min(100, Math.max(0, r)) : 6;
  }
  return values;
}

function officeTakeFromAgentRate(agentRate) {
  if (agentRate === null || Number.isNaN(agentRate)) return null;
  const netAfterRoyalty = 100 - remaxRoyaltyRate;
  return Math.max(0, netAfterRoyalty * (100 - agentRate) / 100);
}

function monthlyFeeMan(rank) {
  return rank.monthlyFeeYen / 10000;
}

function commissionRevenueForRank(rank, annualTransactionMan) {
  const agentRate = rank.licensedRate ?? rank.unlicensedRate;
  const officeTake = officeTakeFromAgentRate(agentRate) ?? 0;
  const bonusTake = officeTakeFromAgentRate(rank.bonusLicensedRate);

  if (bonusTake !== null && annualTransactionMan > rank.thresholdMan) {
    return (rank.thresholdMan * officeTake + (annualTransactionMan - rank.thresholdMan) * bonusTake) / 100;
  }

  return annualTransactionMan * officeTake / 100;
}

function agentIncomeForRank(rank, annualTransactionMan) {
  const netAfterRoyalty = 100 - remaxRoyaltyRate;
  const agentRate = rank.licensedRate ?? rank.unlicensedRate ?? 0;
  const bonusRate = rank.bonusLicensedRate;
  const annualFee = monthlyFeeMan(rank) * 12;
  let grossIncome;

  if (bonusRate !== null && annualTransactionMan > rank.thresholdMan) {
    grossIncome = (rank.thresholdMan * netAfterRoyalty * agentRate / 100 + (annualTransactionMan - rank.thresholdMan) * netAfterRoyalty * bonusRate / 100) / 100;
  } else {
    grossIncome = annualTransactionMan * netAfterRoyalty * agentRate / 10000;
  }

  return grossIncome - annualFee;
}

function distributeAdditionalCounts(additionalCount) {
  const baseTotal = rankPlan.reduce((sum, plan) => sum + plan.count, 0);
  if (additionalCount <= 0 || baseTotal <= 0) return rankPlan.map(() => 0);

  const rawAdds = rankPlan.map((plan, index) => {
    const raw = additionalCount * plan.count / baseTotal;
    return { index, floor: Math.floor(raw), remainder: raw - Math.floor(raw) };
  });
  let remaining = additionalCount - rawAdds.reduce((sum, item) => sum + item.floor, 0);
  rawAdds.sort((a, b) => b.remainder - a.remainder);
  rawAdds.forEach((item) => {
    if (remaining > 0) {
      item.floor += 1;
      remaining -= 1;
    }
  });
  return rawAdds.sort((a, b) => a.index - b.index).map((item) => item.floor);
}

function calcRankPlan(values) {
  const additionalCounts = distributeAdditionalCounts(Math.round(values.rankCountAdd || 0));
  const transactionMultiplier = values.rankTransactionMultiplier || 1;
  const rowRanks = activePreset === "current" ? currentRankCompensations : agentRanks;
  const override = values.rankPlanOverride;   // 年次シミュの昇格モデルから渡る per-rank 上書き
  const rows = rowRanks.map((rank, index) => {
    const ov = override && override[index];
    const plan = ov || rankPlan[index] || { count: 0, annualTransactionMan: 0 };
    const currentRank = currentRankCompensations[index] || {};
    const count = ov ? plan.count : plan.count + (additionalCounts[index] || 0);
    const annualTransactionMan = ov ? plan.annualTransactionMan : plan.annualTransactionMan * transactionMultiplier;
    if (activePreset === "current") {
      const officeRevenue = currentCompanyProfitForRank(currentRank, count, annualTransactionMan, ownerRoyaltyRate(values));
      const grossCommission = count * annualTransactionMan;
      return { rank: currentRank, index, count, annualTransactionMan, grossCommission, deskRevenue: 0, commissionRevenue: officeRevenue, officeRevenue };
    }
    const commissionRevenuePerAgent = commissionRevenueForRank(rank, annualTransactionMan);
    const deskRevenuePerAgent = Math.max(0, monthlyFeeMan(rank) - headOfficeMonthlyFeeMan) * 12;
    const officeRevenue = count * commissionRevenuePerAgent;
    const grossCommission = count * annualTransactionMan;
    const deskRevenue = count * deskRevenuePerAgent;

    return { rank, index, count, annualTransactionMan, grossCommission, deskRevenue, commissionRevenue: count * commissionRevenuePerAgent, officeRevenue };
  });

  const agents = rows.reduce((sum, row) => sum + row.count, 0);
  const grossCommission = rows.reduce((sum, row) => sum + row.grossCommission, 0);
  const commissionRevenue = rows.reduce((sum, row) => sum + row.commissionRevenue, 0);
  const deskRevenue = rows.reduce((sum, row) => sum + row.deskRevenue, 0);
  const averageOfficeTake = grossCommission > 0 ? roundToOne(commissionRevenue / grossCommission * 100) : 0;
  const averageMonthlyDeskFee = agents > 0 ? deskRevenue / agents / 12 : 0;

  return { rows, agents, grossCommission, commissionRevenue, deskRevenue, averageOfficeTake, averageMonthlyDeskFee };
}

function calc(values) {
  const plan = calcRankPlan(values);
  const usesRankPlan = plan.agents > 0;
  const agents = plan.agents;
  const agentGrossCommission = plan.grossCommission;
  const ownerRevenue = values.ownerTransaction * (100 - ownerRoyaltyRate(values)) / 100;
  const grossCommission = agentGrossCommission + values.ownerTransaction;
  const annualDeals = values.fee > 0 ? grossCommission / values.fee : 0;
  const agentCommissionRevenue = plan.commissionRevenue;
  const commissionRevenue = agentCommissionRevenue + ownerRevenue;
  const deskRevenue = plan.deskRevenue;
  const annualRevenue = commissionRevenue + deskRevenue;
  const annualCost = values.monthlyFixed * 12;
  const annualProfit = annualRevenue - annualCost;
  const margin = annualRevenue > 0 ? annualProfit / annualRevenue : 0;
  const officeRevenuePerDeal = annualDeals > 0 ? commissionRevenue / annualDeals : 0;
  const monthlyDeskRevenue = deskRevenue / 12;
  const breakEvenDeals = officeRevenuePerDeal > 0
    ? Math.max(0, ((values.monthlyFixed) - monthlyDeskRevenue) / officeRevenuePerDeal)
    : 0;

  return {
    agents,
    annualDeals,
    grossCommission,
    agentGrossCommission,
    ownerRevenue,
    agentCommissionRevenue,
    commissionRevenue,
    deskRevenue,
    annualRevenue,
    annualCost,
    annualProfit,
    margin,
    breakEvenDeals,
    rankPlan: usesRankPlan ? plan : null,
  };
}

/*
 * 年次シミュレーション（5年）― ランク昇格モデル
 * ============================================================================
 * 【設計の根拠：500/1000/3000万フェーズのランク分布を分析】
 *   各フェーズ＝オフィスの成熟段階。
 *     500万 :  全員C（5名）              … 草創期
 *     1000万: A2 / B3 / C5 / D3（13名）  … 成長期（ピラミッド型）
 *     3000万: A10/ B5 / C5 / D5（25名）  … 成熟期（A40%/B20%/C20%/D20%・A厚め）
 *   → 成長とともに「C中心 → A厚め」へシフトする。これを昇格で再現する。
 *
 * 【モデル】（agentRanks順 index: 0=A,1=B,2=C,3=D）
 *   - 採用 : 毎年 RECRUITS_PER_YEAR 名を D（契約初年度＝新人）で採用。
 *   - 昇格 : D→C（翌年・全員）、C→B（PROMOTE_C_TO_B）、B→A（PROMOTE_B_TO_A）。
 *            全員がAまで上がるのは非現実的なので、A は ATTRITION_A で離職。
 *   - 生産性: 一律%増ではなく、ランク別の代表手数料 RANK_FEE_MAN を使用。
 *            昇格すると手数料がそのランク水準へ上がる（D≈70/C≈600/B≈950/A≈1400万）。
 *   - 1年目は現状のまま（現rankPlanの人数・手数料）。2年目以降に昇格＋採用が効く。
 *   - 固定費は毎年 +5.5%（線形）。
 *
 * 【検証】1000万スタート(A2/B3/C5/D3)で回すと約4年でA10/B5/C5/D5≒3000万に到達し、
 *         「成長期→成熟期」のフェーズ移行を自動再現する。
 * ※ 下の定数（採用数・昇格率・離職率・ランク別手数料）はすべて調整可能。
 * ============================================================================
 */
const RECRUITS_PER_YEAR = 3;          // 毎年Dで新規採用する人数
const PROMOTE_C_TO_B = 0.6;           // C→B 年間昇格率
const PROMOTE_B_TO_A = 0.6;           // B→A 年間昇格率
const ATTRITION_A = 0.15;             // A 年間離職率
const RANK_FEE_MAN = [1400, 950, 600, 70];  // A/B/C/D の代表 年間仲介手数料/人（万円）

function projection(values) {
  const rows = [];
  let cumulative = 0;
  // 開始分布（agentRanks順: 0=A,1=B,2=C,3=D）。1年目は現状そのまま。
  let dist = [0, 1, 2, 3].map((i) => (rankPlan[i] || {}).count || 0);

  for (let year = 1; year <= 5; year += 1) {
    if (year > 1) {
      const [a, b, c, d] = dist;
      const cToB = c * PROMOTE_C_TO_B;
      const bToA = b * PROMOTE_B_TO_A;
      const aLeave = a * ATTRITION_A;
      dist = [
        a - aLeave + bToA,        // A：離職を引き、Bからの昇格を足す
        b - bToA + cToB,          // B
        c - cToB + d,             // C：前年のDは全員Cへ昇格
        RECRUITS_PER_YEAR,        // D：新規採用
      ];
    }
    // 1年目＝現状の人数・手数料／2年目以降＝昇格後の分布×ランク別代表手数料
    const override = (year === 1)
      ? [0, 1, 2, 3].map((i) => ({ count: dist[i], annualTransactionMan: (rankPlan[i] || {}).annualTransactionMan || RANK_FEE_MAN[i] }))
      : dist.map((count, i) => ({ count, annualTransactionMan: RANK_FEE_MAN[i] }));

    const yearValues = {
      ...values,
      ownerSalary: values.ownerSalary * (1 + (year - 1) * 0.055),
      rent: values.rent * (1 + (year - 1) * 0.055),
      officeFee: values.officeFee * (1 + (year - 1) * 0.055),
      adCoopFee: values.adCoopFee * (1 + (year - 1) * 0.055),
      officeStaff: values.officeStaff * (1 + (year - 1) * 0.055),
      otherExpense: values.otherExpense * (1 + (year - 1) * 0.055),
      salesEmployeeSalary: values.salesEmployeeSalary * (1 + (year - 1) * 0.055),
      generalExpense: values.generalExpense * (1 + (year - 1) * 0.055),
      monthlyFixed: values.monthlyFixed * (1 + (year - 1) * 0.055),
      rankPlanOverride: override,
    };
    const result = calc(yearValues);
    cumulative += result.annualProfit;
    rows.push({ year, values: yearValues, result, cumulative });
  }

  return rows;
}

function setAssumptionFieldState() {
  const isCurrent = activePreset === "current";
  const labels = {
    targetProfitLabel: isCurrent ? "比較したい営業利益" : "年間目標利益",
    goalTitle: isCurrent ? "現状と比較する利益" : "最初に決める目標",
    ownerSalaryLabel: isCurrent ? "社長給与" : "オーナー給与",
    officeFeeLabel: isCurrent ? "FC費用1" : "オフィスフィー",
    adCoopFeeLabel: isCurrent ? "FC費用2" : "広告協力金",
    officeStaffLabel: isCurrent ? "事務社員給与" : "スタッフ給与",
    otherExpenseLabel: isCurrent ? "広告宣伝費" : "その他経費",
    salesRoyaltyRateLabel: isCurrent ? "売上に対するロイヤリティ" : "RE/MAX本部ロイヤリティ",
  };

  Object.entries(labels).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  });

  const ownerLabels = {
    ownerDealTitle: isCurrent ? "社長の年間仲介手数料" : "オーナーの年間仲介手数料",
    ownerTransactionLabel: isCurrent ? "社長年間仲介手数料" : "オーナー年間仲介手数料",
    ownerRevenueLabel: isCurrent ? "社長粗利貢献" : "オーナー粗利貢献",
  };

  Object.entries(ownerLabels).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  });

  document.querySelectorAll(".current-assumption-field").forEach((field) => {
    field.hidden = !isCurrent;
  });
}

function setOutputs(values) {
  setAssumptionFieldState();
  document.getElementById("feeOut").value = values.fee;
  document.getElementById("ownerSalaryOut").value = values.ownerSalary;
  document.getElementById("rentOut").value = values.rent;
  document.getElementById("officeFeeOut").value = values.officeFee;
  document.getElementById("adCoopFeeOut").value = values.adCoopFee;
  document.getElementById("officeStaffOut").value = values.officeStaff;
  document.getElementById("otherExpenseOut").value = values.otherExpense;
  document.getElementById("salesEmployeeSalaryOut").value = formatCompact(values.salesEmployeeSalary);
  document.getElementById("generalExpenseOut").value = values.generalExpense;
  document.getElementById("salesRoyaltyRateOut").value = values.salesRoyaltyRate;
  document.getElementById("monthlyFixedTotal").textContent = formatMan(values.monthlyFixed);
  document.getElementById("annualFixedTotal").textContent = formatMan(values.monthlyFixed * 12);
  document.getElementById("ownerTransactionOut").value = values.ownerTransaction;
  document.getElementById("targetProfitOut").value = values.targetProfit;
}

function formatSignedMan(value) {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toLocaleString("ja-JP")}万円`;
}

function formatSignedYen(value) {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toLocaleString("ja-JP")}円`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const source = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index] || ""])));
}

function parseMoney(value) {
  const normalized = String(value || "")
    .replace(/[￥¥,\s]/g, "")
    .replace(/[()]/g, "")
    .trim();
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseReportMonth(value) {
  const match = String(value || "").match(/(\d{4})年\s*(\d{1,2})月/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    label: `${year}年${String(month).padStart(2, "0")}月`,
    year,
    month,
  };
}

function parseFlexibleMonth(value) {
  const text = String(value || "").trim();
  const japaneseMonth = parseReportMonth(text);
  if (japaneseMonth) return japaneseMonth;

  const match = text.match(/(\d{4})[/-](\d{1,2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    label: `${year}年${String(month).padStart(2, "0")}月`,
    year,
    month,
  };
}

function pickValue(row, keys) {
  const foundKey = keys.find((key) => row[key] !== undefined && String(row[key]).trim() !== "");
  return foundKey ? row[foundKey] : "";
}

function addMonths(month, amount) {
  const date = new Date(month.year, month.month - 1 + amount, 1);
  return {
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    label: `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月`,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

function monthRange(start, end) {
  const months = [];
  if (!start || !end) return months;

  let current = { ...start };
  while (current.key <= end.key) {
    months.push(current);
    current = addMonths(current, 1);
  }
  return months;
}

function normalizeActualRow(row) {
  const reportMonth = parseReportMonth(row["報告月"]);
  const agentCommission = ["貸主C(AG分)", "借主C(AG分)", "売主C(AG分)", "買主C(AG分)"]
    .reduce((sum, key) => sum + parseMoney(row[key]), 0);
  const paymentAmount = parseMoney(row["入金額"]);
  const headOfficePayment = paymentAmount * remaxRoyaltyRate / 100;
  const tradeType = row["取引態様"] || "未設定";
  const propertyType = row["種類"] || "未設定";

  return {
    id: row.id || "",
    officeName: row["オフィス名"] || "",
    agentName: row["AG名"] || "未設定",
    projectName: row["案件名"] || "",
    status: row["ステータス"] || "",
    reportMonth,
    paymentDate: row["入金予定日"] || "",
    tradeType,
    propertyType,
    tradeCategory: classifyTradeCategory(tradeType, propertyType),
    paymentAmount,
    transactionAmount: parseMoney(row["取引額"]),
    agentCommission,
    headOfficePayment,
    agentPayment: agentCommission,
    officeShare: paymentAmount - headOfficePayment - agentCommission,
    officeGrossProfit: paymentAmount - agentCommission,
  };
}

function createActualRowKey(row) {
  if (row.id) return `id:${row.id}`;
  const fallbackParts = [
    row.reportMonth?.key || "",
    normalizeAgentName(row.agentName),
    row.projectName,
    row.paymentDate,
    row.tradeType,
    row.propertyType,
    row.transactionAmount || row.paymentAmount,
  ];
  return `fallback:${fallbackParts.map((value) => String(value || "").trim()).join("|")}`;
}

function readActualSalesRows() {
  try {
    const parsed = JSON.parse(localStorage.getItem(actualSalesStorageKey) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((row) => row?.reportMonth?.key && row.agentName)
      : [];
  } catch {
    return [];
  }
}

function saveActualSalesRows() {
  localStorage.setItem(actualSalesStorageKey, JSON.stringify(actualSalesRows));
}

function renderActualCsvImportStatus(message = "") {
  const status = document.getElementById("actualCsvImportStatus");
  if (!status) return;
  if (!actualSalesRows.length && !message) {
    status.innerHTML = "";
    return;
  }
  const months = actualSalesRows.map((row) => row.reportMonth.key).sort();
  const firstMonth = months[0] || "-";
  const lastMonth = months.at(-1) || "-";
  const agentCount = new Set(actualSalesRows.map((row) => normalizeAgentName(row.agentName))).size;
  status.innerHTML = `
    ${message ? `<strong>${escapeHtml(message)}</strong><br />` : ""}
    読込済み: ${actualSalesRows.length.toLocaleString("ja-JP")}件 / ${firstMonth} - ${lastMonth} / ${agentCount.toLocaleString("ja-JP")}名
  `;
}

function mergeActualSalesRows(nextRows) {
  const rowMap = new Map(actualSalesRows.map((row) => [createActualRowKey(row), row]));
  let added = 0;
  let updated = 0;

  nextRows.forEach((row) => {
    const key = createActualRowKey(row);
    if (rowMap.has(key)) {
      updated += 1;
    } else {
      added += 1;
    }
    rowMap.set(key, row);
  });

  actualSalesRows = Array.from(rowMap.values())
    .sort((a, b) => a.reportMonth.key.localeCompare(b.reportMonth.key) || normalizeAgentName(a.agentName).localeCompare(normalizeAgentName(b.agentName), "ja"));
  saveActualSalesRows();
  return { added, updated, total: actualSalesRows.length };
}

function classifyTradeCategory(tradeType, propertyType) {
  const text = `${tradeType} ${propertyType}`;
  if (/賃貸|貸主|借主/.test(text)) return "賃貸";
  if (/売買|売主|買主|土地|戸建|マンション|区分|収益|媒介/.test(text)) return "売買";
  return "その他";
}

function emptyActualBucket(label = "") {
  return {
    label,
    count: 0,
    paymentAmount: 0,
    transactionAmount: 0,
    agentCommission: 0,
    headOfficePayment: 0,
    agentPayment: 0,
    officeShare: 0,
    officeGrossProfit: 0,
  };
}

function addActualToBucket(bucket, row) {
  bucket.count += 1;
  bucket.paymentAmount += row.paymentAmount;
  bucket.transactionAmount += row.transactionAmount;
  bucket.agentCommission += row.agentCommission;
  bucket.headOfficePayment += row.headOfficePayment;
  bucket.agentPayment += row.agentPayment;
  bucket.officeShare += row.officeShare;
  bucket.officeGrossProfit += row.officeGrossProfit;
}

function buildActualPeriod(key, label, rows, months, note = "") {
  const total = emptyActualBucket(label);
  const agentMap = new Map();
  const tradeMap = new Map();
  const categoryMap = new Map(["売買", "賃貸", "その他"].map((category) => [category, emptyActualBucket(category)]));
  const activeAgents = new Set();
  const monthMap = new Map(months.map((month) => [month.key, { month, ...emptyActualBucket(month.label) }]));

  rows.forEach((row) => {
    addActualToBucket(total, row);
    if (row.paymentAmount > 0) activeAgents.add(row.agentName);

    if (!monthMap.has(row.reportMonth.key)) {
      monthMap.set(row.reportMonth.key, { month: row.reportMonth, ...emptyActualBucket(row.reportMonth.label) });
    }
    addActualToBucket(monthMap.get(row.reportMonth.key), row);

    if (!agentMap.has(row.agentName)) agentMap.set(row.agentName, emptyActualBucket(row.agentName));
    addActualToBucket(agentMap.get(row.agentName), row);

    if (!tradeMap.has(row.tradeType)) tradeMap.set(row.tradeType, emptyActualBucket(row.tradeType));
    addActualToBucket(tradeMap.get(row.tradeType), row);
    if (!categoryMap.has(row.tradeCategory)) categoryMap.set(row.tradeCategory, emptyActualBucket(row.tradeCategory));
    addActualToBucket(categoryMap.get(row.tradeCategory), row);
  });

  const monthCount = Math.max(1, months.length);
  return {
    key,
    label,
    note,
    sourceRows: rows,
    ...total,
    monthCount,
    activeAgents: activeAgents.size,
    monthlyAverageOfficeGrossProfit: total.officeGrossProfit / monthCount,
    averageCommission: total.count > 0 ? total.paymentAmount / total.count : 0,
    officeGrossProfitPerAgent: activeAgents.size > 0 ? total.officeGrossProfit / activeAgents.size : 0,
    months: Array.from(monthMap.values()).sort((a, b) => a.month.key.localeCompare(b.month.key)),
    agents: Array.from(agentMap.values()).map((agent) => {
      const agentRows = rows.filter((row) => row.agentName === agent.label);
      const categoryCounts = agentRows.reduce((acc, row) => {
        acc[row.tradeCategory] = (acc[row.tradeCategory] || 0) + 1;
        return acc;
      }, {});
      return {
        ...agent,
        averageCommission: agent.count > 0 ? agent.paymentAmount / agent.count : 0,
        salesCount: categoryCounts["売買"] || 0,
        rentCount: categoryCounts["賃貸"] || 0,
        otherCount: categoryCounts["その他"] || 0,
      };
    }).sort((a, b) => b.paymentAmount - a.paymentAmount),
    tradeTypes: Array.from(tradeMap.values()).sort((a, b) => b.paymentAmount - a.paymentAmount),
    tradeCategories: Array.from(categoryMap.values()),
  };
}

function summarizeActuals(actualRows) {
  const datedRows = actualRows.filter((row) => row.reportMonth);
  const monthKeys = datedRows.map((row) => row.reportMonth.key).sort();
  const firstMonth = datedRows.find((row) => row.reportMonth?.key === monthKeys[0])?.reportMonth || null;
  const lastMonth = datedRows.find((row) => row.reportMonth?.key === monthKeys[monthKeys.length - 1])?.reportMonth || null;
  const last12Start = lastMonth ? addMonths(lastMonth, -11) : null;
  const allMonths = monthRange(firstMonth, lastMonth);
  const years = Array.from(new Set(datedRows.map((row) => row.reportMonth.year))).sort((a, b) => a - b);
  const periods = [
    buildActualPeriod("total", "全期間", datedRows, allMonths, firstMonth && lastMonth ? `${firstMonth.label} - ${lastMonth.label}` : ""),
    ...years.map((year) => {
      const yearRows = datedRows.filter((row) => row.reportMonth.year === year);
      const start = { key: `${year}-01`, label: `${year}年01月`, year, month: 1 };
      const end = { key: `${year}-12`, label: `${year}年12月`, year, month: 12 };
      return buildActualPeriod(String(year), `${year}年`, yearRows, monthRange(start, end), `${year}年01月 - ${year}年12月`);
    }),
    buildActualPeriod(
      "last12",
      "直近12か月",
      last12Start ? datedRows.filter((row) => row.reportMonth.key >= last12Start.key && row.reportMonth.key <= lastMonth.key) : [],
      last12Start ? monthRange(last12Start, lastMonth) : [],
      last12Start && lastMonth ? `${last12Start.label} - ${lastMonth.label}` : "",
    ),
  ];

  return {
    firstMonth,
    lastMonth,
    periods,
  };
}

function getActiveActualPeriod(summary) {
  if (!summary) return null;
  return summary.periods.find((period) => period.key === activeActualPeriodKey) || summary.periods.at(-1) || null;
}

function setActualPeriods(summary) {
  document.getElementById("actualPeriods").innerHTML = summary.periods
    .filter((period) => /^20\d{2}$/.test(period.key))
    .map((period) => `
      <button class="period-button ${period.key === activeActualPeriodKey ? "is-active" : ""}" data-actual-period="${period.key}" type="button">
        ${escapeHtml(period.label)}
      </button>
    `)
    .join("");
}

function setActualSummary(period) {
  if (!period) return;
  document.getElementById("actualSummary").innerHTML = `
    <article>
      <span>表示期間</span>
      <strong>${escapeHtml(period.label)}</strong>
      <small>${escapeHtml(period.note || "売上0月を含めて表示")}</small>
    </article>
    <article>
      <span>取引件数</span>
      <strong>${period.count.toLocaleString("ja-JP")}件</strong>
      <small>CSV 1行を1件として集計</small>
    </article>
    <article>
      <span>売上高</span>
      <strong>${formatYenCompact(period.paymentAmount)}</strong>
      <small>入金明細CSVベース</small>
    </article>
    <article>
      <span>平均仲介手数料</span>
      <strong>${formatYenCompact(period.averageCommission)}</strong>
      <small>売上CSV 入金額 ÷ 取引件数</small>
    </article>
    <article>
      <span>本部支払</span>
      <strong>${formatYenCompact(period.headOfficePayment)}</strong>
      <small>売上高 × ${remaxRoyaltyRate}%</small>
    </article>
    <article>
      <span>AG支払</span>
      <strong>${formatYenCompact(period.agentPayment)}</strong>
      <small>CSVのAG分合計</small>
    </article>
    <article>
      <span>オフィス取り分</span>
      <strong>${formatYenCompact(period.officeShare)}</strong>
      <small>売上高 - 本部支払 - AG支払</small>
    </article>
    <article>
      <span>月平均売上</span>
      <strong>${formatYenCompact(period.paymentAmount / period.monthCount)}</strong>
      <small>${period.monthCount}か月で平均</small>
    </article>
    <article>
      <span>稼働AG</span>
      <strong>${period.activeAgents.toLocaleString("ja-JP")}名</strong>
      <small>入金実績があるAG</small>
    </article>
    <article>
      <span>月平均件数</span>
      <strong>${formatNumber(period.count / period.monthCount, 1)}件</strong>
      <small>取引件数 ÷ ${period.monthCount}か月</small>
    </article>
  `;
}

function setDashboardSummary(period) {
  document.getElementById("dashboardSummary").textContent = `${period.label}は売上CSVベースで売上高${formatYenCompact(period.paymentAmount)}、本部支払${formatYenCompact(period.headOfficePayment)}、AG支払${formatYenCompact(period.agentPayment)}、オフィス取り分${formatYenCompact(period.officeShare)}です。`;
}

function setSalesAnalysis(period) {
  const salesCount = period.tradeCategories.find((item) => item.label === "売買")?.count || 0;
  const rentCount = period.tradeCategories.find((item) => item.label === "賃貸")?.count || 0;
  const salesAmount = period.tradeCategories.find((item) => item.label === "売買")?.paymentAmount || 0;
  const rentAmount = period.tradeCategories.find((item) => item.label === "賃貸")?.paymentAmount || 0;

  document.getElementById("salesSummary").innerHTML = `
    <article><span>売上高</span><strong>${formatYenCompact(period.paymentAmount)}</strong><small>入金額合計</small></article>
    <article><span>取引件数</span><strong>${period.count.toLocaleString("ja-JP")}件</strong><small>CSV 1行 = 1件</small></article>
    <article><span>平均仲介手数料</span><strong>${formatYenCompact(period.averageCommission)}</strong><small>売上高 ÷ 取引件数</small></article>
    <article><span>売買 / 賃貸</span><strong>${salesCount.toLocaleString("ja-JP")}件 / ${rentCount.toLocaleString("ja-JP")}件</strong><small>${formatYenCompact(salesAmount)} / ${formatYenCompact(rentAmount)}</small></article>
  `;

  document.getElementById("salesTradeRows").innerHTML = period.tradeCategories
    .map((row) => `
      <tr>
        <td>${escapeHtml(row.label)}</td>
        <td>${row.count.toLocaleString("ja-JP")}件</td>
        <td>${formatYenCompact(row.paymentAmount)}</td>
        <td>${formatYenCompact(row.count > 0 ? row.paymentAmount / row.count : 0)}</td>
      </tr>
    `)
    .join("");
}

function setProfitAnalysis() {
  const pl = accounting2025.profitLoss;
  const grossRate = roundToOne((pl.grossProfit / pl.sales) * 100);
  const sgaRate = roundToOne((pl.sellingGeneralAdmin / pl.sales) * 100);
  const operatingRate = roundToOne((pl.operatingProfit / pl.sales) * 100);
  const positiveMonths = accounting2025.monthly.filter((month) => month.operatingProfit > 0);
  const worstMonth = accounting2025.monthly.reduce((worst, month) => month.operatingProfit < worst.operatingProfit ? month : worst, accounting2025.monthly[0]);
  const bestMonth = accounting2025.monthly.reduce((best, month) => month.operatingProfit > best.operatingProfit ? month : best, accounting2025.monthly[0]);

  document.getElementById("profitSummary").innerHTML = `
    <article><span>売上高</span><strong>${formatYenCompact(pl.sales)}</strong><small>2025年 損益計算書</small></article>
    <article><span>売上総利益</span><strong>${formatYenCompact(pl.grossProfit)}</strong><small>粗利率 ${formatPercent(grossRate)}</small></article>
    <article><span>販管費</span><strong>${formatYenCompact(pl.sellingGeneralAdmin)}</strong><small>販管費率 ${formatPercent(sgaRate)}</small></article>
    <article class="actual-bridge-negative"><span>営業利益</span><strong>${formatSignedYen(pl.operatingProfit)}</strong><small>営業利益率 ${formatPercent(operatingRate)}</small></article>
    <article><span>黒字月</span><strong>${positiveMonths.length}か月</strong><small>${positiveMonths.map((month) => month.month.replace("2025年", "")).join(" / ")}</small></article>
    <article><span>最大黒字月</span><strong>${bestMonth.month.replace("2025年", "")}</strong><small>${formatSignedYen(bestMonth.operatingProfit)}</small></article>
    <article><span>最大赤字月</span><strong>${worstMonth.month.replace("2025年", "")}</strong><small>${formatSignedYen(worstMonth.operatingProfit)}</small></article>
    <article><span>損益分岐まで</span><strong>${formatYenCompact(Math.abs(pl.operatingProfit))}</strong><small>年間営業利益を0にする不足額</small></article>
  `;

  const statementRows = [
    ["売上高", pl.sales, 100],
    ["売上原価", -pl.costOfSales, roundToOne((pl.costOfSales / pl.sales) * 100)],
    ["売上総利益", pl.grossProfit, grossRate],
    ["販管費", -pl.sellingGeneralAdmin, sgaRate],
    ["営業利益", pl.operatingProfit, operatingRate],
    ["経常利益", pl.operatingProfit, operatingRate],
    ["当期純利益", pl.netProfit, operatingRate],
  ];
  document.getElementById("profitStatementRows").innerHTML = statementRows
    .map(([label, amount, rate]) => `
      <tr class="${amount < 0 ? "is-negative-row" : ""}">
        <td>${label}</td>
        <td>${amount < 0 ? formatSignedYen(amount) : formatYenCompact(amount)}</td>
        <td>${formatPercent(rate)}</td>
      </tr>
    `)
    .join("");

  const revenueItems = accounting2025.revenueBreakdown.map((item) => `${item.label}: ${formatYenCompact(item.amount)}`).join(" / ");
  const costItems = accounting2025.remaxCostBreakdown.map((item) => `${item.label}: ${formatYenCompact(item.amount)}`).join(" / ");
  document.getElementById("profitBreakdown").innerHTML = `
    <article><strong>売上高の内訳</strong><span>${revenueItems}</span></article>
    <article><strong>売上原価の内訳</strong><span>${costItems}</span></article>
    <article><strong>支払手数料の内訳</strong><span>ビッグ情報システム使用 1,200,000円 / 施錠システム 402,000円 / 動画関係 360,000円 / Slack 87,368円 ほか</span></article>
  `;

  document.getElementById("monthlyActualRows").innerHTML = accounting2025.monthly
    .map((row) => `
      <tr class="${row.operatingProfit >= 0 ? "is-positive-row" : "is-negative-row"}">
        <td>${row.month}</td>
        <td>${formatYenCompact(row.sales)}</td>
        <td>${formatYenCompact(row.grossProfit)}</td>
        <td>${formatYenCompact(row.sellingGeneralAdmin)}</td>
        <td>${formatSignedYen(row.operatingProfit)}</td>
      </tr>
    `)
    .join("");
}

function normalizeAgentName(name) {
  return String(name || "").replace(/\s+/g, "");
}

function setAgentAnalysis(period) {
  const billing = agentBilling2025;
  const averageAgents = billing.agentMonths / billing.monthly.length;

  document.getElementById("agentSummary").innerHTML = `
    <article><span>期首AG数</span><strong>${billing.startAgents}名</strong><small>2025年1月</small></article>
    <article><span>期末AG数</span><strong>${billing.endAgents}名</strong><small>2025年12月</small></article>
    <article><span>平均AG数</span><strong>${formatNumber(averageAgents, 1)}名</strong><small>AG人月 ÷ 12</small></article>
    <article><span>AG人月</span><strong>${billing.agentMonths}人月</strong><small>請求表ベース</small></article>
    <article><span>フィー合計</span><strong>${formatYenCompact(billing.feeTotal)}</strong><small>基本フィー請求</small></article>
    <article><span>フィー以外</span><strong>${formatYenCompact(billing.otherTotal)}</strong><small>更新料・登記情報利用料など</small></article>
    <article><span>請求額合計</span><strong>${formatYenCompact(billing.invoiceTotal)}</strong><small>フィー + フィー以外</small></article>
    <article><span>月平均請求額</span><strong>${formatYenCompact(billing.invoiceTotal / 12)}</strong><small>請求額合計 ÷ 12</small></article>
  `;

  document.getElementById("agentMonthlyRows").innerHTML = billing.monthly
    .map((row) => `
      <tr>
        <td>${row.month}</td>
        <td>${row.agents}名</td>
        <td>A${row.ranks.A || 0} / B${row.ranks.B || 0} / C${row.ranks.C || 0} / D${row.ranks.D || 0}</td>
        <td>${formatYenCompact(row.invoice)}</td>
      </tr>
    `)
    .join("");

  document.getElementById("agentDetailRows").innerHTML = billing.agents
    .map((agent) => {
      const sales = period.agents.find((row) => normalizeAgentName(row.label) === normalizeAgentName(agent.name));
      const personMonthGross = sales && agent.months > 0 ? sales.officeGrossProfit / agent.months : 0;
      return `
        <tr>
          <td>${escapeHtml(agent.name)}</td>
          <td>${agent.months}か月 / ${escapeHtml(agent.rank)}</td>
          <td>${formatYenCompact(agent.fee)}<small>他 ${formatYenCompact(agent.other)}</small></td>
          <td>${sales ? formatYenCompact(sales.paymentAmount) : "-"}<small>${sales ? `${sales.count.toLocaleString("ja-JP")}件` : ""}</small></td>
          <td>${sales ? formatYenCompact(personMonthGross) : "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function setYearComparison(summary) {
  const rows = summary.periods
    .filter((period) => /^20\d{2}$/.test(period.key))
    .map((period) => {
      const year = Number(period.key);
      const accounting = accountingYears[year]?.profitLoss || null;
      const agentMonths = year === 2025 ? `${agentBilling2025.agentMonths}人月` : "未取込";
      const periodLabel = year === new Date().getFullYear() ? `${period.note} 累計` : period.note;
      return `
        <tr>
          <td>${period.label}</td>
          <td>${escapeHtml(periodLabel)}</td>
          <td>${formatYenCompact(period.paymentAmount)}</td>
          <td>${period.count.toLocaleString("ja-JP")}件</td>
          <td>${formatYenCompact(period.averageCommission)}</td>
          <td>${accounting ? formatYenCompact(accounting.grossProfit) : "未取込"}</td>
          <td>${accounting ? formatYenCompact(accounting.sellingGeneralAdmin) : "未取込"}</td>
          <td class="${accounting && accounting.operatingProfit < 0 ? "is-negative" : "is-positive"}">${accounting ? formatSignedYen(accounting.operatingProfit) : "未取込"}</td>
          <td>${agentMonths}</td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("yearComparisonRows").innerHTML = rows;
}

function renderActualAnnualSalesTable(period) {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const rows = period.sourceRows || [];
  const agentNames = period.agents.map((agent) => agent.label);
  const amountFields = [
    { key: "paymentAmount", label: "売上高" },
    { key: "headOfficePayment", label: "本部支払" },
    { key: "agentPayment", label: "AG支払" },
    { key: "officeShare", label: "オフィス取り分" },
  ];

  const cellFor = (agentName, month, field) => {
    const monthRows = rows.filter((row) => row.agentName === agentName && row.reportMonth?.month === month);
    if (!monthRows.length) return "";
    const amount = monthRows.reduce((sum, row) => sum + (row[field] || 0), 0);
    if (field === "salesCount") return `${monthRows.filter((row) => row.tradeCategory === "売買").length.toLocaleString("ja-JP")}件`;
    if (field === "rentCount") return `${monthRows.filter((row) => row.tradeCategory === "賃貸").length.toLocaleString("ja-JP")}件`;
    return formatYenCompact(amount);
  };

  const annualFor = (agentName, field) => {
    const agentRows = rows.filter((row) => row.agentName === agentName);
    const amount = agentRows.reduce((sum, row) => sum + (row[field] || 0), 0);
    if (field === "salesCount") return `${agentRows.filter((row) => row.tradeCategory === "売買").length.toLocaleString("ja-JP")}件`;
    if (field === "rentCount") return `${agentRows.filter((row) => row.tradeCategory === "賃貸").length.toLocaleString("ja-JP")}件`;
    return formatYenCompact(amount);
  };

  const agentRows = agentNames.length ? agentNames.map((agentName) => `
    <tr class="agent-annual-block-start">
      <td class="agent-annual-name" rowspan="6">
        <strong>${escapeHtml(agentName)}</strong>
        <small>年間売上 ${annualFor(agentName, "paymentAmount")}</small>
        <small>オフィス取り分 ${annualFor(agentName, "officeShare")}</small>
        <small>売買 ${annualFor(agentName, "salesCount")} / 賃貸 ${annualFor(agentName, "rentCount")}</small>
      </td>
      <td class="agent-annual-kind">${amountFields[0].label}</td>
      ${months.map((month) => `<td>${cellFor(agentName, month, amountFields[0].key)}</td>`).join("")}
      <td>${annualFor(agentName, amountFields[0].key)}</td>
    </tr>
    ${amountFields.slice(1).map((field) => `
      <tr>
        <td class="agent-annual-kind">${field.label}</td>
        ${months.map((month) => `<td>${cellFor(agentName, month, field.key)}</td>`).join("")}
        <td>${annualFor(agentName, field.key)}</td>
      </tr>
    `).join("")}
    <tr>
      <td class="agent-annual-kind">売買件数</td>
      ${months.map((month) => `<td>${cellFor(agentName, month, "salesCount")}</td>`).join("")}
      <td>${annualFor(agentName, "salesCount")}</td>
    </tr>
    <tr>
      <td class="agent-annual-kind">賃貸件数</td>
      ${months.map((month) => `<td>${cellFor(agentName, month, "rentCount")}</td>`).join("")}
      <td>${annualFor(agentName, "rentCount")}</td>
    </tr>
  `).join("") : `
    <tr class="is-zero-row">
      <td colspan="15">この年度の売上データはありません。</td>
    </tr>
  `;

  const totalRows = agentNames.length ? `
    <tr class="agent-annual-total-row">
      <td rowspan="7"><strong>${escapeHtml(period.label)} 合計</strong></td>
      <td class="agent-annual-kind">${amountFields[0].label}</td>
      ${months.map((month) => formatActualSalesTotalCell(rows, month, amountFields[0].key)).join("")}
      <td>${formatYenCompact(period[amountFields[0].key])}</td>
    </tr>
    ${amountFields.slice(1).map((field) => `
      <tr class="agent-annual-total-row">
        <td class="agent-annual-kind">${field.label}</td>
        ${months.map((month) => formatActualSalesTotalCell(rows, month, field.key)).join("")}
        <td>${formatYenCompact(period[field.key])}</td>
      </tr>
    `).join("")}
    <tr class="agent-annual-total-row">
      <td class="agent-annual-kind">売買件数</td>
      ${months.map((month) => `<td>${countActualSalesRows(rows, month, "売買").toLocaleString("ja-JP")}件</td>`).join("")}
      <td>${rows.filter((row) => row.tradeCategory === "売買").length.toLocaleString("ja-JP")}件</td>
    </tr>
    <tr class="agent-annual-total-row">
      <td class="agent-annual-kind">賃貸件数</td>
      ${months.map((month) => `<td>${countActualSalesRows(rows, month, "賃貸").toLocaleString("ja-JP")}件</td>`).join("")}
      <td>${rows.filter((row) => row.tradeCategory === "賃貸").length.toLocaleString("ja-JP")}件</td>
    </tr>
    <tr class="agent-annual-total-row agent-annual-grand-total-row">
      <td class="agent-annual-kind">平均</td>
      ${months.map((month) => {
        const monthRows = rows.filter((row) => row.reportMonth?.month === month);
        const amount = monthRows.reduce((sum, row) => sum + row.paymentAmount, 0);
        return `<td>${monthRows.length ? formatYenCompact(amount / monthRows.length) : ""}</td>`;
      }).join("")}
      <td>${formatYenCompact(period.averageCommission)}</td>
    </tr>
  ` : "";

  document.getElementById("actualAnnualSalesRows").innerHTML = agentRows + totalRows;
}

function formatActualSalesTotalCell(rows, month, field) {
  const amount = rows
    .filter((row) => row.reportMonth?.month === month)
    .reduce((sum, row) => sum + (row[field] || 0), 0);
  return `<td>${formatYenCompact(amount)}</td>`;
}

function countActualSalesRows(rows, month, tradeCategory) {
  return rows.filter((row) => row.reportMonth?.month === month && row.tradeCategory === tradeCategory).length;
}

function setSimulationAssumptions(period) {
  if (!document.getElementById("simulationAssumptions") || !document.getElementById("actualBridge")) return;
  const values = getValues();
  const result = calc(values);
  const pl = accounting2025.profitLoss;
  const monthlyAccountingGross = pl.grossProfit / 12;
  const monthlySga = pl.sellingGeneralAdmin / 12;
  const grossPerAgentMonth = pl.grossProfit / agentBilling2025.agentMonths;
  const breakEvenAgentMonths = grossPerAgentMonth > 0 ? monthlySga / grossPerAgentMonth : 0;
  const planMonthlyGross = result.annualRevenue * 10000 / 12;
  const planGap = monthlyAccountingGross - planMonthlyGross;

  document.getElementById("simulationAssumptions").innerHTML = [
    ["月平均売上高", formatYenCompact(pl.sales / 12), "2025年", "高"],
    ["月平均会計粗利", formatYenCompact(monthlyAccountingGross), "2025年", "高"],
    ["月平均販管費", formatYenCompact(monthlySga), "2025年", "高"],
    ["月平均営業利益", formatSignedYen(pl.operatingProfit / 12), "2025年", "高"],
    ["AG1人月あたり会計粗利", formatYenCompact(grossPerAgentMonth), "2025年", "中"],
    ["損益分岐に必要なAG人月", `${formatNumber(breakEvenAgentMonths, 1)}人月/月`, "2025年", "中"],
  ].map(([label, value, source, confidence]) => `
    <tr>
      <td>${label}</td>
      <td>${value}</td>
      <td>${source}</td>
      <td>${confidence}</td>
    </tr>
  `).join("");

  document.getElementById("actualBridge").innerHTML = `
    <article>
      <span>現在設定の月平均粗利</span>
      <strong>${formatYenCompact(planMonthlyGross)}</strong>
      <small>シミュレーション設定から計算</small>
    </article>
    <article>
      <span>2025年 月平均会計粗利</span>
      <strong>${formatYenCompact(monthlyAccountingGross)}</strong>
      <small>売上総利益 ÷ 12</small>
    </article>
    <article class="${planGap >= 0 ? "actual-bridge-positive" : "actual-bridge-negative"}">
      <span>実績との差</span>
      <strong>${formatSignedYen(planGap)}</strong>
      <small>実績月平均粗利 - 現在設定</small>
    </article>
    <article>
      <span>損益分岐の月粗利</span>
      <strong>${formatYenCompact(monthlySga)}</strong>
      <small>月平均販管費と同額</small>
    </article>
  `;
}

function setSourceStatus() {
  const sourceStatus = document.getElementById("sourceStatus");
  if (!sourceStatus) return;
  const years = [
    { year: 2024, sales: actualSummaryState?.periods.some((period) => period.key === "2024"), accounting: accountingPdfState.trendYears.has(2024), sub: false, agent: false, period: "通期/資料次第" },
    { year: 2025, sales: actualSummaryState?.periods.some((period) => period.key === "2025"), accounting: accountingPdfState.profitLoss || accountingPdfState.trendYears.has(2025), sub: accountingPdfState.subAccounts, agent: accountingPdfState.agentBilling || agentRegistrySummaryState, period: "通期" },
    { year: 2026, sales: actualSummaryState?.periods.some((period) => period.key === "2026"), accounting: accountingPdfState.trendYears.has(2026), sub: false, agent: agentRegistrySummaryState?.fromPdf, period: "累計" },
  ];

  const status = (value) => value ? "あり" : "未取込";
  sourceStatus.innerHTML = `
    <div class="table-wrap">
      <table class="actual-table actual-table--compact">
        <thead>
          <tr><th>年度</th><th>売上CSV</th><th>損益</th><th>補助科目</th><th>AG資料</th><th>対象期間</th></tr>
        </thead>
        <tbody>
          ${years.map((row) => `
            <tr>
              <td>${row.year}年</td>
              <td>${status(row.sales)}</td>
              <td>${status(row.accounting)}</td>
              <td>${status(row.sub)}</td>
              <td>${status(row.agent)}</td>
              <td>${row.period}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setActualBridge(summary) {
  const period = getActiveActualPeriod(summary);
  if (!period) return;
  const values = getValues();
  const result = calc(values);
  const planAnnualOfficeGrossProfitYen = result.annualRevenue * 10000;
  const planMonthlyOfficeGrossProfitYen = planAnnualOfficeGrossProfitYen / 12;
  const planPeriodOfficeGrossProfitYen = planMonthlyOfficeGrossProfitYen * period.monthCount;
  const actualPeriodOfficeGrossProfitYen = period.officeGrossProfit;
  const actualMonthlyOfficeGrossProfitYen = period.monthlyAverageOfficeGrossProfit;
  const gapYen = actualPeriodOfficeGrossProfitYen - planPeriodOfficeGrossProfitYen;
  const planRatio = planPeriodOfficeGrossProfitYen > 0 ? actualPeriodOfficeGrossProfitYen / planPeriodOfficeGrossProfitYen * 100 : 0;
  const fixedCostYen = values.monthlyFixed * period.monthCount * 10000;
  const actualProfitAfterFixedYen = actualPeriodOfficeGrossProfitYen - fixedCostYen;

  document.getElementById("actualBridge").innerHTML = `
    <article>
      <span>現在プランの期間換算粗利</span>
      <strong>${formatYenCompact(planPeriodOfficeGrossProfitYen)}</strong>
      <small>月平均プラン粗利 × ${period.monthCount}か月</small>
    </article>
    <article>
      <span>${escapeHtml(period.label)}実績粗利</span>
      <strong>${formatYenCompact(actualPeriodOfficeGrossProfitYen)}</strong>
      <small>${escapeHtml(period.note)}</small>
    </article>
    <article class="${gapYen >= 0 ? "actual-bridge-positive" : "actual-bridge-negative"}">
      <span>実績との差額</span>
      <strong>${formatSignedYen(gapYen)}</strong>
      <small>実績粗利 - 期間換算プラン粗利</small>
    </article>
    <article>
      <span>実績の達成率</span>
      <strong>${formatNumber(planRatio, 1)}%</strong>
      <small>実績粗利 ÷ 期間換算プラン粗利</small>
    </article>
    <article>
      <span>プラン月平均粗利</span>
      <strong>${formatYenCompact(planMonthlyOfficeGrossProfitYen)}</strong>
      <small>現在プラン ÷ 12</small>
    </article>
    <article>
      <span>実績月平均粗利</span>
      <strong>${formatYenCompact(actualMonthlyOfficeGrossProfitYen)}</strong>
      <small>${period.monthCount}か月で平均</small>
    </article>
    <article>
      <span>実績ベース営業利益</span>
      <strong>${formatYenCompact(actualProfitAfterFixedYen)}</strong>
      <small>実績粗利 - 現在の期間換算固定費</small>
    </article>
    <article>
      <span>固定費差引後の月平均</span>
      <strong>${formatYenCompact(actualProfitAfterFixedYen / period.monthCount)}</strong>
      <small>実績ベース営業利益 ÷ ${period.monthCount}か月</small>
    </article>
  `;
}

function getActualPeriodByYear(year) {
  return actualSummaryState?.periods.find((period) => period.key === String(year)) || null;
}

function getVisibleAccountingYears(hasAccounting) {
  const selectedTrendYears = Array.from(accountingPdfState.trendYears);
  if (!selectedTrendYears.length && hasAccounting) return [2025];

  return Object.keys(accountingYears)
    .map(Number)
    .filter((year) => selectedTrendYears.includes(year) || (year === 2025 && hasAccounting))
    .sort((a, b) => a - b);
}

function renderAccountingYearComparison(hasAccounting) {
  const years = getVisibleAccountingYears(hasAccounting);
  if (!years.length) return "";

  const rows = years.map((year) => {
    const data = accountingYears[year];
    const pl = data.profitLoss;
    const actualPeriod = getActualPeriodByYear(year);
    const csvGross = actualPeriod?.officeGrossProfit ?? null;
    const grossGap = csvGross === null ? null : pl.grossProfit - csvGross;
    const positiveMonths = data.monthly.filter((month) => month.operatingProfit > 0).length;
    const operatingMargin = pl.sales ? roundToOne((pl.operatingProfit / pl.sales) * 100) : null;

    return `
      <tr>
        <td>
          <strong>${data.label}</strong>
          <small>${escapeHtml(data.note)}</small>
        </td>
        <td>${formatYenCompact(pl.sales)}</td>
        <td>${formatYenCompact(pl.grossProfit)}</td>
        <td>${csvGross === null ? "-" : formatYenCompact(csvGross)}</td>
        <td class="${grossGap === null || grossGap >= 0 ? "is-positive" : "is-negative"}">${grossGap === null ? "-" : formatSignedYen(grossGap)}</td>
        <td>${formatYenCompact(pl.sellingGeneralAdmin)}</td>
        <td class="${pl.operatingProfit >= 0 ? "is-positive" : "is-negative"}">${formatSignedYen(pl.operatingProfit)}</td>
        <td>${positiveMonths} / ${data.monthly.length}か月</td>
        <td>${formatPercent(operatingMargin)}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="management-year-section">
      <div class="management-subheading">
        <div>
          <p class="eyebrow">Yearly P/L</p>
          <h4>年度別の収支比較</h4>
        </div>
        <span>売上CSVと月次損益計算書を年度単位で照合</span>
      </div>
      <div class="table-wrap">
        <table class="management-year-table">
          <thead>
            <tr>
              <th>年度</th>
              <th>会計売上高</th>
              <th>会計粗利</th>
              <th>CSV粗利</th>
              <th>粗利差</th>
              <th>販管費</th>
              <th>営業損益</th>
              <th>黒字月</th>
              <th>営業利益率</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="management-note">2024年は月次損益計算書ベースで収支を表示できます。会計側とCSV側は計上基準が異なる可能性があるため、差額は「原因を確認する項目」として扱います。</p>
    </div>
  `;
}

function renderManagementSummary() {
  const summary = document.getElementById("managementSummary");
  const period2025 = actualSummaryState?.periods.find((period) => period.key === "2025");
  const hasAccounting = accountingPdfState.profitLoss || accountingPdfState.subAccounts || accountingPdfState.agentBilling;

  if (!period2025 && !hasAccounting) {
    summary.hidden = true;
    return;
  }

  const pl = accounting2025.profitLoss;
  const billing = accounting2025.agentBilling;
  const accountingGrossGap = hasAccounting && period2025 ? pl.grossProfit - period2025.officeGrossProfit : null;
  const accountingSalesGap = hasAccounting && period2025 ? pl.sales - period2025.paymentAmount : null;
  const csvGrossPerAgentMonth = period2025 && billing.agentMonths > 0 ? period2025.officeGrossProfit / billing.agentMonths : null;
  const accountingGrossPerAgentMonth = hasAccounting && billing.agentMonths > 0 ? pl.grossProfit / billing.agentMonths : null;
  const loadedAccountingText = hasAccounting
    ? "会計PDF読込済み"
    : "会計PDFを読み込むと、販管費と営業利益まで表示します。";

  summary.hidden = false;
  summary.innerHTML = `
    <div class="management-heading">
      <div>
        <p class="eyebrow">2025 Baseline</p>
        <h3>2025年 経営サマリー</h3>
      </div>
      <strong>${loadedAccountingText}</strong>
    </div>
    <p class="management-lead">
      2025年は売上明細、AG請求、損益計算書が揃う基準年です。2024年の月次損益計算書も読み込めば、売上だけでなく販管費と営業損益まで年度比較できます。
    </p>
    <div class="management-grid">
      <article>
        <span>売上CSV オフィス粗利</span>
        <strong>${period2025 ? formatYenCompact(period2025.officeGrossProfit) : "-"}</strong>
        <small>入金額 - AG分</small>
      </article>
      <article>
        <span>会計 売上総利益</span>
        <strong>${hasAccounting ? formatYenCompact(pl.grossProfit) : "-"}</strong>
        <small>${hasAccounting ? `売上高 ${formatYenCompact(pl.sales)} / 売上原価 ${formatYenCompact(pl.costOfSales)}` : "損益計算書PDFから読込"}</small>
      </article>
      <article class="${accountingGrossGap === null || accountingGrossGap >= 0 ? "actual-bridge-positive" : "actual-bridge-negative"}">
        <span>粗利差額</span>
        <strong>${accountingGrossGap === null ? "-" : formatSignedYen(accountingGrossGap)}</strong>
        <small>会計売上総利益 - CSV粗利</small>
      </article>
      <article class="${hasAccounting && pl.operatingProfit < 0 ? "actual-bridge-negative" : ""}">
        <span>会計 営業損益</span>
        <strong>${hasAccounting ? formatSignedYen(pl.operatingProfit) : "-"}</strong>
        <small>${hasAccounting ? `販管費 ${formatYenCompact(pl.sellingGeneralAdmin)} 差引後` : "損益計算書PDFから読込"}</small>
      </article>
      <article>
        <span>売上CSV 入金額</span>
        <strong>${period2025 ? formatYenCompact(period2025.paymentAmount) : "-"}</strong>
        <small>売買・賃貸の入金明細合計</small>
      </article>
      <article>
        <span>会計 売上高との差</span>
        <strong>${accountingSalesGap === null ? "-" : formatSignedYen(accountingSalesGap)}</strong>
        <small>会計売上高 - CSV入金額</small>
      </article>
      <article>
        <span>AG請求額</span>
        <strong>${hasAccounting ? formatYenCompact(billing.invoiceTotal) : "-"}</strong>
        <small>${hasAccounting ? `AGフィー ${formatYenCompact(billing.feeTotal)} / ${billing.agentMonths}人月` : "エージェント請求表PDFから読込"}</small>
      </article>
      <article>
        <span>AG1人月あたり粗利</span>
        <strong>${csvGrossPerAgentMonth === null ? "-" : formatYenCompact(csvGrossPerAgentMonth)}</strong>
        <small>${accountingGrossPerAgentMonth === null ? "AG請求表PDFで精度向上" : `会計粗利ベース ${formatYenCompact(accountingGrossPerAgentMonth)}`}</small>
      </article>
    </div>
    ${renderAccountingYearComparison(hasAccounting)}
  `;
}

function renderActuals(summary) {
  actualSummaryState = summary;
  const yearPeriods = summary.periods.filter((period) => /^20\d{2}$/.test(period.key));
  if (!yearPeriods.some((period) => period.key === activeActualPeriodKey)) {
    activeActualPeriodKey = yearPeriods.at(-1)?.key || "total";
  }
  const period = getActiveActualPeriod(summary);
  document.getElementById("actualEmpty").hidden = true;
  document.getElementById("actualLoaded").hidden = false;
  setActualPeriods(summary);
  setActualSummary(period);
  setDashboardSummary(period);
  renderActualAnnualSalesTable(period);
}

function loadActualCsv(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const rows = parseCsv(String(reader.result || ""));
    const actualRows = rows.map(normalizeActualRow).filter((row) => row.reportMonth && row.agentName && row.paymentAmount > 0);
    if (!actualRows.length) {
      renderActualCsvImportStatus("読み込める売上データが見つかりませんでした。CSVの報告月・AG名・入金額を確認してください。");
      return;
    }
    const result = mergeActualSalesRows(actualRows);
    renderActuals(summarizeActuals(actualSalesRows));
    renderActualCsvImportStatus(`${file.name} を追加しました。新規 ${result.added.toLocaleString("ja-JP")}件 / 更新 ${result.updated.toLocaleString("ja-JP")}件`);
    document.getElementById("actualCsvInput").value = "";
  });
  reader.readAsText(file, "utf-8");
}

function clearActualSalesRows() {
  if (!actualSalesRows.length) return;
  if (!confirm("読み込み済みの売上CSVデータをすべて削除しますか？")) return;
  actualSalesRows = [];
  localStorage.removeItem(actualSalesStorageKey);
  actualSummaryState = null;
  document.getElementById("actualEmpty").hidden = false;
  document.getElementById("actualLoaded").hidden = true;
  renderActualCsvImportStatus("読み込み済みデータをクリアしました。");
}

function updateActualPeriod(target) {
  const periodKey = target.dataset.actualPeriod;
  if (!periodKey || !actualSummaryState) return;
  activeActualPeriodKey = periodKey;
  renderActuals(actualSummaryState);
}

function summarizeExpenses(rows) {
  const normalized = rows.map((row) => {
    const month = parseFlexibleMonth(pickValue(row, ["月", "年月", "対象月", "報告月", "支払月", "日付"]));
    return {
      month,
      category: pickValue(row, ["費目", "勘定科目", "科目", "カテゴリ"]) || "未設定",
      vendor: pickValue(row, ["支払先", "取引先", "摘要"]) || "",
      type: pickValue(row, ["固定/変動", "区分", "固定変動"]) || "",
      amount: parseMoney(pickValue(row, ["金額", "支払額", "税込金額", "費用", "金額（税込）"])),
    };
  }).filter((row) => row.month && row.amount !== 0);

  const monthMap = new Map();
  const categoryMap = new Map();
  normalized.forEach((row) => {
    monthMap.set(row.month.key, (monthMap.get(row.month.key) || 0) + row.amount);
    categoryMap.set(row.category, (categoryMap.get(row.category) || 0) + row.amount);
  });
  const months = Array.from(monthMap.keys()).sort();
  const total = normalized.reduce((sum, row) => sum + row.amount, 0);

  return {
    rows: normalized,
    count: normalized.length,
    total,
    monthCount: months.length,
    monthlyAverage: months.length > 0 ? total / months.length : 0,
    period: months.length > 0 ? `${months[0].replace("-", "年")}月 - ${months.at(-1).replace("-", "年")}月` : "-",
    topCategory: Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1])[0] || ["-", 0],
  };
}

function summarizeAgentRegistry(rows) {
  const normalized = rows.map((row) => ({
    name: pickValue(row, ["AG名", "氏名", "名前", "エージェント名"]) || "未設定",
    joinedAt: pickValue(row, ["登録日", "入会日", "契約日", "開始日"]),
    leftAt: pickValue(row, ["退会日", "解約日", "終了日"]),
    rank: pickValue(row, ["ランク", "登録ランク"]) || "未設定",
    license: pickValue(row, ["宅建士区分", "宅建士", "資格"]) || "",
    monthlyFee: parseMoney(pickValue(row, ["月額フィー", "月額Agフィー", "AGフィー", "月額"])),
  })).filter((row) => row.name !== "未設定");

  const activeCount = normalized.filter((row) => !row.leftAt).length;
  const rankMap = new Map();
  normalized.forEach((row) => {
    rankMap.set(row.rank, (rankMap.get(row.rank) || 0) + 1);
  });

  return {
    rows: normalized,
    count: normalized.length,
    activeCount,
    inactiveCount: normalized.length - activeCount,
    rankText: Array.from(rankMap.entries()).map(([rank, count]) => `${rank} ${count}名`).join(" / ") || "-",
  };
}

function getTodayInputValue() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

function createAgentId() {
  return `agent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function cleanAgentId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "") || createAgentId();
}

function normalizeAgentRank(value, fallback = "C") {
  const rank = String(value || "").trim().toUpperCase();
  return agentRankOptions.includes(rank) ? rank : fallback;
}

function normalizeAgentLicense(value, fallback = "宅建士") {
  const license = String(value || "").trim();
  if (agentLicenseOptions.includes(license)) return license;
  if (["なし", "無し", "無資格"].includes(license)) return "無";
  if (license.includes("専任")) return "宅建士（専任）";
  if (license.includes("宅建")) return "宅建士";
  return fallback;
}

function calculateAgentCommissionRate(rank, license) {
  const baseRate = agentRankCommissionRates[normalizeAgentRank(rank)] ?? agentRankCommissionRates.C;
  const licensePenalty = normalizeAgentLicense(license) === "無" ? 10 : 0;
  return Math.max(0, Math.min(100, baseRate - licensePenalty));
}

function inferAgentRankFromCommissionRate(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate)) return "C";
  const baseMatch = Object.entries(agentRankCommissionRates).find(([, baseRate]) => baseRate === rate);
  if (baseMatch) return baseMatch[0];
  const unlicensedMatch = Object.entries(agentRankCommissionRates).find(([, baseRate]) => baseRate - 10 === rate);
  return unlicensedMatch?.[0] || "C";
}

function rankOptionsHtml(selectedRank) {
  return agentRankOptions
    .map((rank) => `<option value="${rank}"${rank === selectedRank ? " selected" : ""}>${rank}</option>`)
    .join("");
}

function licenseOptionsHtml(selectedLicense) {
  return agentLicenseOptions
    .map((license) => `<option value="${escapeHtml(license)}"${license === selectedLicense ? " selected" : ""}>${escapeHtml(license)}</option>`)
    .join("");
}

function normalizeMoneyHistory(history, fallbackAmount) {
  const normalized = (Array.isArray(history) ? history : [])
    .map((item) => ({
      id: cleanAgentId(item.id),
      startMonth: normalizeContractMonth(item.startMonth),
      amount: Math.max(0, Number(item.amount) || 0),
    }))
    .filter((item) => item.startMonth)
    .sort((a, b) => a.startMonth.localeCompare(b.startMonth));

  return normalized.length ? normalized : [{ id: createAgentId(), startMonth: "2020-01", amount: fallbackAmount }];
}

function readHeadOfficePaymentSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(headOfficePaymentStorageKey) || "{}");
    const legacyRegistration = normalizeMoneyHistory(parsed.registrationPayment, 15000);
    const legacyRenewal = normalizeMoneyHistory(parsed.renewalPayment, 15000);
    return {
      monthlyRegistration: normalizeMoneyHistory(parsed.monthlyRegistration, 5000),
      registrationRenewalPayment: normalizeMoneyHistory(parsed.registrationRenewalPayment || parsed.registrationPayment || parsed.renewalPayment, 15000),
      registrationPayment: legacyRegistration,
      renewalPayment: legacyRenewal,
    };
  } catch {
    return {
      monthlyRegistration: normalizeMoneyHistory([], 5000),
      registrationRenewalPayment: normalizeMoneyHistory([], 15000),
      registrationPayment: normalizeMoneyHistory([], 15000),
      renewalPayment: normalizeMoneyHistory([], 15000),
    };
  }
}

function saveHeadOfficePaymentSettings() {
  headOfficePaymentSettings.monthlyRegistration = normalizeMoneyHistory(headOfficePaymentSettings.monthlyRegistration, 5000);
  headOfficePaymentSettings.registrationRenewalPayment = normalizeMoneyHistory(headOfficePaymentSettings.registrationRenewalPayment, 15000);
  headOfficePaymentSettings.registrationPayment = headOfficePaymentSettings.registrationRenewalPayment;
  headOfficePaymentSettings.renewalPayment = headOfficePaymentSettings.registrationRenewalPayment;
  localStorage.setItem(headOfficePaymentStorageKey, JSON.stringify(headOfficePaymentSettings));
}

function getHistoryAmountForMonth(history, year, month) {
  const targetKey = `${year}-${String(month).padStart(2, "0")}`;
  const current = normalizeMoneyHistory(history, 0)
    .filter((item) => item.startMonth <= targetKey)
    .at(-1);
  return current ? current.amount : 0;
}

function getHeadOfficeMonthlyFeeForMonth(year, month) {
  return getHistoryAmountForMonth(headOfficePaymentSettings.monthlyRegistration, year, month);
}

function getHeadOfficeRenewalFeeForMonth(year, month) {
  return getHistoryAmountForMonth(headOfficePaymentSettings.registrationRenewalPayment, year, month);
}

function getHeadOfficeRegistrationFeeForMonth(year, month) {
  return getHistoryAmountForMonth(headOfficePaymentSettings.registrationRenewalPayment, year, month);
}

function getHeadOfficePaymentConfig(type) {
  return {
    monthlyRegistration: {
      fallback: 5000,
      startInputId: "headOfficeMonthlyStartInput",
      amountInputId: "headOfficeMonthlyAmountInput",
    },
    registrationRenewalPayment: {
      fallback: 15000,
      startInputId: "headOfficeOneTimeStartInput",
      amountInputId: "headOfficeOneTimeAmountInput",
    },
  }[type];
}

function normalizeFeeHistory(agent) {
  const history = Array.isArray(agent.feeHistory) ? agent.feeHistory : [];
  const normalized = history
    .map((item) => ({
      id: cleanAgentId(item.id),
      startMonth: normalizeContractMonth(item.startMonth),
      amount: Math.max(0, Number(item.amount) || 0),
    }))
    .filter((item) => item.startMonth)
    .sort((a, b) => a.startMonth.localeCompare(b.startMonth));

  if (normalized.length) return normalized;

  const contractDate = normalizeContractMonth(agent.contractDate);
  const monthlyFee = Math.max(0, Number(agent.monthlyFee) || 0);
  return contractDate ? [{ id: createAgentId(), startMonth: contractDate, amount: monthlyFee }] : [];
}

function getAgentLatestFee(agent) {
  const history = normalizeFeeHistory(agent);
  return history.at(-1)?.amount || 0;
}

function getAgentLatestFeeMonth(agent) {
  const history = normalizeFeeHistory(agent);
  return history.at(-1)?.startMonth || "";
}

function normalizeAgentProfileHistory(agent) {
  const fallbackRank = normalizeAgentRank(agent.rank, inferAgentRankFromCommissionRate(agent.commissionRate));
  const fallbackLicense = normalizeAgentLicense(agent.license, "宅建士");
  const history = Array.isArray(agent.profileHistory) ? agent.profileHistory : [];
  const normalized = history
    .map((item) => {
      const rank = normalizeAgentRank(item.rank, fallbackRank);
      const license = normalizeAgentLicense(item.license, fallbackLicense);
      return {
        id: cleanAgentId(item.id),
        startMonth: normalizeContractMonth(item.startMonth),
        rank,
        license,
        commissionRate: calculateAgentCommissionRate(rank, license),
      };
    })
    .filter((item) => item.startMonth)
    .sort((a, b) => a.startMonth.localeCompare(b.startMonth));

  if (normalized.length) return normalized;

  const contractDate = normalizeContractMonth(agent.contractDate);
  return contractDate ? [{
    id: createAgentId(),
    startMonth: contractDate,
    rank: fallbackRank,
    license: fallbackLicense,
    commissionRate: calculateAgentCommissionRate(fallbackRank, fallbackLicense),
  }] : [];
}

function getAgentLatestProfile(agent) {
  const history = normalizeAgentProfileHistory(agent);
  return history.at(-1) || {
    rank: normalizeAgentRank(agent.rank),
    license: normalizeAgentLicense(agent.license),
    commissionRate: calculateAgentCommissionRate(agent.rank, agent.license),
  };
}

function getAgentProfileForMonth(agent, year, month) {
  const targetKey = `${year}-${String(month).padStart(2, "0")}`;
  const history = normalizeAgentProfileHistory(agent);
  const current = history.filter((item) => item.startMonth <= targetKey).at(-1);
  return current || history[0] || getAgentLatestProfile(agent);
}

function emptyLicenseBreakdown() {
  return Object.fromEntries(agentLicenseOptions.map((license) => [license, 0]));
}

function formatLicenseBreakdown(counts) {
  return `<span class="license-breakdown">${agentLicenseOptions
    .map((license) => `<span>${escapeHtml(license)} ${Number(counts?.[license] || 0).toLocaleString("ja-JP")}名</span>`)
    .join("")}</span>`;
}

function updateAgentLatestProfile(agent, updates) {
  agent.profileHistory = normalizeAgentProfileHistory(agent);
  if (!agent.profileHistory.length && agent.contractDate) {
    agent.profileHistory.push({
      id: createAgentId(),
      startMonth: normalizeContractMonth(agent.contractDate),
      rank: normalizeAgentRank(agent.rank),
      license: normalizeAgentLicense(agent.license),
      commissionRate: calculateAgentCommissionRate(agent.rank, agent.license),
    });
  }
  const latestProfile = agent.profileHistory.at(-1);
  if (!latestProfile) return;
  if (updates.rank !== undefined) latestProfile.rank = normalizeAgentRank(updates.rank, latestProfile.rank);
  if (updates.license !== undefined) latestProfile.license = normalizeAgentLicense(updates.license, latestProfile.license);
  latestProfile.commissionRate = calculateAgentCommissionRate(latestProfile.rank, latestProfile.license);
}

function sortedRegisteredAgents() {
  return [...registeredAgents].sort((a, b) => {
    const dateCompare = normalizeContractMonth(a.contractDate).localeCompare(normalizeContractMonth(b.contractDate));
    if (dateCompare !== 0) return dateCompare;
    return String(a.name || "").localeCompare(String(b.name || ""), "ja");
  });
}

function readRegisteredAgents() {
  try {
    const parsed = JSON.parse(localStorage.getItem(registeredAgentsStorageKey) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((agent) => {
        const feeHistory = normalizeFeeHistory(agent);
        const profileHistory = normalizeAgentProfileHistory(agent);
        const latestProfile = profileHistory.at(-1) || getAgentLatestProfile(agent);
        return {
          id: cleanAgentId(agent.id),
          name: String(agent.name || "").trim(),
          rank: latestProfile.rank,
          license: latestProfile.license,
          monthlyFee: feeHistory.at(-1)?.amount || Math.max(0, Number(agent.monthlyFee) || 0),
          feeHistory,
          profileHistory,
          registrationFee: agent.registrationFee === undefined ? 60000 : Math.max(0, Number(agent.registrationFee) || 0),
          commissionRate: latestProfile.commissionRate,
          renewalFee: Math.max(0, Number(agent.renewalFee) || 0),
          contractDate: normalizeContractMonth(agent.contractDate),
          canceledAt: normalizeContractMonth(agent.canceledAt),
        };
      })
      .filter((agent) => agent.name && agent.contractDate);
  } catch {
    return [];
  }
}

function saveRegisteredAgents() {
  registeredAgents.forEach((agent) => {
    agent.feeHistory = normalizeFeeHistory(agent);
    agent.monthlyFee = getAgentLatestFee(agent);
    agent.profileHistory = normalizeAgentProfileHistory(agent);
    const latestProfile = getAgentLatestProfile(agent);
    agent.rank = latestProfile.rank;
    agent.license = latestProfile.license;
    agent.commissionRate = latestProfile.commissionRate;
    agent.registrationFee = agent.registrationFee === undefined ? 60000 : Math.max(0, Number(agent.registrationFee) || 0);
  });
  localStorage.setItem(registeredAgentsStorageKey, JSON.stringify(registeredAgents));
}

function normalizeContractMonth(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
  return match ? `${match[1]}-${match[2]}` : "";
}

function parseInputDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3] || 1),
    key: `${match[1]}-${match[2]}`,
  };
}

function isAgentActiveInMonth(agent, year, month) {
  const contract = parseInputDate(agent.contractDate);
  if (!contract) return false;
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const canceledAt = normalizeContractMonth(agent.canceledAt);
  return contract.key <= monthKey && (!canceledAt || monthKey <= canceledAt);
}

function isAgentCanceledBeforeMonth(agent, year, month) {
  const canceledAt = normalizeContractMonth(agent.canceledAt);
  if (!canceledAt) return false;
  return `${year}-${String(month).padStart(2, "0")}` > canceledAt;
}

function isRenewalMonth(agent, year, month) {
  const contract = parseInputDate(agent.contractDate);
  return Boolean(contract && year > contract.year && month === contract.month);
}

function isRegistrationMonth(agent, year, month) {
  const contract = parseInputDate(agent.contractDate);
  return Boolean(contract && year === contract.year && month === contract.month);
}

function isRenewalInterviewMonth(agent, month) {
  const contract = parseInputDate(agent.contractDate);
  if (!contract) return false;
  const monthsUntilAnniversary = (contract.month - month + 12) % 12;
  return monthsUntilAnniversary === 1 || monthsUntilAnniversary === 2;
}

function getAgentFeeForMonth(agent, year, month) {
  const targetKey = `${year}-${String(month).padStart(2, "0")}`;
  const current = normalizeFeeHistory(agent)
    .filter((item) => item.startMonth <= targetKey)
    .at(-1);
  return current ? current.amount : 0;
}

function getAgentMonthBilling(agent, year, month) {
  const active = isAgentActiveInMonth(agent, year, month);
  const registrationDue = active && isRegistrationMonth(agent, year, month);
  const renewalDue = active && isRenewalMonth(agent, year, month);
  const interviewDue = active && isRenewalInterviewMonth(agent, month);
  const fee = active ? getAgentFeeForMonth(agent, year, month) : 0;
  const profile = getAgentProfileForMonth(agent, year, month);
  const registration = registrationDue ? agent.registrationFee : 0;
  const renewal = renewalDue ? agent.renewalFee : 0;
  const oneTimeFee = registration + renewal;
  const headOfficeMonthlyFee = active ? getHeadOfficeMonthlyFeeForMonth(year, month) : 0;
  const headOfficeRegistrationFee = registrationDue ? getHeadOfficeRegistrationFeeForMonth(year, month) : 0;
  const headOfficeRenewalFee = renewalDue ? getHeadOfficeRenewalFeeForMonth(year, month) : 0;
  const headOfficeOneTimeFee = headOfficeRegistrationFee + headOfficeRenewalFee;
  const feeNet = active ? fee - headOfficeMonthlyFee : 0;
  const renewalNet = (registrationDue || renewalDue) ? oneTimeFee - headOfficeOneTimeFee : 0;
  return {
    active,
    canceled: isAgentCanceledBeforeMonth(agent, year, month),
    registrationDue,
    renewalDue,
    interviewDue,
    rank: profile.rank,
    license: profile.license,
    commissionRate: profile.commissionRate,
    fee,
    registration,
    renewal: oneTimeFee,
    renewalOnly: renewal,
    headOfficeMonthlyFee,
    headOfficeRegistrationFee,
    headOfficeRenewalFee,
    headOfficeOneTimeFee,
    feeNet,
    renewalNet,
    total: fee + oneTimeFee,
    netTotal: feeNet + renewalNet,
  };
}

function summarizeRegisteredAgents() {
  const currentYear = Number(document.getElementById("agentAnnualYear")?.value) || new Date().getFullYear();
  const monthly = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const rows = registeredAgents.map((agent) => getAgentMonthBilling(agent, currentYear, month));
    const activeAgents = rows.filter((row) => row.active);
    const feeTotal = activeAgents.reduce((sum, row) => sum + row.fee, 0);
    const renewalTotal = activeAgents.reduce((sum, row) => sum + row.renewal, 0);
    const headOfficeMonthlyTotal = activeAgents.reduce((sum, row) => sum + row.headOfficeMonthlyFee, 0);
    const headOfficeRegistrationTotal = activeAgents.reduce((sum, row) => sum + row.headOfficeRegistrationFee, 0);
    const headOfficeRenewalTotal = activeAgents.reduce((sum, row) => sum + row.headOfficeRenewalFee, 0);
    const headOfficeOneTimeTotal = activeAgents.reduce((sum, row) => sum + row.headOfficeOneTimeFee, 0);
    const feeNetTotal = activeAgents.reduce((sum, row) => sum + row.feeNet, 0);
    const renewalNetTotal = activeAgents.reduce((sum, row) => sum + row.renewalNet, 0);
    return {
      month,
      agents: activeAgents.length,
      feeTotal,
      renewalTotal,
      headOfficeMonthlyTotal,
      headOfficeRegistrationTotal,
      headOfficeRenewalTotal,
      headOfficeOneTimeTotal,
      feeNetTotal,
      renewalNetTotal,
      total: feeTotal + renewalTotal,
      netTotal: feeNetTotal + renewalNetTotal,
    };
  });
  const annualFee = monthly.reduce((sum, row) => sum + row.feeTotal, 0);
  const annualRenewal = monthly.reduce((sum, row) => sum + row.renewalTotal, 0);
  const annualHeadOfficeMonthly = monthly.reduce((sum, row) => sum + row.headOfficeMonthlyTotal, 0);
  const annualHeadOfficeRegistration = monthly.reduce((sum, row) => sum + row.headOfficeRegistrationTotal, 0);
  const annualHeadOfficeRenewal = monthly.reduce((sum, row) => sum + row.headOfficeRenewalTotal, 0);
  const annualHeadOfficeOneTime = monthly.reduce((sum, row) => sum + row.headOfficeOneTimeTotal, 0);
  const annualFeeNet = monthly.reduce((sum, row) => sum + row.feeNetTotal, 0);
  const annualRenewalNet = monthly.reduce((sum, row) => sum + row.renewalNetTotal, 0);
  const registeredLicenseBreakdown = emptyLicenseBreakdown();
  registeredAgents.forEach((agent) => {
    const license = normalizeAgentLicense(getAgentLatestProfile(agent).license);
    registeredLicenseBreakdown[license] += 1;
  });
  const yearEndLicenseBreakdown = emptyLicenseBreakdown();
  registeredAgents
    .filter((agent) => isAgentActiveInMonth(agent, currentYear, 12))
    .forEach((agent) => {
      const license = normalizeAgentLicense(getAgentProfileForMonth(agent, currentYear, 12).license);
      yearEndLicenseBreakdown[license] += 1;
    });
  const activeInYear = new Set();
  monthly.forEach((row, index) => {
    registeredAgents
      .filter((agent) => isAgentActiveInMonth(agent, currentYear, index + 1))
      .forEach((agent) => activeInYear.add(agent.id));
  });

  return {
    year: currentYear,
    monthly,
    annualFee,
    annualRenewal,
    annualHeadOfficeMonthly,
    annualHeadOfficeRegistration,
    annualHeadOfficeRenewal,
    annualHeadOfficeOneTime,
    annualFeeNet,
    annualRenewalNet,
    annualTotal: annualFee + annualRenewal,
    annualNetTotal: annualFeeNet + annualRenewalNet,
    activeCount: registeredAgents.filter((agent) => isAgentActiveInMonth(agent, currentYear, 12)).length,
    registeredLicenseBreakdown,
    yearEndLicenseBreakdown,
    activeInYearCount: activeInYear.size,
    averageMonthlyTotal: (annualFee + annualRenewal) / 12,
  };
}

function renderHeadOfficeHistoryRows(type, targetId, unitLabel) {
  const config = getHeadOfficePaymentConfig(type);
  const rows = normalizeMoneyHistory(headOfficePaymentSettings[type], config?.fallback || 0)
    .map((item, index) => `
      <div class="head-office-history-item">
        <input class="agent-table-input agent-table-input--date" data-head-office-type="${type}" data-head-office-id="${item.id}" data-field="startMonth" type="month" value="${escapeHtml(item.startMonth)}" aria-label="本部支払 適用開始月" />
        <input class="agent-table-input" data-head-office-type="${type}" data-head-office-id="${item.id}" data-field="amount" type="number" min="0" step="1000" value="${item.amount}" aria-label="本部支払 金額" />
        <small>${unitLabel}</small>
        ${index === 0 ? '<span class="fee-history-base-label">初回</span>' : `<button class="agent-delete-button" data-head-office-delete="${item.id}" data-head-office-type="${type}" type="button">削除</button>`}
      </div>
    `)
    .join("");
  document.getElementById(targetId).innerHTML = rows;
}

function renderHeadOfficePaymentSettings() {
  const year = Number(document.getElementById("agentAnnualYear")?.value) || new Date().getFullYear();
  const summary = summarizeRegisteredAgents();
  const januaryMonthlyFee = getHeadOfficeMonthlyFeeForMonth(year, 1);
  const januaryRegistrationFee = getHeadOfficeRegistrationFeeForMonth(year, 1);
  const januaryRenewalFee = getHeadOfficeRenewalFeeForMonth(year, 1);
  document.getElementById("headOfficePaymentSummary").innerHTML = `
    <article><span>${year}年 本部月額登録料</span><strong>${formatYenCompact(summary.annualHeadOfficeMonthly)}</strong><small>在籍AGごとの月額支払</small></article>
    <article><span>${year}年 本部登録時支払</span><strong>${formatYenCompact(summary.annualHeadOfficeRegistration)}</strong><small>契約締結月の支払</small></article>
    <article><span>${year}年 本部更新時支払</span><strong>${formatYenCompact(summary.annualHeadOfficeRenewal)}</strong><small>更新応当月の支払</small></article>
    <article><span>${year}年 本部支払合計</span><strong>${formatYenCompact(summary.annualHeadOfficeMonthly + summary.annualHeadOfficeOneTime)}</strong><small>月額登録料 + 登録時支払 + 更新時支払</small></article>
    <article><span>${year}年 実質総合計</span><strong>${formatYenCompact(summary.annualNetTotal)}</strong><small>フィー・登録料・更新料から本部支払を控除</small></article>
    <article><span>1月時点の本部単価</span><strong>${formatYenCompact(januaryMonthlyFee)}</strong><small>登録・更新 ${formatYenCompact(januaryRegistrationFee || januaryRenewalFee)}</small></article>
  `;
  renderHeadOfficeHistoryRows("monthlyRegistration", "headOfficeMonthlyRows", "円/月");
  renderHeadOfficeHistoryRows("registrationRenewalPayment", "headOfficeOneTimeRows", "円/回");
}

function updateHeadOfficePaymentHistory(target) {
  const type = target.dataset.headOfficeType;
  const id = target.dataset.headOfficeId;
  const field = target.dataset.field;
  const history = headOfficePaymentSettings?.[type]?.find((item) => item.id === id);
  if (!type || !id || !field || !history) return;

  if (field === "startMonth") {
    history.startMonth = normalizeContractMonth(target.value);
  } else if (field === "amount") {
    history.amount = Math.max(0, Number(target.value) || 0);
  }
  saveHeadOfficePaymentSettings();
  renderRegisteredAgents();
}

function addHeadOfficePaymentHistory(type) {
  const config = getHeadOfficePaymentConfig(type);
  if (!config) return;
  const startInput = document.getElementById(config.startInputId);
  const amountInput = document.getElementById(config.amountInputId);
  const startMonth = normalizeContractMonth(startInput.value);
  const amount = Math.max(0, Number(amountInput.value) || 0);
  if (!startMonth) return;

  headOfficePaymentSettings[type] = normalizeMoneyHistory(headOfficePaymentSettings[type], config.fallback);
  const existing = headOfficePaymentSettings[type].find((item) => item.startMonth === startMonth);
  if (existing) {
    existing.amount = amount;
  } else {
    headOfficePaymentSettings[type].push({ id: createAgentId(), startMonth, amount });
  }
  saveHeadOfficePaymentSettings();
  renderRegisteredAgents();
}

function deleteHeadOfficePaymentHistory(target) {
  const type = target.dataset.headOfficeType;
  const id = target.dataset.headOfficeDelete;
  if (!type || !id) return;
  const config = getHeadOfficePaymentConfig(type);
  if (!config) return;

  headOfficePaymentSettings[type] = normalizeMoneyHistory(headOfficePaymentSettings[type], config.fallback);
  if (headOfficePaymentSettings[type].length <= 1) return;
  const item = headOfficePaymentSettings[type].find((row) => row.id === id);
  const label = item ? `${item.startMonth} / ${formatYenCompact(item.amount)}` : "この本部支払履歴";
  if (!confirm(`${label}を本当に削除しますか？`)) return;
  headOfficePaymentSettings[type] = headOfficePaymentSettings[type].filter((row) => row.id !== id);
  saveHeadOfficePaymentSettings();
  renderRegisteredAgents();
}

function formatBillingCell(row, field) {
  if (!row.active) return "";
  if (field === "renewal") return (row.registrationDue || row.renewalDue) ? formatAnnualYen(row.renewal) : "";
  if (field === "feeNet") return formatNetBillingAmount(row.feeNet);
  if (field === "renewalNet") return (row.registrationDue || row.renewalDue) ? formatRenewalNetBillingAmount(row.renewalNet, row.headOfficeOneTimeFee) : "";
  const value = row[field];
  if (value <= 0) return "";
  return formatAnnualYen(value);
}

function formatNetBillingAmount(value) {
  return `<span class="agent-net-amount">${formatAnnualNetYen(value)}</span>`;
}

function formatRenewalNetBillingAmount(value, headOfficeRenewalFee) {
  return `<span class="agent-net-amount agent-net-amount--with-detail">${formatAnnualNetYen(value)}</span>`;
}

function formatProfileBillingCell(row) {
  if (!row.active) return "";
  return `${escapeHtml(row.rank)} / ${escapeHtml(row.license)}<small>${formatPercent(row.commissionRate)}</small>`;
}

function renderAnnualBillingRows(summary) {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const agents = sortedRegisteredAgents();
  const agentRows = agents.length ? agents.map((agent) => {
    const billing = months.map((month) => getAgentMonthBilling(agent, summary.year, month));
    const annualFee = billing.reduce((sum, row) => sum + row.fee, 0);
    const annualFeeNet = billing.reduce((sum, row) => sum + row.feeNet, 0);
    const annualRenewal = billing.reduce((sum, row) => sum + row.renewal, 0);
    const annualRenewalNet = billing.reduce((sum, row) => sum + row.renewalNet, 0);
    const annualHeadOfficeOneTime = billing.reduce((sum, row) => sum + row.headOfficeOneTimeFee, 0);
    const contract = parseInputDate(agent.contractDate);
    const contractLabel = contract ? `${contract.year}年${contract.month}月` : "-";
    const canceledAt = parseInputDate(agent.canceledAt);
    const canceledLabel = canceledAt ? `${canceledAt.year}年${canceledAt.month}月` : "";
    const latestFee = getAgentLatestFee(agent);
    const latestProfile = getAgentLatestProfile(agent);
    const agentCell = `
      <td class="agent-annual-name" rowspan="4">
        <strong>${escapeHtml(agent.name)}</strong>
        <small>契約締結月 ${escapeHtml(contractLabel)}</small>
        ${canceledLabel ? `<small class="agent-canceled-label">解約月 ${escapeHtml(canceledLabel)}</small>` : ""}
        <small>${escapeHtml(latestProfile.rank)}ランク / ${escapeHtml(latestProfile.license)}</small>
        <small>最新 ${formatYenCompact(latestFee)} / 登録 ${formatYenCompact(agent.registrationFee)} / 更新 ${formatYenCompact(agent.renewalFee)}</small>
        <small>コミッション率 ${formatPercent(latestProfile.commissionRate)}（実効 ${formatAgentEffectiveCommission(latestProfile.commissionRate)}）</small>
      </td>
    `;
    const amountCells = (field) => billing
      .map((row) => {
        const className = row.canceled ? "is-after-cancel" : !row.active ? "is-before-contract" : (row.registrationDue || row.renewalDue) ? "is-renewal-month" : row.interviewDue ? "is-interview-window" : "";
        return `<td class="${className}">${formatBillingCell(row, field)}</td>`;
      })
      .join("");

    return `
      <tr class="agent-annual-block-start">
        ${agentCell}
        <td class="agent-annual-kind">フィー収入</td>
        ${amountCells("fee")}
        <td>${annualFee > 0 ? formatAnnualYen(annualFee) : ""}</td>
      </tr>
      <tr>
        <td class="agent-annual-kind agent-annual-net-kind">フィー実質</td>
        ${amountCells("feeNet")}
        <td>${annualFee > 0 || annualFeeNet !== 0 ? formatNetBillingAmount(annualFeeNet) : ""}</td>
      </tr>
      <tr>
        <td class="agent-annual-kind">登録・更新料収入</td>
        ${amountCells("renewal")}
        <td>${annualRenewal > 0 ? formatAnnualYen(annualRenewal) : ""}</td>
      </tr>
      <tr>
        <td class="agent-annual-kind agent-annual-net-kind">登録・更新料実質</td>
        ${amountCells("renewalNet")}
        <td>${billing.some((row) => row.registrationDue || row.renewalDue) ? formatRenewalNetBillingAmount(annualRenewalNet, annualHeadOfficeOneTime) : ""}</td>
      </tr>
    `;
  }).join("") : `
    <tr class="is-zero-row">
      <td colspan="15">まだ登録されていません。</td>
    </tr>
  `;
  const totalRows = agents.length ? `
    <tr class="agent-annual-total-row">
      <td rowspan="6"><strong>${summary.year}年 合計</strong></td>
      <td class="agent-annual-kind">フィー収入</td>
      ${summary.monthly.map((row) => `<td>${formatAnnualYen(row.feeTotal)}</td>`).join("")}
      <td>${formatAnnualYen(summary.annualFee)}</td>
    </tr>
    <tr class="agent-annual-total-row">
      <td class="agent-annual-kind agent-annual-net-kind">フィー実質</td>
      ${summary.monthly.map((row) => `<td>${formatNetBillingAmount(row.feeNetTotal)}</td>`).join("")}
      <td>${formatNetBillingAmount(summary.annualFeeNet)}</td>
    </tr>
    <tr class="agent-annual-total-row">
      <td class="agent-annual-kind">登録・更新料収入</td>
      ${summary.monthly.map((row) => `<td>${formatAnnualYen(row.renewalTotal)}</td>`).join("")}
      <td>${formatAnnualYen(summary.annualRenewal)}</td>
    </tr>
    <tr class="agent-annual-total-row">
      <td class="agent-annual-kind agent-annual-net-kind">登録・更新料実質</td>
      ${summary.monthly.map((row) => `<td>${formatRenewalNetBillingAmount(row.renewalNetTotal, row.headOfficeOneTimeTotal)}</td>`).join("")}
      <td>${formatRenewalNetBillingAmount(summary.annualRenewalNet, summary.annualHeadOfficeOneTime)}</td>
    </tr>
    <tr class="agent-annual-total-row agent-annual-grand-total-row">
      <td class="agent-annual-kind">総額合計</td>
      ${summary.monthly.map((row) => `<td>${formatAnnualYen(row.total)}</td>`).join("")}
      <td>${formatAnnualYen(summary.annualTotal)}</td>
    </tr>
    <tr class="agent-annual-total-row agent-annual-net-total-row">
      <td class="agent-annual-kind">実質総合計</td>
      ${summary.monthly.map((row) => `<td>${formatAnnualYen(row.netTotal)}</td>`).join("")}
      <td>${formatAnnualYen(summary.annualNetTotal)}</td>
    </tr>
  ` : "";

  document.getElementById("agentAnnualBillingRows").innerHTML = agentRows + totalRows;
}

function syncRegisteredAgentSummary() {
  if (!registeredAgents.length) {
    if (agentRegistrySummaryState?.source === "manual") agentRegistrySummaryState = null;
    return;
  }

  agentRegistrySummaryState = {
    source: "manual",
    count: registeredAgents.length,
    activeCount: summarizeRegisteredAgents().activeCount,
    inactiveCount: 0,
    rankText: agentRankOptions
      .map((rank) => `${rank} ${registeredAgents.filter((agent) => normalizeAgentRank(agent.rank) === rank).length}名`)
      .join(" / "),
  };
}

function renderRegisteredAgents() {
  const annualYearInput = document.getElementById("agentAnnualYear");
  syncRegisteredAgentSummary();
  const summary = summarizeRegisteredAgents();
  renderHeadOfficePaymentSettings();
  document.getElementById("agentIncomeSummary").innerHTML = `
    <article><span>登録AG数</span><strong>${registeredAgents.length.toLocaleString("ja-JP")}名</strong><small>登録表にあるエージェント</small>${formatLicenseBreakdown(summary.registeredLicenseBreakdown)}</article>
    <article><span>${summary.year}年 期末AG数</span><strong>${summary.activeCount.toLocaleString("ja-JP")}名</strong><small>12月時点で契約済み</small>${formatLicenseBreakdown(summary.yearEndLicenseBreakdown)}</article>
    <article><span>${summary.year}年 フィー収入</span><strong>${formatYenCompact(summary.annualFee)}</strong><small>月額フィーの年間合計</small></article>
    <article><span>${summary.year}年 登録・更新料</span><strong>${formatYenCompact(summary.annualRenewal)}</strong><small>登録月と更新応当月に計上</small></article>
    <article><span>${summary.year}年 総額合計</span><strong>${formatYenCompact(summary.annualTotal)}</strong><small>本部支払控除前</small></article>
    <article><span>${summary.year}年 実質総合計</span><strong>${formatYenCompact(summary.annualNetTotal)}</strong><small>本部支払控除後</small></article>
  `;

  const agents = sortedRegisteredAgents();
  document.getElementById("registeredAgentRows").innerHTML = agents.length ? agents
    .map((agent) => {
      const latestFee = getAgentLatestFee(agent);
      const feeHistory = normalizeFeeHistory(agent);
      const profileHistory = normalizeAgentProfileHistory(agent);
      const latestProfile = getAgentLatestProfile(agent);
      const rank = latestProfile.rank;
      const license = latestProfile.license;
      const historyRows = feeHistory.map((item, index) => `
        <div class="fee-history-item">
          <input class="agent-table-input agent-table-input--date" data-agent-id="${agent.id}" data-fee-history-id="${item.id}" data-field="startMonth" type="month" value="${escapeHtml(item.startMonth)}" aria-label="${escapeHtml(agent.name)} フィー適用開始月" />
          <input class="agent-table-input" data-agent-id="${agent.id}" data-fee-history-id="${item.id}" data-field="amount" type="number" min="0" step="1000" value="${item.amount}" aria-label="${escapeHtml(agent.name)} フィー履歴金額" />
          <small>円/月</small>
          ${index === 0 ? '<span class="fee-history-base-label">初回</span>' : `<button class="agent-delete-button" data-fee-history-delete="${item.id}" data-agent-id="${agent.id}" type="button">削除</button>`}
        </div>
      `).join("");
      const profileRows = profileHistory.map((item, index) => `
        <div class="profile-history-item">
          <input class="agent-table-input agent-table-input--date" data-agent-id="${agent.id}" data-profile-history-id="${item.id}" data-field="startMonth" type="month" value="${escapeHtml(item.startMonth)}" aria-label="${escapeHtml(agent.name)} ランク・宅建 適用開始月" />
          <select class="agent-table-select" data-agent-id="${agent.id}" data-profile-history-id="${item.id}" data-field="rank" aria-label="${escapeHtml(agent.name)} 履歴ランク">${rankOptionsHtml(item.rank)}</select>
          <select class="agent-table-select" data-agent-id="${agent.id}" data-profile-history-id="${item.id}" data-field="license" aria-label="${escapeHtml(agent.name)} 履歴宅建区分">${licenseOptionsHtml(item.license)}</select>
          <input class="agent-table-input" type="number" value="${item.commissionRate}" aria-label="${escapeHtml(agent.name)} 履歴コミッション率" readonly />
          <small>%</small>
          ${index === 0 ? '<span class="fee-history-base-label">初回</span>' : `<button class="agent-delete-button" data-profile-history-delete="${item.id}" data-agent-id="${agent.id}" type="button">削除</button>`}
        </div>
      `).join("");
      return `
      <tr class="agent-register-main-row">
        <td><input class="agent-table-input agent-table-input--name" data-agent-id="${agent.id}" data-field="name" type="text" value="${escapeHtml(agent.name)}" aria-label="エージェント名" /></td>
        <td><select class="agent-table-select" data-agent-id="${agent.id}" data-field="rank" aria-label="${escapeHtml(agent.name)} ランク">${rankOptionsHtml(rank)}</select></td>
        <td><select class="agent-table-select" data-agent-id="${agent.id}" data-field="license" aria-label="${escapeHtml(agent.name)} 宅建区分">${licenseOptionsHtml(license)}</select></td>
        <td><strong class="current-fee">${formatYenCompact(latestFee)}</strong></td>
        <td><input class="agent-table-input" data-agent-id="${agent.id}" data-field="registrationFee" type="number" min="0" step="1000" value="${agent.registrationFee}" aria-label="${escapeHtml(agent.name)} 登録料" /><small>円</small></td>
        <td><input class="agent-table-input" data-agent-id="${agent.id}" data-field="commissionRate" type="number" min="0" max="100" step="1" value="${agent.commissionRate}" aria-label="${escapeHtml(agent.name)} コミッション率" readonly /><small>%</small></td>
        <td><input class="agent-table-input" data-agent-id="${agent.id}" data-field="renewalFee" type="number" min="0" step="1000" value="${agent.renewalFee}" aria-label="${escapeHtml(agent.name)} 更新料" /><small>円/年</small></td>
        <td><input class="agent-table-input agent-table-input--date" data-agent-id="${agent.id}" data-field="contractDate" type="month" value="${escapeHtml(normalizeContractMonth(agent.contractDate))}" aria-label="${escapeHtml(agent.name)} 契約締結月" /></td>
        <td><input class="agent-table-input agent-table-input--date" data-agent-id="${agent.id}" data-field="canceledAt" type="month" value="${escapeHtml(normalizeContractMonth(agent.canceledAt))}" aria-label="${escapeHtml(agent.name)} 解約月" /></td>
        <td><button class="agent-delete-button" data-agent-delete="${agent.id}" type="button">削除</button></td>
      </tr>
      <tr class="fee-history-row">
        <td colspan="10">
          <div class="agent-history-grid">
            <div class="fee-history-panel">
              <div class="fee-history-heading">
                <strong>フィー履歴</strong>
                <span>適用開始月から次の履歴の前月まで、この金額で集計します。</span>
              </div>
              <div class="fee-history-list">${historyRows}</div>
              <div class="fee-history-add-row">
                <input class="agent-table-input agent-table-input--date" data-fee-history-start="${agent.id}" type="month" value="${escapeHtml(getTodayInputValue())}" aria-label="${escapeHtml(agent.name)} 追加する適用開始月" />
                <input class="agent-table-input" data-fee-history-amount="${agent.id}" type="number" min="0" step="1000" value="${latestFee}" aria-label="${escapeHtml(agent.name)} 追加するフィー金額" />
                <small>円/月</small>
                <button class="file-button fee-history-add-button" data-fee-history-add="${agent.id}" type="button">履歴を追加</button>
              </div>
            </div>
            <div class="fee-history-panel">
              <div class="fee-history-heading">
                <strong>ランク・宅建履歴</strong>
                <span>適用開始月から次の履歴の前月まで、このランク・宅建区分でコミッション率を集計します。</span>
              </div>
              <div class="fee-history-list">${profileRows}</div>
              <div class="profile-history-add-row">
                <input class="agent-table-input agent-table-input--date" data-profile-history-start="${agent.id}" type="month" value="${escapeHtml(getTodayInputValue())}" aria-label="${escapeHtml(agent.name)} 追加するランク・宅建 適用開始月" />
                <select class="agent-table-select" data-profile-history-rank="${agent.id}" aria-label="${escapeHtml(agent.name)} 追加するランク">${rankOptionsHtml(latestProfile.rank)}</select>
                <select class="agent-table-select" data-profile-history-license="${agent.id}" aria-label="${escapeHtml(agent.name)} 追加する宅建区分">${licenseOptionsHtml(latestProfile.license)}</select>
                <button class="file-button fee-history-add-button" data-profile-history-add="${agent.id}" type="button">履歴を追加</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
    })
    .join("") : `
      <tr class="is-zero-row">
        <td colspan="10">まだ登録されていません。</td>
      </tr>
    `;

  renderAnnualBillingRows(summary);
  setSourceStatus();
}

function syncAgentCommissionInput() {
  const rankInput = document.getElementById("agentRankInput");
  const licenseInput = document.getElementById("agentLicenseInput");
  const commissionInput = document.getElementById("agentCommissionInput");
  if (!rankInput || !licenseInput || !commissionInput) return;
  commissionInput.value = calculateAgentCommissionRate(rankInput.value, licenseInput.value);
}

function addRegisteredAgent(event) {
  event.preventDefault();
  const nameInput = document.getElementById("agentNameInput");
  const rankInput = document.getElementById("agentRankInput");
  const licenseInput = document.getElementById("agentLicenseInput");
  const feeInput = document.getElementById("agentFeeInput");
  const registrationInput = document.getElementById("agentRegistrationInput");
  const commissionInput = document.getElementById("agentCommissionInput");
  const renewalInput = document.getElementById("agentRenewalInput");
  const contractInput = document.getElementById("agentContractInput");
  const name = nameInput.value.trim();
  if (!name || !contractInput.value) return;
  const rank = normalizeAgentRank(rankInput.value);
  const license = normalizeAgentLicense(licenseInput.value);

  registeredAgents.push({
    id: createAgentId(),
    name,
    rank,
    license,
    monthlyFee: Math.max(0, Number(feeInput.value) || 0),
    feeHistory: [{
      id: createAgentId(),
      startMonth: normalizeContractMonth(contractInput.value),
      amount: Math.max(0, Number(feeInput.value) || 0),
    }],
    profileHistory: [{
      id: createAgentId(),
      startMonth: normalizeContractMonth(contractInput.value),
      rank,
      license,
      commissionRate: calculateAgentCommissionRate(rank, license),
    }],
    registrationFee: Math.max(0, Number(registrationInput.value) || 0),
    commissionRate: calculateAgentCommissionRate(rank, license),
    renewalFee: Math.max(0, Number(renewalInput.value) || 0),
    contractDate: normalizeContractMonth(contractInput.value),
    canceledAt: "",
  });
  saveRegisteredAgents();
  event.target.reset();
  rankInput.value = "C";
  licenseInput.value = "宅建士";
  feeInput.value = 34000;
  registrationInput.value = 60000;
  commissionInput.value = calculateAgentCommissionRate(rankInput.value, licenseInput.value);
  renewalInput.value = 0;
  contractInput.value = getTodayInputValue();
  renderRegisteredAgents();
}

function updateRegisteredAgent(target) {
  const id = target.dataset.agentId;
  const field = target.dataset.field;
  const agent = registeredAgents.find((item) => item.id === id);
  if (!agent || !field) return;

  if (field === "name") {
    agent.name = target.value.trim();
  } else if (field === "contractDate") {
    const previousContractDate = agent.contractDate;
    agent.contractDate = normalizeContractMonth(target.value);
    if (agent.feeHistory?.length === 1 && agent.feeHistory[0].startMonth === previousContractDate) {
      agent.feeHistory[0].startMonth = agent.contractDate;
    }
    if (agent.profileHistory?.length === 1 && agent.profileHistory[0].startMonth === previousContractDate) {
      agent.profileHistory[0].startMonth = agent.contractDate;
    }
  } else if (field === "canceledAt") {
    agent.canceledAt = normalizeContractMonth(target.value);
  } else if (field === "rank") {
    updateAgentLatestProfile(agent, { rank: target.value });
  } else if (field === "license") {
    updateAgentLatestProfile(agent, { license: target.value });
  } else if (field === "commissionRate") {
    const latestProfile = getAgentLatestProfile(agent);
    agent.commissionRate = latestProfile.commissionRate;
  } else if (field) {
    agent[field] = Math.max(0, Number(target.value) || 0);
  }
  registeredAgents = registeredAgents.filter((item) => item.name && item.contractDate);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function updateFeeHistory(target) {
  const agent = registeredAgents.find((item) => item.id === target.dataset.agentId);
  const history = agent?.feeHistory?.find((item) => item.id === target.dataset.feeHistoryId);
  const field = target.dataset.field;
  if (!agent || !history || !field) return;

  if (field === "startMonth") {
    history.startMonth = normalizeContractMonth(target.value);
  } else if (field === "amount") {
    history.amount = Math.max(0, Number(target.value) || 0);
  }
  agent.feeHistory = normalizeFeeHistory(agent);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function addFeeHistory(target) {
  const id = target.dataset.feeHistoryAdd;
  const agent = registeredAgents.find((item) => item.id === id);
  if (!agent) return;

  const row = target.closest(".fee-history-add-row");
  const startMonth = normalizeContractMonth(row?.querySelector(`[data-fee-history-start="${id}"]`)?.value);
  const amount = Math.max(0, Number(row?.querySelector(`[data-fee-history-amount="${id}"]`)?.value) || 0);
  if (!startMonth) return;

  agent.feeHistory = normalizeFeeHistory(agent);
  const existing = agent.feeHistory.find((item) => item.startMonth === startMonth);
  if (existing) {
    existing.amount = amount;
  } else {
    agent.feeHistory.push({ id: createAgentId(), startMonth, amount });
  }
  agent.feeHistory = normalizeFeeHistory(agent);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function deleteFeeHistory(target) {
  const agent = registeredAgents.find((item) => item.id === target.dataset.agentId);
  const historyId = target.dataset.feeHistoryDelete;
  if (!agent || !historyId) return;

  agent.feeHistory = normalizeFeeHistory(agent);
  if (agent.feeHistory.length <= 1) return;
  const history = agent.feeHistory.find((item) => item.id === historyId);
  const label = history ? `${history.startMonth} / ${formatYenCompact(history.amount)}` : "このフィー履歴";
  if (!confirm(`${label}を本当に削除しますか？`)) return;
  agent.feeHistory = agent.feeHistory.filter((item) => item.id !== historyId);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function updateProfileHistory(target) {
  const agent = registeredAgents.find((item) => item.id === target.dataset.agentId);
  const history = agent?.profileHistory?.find((item) => item.id === target.dataset.profileHistoryId);
  const field = target.dataset.field;
  if (!agent || !history || !field) return;

  if (field === "startMonth") {
    history.startMonth = normalizeContractMonth(target.value);
  } else if (field === "rank") {
    history.rank = normalizeAgentRank(target.value, history.rank);
  } else if (field === "license") {
    history.license = normalizeAgentLicense(target.value, history.license);
  }
  history.commissionRate = calculateAgentCommissionRate(history.rank, history.license);
  agent.profileHistory = normalizeAgentProfileHistory(agent);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function addProfileHistory(target) {
  const id = target.dataset.profileHistoryAdd;
  const agent = registeredAgents.find((item) => item.id === id);
  if (!agent) return;

  const row = target.closest(".profile-history-add-row");
  const startMonth = normalizeContractMonth(row?.querySelector(`[data-profile-history-start="${id}"]`)?.value);
  const rank = normalizeAgentRank(row?.querySelector(`[data-profile-history-rank="${id}"]`)?.value);
  const license = normalizeAgentLicense(row?.querySelector(`[data-profile-history-license="${id}"]`)?.value);
  if (!startMonth) return;

  agent.profileHistory = normalizeAgentProfileHistory(agent);
  const existing = agent.profileHistory.find((item) => item.startMonth === startMonth);
  if (existing) {
    existing.rank = rank;
    existing.license = license;
    existing.commissionRate = calculateAgentCommissionRate(rank, license);
  } else {
    agent.profileHistory.push({
      id: createAgentId(),
      startMonth,
      rank,
      license,
      commissionRate: calculateAgentCommissionRate(rank, license),
    });
  }
  agent.profileHistory = normalizeAgentProfileHistory(agent);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function deleteProfileHistory(target) {
  const agent = registeredAgents.find((item) => item.id === target.dataset.agentId);
  const historyId = target.dataset.profileHistoryDelete;
  if (!agent || !historyId) return;

  agent.profileHistory = normalizeAgentProfileHistory(agent);
  if (agent.profileHistory.length <= 1) return;
  const history = agent.profileHistory.find((item) => item.id === historyId);
  const label = history ? `${history.startMonth} / ${history.rank} / ${history.license}` : "このランク・宅建履歴";
  if (!confirm(`${label}を本当に削除しますか？`)) return;
  agent.profileHistory = agent.profileHistory.filter((item) => item.id !== historyId);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function deleteRegisteredAgent(target) {
  const id = target.dataset.agentDelete;
  if (!id) return;
  const agent = registeredAgents.find((item) => item.id === id);
  const name = agent?.name || "このエージェント";
  if (!confirm(`${name}を本当に削除しますか？`)) return;
  registeredAgents = registeredAgents.filter((agent) => agent.id !== id);
  saveRegisteredAgents();
  renderRegisteredAgents();
}

function setNextDataSummary() {
  const expenseHtml = expenseSummaryState ? `
    <article>
      <span>販管費</span>
      <strong>${formatYenCompact(expenseSummaryState.total)}</strong>
      <small>${expenseSummaryState.count}件 / 月平均 ${formatYenCompact(expenseSummaryState.monthlyAverage)} / 最大費目 ${escapeHtml(expenseSummaryState.topCategory[0])}</small>
    </article>
  ` : "";
  const agentHtml = agentRegistrySummaryState ? `
    <article>
      <span>AG登録</span>
      <strong>${agentRegistrySummaryState.activeCount.toLocaleString("ja-JP")}名</strong>
      <small>登録 ${agentRegistrySummaryState.count}名 / 退会 ${agentRegistrySummaryState.inactiveCount}名 / ${escapeHtml(agentRegistrySummaryState.rankText)}</small>
    </article>
  ` : "";
  document.getElementById("nextDataSummary").innerHTML = expenseHtml + agentHtml;
}

function loadExpenseCsv(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    expenseSummaryState = summarizeExpenses(parseCsv(String(reader.result || "")));
    setNextDataSummary();
    setSourceStatus();
  });
  reader.readAsText(file, "utf-8");
}

function loadAgentCsv(file) {
  if (!file) return;
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    agentRegistrySummaryState = {
      fromPdf: true,
      count: agentBilling2025.endAgents,
      activeCount: agentBilling2025.endAgents,
      inactiveCount: Math.max(0, agentBilling2025.startAgents - agentBilling2025.endAgents),
      rankText: "A/C/D 請求表・管理表ベース",
    };
    setNextDataSummary();
    setSourceStatus();
    if (actualSummaryState) renderActuals(actualSummaryState);
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    agentRegistrySummaryState = summarizeAgentRegistry(parseCsv(String(reader.result || "")));
    setNextDataSummary();
    setSourceStatus();
    if (actualSummaryState) renderActuals(actualSummaryState);
  });
  reader.readAsText(file, "utf-8");
}

function classifyAccountingPdf(fileName) {
  if (fileName.includes("損益計算書") && fileName.includes("年間推移")) return "profitLossTrend";
  if (fileName.includes("損益計算書")) return "profitLoss";
  if (fileName.includes("補助科目")) return "subAccounts";
  if (fileName.includes("エージェント請求表")) return "agentBilling";
  return null;
}

function detectAccountingYear(fileName) {
  const normalized = fileName.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0));
  const match = normalized.match(/20\d{2}/);
  return match ? Number(match[0]) : null;
}

function renderAccountingSummary() {
  const legacySummary = document.getElementById("accountingSummary");
  if (legacySummary) legacySummary.hidden = true;
  setSourceStatus();
  if (actualSummaryState) renderActuals(actualSummaryState);
  return;
  const loadedLabels = [
    accountingPdfState.profitLoss ? "損益計算書" : null,
    accountingPdfState.subAccounts ? "補助科目" : null,
    accountingPdfState.agentBilling ? "エージェント請求表" : null,
  ].filter(Boolean);
  const missingLabels = [
    accountingPdfState.profitLoss ? null : "損益計算書",
    accountingPdfState.subAccounts ? null : "補助科目",
    accountingPdfState.agentBilling ? null : "エージェント請求表",
  ].filter(Boolean);
  const pl = accounting2025.profitLoss;
  const revenueText = accounting2025.revenueBreakdown
    .map((item) => `${item.label} ${formatYenCompact(item.amount)}`)
    .join(" / ");
  const costText = accounting2025.remaxCostBreakdown
    .slice(0, 3)
    .map((item) => `${item.label} ${formatYenCompact(item.amount)}`)
    .join(" / ");
  const billing = accounting2025.agentBilling;
  const billingAverage = billing.invoiceTotal / billing.monthly.length;
  const summary = document.getElementById("accountingSummary");

  summary.hidden = false;
  summary.innerHTML = `
    <article>
      <span>読み込み済みPDF</span>
      <strong>${loadedLabels.length.toLocaleString("ja-JP")} / 3</strong>
      <small>${escapeHtml(loadedLabels.join(" / ") || "未選択")}${missingLabels.length ? ` / 未選択: ${escapeHtml(missingLabels.join(" / "))}` : ""}</small>
    </article>
    <article>
      <span>2025年売上高</span>
      <strong>${formatYenCompact(pl.sales)}</strong>
      <small>${revenueText}</small>
    </article>
    <article>
      <span>2025年売上総利益</span>
      <strong>${formatYenCompact(pl.grossProfit)}</strong>
      <small>売上高 - 売上原価 ${formatYenCompact(pl.costOfSales)}</small>
    </article>
    <article class="${pl.operatingProfit >= 0 ? "actual-bridge-positive" : "actual-bridge-negative"}">
      <span>2025年営業損益</span>
      <strong>${formatSignedYen(pl.operatingProfit)}</strong>
      <small>販管費 ${formatYenCompact(pl.sellingGeneralAdmin)} 差引後</small>
    </article>
    <article>
      <span>RE/MAX関連原価</span>
      <strong>${formatYenCompact(accounting2025.remaxCostBreakdown.reduce((sum, item) => sum + item.amount, 0))}</strong>
      <small>${costText}</small>
    </article>
    <article>
      <span>AG請求額</span>
      <strong>${formatYenCompact(billing.invoiceTotal)}</strong>
      <small>エージェントフィー ${formatYenCompact(billing.feeTotal)} / 月平均 ${formatYenCompact(billingAverage)}</small>
    </article>
  `;
  setSourceStatus();
  if (actualSummaryState) renderActuals(actualSummaryState);
}

function loadAccountingPdfs(files) {
  Array.from(files || []).forEach((file) => {
    const kind = classifyAccountingPdf(file.name);
    const year = detectAccountingYear(file.name);
    if (kind === "profitLossTrend") {
      accountingPdfState.profitLoss = true;
      if (year && accountingYears[year]) accountingPdfState.trendYears.add(year);
      return;
    }
    if (kind) accountingPdfState[kind] = true;
    if (kind === "profitLoss" && year && accountingYears[year]) accountingPdfState.trendYears.add(year);
  });
  renderAccountingSummary();
}

function setKpis(values, result) {
  const isCurrent = activePreset === "current";
  document.getElementById("annualRevenueLabel").textContent = isCurrent ? "年間会社計上粗利" : "現在プランの年間オフィス粗利";
  document.getElementById("annualRevenueNote").textContent = isCurrent ? "売上高から歩合・ロイヤリティを控除後" : "オーナー粗利 + Agフィー年間利益 + Ag手数料粗利";
  document.getElementById("annualCostLabel").textContent = isCurrent ? "年間販管費" : "年間固定費";
  document.getElementById("annualCostNote").textContent = isCurrent ? "現在設定の販管費合計" : "事業前提の月額合計 × 12か月";
  document.getElementById("annualProfitLabel").textContent = isCurrent ? "年間営業利益" : "現在プランの年間営業利益";
  document.getElementById("annualRevenue").textContent = formatMan(result.annualRevenue);
  document.getElementById("annualCost").textContent = formatMan(result.annualCost);
  document.getElementById("annualProfit").textContent = formatMan(result.annualProfit);
  document.getElementById("profitNote").textContent = isCurrent ? `会社計上粗利 ${formatMan(result.annualRevenue)} - 販管費 ${formatMan(result.annualCost)}` : `${formatMan(result.annualRevenue)} - ${formatMan(result.annualCost)}`;
}

function setInsight(values, result) {
  const headline = document.getElementById("headline");
  const insight = document.getElementById("insight");

  const targetGap = result.annualProfit - values.targetProfit;

  if (activePreset === "current") {
    headline.textContent = targetGap < 0 ? "販管費をまかなう粗利が見える" : "会社の損益構造が見える";
    insight.textContent = `年間売上高は${formatMan(result.grossCommission)}、会社計上粗利は${formatMan(result.annualRevenue)}、年間販管費は${formatMan(result.annualCost)}です。営業利益は${formatMan(result.annualProfit)}で、比較したい営業利益との差額は${formatSignedMan(targetGap)}です。`;
    return;
  }

  if (targetGap < 0) {
    headline.textContent = "目標利益までの不足が見える";
    insight.textContent = `現在プランの年間営業利益は約${formatMan(result.annualProfit)}で、目標利益まであと${formatMan(Math.abs(targetGap))}です。ランク別採用計画の人数や1人あたり年間仲介手数料を調整すると、不足の埋め方を確認できます。`;
    return;
  }

  headline.textContent = "目標利益を満たす設計が見える";
  insight.textContent = `現在プランの年間営業利益は約${formatMan(result.annualProfit)}で、目標利益を${formatSignedMan(targetGap)}上回っています。ランク別採用計画を動かすと、必要粗利とのバランスを確認できます。`;
}

function setProjection(values) {
  const rows = projection(values);

  document.getElementById("projectionRows").innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.year}年目</td>
        <td>${Math.round(row.result.agents)}名</td>
        <td>${formatNumber(row.result.annualDeals, 1)}件</td>
        <td>${formatMan(row.result.annualRevenue)}</td>
        <td>${formatMan(row.result.annualProfit)}</td>
        <td>${formatMan(row.cumulative)}</td>
      </tr>
    `)
    .join("");
}

function seminarTalkPoint(reverse, result, targetGap) {
  if (activePreset === "current") {
    return "既存の不動産会社が、売上から歩合・ロイヤリティ・販管費を差し引いて営業利益を作る構造を確認します。";
  }
  if (activePreset === "phase300") {
    return `まずは${reverse.agents}名体制で黒字化ラインを確認します。必要粗利は${formatMan(reverse.requiredRevenue)}です。`;
  }
  if (activePreset === "phase500") {
    return `固定費を軽く保つと、少人数でも利益を作れる構造が見えてきます。目標との差額は${formatSignedMan(targetGap)}です。`;
  }
  if (activePreset === "phase1000") {
    return `${reverse.agents}名規模になると、オーナー個人の売上から組織収益へ移るイメージを確認できます。`;
  }
  if (activePreset === "phase3000") {
    return "採用力と生産性が伸びた時に、利益が大きく拡張する構造を確認します。";
  }
  return "目標利益、採用人数、必要手数料の関係を確認します。";
}

function renderSeminarSummary(values, result) {
  const reverse = reverseCalc(values, result);
  const projectionRows = projection(values);
  const cumulative = projectionRows.at(-1)?.cumulative || 0;
  const targetGap = result.annualProfit - values.targetProfit;
  const isCurrent = activePreset === "current";
  const operatingMargin = result.grossCommission > 0 ? result.annualProfit / result.grossCommission * 100 : 0;

  document.getElementById("seminarPhaseLabel").textContent = reverse.label || "利益フェーズ";
  const summaryTitleEl = document.getElementById("seminarSummaryTitle");
  if (summaryTitleEl) summaryTitleEl.textContent = isCurrent ? "従来の不動産会社の収益構造" : "オフィス経営の収益構造";
  document.getElementById("seminarPrimaryLabel").textContent = isCurrent ? "年間売上高" : "年間営業利益";
  document.getElementById("seminarAnnualProfit").textContent = isCurrent ? formatMan(result.grossCommission) : formatMan(result.annualProfit);
  document.getElementById("seminarProfitGap").textContent = isCurrent
    ? `営業利益 ${formatMan(result.annualProfit)} / 比較利益との差額 ${formatSignedMan(targetGap)}`
    : `目標利益 ${formatMan(values.targetProfit)} / 差額 ${formatSignedMan(targetGap)}`;
  document.getElementById("seminarSecondLabel").textContent = isCurrent ? "会社計上粗利" : "採用人数";
  document.getElementById("seminarAgents").textContent = isCurrent ? formatMan(result.annualRevenue) : `${result.agents.toLocaleString("ja-JP")}名`;
  document.getElementById("seminarSecondNote").textContent = isCurrent ? "売上高 - 歩合 - ロイヤリティ" : "ランク別採用計画の合計";
  document.getElementById("seminarThirdLabel").textContent = isCurrent ? "年間販管費" : "Ag1人あたり必要手数料";
  document.getElementById("seminarRequiredPerAgent").textContent = isCurrent ? formatMan(result.annualCost) : formatMan(reverse.requiredPerAgent);
  document.getElementById("seminarThirdNote").textContent = isCurrent ? "固定費・営業人件費の年間合計" : "目標利益から逆算";
  document.getElementById("seminarFourthLabel").textContent = isCurrent ? "営業利益率" : "5年累計利益";
  document.getElementById("seminarCumulativeProfit").textContent = isCurrent ? `${formatNumber(operatingMargin, 1)}%` : formatMan(cumulative);
  document.getElementById("seminarFourthNote").textContent = isCurrent ? "営業利益 ÷ 年間売上高" : "年次シミュレーション";
  document.getElementById("seminarTalkPoint").textContent = seminarTalkPoint(reverse, result, targetGap);
  document.getElementById("seminarRevenueMix").textContent = isCurrent
    ? `会社計上粗利 ${formatMan(result.annualRevenue)}、年間販管費 ${formatMan(result.annualCost)}、営業利益 ${formatMan(result.annualProfit)}です。`
    : `オーナー粗利 ${formatMan(reverse.ownerRevenue)}、Agフィー利益 ${formatMan(reverse.deskRevenue)}、Ag手数料粗利 ${formatMan(result.agentCommissionRevenue)}です。`;
}

function reverseCalc(values, result) {
  const phase = phasePlans[activePreset];
  const annualFixed = values.monthlyFixed * 12;
  const ownerSalary = values.ownerSalary * 12;
  const rent = values.rent * 12;
  const officeFee = values.officeFee * 12;
  const adCoopFee = values.adCoopFee * 12;
  const officeStaff = values.officeStaff * 12;
  const otherExpense = values.otherExpense * 12;
  const salesEmployeeSalary = values.salesEmployeeSalary * 12;
  const generalExpense = values.generalExpense * 12;
  const ownerTransaction = values.ownerTransaction;
  const targetProfit = values.targetProfit;
  const agents = result.agents;
  const effectiveDesk = result.rankPlan ? result.rankPlan.averageMonthlyDeskFee : 0;
  const effectiveSplit = result.rankPlan ? result.rankPlan.averageOfficeTake : 0;
  const requiredRevenue = annualFixed + targetProfit;
  const deskRevenue = agents * effectiveDesk * 12;
  const ownerRevenue = ownerTransaction * (100 - ownerRoyaltyRate(values)) / 100;
  const requiredOfficeCommission = Math.max(0, requiredRevenue - deskRevenue - ownerRevenue);
  const officeTakeRate = effectiveSplit / 100;
  const requiredAgentCommissionSales = officeTakeRate > 0 ? requiredOfficeCommission / officeTakeRate : 0;
  const requiredCommissionSales = ownerTransaction + requiredAgentCommissionSales;
  const requiredPerAgent = agents > 0 ? requiredAgentCommissionSales / agents : 0;
  const expenseImpact = officeTakeRate > 0 ? 200 / officeTakeRate : 0;

  return {
    ...phase,
    annualFixed,
    ownerSalary,
    rent,
    officeFee,
    adCoopFee,
    officeStaff,
    otherExpense,
    salesEmployeeSalary,
    generalExpense,
    ownerTransaction,
    ownerRevenue,
    targetProfit,
    agents,
    effectiveDesk,
    effectiveSplit,
    requiredRevenue,
    deskRevenue,
    requiredOfficeCommission,
    requiredCommissionSales,
    requiredAgentCommissionSales,
    requiredPerAgent,
    expenseImpact,
  };
}

function setReverse(values, result) {
  const reverse = reverseCalc(values, result);
  const isCurrent = activePreset === "current";
  const resultTitle = document.getElementById("resultTitle");
  const grossSourceTitle = document.getElementById("grossSourceTitle");
  const grossSourceGrid = document.getElementById("grossSourceGrid");

  if (resultTitle) resultTitle.textContent = isCurrent ? "現在の損益結果" : "現在プランの結果";
  if (grossSourceTitle) grossSourceTitle.textContent = isCurrent ? "年間会社計上粗利の内訳" : "年間オフィス粗利の内訳";
  const sourceSumLabel = document.getElementById("sourceSumLabel");
  if (sourceSumLabel) sourceSumLabel.textContent = isCurrent ? "上の2項目を合計" : "上の3項目を合計";
  // 年次シミュレーション表は将来の成長前提なので、従来タブでは非表示・RE/MAXフェーズでのみ表示
  // （CSSの .table-panel { display:none } をインラインで上書き）
  const tablePanel = document.querySelector(".table-panel");
  if (tablePanel) tablePanel.style.display = isCurrent ? "none" : "block";
  grossSourceGrid.classList.toggle("reverse-grid--formula", !isCurrent);
  grossSourceGrid.classList.toggle("reverse-grid--current-source", isCurrent);
  grossSourceGrid.innerHTML = isCurrent ? `
    <article class="reverse-card">
      <span>社長粗利</span>
      <strong id="sourceOwnerRevenue">0万円</strong>
      <small>社長手数料からロイヤリティを控除</small>
    </article>
    <article class="reverse-card">
      <span>社員粗利</span>
      <strong id="sourceAgentCommissionRevenue">0万円</strong>
      <small>社員手数料からロイヤリティ・歩合を控除</small>
    </article>
  ` : `
    <article class="reverse-card">
      <span>オーナー粗利</span>
      <strong id="sourceOwnerRevenue">0万円</strong>
      <small>オーナー手数料 × 94%</small>
    </article>
    <span class="formula-operator" aria-hidden="true">+</span>
    <article class="reverse-card">
      <span>Agフィー年間利益</span>
      <strong id="sourceDeskRevenue">0万円</strong>
      <small>本部支払0.8万円/月を控除後</small>
    </article>
    <span class="formula-operator" aria-hidden="true">+</span>
    <article class="reverse-card">
      <span>Ag手数料粗利</span>
      <strong id="sourceAgentCommissionRevenue">0万円</strong>
      <small>採用・報酬設計から計算</small>
    </article>
  `;

  document.getElementById("phaseBadge").textContent = reverse.label;
  if (isCurrent) {
    document.getElementById("sourceOwnerRevenue").textContent = formatMan(result.ownerRevenue);
    // 社員計上粗利＝会社計上粗利(総額) − 社長粗利（タイプ別売上計画の合計と一致）
    document.getElementById("sourceAgentCommissionRevenue").textContent = formatMan(result.annualRevenue - result.ownerRevenue);
  } else {
    document.getElementById("sourceOwnerRevenue").textContent = formatMan(reverse.ownerRevenue);
    document.getElementById("sourceAgentCommissionRevenue").textContent = formatMan(result.agentCommissionRevenue);
    document.getElementById("sourceDeskRevenue").textContent = formatMan(reverse.deskRevenue);
  }
  document.getElementById("ownerRevenueValue").textContent = formatMan(reverse.ownerRevenue);
  document.getElementById("ownerRevenueNote").textContent = `${formatCompact(ownerRoyaltyRate(values))}%ロイヤリティ控除後`;

}

function rankInput(value, field, index, suffix = "") {
  const isEffectiveAgentRate = agentRateFields.has(field);
  const displayValue = value === null ? "" : isEffectiveAgentRate ? effectiveAgentRate(value) : value;
  const isYen = suffix.includes("円") || field.toLowerCase().includes("yen");
  return `<input class="rank-input" data-rank-index="${index}" data-field="${field}" ${isEffectiveAgentRate ? 'data-effective-rate="true"' : ""} ${isYen ? 'data-yen-input="true" type="text" inputmode="numeric"' : 'type="number" min="0"'} step="${isEffectiveAgentRate ? "0.1" : "1"}" value="${isYen ? formatInputYen(displayValue) : displayValue}" aria-label="${agentRanks[index].rank} ${field}" />${suffix}`;
}

function currentRankInput(value, field, index, suffix = "", step = "1") {
  const displayValue = value === null ? "" : value;
  const isYen = suffix.includes("円");
  return `<input class="rank-input" data-current-rank-index="${index}" data-field="${field}" ${isYen ? 'data-yen-input="true" type="text" inputmode="numeric"' : 'type="number" min="0"'} step="${step}" value="${isYen ? formatInputYen(displayValue) : displayValue}" aria-label="${currentRankCompensations[index].rank} ${field}" />${suffix}`;
}

function currentEmployeeIncomeForRank(rank, annualTransactionMan) {
  const fixedSalaryMan = Math.max(0, Number(rank.fixedSalaryYen) || 0) / 10000 * 12;
  const bonusMan = Math.max(0, Number(rank.fixedSalaryYen) || 0) / 10000 * Math.max(0, Number(rank.bonusMonths) || 0);
  const commissionRate = Math.max(0, Number(rank.commissionRate) || 0) / 100;
  return fixedSalaryMan + bonusMan + annualTransactionMan * commissionRate;
}

function currentCompanyProfitForRank(rank, count, annualTransactionMan, royaltyRate = 0) {
  const commissionRate = Math.max(0, Number(rank.commissionRate) || 0) / 100;
  const royalty = Math.min(100, Math.max(0, Number(royaltyRate) || 0)) / 100;
  return annualTransactionMan * count * Math.max(0, 1 - commissionRate - royalty);
}

function renderRankRows() {
  const isCurrent = activePreset === "current";
  const rankPanel = document.querySelector(".rank-panel");
  if (rankPanel) rankPanel.hidden = !isCurrent;
  document.getElementById("rankTitle").textContent = isCurrent ? "社員報酬タイプ" : "ランク別フィー・コミッション設定";
  document.getElementById("rankSource").hidden = isCurrent;
  const rankReference = document.getElementById("rankReference");
  // 報酬カード（上部ボックス）は下の編集テーブルと重複するため非表示
  rankReference.hidden = true;
  rankReference.innerHTML = "";

  const table = document.querySelector(".rank-table");
  table.classList.toggle("rank-table--current", isCurrent);

  const tableHead = document.querySelector(".rank-table thead");
  tableHead.innerHTML = isCurrent ? `
    <tr>
      <th>報酬タイプ</th>
      <th>固定給</th>
      <th>歩合率</th>
      <th>賞与</th>
      <th>法定福利費</th>
    </tr>
  ` : `
    <tr>
      <th>ランク</th>
      <th>月額Agフィー</th>
      <th>宅建士 通常</th>
      <th>非保持者 通常</th>
      <th>達成基準</th>
      <th>宅建士 達成後</th>
    </tr>
  `;

  document.getElementById("rankRows").innerHTML = isCurrent ? currentRankCompensations
    .map((rank, index) => `
      <tr>
        <td>
          <input class="rank-pay-type-input" data-current-rank-index="${index}" data-field="payType" type="text" value="${rank.payType || ""}" aria-label="${rank.rank} 報酬タイプ" />
        </td>
        <td>${currentRankInput(rank.fixedSalaryYen, "fixedSalaryYen", index, "<span>円</span>")}</td>
        <td>${currentRankInput(rank.commissionRate, "commissionRate", index, "<span>%</span>")}</td>
        <td>${currentRankInput(rank.bonusMonths, "bonusMonths", index, "<span>か月</span>", "0.1")}</td>
        <td>${currentRankInput(rank.welfareRate, "welfareRate", index, "<span>%</span>")}</td>
      </tr>
    `)
    .join("") : agentRanks
    .map((rank, index) => `
      <tr>
        <td>
          <input class="rank-name-input" data-rank-index="${index}" data-field="rank" type="text" value="${rank.rank}" aria-label="ランク名" />
          <small>${rank.note}</small>
        </td>
        <td>${rankInput(rank.monthlyFeeYen, "monthlyFeeYen", index, "<span>円</span>")}</td>
        <td>${rankInput(rank.licensedRate, "licensedRate", index)}<span>%</span></td>
        <td>${rankInput(rank.unlicensedRate, "unlicensedRate", index)}<span>%</span></td>
        <td>${rankInput(rank.thresholdMan, "thresholdMan", index)}<span>万円</span></td>
        <td>${rankInput(rank.bonusLicensedRate, "bonusLicensedRate", index)}<span>%</span></td>
      </tr>
    `)
    .join("");
}

function updateRankData(target) {
  if (target.dataset.currentRankIndex) {
    const index = Number(target.dataset.currentRankIndex);
    const field = target.dataset.field;
    const rank = currentRankCompensations[index];
    if (!rank || !field) return;
    if (field === "rank") {
      rank.rank = target.value.trim() || rank.rank;
    } else if (field === "payType") {
      rank.payType = target.value.trim() || rank.payType;
    } else {
      rank[field] = Math.max(0, parseFormattedNumber(target.value));
    }
    renderRankPlanRows();
    render();
    return;
  }

  const index = Number(target.dataset.rankIndex);
  const field = target.dataset.field;
  const rank = agentRanks[index];
  if (!rank || !field) return;

  if (field === "rank") {
    rank.rank = target.value.trim() || rank.rank;
  } else {
    const nextValue = parseFormattedNumber(target.value);
    rank[field] = target.value === "" ? null : target.dataset.effectiveRate ? baseAgentRateFromEffective(nextValue) : nextValue;
  }

  renderRankPlanRows();
  render();
}

function renderRankPlanRows() {
  const isCurrent = activePreset === "current";
  const currentRoyaltyRate = isCurrent ? parseFormattedNumber(inputs.salesRoyaltyRate.value) : 0;
  document.getElementById("rankPlanEyebrow").textContent = isCurrent ? "Sales Mix" : "Recruiting Mix";
  document.getElementById("rankPlanTitle").textContent = isCurrent ? "タイプ別売上計画" : "採用・報酬設計";
  const typeButtons = document.getElementById("rankPlanTypeButtons");
  if (typeButtons) {
    typeButtons.hidden = !isCurrent;
    typeButtons.innerHTML = isCurrent ? currentSalesPlanPresets
      .map((preset) => `<button class="rank-plan-type-button${preset.index === activeSalesPlanIndex ? " is-active" : ""}" data-current-sales-plan="${preset.index}" type="button">${(currentRankCompensations[preset.index] || {}).payType || preset.label}</button>`)
      .join("") : "";
  }
  const mgmtWrap = document.getElementById("managementTypeSelect");
  if (mgmtWrap) mgmtWrap.hidden = !isCurrent;
  const mgmtButtons = document.getElementById("managementTypeButtons");
  if (mgmtButtons) {
    mgmtButtons.innerHTML = Object.entries(managementTypePresets)
      .map(([key, m]) => `<button class="preset${key === activeManagementType ? " is-active" : ""}" data-management-type="${key}" type="button"><strong>${m.label}</strong><small>${m.sub}</small></button>`)
      .join("");
  }
  const phaseBadge = document.getElementById("phaseBadge");
  if (phaseBadge) phaseBadge.hidden = isCurrent;
  const table = document.querySelector(".rank-plan-table");
  table.classList.toggle("rank-plan-table--current", isCurrent);
  table.classList.toggle("rank-plan-table--agent", !isCurrent);
  const tableHead = document.querySelector(".rank-plan-table thead");
  tableHead.innerHTML = isCurrent ? `
    <tr>
      <th>報酬タイプ</th>
      <th>人数</th>
      <th>1人あたり年間仲介手数料</th>
      <th>歩合率</th>
      <th>1人あたり営業社員年収</th>
      <th>会社計上粗利</th>
    </tr>
  ` : `
    <tr>
      <th>ランク</th>
      <th>採用人数</th>
      <th>年手数料/人</th>
      <th>月額フィー</th>
      <th>コミッション率</th>
      <th>達成基準</th>
      <th><span>達成後</span><small>コミッション率</small></th>
      <th><span>Ag収入/人</span><small>フィー控除後</small></th>
      <th>手数料粗利</th>
    </tr>
  `;

  const totalLabelCell = document.querySelector(".rank-plan-total-row td:first-child");
  if (totalLabelCell) totalLabelCell.colSpan = isCurrent ? 5 : 8;
  const summaryCell = document.getElementById("rankPlanSummaryCell");
  if (summaryCell) summaryCell.colSpan = isCurrent ? 6 : 9;

  const rowRanks = isCurrent ? currentRankCompensations : agentRanks;
  document.getElementById("rankPlanRows").innerHTML = rowRanks
    .map((rank, index) => {
      const plan = rankPlan[index] || { count: 0, annualTransactionMan: 0 };
      const currentRank = currentRankCompensations[index] || {};
      const agentRank = agentRanks[index] || agentRanks.at(-1);
      const officeRevenue = plan.count * commissionRevenueForRank(agentRank, plan.annualTransactionMan);
      const agentIncome = agentIncomeForRank(agentRank, plan.annualTransactionMan);
      const currentEmployeeIncome = currentEmployeeIncomeForRank(currentRank, plan.annualTransactionMan);
      const currentCompanyProfit = currentCompanyProfitForRank(currentRank, plan.count, plan.annualTransactionMan, currentRoyaltyRate);
      return isCurrent ? `
        <tr>
          <td><span class="rank-plan-pay-type">${currentRank.payType || rank.payType || ""}</span></td>
          <td><span class="unit-input"><input class="rank-plan-input" data-plan-index="${index}" data-field="count" type="number" min="0" step="1" value="${plan.count}" aria-label="${currentRank.rank || rank.rank} 人数" /><span>名</span></span></td>
          <td><span class="unit-input"><input class="rank-plan-input rank-plan-input--wide" data-plan-index="${index}" data-field="annualTransactionMan" type="number" min="0" step="10" value="${plan.annualTransactionMan}" aria-label="${currentRank.rank || rank.rank} 年間仲介手数料" /><span>万円</span></span></td>
          <td>${formatPercent(currentRank.commissionRate || 0)}</td>
          <td id="rankPlanAgentIncome-${index}">${formatMan(currentEmployeeIncome)}</td>
          <td id="rankPlanOffice-${index}">${formatMan(currentCompanyProfit)}</td>
        </tr>
      ` : `
        <tr>
          <td>
            <input class="rank-name-input" data-rank-index="${index}" data-field="rank" type="text" value="${rank.rank}" aria-label="ランク名" />
            <small>${rank.note}</small>
          </td>
          <td><span class="unit-input"><input class="rank-plan-input" data-plan-index="${index}" data-field="count" type="number" min="0" step="1" value="${plan.count}" aria-label="${rank.rank}ランク 採用人数" /><span>名</span></span></td>
          <td><span class="unit-input"><input class="rank-plan-input rank-plan-input--wide" data-plan-index="${index}" data-field="annualTransactionMan" type="number" min="0" step="10" value="${plan.annualTransactionMan}" aria-label="${rank.rank}ランク 年間仲介手数料" /><span>万円</span></span></td>
          <td><span class="unit-input">${rankInput(rank.monthlyFeeYen, "monthlyFeeYen", index, "")}<span>円</span></span></td>
          <td><span class="unit-input">${rankInput(rank.licensedRate, "licensedRate", index)}<span>%</span></span></td>
          <td><span class="unit-input">${rankInput(rank.thresholdMan, "thresholdMan", index)}<span>万円</span></span></td>
          <td><span class="unit-input">${rankInput(rank.bonusLicensedRate, "bonusLicensedRate", index)}<span>%</span></span></td>
          <td id="rankPlanAgentIncome-${index}">${formatMan(agentIncome)}</td>
          <td id="rankPlanOffice-${index}">${formatMan(officeRevenue)}</td>
        </tr>
      `;
    })
    .join("");
}

function setRankPlanRowOutputs() {
  const isCurrent = activePreset === "current";
  const currentRoyaltyRate = isCurrent ? parseFormattedNumber(inputs.salesRoyaltyRate.value) : 0;
  let totalOfficeProfit = 0;
  const rowRanks = isCurrent ? currentRankCompensations : agentRanks;
  rowRanks.forEach((rank, index) => {
    const plan = rankPlan[index] || { count: 0, annualTransactionMan: 0 };
    const currentRank = currentRankCompensations[index] || {};
    const officeProfit = isCurrent
      ? currentCompanyProfitForRank(currentRank, plan.count, plan.annualTransactionMan, currentRoyaltyRate)
      : plan.count * commissionRevenueForRank(rank, plan.annualTransactionMan);
    const agentIncome = isCurrent
      ? currentEmployeeIncomeForRank(currentRank, plan.annualTransactionMan)
      : agentIncomeForRank(rank, plan.annualTransactionMan);
    totalOfficeProfit += officeProfit;
    const agentCell = document.getElementById(`rankPlanAgentIncome-${index}`);
    const cell = document.getElementById(`rankPlanOffice-${index}`);
    if (agentCell) agentCell.textContent = formatMan(agentIncome);
    if (cell) cell.textContent = formatMan(officeProfit);
  });

  const totalCell = document.getElementById("rankPlanProfitTotal");
  if (totalCell) totalCell.textContent = formatMan(totalOfficeProfit);
}

function setRankPlanSummary(result) {
  const isCurrent = activePreset === "current";
  const plan = result.rankPlan || calcRankPlan(getValues());
  const currentRoyaltyRate = isCurrent ? parseFormattedNumber(inputs.salesRoyaltyRate.value) : 0;
  const currentCompanyProfitTotal = rankPlan.reduce((sum, row, index) => (
    sum + currentCompanyProfitForRank(currentRankCompensations[index] || {}, row.count, row.annualTransactionMan, currentRoyaltyRate)
  ), 0);
  document.getElementById("rankPlanTotal").textContent = `合計 ${plan.agents}名`;
  document.getElementById("rankPlanSummary").innerHTML = isCurrent ? `
    <article>
      <span>営業人数</span>
      <strong>${plan.agents}名</strong>
      <small>タイプ別人数の合計</small>
    </article>
    <article>
      <span>年間売上高</span>
      <strong>${formatMan(plan.grossCommission)}</strong>
      <small>各タイプの人数 × 年間売上</small>
    </article>
    <article>
      <span>会社計上粗利合計</span>
      <strong>${formatMan(currentCompanyProfitTotal)}</strong>
      <small>売上から歩合・ロイヤリティを控除後</small>
    </article>
  ` : `
    <article>
      <span>採用人数</span>
      <strong>${plan.agents}名</strong>
      <small>ランク別人数の合計</small>
    </article>
    <article>
      <span>年間仲介手数料</span>
      <strong>${formatMan(plan.grossCommission)}</strong>
      <small>各ランクの人数 × 年間金額</small>
    </article>
    <article>
      <span>平均オフィス取り分</span>
      <strong>${formatNumber(plan.averageOfficeTake, 1)}%</strong>
      <small>達成後条件を含む加重平均</small>
    </article>
  `;
}

function updateRankPlanData(target) {
  const index = Number(target.dataset.planIndex);
  const field = target.dataset.field;
  const plan = rankPlan[index];
  if (!plan || !field) return;

  plan[field] = Math.max(0, Number(target.value) || 0);
  render();
}

function render() {
  const values = getValues();
  const result = calc(values);

  setOutputs(values);
  setKpis(values, result);
  setInsight(values, result);
  setProjection(values);
  setRankPlanRowOutputs();
  setRankPlanSummary(result);
  setReverse(values, result);
  renderSeminarSummary(values, result);
  if (actualSummaryState) setSimulationAssumptions(getActiveActualPeriod(actualSummaryState));
  highlightPresetButtons();   // 上部フェーズタブの赤(選択中)を常に最新化
}

function applyPhaseRankPlan(name) {
  const plan = phaseRankPlans[name] || phaseRankPlans.phase300;
  plan.forEach((row, index) => {
    rankPlan[index] = { ...row };
  });
}

function applyQuickRankPlan() {
  // 「利益◯◯万円」バッジのクリックで、そのフェーズの例示採用計画を一発入力。
  // phaseQuickRankPlans に専用の例示があればそれを、無ければそのフェーズの既定採用計画を使う
  // （phase300のみ専用例示。500/1000/3000は未定義だったため従来は無反応だった）。
  const plan = phaseQuickRankPlans[activePreset] || phaseRankPlans[activePreset];
  if (!plan) return;
  plan.forEach((row, index) => {
    rankPlan[index] = { ...row };
  });
  renderRankPlanRows();
  render();
}

function applyCurrentSalesPlan(index) {
  if (activePreset !== "current") return;
  const preset = currentSalesPlanPresets.find((item) => item.index === index);
  if (!preset) return;
  activeSalesPlanIndex = index;
  currentRankCompensations.forEach((_, rowIndex) => {
    rankPlan[rowIndex] = { count: 0, annualTransactionMan: 0 };
  });
  const plan = (salesPlanByManagement[activeManagementType] || salesPlanByManagement.ikkatsu)[index] || { count: 0, annualTransactionMan: 0 };
  rankPlan[index] = { count: plan.count, annualTransactionMan: plan.annualTransactionMan };
  renderRankPlanRows();
  render();
}

function applyManagementType(key) {
  if (activePreset !== "current") return;
  const m = managementTypePresets[key];
  if (!m) return;
  activeManagementType = key;
  activeSalesPlanIndex = m.planIndex;
  Object.entries(m.values).forEach(([id, val]) => { if (inputs[id]) inputs[id].value = val; });
  currentRankCompensations.forEach((_, i) => { rankPlan[i] = { count: 0, annualTransactionMan: 0 }; });
  const natural = (salesPlanByManagement[key] || [])[m.planIndex] || { count: m.count, annualTransactionMan: m.perCommission };
  rankPlan[m.planIndex] = { count: natural.count, annualTransactionMan: natural.annualTransactionMan };
  renderRankRows();
  renderRankPlanRows();
  render();
}

function currentInputValues() {
  return Object.fromEntries(ids.map((id) => [id, parseFormattedNumber(inputs[id].value)]));
}

function savePresetState(name = activePreset) {
  if (!presetStates[name]) return;
  presetStates[name] = {
    values: currentInputValues(),
    rankPlan: cloneRows(rankPlan),
    agentRanks: cloneRows(agentRanks),
    currentRankCompensations: cloneRows(currentRankCompensations),
  };
}

function loadPresetState(name) {
  const state = presetStates[name] || createInitialPresetState(name);
  ids.forEach((id) => {
    inputs[id].value = state.values[id] ?? presets[name]?.[id] ?? 0;
  });
  state.rankPlan.forEach((row, index) => {
    rankPlan[index] = { ...row };
  });
  state.agentRanks.forEach((rank, index) => {
    agentRanks[index] = { ...rank };
  });
  state.currentRankCompensations.forEach((rank, index) => {
    currentRankCompensations[index] = { ...rank };
  });
}

// 上部フェーズタブの赤(選択中)/白を、いま開いているタブ(activePreset)に合わせて更新。
// ＝そのタブを開いている間は常に赤。リセットしても activePreset は変わらないので赤のまま。
// 経営タイプボタン(.preset[data-management-type])は対象外にするため data-preset 限定で選択。
function highlightPresetButtons() {
  document.querySelectorAll(".preset-row--phase .preset").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === activePreset);
  });
}

function applyPreset(name) {
  if (!presets[name] || name === activePreset) return;   // 同じタブの再クリックは何もしない
  // タブ切替＝「保持」: 現タブの入力(人数・金額・報酬設定)を保存し、切替先タブの保存値を復元する。
  // これにより、タブを行き来しても入力した値がデフォルトに戻らない（初回だけ既定の例示を表示）。
  // 例示に戻したいときは各タブの「利益◯◯万円」ボタン（applyQuickRankPlan）を使う。
  savePresetState(activePreset);
  activePreset = name;
  loadPresetState(name);
  renderRankRows();
  renderRankPlanRows();
  render();   // render内で highlightPresetButtons を呼びタブの赤を最新化
}

function resetAll() {
  if (activePreset === "current") {
    // リセット＝タイプ別売上計画を全て0に（人数・手数料）。報酬タイプ・事業前提・社長手数料はそのまま。
    currentRankCompensations.forEach((_, i) => { rankPlan[i] = { count: 0, annualTransactionMan: 0 }; });
    activeSalesPlanIndex = null;
    renderRankPlanRows();
    render();
    return;
  }
  // RE/MAXフェーズタブ(300/500/1000/3000)：採用計画(rankPlan＝人数・手数料)を全て0に。
  // 事業前提・報酬設定はそのまま。タブの選択色(赤)はそのまま維持する。
  rankPlan.forEach((_, i) => { rankPlan[i] = { count: 0, annualTransactionMan: 0 }; });
  renderRankPlanRows();
  render();
}

function setView(view) {
  const nextView = ["actual", "agents"].includes(view) ? view : "simulation";
  document.body.dataset.view = nextView;
  document.querySelectorAll(".view-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTab === nextView);
  });
}

function setSeminarMode(enabled, shouldSave = true) {
  const isEnabled = Boolean(enabled);
  document.body.dataset.seminar = isEnabled ? "true" : "false";
  const button = document.getElementById("seminarToggle");
  if (button) {
    button.setAttribute("aria-pressed", String(isEnabled));
    button.textContent = isEnabled ? "通常表示へ" : "セミナー表示";
  }
  if (shouldSave) {
    localStorage.setItem(seminarModeStorageKey, isEnabled ? "true" : "false");
  }
  if (isEnabled && document.body.dataset.view !== "simulation") {
    setView("simulation");
  }
}

function normalizeNumberInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.readOnly) return;
  if (target.dataset.yenInput) {
    const raw = normalizeNumericText(target.value).replace(/[^\d]/g, "");
    target.value = raw ? raw.replace(/^0+(?=\d)/, "") : "";
    return;
  }
  if (target.type !== "number") return;
  const value = target.value;
  if (!value || value === "0") return;
  const normalized = value.replace(/^(-?)0+(?=\d)/, "$1");
  if (normalized !== value) target.value = normalized;
}

function prepareYenInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.dataset.yenInput || target.readOnly) return;
  const value = parseFormattedNumber(target.value);
  target.value = value ? String(Math.round(value)) : "";
}

function formatYenInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.dataset.yenInput) return;
  const value = parseFormattedNumber(target.value);
  target.value = value ? formatInputYen(value) : "0";
}

document.addEventListener("input", normalizeNumberInput, true);
document.addEventListener("focusin", prepareYenInput);
document.addEventListener("focusout", formatYenInput);
ids.forEach((id) => inputs[id].addEventListener("input", render));
document.getElementById("resetButton").addEventListener("click", resetAll);
const rankRowsElement = document.getElementById("rankRows");
rankRowsElement.addEventListener("change", (event) => updateRankData(event.target));
rankRowsElement.addEventListener("focusout", (event) => updateRankData(event.target));
document.getElementById("rankPlanRows").addEventListener("input", (event) => {
  if (event.target.dataset.rankIndex || event.target.dataset.currentRankIndex) {
    updateRankData(event.target);
    return;
  }
  updateRankPlanData(event.target);
});
document.getElementById("rankPlanRows").addEventListener("change", (event) => {
  if (event.target.dataset.rankIndex || event.target.dataset.currentRankIndex) updateRankData(event.target);
});
document.getElementById("rankPlanRows").addEventListener("focusout", (event) => {
  if (event.target.dataset.rankIndex || event.target.dataset.currentRankIndex) updateRankData(event.target);
});
document.getElementById("actualCsvInput").addEventListener("change", (event) => loadActualCsv(event.target.files[0]));
document.getElementById("actualCsvClearButton").addEventListener("click", clearActualSalesRows);
document.getElementById("actualPeriods").addEventListener("click", (event) => updateActualPeriod(event.target));
document.getElementById("expenseCsvInput").addEventListener("change", (event) => loadExpenseCsv(event.target.files[0]));
document.getElementById("agentRegisterForm").addEventListener("submit", addRegisteredAgent);
document.getElementById("agentRankInput").addEventListener("change", syncAgentCommissionInput);
document.getElementById("agentLicenseInput").addEventListener("change", syncAgentCommissionInput);
document.getElementById("headOfficeMonthlyRows").addEventListener("change", (event) => updateHeadOfficePaymentHistory(event.target));
document.getElementById("headOfficeOneTimeRows").addEventListener("change", (event) => updateHeadOfficePaymentHistory(event.target));
document.getElementById("headOfficeMonthlyRows").addEventListener("click", (event) => deleteHeadOfficePaymentHistory(event.target));
document.getElementById("headOfficeOneTimeRows").addEventListener("click", (event) => deleteHeadOfficePaymentHistory(event.target));
document.getElementById("headOfficeMonthlyAddButton").addEventListener("click", () => addHeadOfficePaymentHistory("monthlyRegistration"));
document.getElementById("headOfficeOneTimeAddButton").addEventListener("click", () => addHeadOfficePaymentHistory("registrationRenewalPayment"));
document.getElementById("registeredAgentRows").addEventListener("change", (event) => {
  if (event.target.dataset.feeHistoryId) {
    updateFeeHistory(event.target);
    return;
  }
  if (event.target.dataset.profileHistoryId) {
    updateProfileHistory(event.target);
    return;
  }
  updateRegisteredAgent(event.target);
});
document.getElementById("registeredAgentRows").addEventListener("click", (event) => {
  if (event.target.dataset.feeHistoryAdd) {
    addFeeHistory(event.target);
    return;
  }
  if (event.target.dataset.profileHistoryAdd) {
    addProfileHistory(event.target);
    return;
  }
  if (event.target.dataset.feeHistoryDelete) {
    deleteFeeHistory(event.target);
    return;
  }
  if (event.target.dataset.profileHistoryDelete) {
    deleteProfileHistory(event.target);
    return;
  }
  deleteRegisteredAgent(event.target);
});
document.getElementById("agentAnnualYear").addEventListener("input", (event) => {
  renderRegisteredAgents();
});
document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewTab));
});
document.getElementById("seminarToggle").addEventListener("click", () => {
  setSeminarMode(document.body.dataset.seminar !== "true");
});
document.querySelectorAll(".preset").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});
document.getElementById("phaseBadge").addEventListener("click", applyQuickRankPlan);
document.getElementById("rankPlanTypeButtons").addEventListener("click", (event) => {
  const button = event.target.closest("[data-current-sales-plan]");
  if (!button) return;
  applyCurrentSalesPlan(Number(button.dataset.currentSalesPlan));
});
document.getElementById("managementTypeButtons").addEventListener("click", (event) => {
  const button = event.target.closest("[data-management-type]");
  if (!button) return;
  applyManagementType(button.dataset.managementType);
});

actualSalesRows = readActualSalesRows();
if (actualSalesRows.length) {
  renderActuals(summarizeActuals(actualSalesRows));
}
renderActualCsvImportStatus();
registeredAgents = readRegisteredAgents();
headOfficePaymentSettings = readHeadOfficePaymentSettings();
document.getElementById("agentContractInput").value = getTodayInputValue();
document.getElementById("agentAnnualYear").value = new Date().getFullYear();
document.getElementById("headOfficeMonthlyStartInput").value = getTodayInputValue();
document.getElementById("headOfficeOneTimeStartInput").value = getTodayInputValue();
loadPresetState(activePreset);   // 初期表示を既定プリセット（従来の不動産会社）の値に同期
syncAgentCommissionInput();
renderRankRows();
renderRankPlanRows();
setSourceStatus();
renderRegisteredAgents();
render();
setSeminarMode(window.location.hash === "#seminar" || localStorage.getItem(seminarModeStorageKey) === "true", false);
