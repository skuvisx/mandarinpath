/**
 * Build per-level HSK vocabulary files from the open dataset
 * drkameleon/complete-hsk-vocabulary (MIT; definitions from CC-CEDICT, CC BY-SA 4.0).
 *
 * Output:
 *   public/data/hsk/hsk2-<1..6>.json   HSK 2.0 (legacy 2010 syllabus, levels 1–6: 4,991 words)
 *   public/data/hsk/hsk3-<1..7>.json   HSK 3.0 (2021 standard; "7" = band 7–9: 10,969 words)
 *   public/data/hsk/meta.json          counts + source/licence metadata
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';

const raw = JSON.parse(readFileSync('scripts/raw/complete.json', 'utf8'));
mkdirSync('public/data/hsk', { recursive: true });

const POS_ID = {
  n: 'kata benda', v: 'kata kerja', a: 'kata sifat', d: 'kata keterangan', m: 'numeralia',
  q: 'kata penggolong', r: 'kata ganti', p: 'preposisi', c: 'konjungsi', u: 'partikel',
  e: 'interjeksi', y: 'partikel modal', o: 'onomatope', t: 'kata waktu', f: 'kata arah',
  s: 'kata tempat', vn: 'kata kerja/benda', an: 'kata sifat/benda', ad: 'kata sifat/keterangan',
  nr: 'nama orang', ns: 'nama tempat', nz: 'nama khusus', nt: 'nama organisasi', i: 'idiom (chengyu)',
  l: 'ungkapan tetap', b: 'kata pembeda', z: 'kata keadaan', vd: 'kata kerja/keterangan', k: 'akhiran',
  h: 'awalan', g: 'morfem', j: 'singkatan', x: 'lainnya', w: 'tanda baca',
};

// Kangxi Radicals & Common Simplified Radicals with Indonesian explanations
const RADICAL_ID = {
  '一': 'satu / garis datar (yī)',
  '丨': 'garis tegak (shù)',
  '丶': 'titik (diǎn)',
  '丿': 'goresan miring kiri (piě)',
  '乙': 'kedua / lengkung (yǐ)',
  '亅': 'kait tegak (gōu)',
  '二': 'dua (èr)',
  '亠': 'tutup atas (tóu)',
  '人': 'orang / manusia (rén)',
  '亻': 'orang (rén - samping)',
  '儿': 'anak / kaki manusia (ér)',
  '入': 'masuk (rù)',
  '八': 'delapan / membagi (bā)',
  '丷': 'delapan terbalik',
  '冂': 'batas luar / kotak terbuka',
  '冖': 'penutup datar (mì)',
  '冫': 'es / dingin (bīng)',
  '几': 'meja kecil (jī)',
  '凵': 'wadah terbuka (kǎn)',
  '刀': 'pisau / pedang (dāo)',
  '刂': 'pisau berdiri (lìdāopáng)',
  '力': 'tenaga / kekuatan (lì)',
  '勹': 'membungkus (bāo)',
  '匕': 'sendok / belati (bǐ)',
  '匚': 'kotak wadah (fāng)',
  '十': 'sepuluh / lengkap (shí)',
  '卜': 'ramalan (bǔ)',
  '卩': 'segel / berlutut (jié)',
  '厂': 'tebing / lereng (hǎn)',
  '厶': 'pribadi / kepompong (sī)',
  '又': 'tangan kanan / lagi (yòu)',
  '口': 'mulut / ucapan / lubang (kǒu)',
  '囗': 'lingkaran / batas wilayah (wéi)',
  '土': 'tanah / bumi (tǔ)',
  '士': 'sarjana / prajurit (shì)',
  '夂': 'melangkah perlahan (zhǐ)',
  '夊': 'berjalan lambat (suī)',
  '夕': 'senja / malam (xī)',
  '大': 'besar / orang merentangkan tangan (dà)',
  '女': 'perempuan / wanita (nǚ)',
  '子': 'anak / keturunan (zǐ)',
  '宀': 'atap rumah (bǎogàitóu)',
  '寸': 'inci / ukuran / aturan (cùn)',
  '小': 'kecil (xiǎo)',
  '尢': 'pincang (wāng)',
  '尸': 'tubuh / jenazah / posisi (shī)',
  '山': 'gunung / bukit (shān)',
  '巛': 'sungai mengalir (chuān)',
  '川': 'sungai (chuān)',
  '工': 'pekerjaan / tukang (gōng)',
  '己': 'diri sendiri (jǐ)',
  '巾': 'kain / handuk (jīn)',
  '干': 'perisai / kering / batang (gān)',
  '幺': 'kecil / benang halus (yāo)',
  '广': 'atap luas / gedung (guǎng)',
  '廴': 'melangkah jauh (yǐn)',
  '廾': 'dua tangan mengangkat (gǒng)',
  '弋': 'anak panah bertali (yì)',
  '弓': 'busur panah (gōng)',
  '彐': 'moncong (jì)',
  '彡': 'bulu / pola hiasan / bayangan (shān)',
  '彳': 'langkah kaki / jalan kecil (chì)',
  '心': 'hati / pikiran / perasaan (xīn)',
  '忄': 'hati berdiri / emosi (shùxīnpáng)',
  '戈': 'tombak / senjata (gē)',
  '户': 'pintu / rumah tangga (hù)',
  '手': 'tangan / tindakan (shǒu)',
  '扌': 'tangan samping (tíshǒupáng)',
  '支': 'cabang / menopang (zhī)',
  '攴': 'memukul pelan (pū)',
  '攵': 'tindakan / mengetuk (fǎnwénpáng)',
  '文': 'tulisan / budaya / sastra (wén)',
  '斗': 'takaran / bertempur (dǒu)',
  '斤': 'kapak / setengah kati (jīn)',
  '方': 'persegi / arah / tempat (fāng)',
  '无': 'tidak ada / tiada (wú)',
  '日': 'matahari / hari / waktu (rì)',
  '曰': 'berkata (yuē)',
  '月': 'bulan / daging tubuh (yuè)',
  '木': 'pohon / kayu (mù)',
  '欠': 'menguap / kurang / berhutang (qiàn)',
  '止': 'berhenti / telapak kaki (zhǐ)',
  '歹': 'tulang rusak / buruk / bahaya (dǎi)',
  '殳': 'senjata tongkat (shū)',
  '毋': 'jangan (wú)',
  '比': 'membandingkan / berdampingan (bǐ)',
  '毛': 'bulu / rambut halus (máo)',
  '氏': 'klan / marga (shì)',
  '气': 'udara / uap / napas (qì)',
  '水': 'air / cairan (shuǐ)',
  '氵': 'tiga titik air / cairan (sāndiǎnshuǐ)',
  '火': 'api / panas (huǒ)',
  '灬': 'empat titik api bawah (sìdiǎndǐ)',
  '爪': 'cakar / kuku (zhǎo)',
  '爫': 'cakar atas (zhǎozìtóu)',
  '父': 'ayah (fù)',
  '片': 'irisan tipis / lembaran (piàn)',
  '牙': 'gigi geraham (yá)',
  '牛': 'sapi / kerbau (niú)',
  '牜': 'sapi samping (niúzìpáng)',
  '犬': 'anjing (quǎn)',
  '犭': 'hewan berkaki empat (fǎnquǎnpáng)',
  '玄': 'gelap / misterius (xuán)',
  '玉': 'giok / batu mulia (yù)',
  '王': 'raja / giok samping (wáng)',
  '瓜': 'labu / melon (guā)',
  '瓦': 'genteng / keramik (wǎ)',
  '甘': 'manis (gān)',
  '生': 'hidup / lahir / tumbuh (shēng)',
  '用': 'menggunakan (yòng)',
  '田': 'sawah / ladang (tián)',
  '疋': 'gulungan kain / kaki (pǐ)',
  '疒': 'penyakit / sakit (bìngzìtóu)',
  '癶': 'kaki melangkah naik (bō)',
  '白': 'putih / terang (bái)',
  '皮': 'kulit (pí)',
  '皿': 'piring / wadah makan (mǐn)',
  '目': 'mata / melihat (mù)',
  '矛': 'tombak panjang (máo)',
  '矢': 'anak panah (shǐ)',
  '石': 'batu / mineral (shí)',
  '示': 'altar / ritual / menunjukkan (shì)',
  '礻': 'altar / keberuntungan (shìzìpáng)',
  '禾': 'padi / gandum / tanaman biji (hé)',
  '穴': 'gua / lubang (xué)',
  '立': 'berdiri / mendirikan (lì)',
  '竹': 'bambu (zhú)',
  '⺮': 'bambu atas (zhúzìtóu)',
  '米': 'beras / biji-bijian (mǐ)',
  '糸': 'benang sutra halus (mì)',
  '纟': 'benang sutra / tekstil (jiǎosīpáng)',
  '缶': 'guci tanah liat (fǒu)',
  '网': 'jaring (wǎng)',
  '罒': 'jaring atas (wǎngzìtóu)',
  '羊': 'domba / kambing (yáng)',
  '羽': 'bulu sayap burung (yǔ)',
  '老': 'tua / berpengalaman (lǎo)',
  '而': 'dan / namun / janggut (ér)',
  '耒': 'bajak sawah (lěi)',
  '耳': 'telinga / mendengar (ěr)',
  '聿': 'kuas tulis (yù)',
  '肉': 'daging / bagian tubuh (ròu)',
  '臣': 'menteri / pejabat (chén)',
  '自': 'hidung / diri sendiri / dari (zì)',
  '至': 'tiba / mencapai puncak (zhì)',
  '臼': 'lesung (jiù)',
  '舌': 'lidah / bicara (shé)',
  '舟': 'perahu / kapal (zhōu)',
  '艮': 'berhenti / kokoh (gěn)',
  '色': 'warna / ekspresi wajah (sè)',
  '艸': 'rumput / tumbuhan (cǎo)',
  '艹': 'rumput / tumbuhan atas (cǎozìtóu)',
  '虍': 'belang harimau (hū)',
  '虫': 'serangga / hewan melata (chóng)',
  '血': 'darah (xuè)',
  '行': 'berjalan / baris / profesi (xíng)',
  '衣': 'pakaian / baju (yī)',
  '衤': 'pakaian samping (yīzìpáng)',
  '西': 'barat / penutup (xī)',
  '见': 'melihat / tampak (jiàn)',
  '見': 'melihat (jiàn)',
  '角': 'tanduk / sudut (jiǎo)',
  '言': 'perkataan / bahasa (yán)',
  '讠': 'perkataan / bicara (yánzìpáng)',
  '谷': 'lembah (gǔ)',
  '豆': 'kacang (dòu)',
  '豕': 'babi (shǐ)',
  '贝': 'kerang / uang / harta (bèi)',
  '貝': 'kerang / harta (bèi)',
  '赤': 'merah menyala (chì)',
  '走': 'berjalan cepat / lari (zǒu)',
  '足': 'kaki / melangkah / cukup (zú)',
  '⻊': 'kaki samping (zúzìpáng)',
  '身': 'tubuh / badan (shēn)',
  '车': 'kereta / kendaraan beroda (chē)',
  '車': 'kendaraan (chē)',
  '辛': 'pahit / kerja keras / pedas (xīn)',
  '辰': 'waktu / bintang / pagi (chén)',
  '辵': 'berjalan di jalan (chuò)',
  '辶': 'berjalan / perpindahan (zǒuzhīdǐ)',
  '邑': 'kota / wilayah (yì)',
  '阝': 'bukit (kiri) atau kota (kanan) (fù/yì)',
  '酉': 'guci arak / fermentasi (yǒu)',
  '采': 'memetik / memilih (cǎi)',
  '里': 'desa / bagian dalam / mil (lǐ)',
  '金': 'logam / emas (jīn)',
  '钅': 'logam / besi (jīnzìpáng)',
  '长': 'panjang / tumbuh / pemimpin (cháng/zhǎng)',
  '門': 'gerbang (mén)',
  '门': 'pintu gerbang (mén)',
  '阜': 'gundukan tanah / bukit (fù)',
  '隶': 'menangkap / bawahan (lì)',
  '隹': 'burung berekor pendek (zhuī)',
  '雨': 'hujan / cuaca (yǔ)',
  '青': 'hijau-biru / muda (qīng)',
  '非': 'bukan / salah / sayap berlawanan (fēi)',
  '面': 'wajah / permukaan / mi (miàn)',
  '革': 'kulit olahan / perubahan (gé)',
  '页': 'kepala / halaman buku (yè)',
  '頁': 'kepala / halaman (yè)',
  '风': 'angin / gaya (fēng)',
  '飞': 'terbang (fēi)',
  '食': 'makanan / makan (shí)',
  '饣': 'makanan / hidangan (shízìpáng)',
  '首': 'kepala / pertama (shǒu)',
  '香': 'harum / wangi (xiāng)',
  '马': 'kuda (mǎ)',
  '馬': 'kuda (mǎ)',
  '骨': 'tulang (gǔ)',
  '高': 'tinggi (gāo)',
  '髟': 'rambut panjang (biāo)',
  '鬼': 'roh / hantu (guǐ)',
  '鱼': 'ikan (yú)',
  '鸟': 'burung (niǎo)',
  '卤': 'garam / asin (lǔ)',
  '鹿': 'rusa (lù)',
  '麦': 'gandum (mài)',
  '麻': 'rami / kebas (má)',
  '黄': 'kuning (huáng)',
  '黑': 'hitam / gelap (hēi)',
  '鼻': 'hidung (bí)',
  '齿': 'gigi (chǐ)',
  '龙': 'naga (lóng)',
};

// Load hand-crafted Indonesian glosses from public/data/hsk/id/*.json
const idDir = 'public/data/hsk/id';
const idMap = {};
if (existsSync(idDir)) {
  for (const f of readdirSync(idDir).filter((f) => f.endsWith('.json') && f !== 'all.json')) {
    try {
      Object.assign(idMap, JSON.parse(readFileSync(`${idDir}/${f}`, 'utf8')));
    } catch (err) {
      console.warn('Skipping malformed file:', f, err.message);
    }
  }
}

// High-coverage English → Indonesian phrase/word gloss cleaner for entries not yet in idMap
const EN_TO_ID_EXACT = {
  'to be': 'adalah; berada',
  'to have': 'memiliki; ada',
  'to go': 'pergi',
  'to come': 'datang',
  'to see': 'melihat',
  'to look': 'melihat; memandang',
  'to think': 'berpikir; mengira',
  'to know': 'tahu; mengetahui',
  'to say': 'mengatakan; berkata',
  'to speak': 'berbicara',
  'to eat': 'makan',
  'to drink': 'minum',
  'to make': 'membuat',
  'to do': 'melakukan; mengerjakan',
  'to use': 'menggunakan; memakai',
  'to give': 'memberi; memberikan',
  'to take': 'mengambil; membawa',
  'to find': 'menemukan; mencari',
  'to work': 'bekerja',
  'to study': 'belajar; mempelajari',
  'to learn': 'belajar',
  'to live': 'tinggal; hidup',
  'to buy': 'membeli',
  'to sell': 'menjual',
  'to help': 'membantu; menolong',
  'to begin': 'mulai; memulai',
  'to start': 'memulai; mulai',
  'to finish': 'menyelesaikan; selesai',
  'to end': 'mengakhiri; berakhir',
  'to change': 'mengubah; berubah',
  'to develop': 'mengembangkan; berkembang',
  'to increase': 'meningkatkan; bertambah',
  'to reduce': 'mengurangi; menurun',
  'to protect': 'melindungi',
  'to support': 'mendukung; menyokong',
  'to express': 'mengungkapkan; menyatakan',
  'to explain': 'menjelaskan; menerangkan',
  'to решить': 'memutuskan',
  'to decide': 'memutuskan',
  'to choose': 'memilih',
  'to hope': 'berharap; harapan',
  'to wish': 'mengharapkan',
  'to believe': 'percaya; meyakini',
  'to feel': 'merasa; merasakan',
  'to accept': 'menerima',
  'to refuse': 'menolak',
  'to allow': 'mengizinkan; memperbolehkan',
  'to prevent': 'mencegah',
  'to avoid': 'menghindari',
  'to achieve': 'mencapai; meraih',
  'to maintain': 'mempertahankan; menjaga',
  'to build': 'membangun',
  'to establish': 'mendirikan; menetapkan',
  'to create': 'menciptakan; membuat',
  'to produce': 'memproduksi; menghasilkan',
  'to provide': 'menyediakan; memberikan',
  'to receive': 'menerima; memperoleh',
  'to require': 'membutuhkan; mensyaratkan',
  'to need': 'membutuhkan; perlu',
  'to appear': 'muncul; tampak',
  'to disappear': 'menghilang; lenyap',
  'to happen': 'terjadi',
  'to occur': 'terjadi; berlangsung',
  'to continue': 'melanjutkan; terus berlangsung',
  'to stop': 'berhenti; menghentikan',
  'to leave': 'meninggalkan; berangkat',
  'to return': 'kembali; mengembalikan',
  'to enter': 'masuk; memasuki',
  'to send': 'mengirim; mengutus',
  'to carry': 'membawa; mengangkut',
  'to hold': 'memegang; menyelenggarakan',
  'to keep': 'menyimpan; menjaga',
  'to put': 'meletakkan; menaruh',
  'to open': 'membuka',
  'to close': 'menutup',
  'to win': 'menang; memenangkan',
  'to lose': 'kalah; kehilangan',
  'to fight': 'bertarung; berjuang',
  'tounggu': 'menunggu',
  'to wait': 'menunggu',
  'to meet': 'bertemu; memenuhi',
  'to join': 'bergabung; mengikuti',
  'to lead': 'memimpin; menuntun',
  'to follow': 'mengikuti; mematuhi',
  'to check': 'memeriksa; mengecek',
  'to test': 'menguji; tes',
  'to prove': 'membuktikan',
  'to discover': 'menemukan; mengungkap',
  'to research': 'meneliti; riset',
  'to discuss': 'mendiskusikan; membahas',
  'to consider': 'mempertimbangkan; menganggap',
  'to compare': 'membandingkan',
  'to connect': 'menghubungkan',
  'to combine': 'menggabungkan; memadukan',
  'to separate': 'memisahkan; terpisah',
  'to divide': 'membagi',
  'to control': 'mengendalikan; kontrol',
  'to manage': 'mengelola; mengatur',
  'to organize': 'mengorganisir; menyusun',
  'to prepare': 'mempersiapkan; bersiap',
  'to plan': 'merencanakan; rencana',
  'to design': 'merancang; desain',
  'to repair': 'memperbaiki; mereparasi',
  'to destroy': 'menghancurkan; merusak',
  'to save': 'menyelamatkan; menghemat',
  'to spend': 'menghabiskan; membelanjakan',
  'to pay': 'membayar',
  'to earn': 'memperoleh; menghasilkan',
};

const EN_WORD_SUB = [
  [/^to be /i, 'menjadi / bersifat '],
  [/^to make /i, 'membuat '],
  [/^to become /i, 'menjadi '],
  [/^to cause /i, 'menyebabkan '],
  [/^to have /i, 'memiliki '],
  [/^to take /i, 'mengambil '],
  [/^to give /i, 'memberikan '],
  [/^to go /i, 'pergi '],
  [/^to come /i, 'datang '],
  [/^to feel /i, 'merasa '],
  [/^to express /i, 'mengungkapkan '],
  [/^to carry out /i, 'melaksanakan '],
  [/^to conduct /i, 'melakukan '],
  [/^to engage in /i, 'terlibat dalam '],
  [/^to suffer /i, 'mengalami '],
  [/^to obtain /i, 'memperoleh '],
  [/^to receive /i, 'menerima '],
  [/^to lose /i, 'kehilangan '],
  [/^to lack /i, 'kekurangan '],
  [/^to keep /i, 'menjaga '],
  [/^to maintain /i, 'mempertahankan '],
  [/^to protect /i, 'melindungi '],
  [/^to prevent /i, 'mencegah '],
  [/^to avoid /i, 'menghindari '],
  [/^to promote /i, 'mendorong / mempromosikan '],
  [/^to improve /i, 'meningkatkan / memperbaiki '],
  [/^to strengthen /i, 'memperkuat '],
  [/^to expand /i, 'memperluas '],
  [/^to reduce /i, 'mengurangi '],
  [/^to eliminate /i, 'menghapuskan '],
  [/^to establish /i, 'mendirikan / menetapkan '],
  [/^to build /i, 'membangun '],
  [/^to create /i, 'menciptakan '],
  [/^to produce /i, 'menghasilkan '],
  [/^to form /i, 'membentuk '],
  [/^to develop /i, 'mengembangkan '],
  [/^to change /i, 'mengubah '],
  [/^to turn into /i, 'berubah menjadi '],
  [/^to use /i, 'menggunakan '],
  [/^to utilize /i, 'memanfaatkan '],
  [/^to rely on /i, 'bergantung pada '],
  [/^to depend on /i, 'bergantung pada '],
  [/^to belong to /i, 'termasuk dalam / milik '],
  [/^to conform to /i, 'sesuai dengan '],
  [/^to adapt to /i, 'beradaptasi dengan '],
  [/^to deal with /i, 'menangani '],
  [/^to handle /i, 'menangani '],
  [/^to solve /i, 'menyelesaikan '],
  [/^to resolve /i, 'menyelesaikan '],
  [/^to decide /i, 'memutuskan '],
  [/^to determine /i, 'menentukan '],
  [/^to choose /i, 'memilih '],
  [/^to select /i, 'memilih '],
  [/^to inspect /i, 'memeriksa '],
  [/^to examine /i, 'memeriksa / menguji '],
  [/^to check /i, 'memeriksa '],
  [/^to observe /i, 'mengamati '],
  [/^to discover /i, 'menemukan '],
  [/^to find /i, 'menemukan '],
  [/^to seek /i, 'mencari '],
  [/^to pursue /i, 'mengejar '],
  [/^to study /i, 'mempelajari '],
  [/^to research /i, 'meneliti '],
  [/^to analyze /i, 'menganalisis '],
  [/^to discuss /i, 'membahas '],
  [/^to explain /i, 'menjelaskan '],
  [/^to describe /i, 'menggambarkan '],
  [/^to indicate /i, 'menunjukkan '],
  [/^to show /i, 'menunjukkan '],
  [/^to display /i, 'menampilkan '],
  [/^to reflect /i, 'mencerminkan '],
  [/^to represent /i, 'mewakili '],
  [/^to symbolize /i, 'melambangkan '],
  [/^to emphasize /i, 'menekankan '],
  [/^to insist /i, 'bersikeras '],
  [/^to admit /i, 'mengakui '],
  [/^to deny /i, 'menyangkal '],
  [/^to refuse /i, 'menolak '],
  [/^to reject /i, 'menolak '],
  [/^to accept /i, 'menerima '],
  [/^to approve /i, 'menyetujui '],
  [/^to agree /i, 'setuju '],
  [/^to support /i, 'mendukung '],
  [/^to oppose /i, 'menentang '],
  [/^to criticize /i, 'mengkritik '],
  [/^to praise /i, 'memuji '],
  [/^to encourage /i, 'mendorong / menyemangati '],
  [/^to comfort /i, 'menghibur '],
  [/^to persuade /i, 'membujuk '],
  [/^to warn /i, 'memperingatkan '],
  [/^to remind /i, 'mengingatkan '],
  [/^to notify /i, 'memberitahukan '],
  [/^to announce /i, 'mengumumkan '],
  [/^to declare /i, 'menyatakan '],
  [/^to publish /i, 'menerbitkan '],
  [/^to spread /i, 'menyebarkan '],
];

// Character-meaning fallback using single-character meanings in idMap
function synthesizeMeaning(word, englishArr) {
  if (idMap[word]) return idMap[word];
  const cleaned = englishArr
    .filter((m) => !/^(variant of|old variant of|see |also written|surname |CL:)/i.test(m))
    .slice(0, 3)
    .map((m) => {
      let s = m.replace(/\s*\(CL:[^)]+\)/g, '').trim();
      const lower = s.toLowerCase();
      if (EN_TO_ID_EXACT[lower]) return EN_TO_ID_EXACT[lower];
      for (const [re, rep] of EN_WORD_SUB) {
        if (re.test(s)) {
          s = s.replace(re, rep);
          break;
        }
      }
      return s;
    });
  // Also append literal component hint if multi-char and each char is in idMap
  const chars = [...word];
  const charHints = chars
    .map((c) => (idMap[c] ? `${c} (${idMap[c].split(';')[0].trim()})` : null))
    .filter(Boolean);
  const base = cleaned.join('; ') || englishArr.slice(0, 2).join('; ');
  if (chars.length >= 2 && charHints.length === chars.length && !idMap[word]) {
    return `${base} [unsur: ${charHints.join(' + ')}]`;
  }
  return base;
}

function levelOf(levels, prefix) {
  const hit = levels.find((l) => l.startsWith(prefix + '-'));
  return hit ? Number(hit.split('-')[1]) : undefined;
}

const entries = raw.map((w) => {
  const form = w.forms[0];
  const meanings = [];
  for (const f of w.forms) {
    for (const m of f.meanings) {
      if (!meanings.includes(m) && !/^CL:/i.test(m)) meanings.push(m);
    }
  }
  const pinyins = [...new Set(w.forms.map((f) => f.transcriptions.pinyin))];
  const e = {
    s: w.simplified,
    p: pinyins.join(' / '),
    id: synthesizeMeaning(w.simplified, meanings),
    e: meanings.slice(0, 5),
  };
  if (form.traditional && form.traditional !== w.simplified) e.t = form.traditional;
  if (w.pos?.length) e.pos = [...new Set(w.pos.map((p) => POS_ID[p] || p))];
  if (w.radical) {
    e.r = w.radical;
    if (RADICAL_ID[w.radical]) e.rn = RADICAL_ID[w.radical];
  }
  if (w.frequency) e.f = w.frequency;
  const o = levelOf(w.level, 'old');
  const n = levelOf(w.level, 'new');
  if (o) e.o = o;
  if (n) e.n = n;
  return e;
});

const meta = {
  generated_at: new Date().toISOString(),
  source: 'https://github.com/drkameleon/complete-hsk-vocabulary',
  source_license: 'MIT (dataset compilation)',
  definitions_license: 'CC-CEDICT, CC BY-SA 4.0 — https://cc-cedict.org/wiki/',
  notes:
    'HSK 2.0 = silabus 2010 (Level 1–6, total 4.991 kosakata). HSK 3.0 = Standar Pemeringkatan Kemahiran Bahasa Mandarin GF0025-2021 (Level 1–6 serta Band 7–9, total 10.969 kosakata).',
  hsk2: {},
  hsk3: {},
  handcrafted_indonesian_count: Object.keys(idMap).length,
};

for (let lv = 1; lv <= 6; lv++) {
  const list = entries.filter((x) => x.o === lv).sort((a, b) => (a.f || 1e9) - (b.f || 1e9));
  writeFileSync(`public/data/hsk/hsk2-${lv}.json`, JSON.stringify(list));
  meta.hsk2[lv] = list.length;
}
for (let lv = 1; lv <= 7; lv++) {
  const list = entries.filter((x) => x.n === lv).sort((a, b) => (a.f || 1e9) - (b.f || 1e9));
  writeFileSync(`public/data/hsk/hsk3-${lv}.json`, JSON.stringify(list));
  meta.hsk3[lv] = list.length;
}

if (existsSync(idDir)) {
  writeFileSync(`${idDir}/all.json`, JSON.stringify(idMap));
}

writeFileSync('public/data/hsk/meta.json', JSON.stringify(meta, null, 2));
console.log('HSK 2.0:', meta.hsk2, '\nHSK 3.0:', meta.hsk3, '\nHandcrafted ID glosses:', meta.handcrafted_indonesian_count);
