import { DiagnosticQuestion } from '@/types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-01',
    type: 'hanzi_recognition',
    skill: 'vocabulary',
    level_estimate: 'HSK1',
    prompt: 'Pilihlah karakter Hanzi yang tepat untuk kata "mengenal / mengetahui (seseorang)":',
    options: [
      { id: 'opt-a', text: '认识', pinyin: 'rènshi' },
      { id: 'opt-b', text: '喜欢', pinyin: 'xǐhuan' },
      { id: 'opt-c', text: '明白', pinyin: 'míngbai' },
      { id: 'opt-d', text: '觉得', pinyin: 'juéde' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: '认识 (rènshi) berarti mengenal seseorang. Memiliki radikal bicara (讠).'
  },
  {
    id: 'diag-02',
    type: 'pinyin_identification',
    skill: 'pinyin',
    level_estimate: 'HSK2',
    prompt: 'Karakter "准备" (mempersiapkan) memiliki pelafalan Pinyin yang benar adalah:',
    options: [
      { id: 'opt-a', text: 'zhǔnbèi (nada 3, nada 4)' },
      { id: 'opt-b', text: 'zhūnbēi (nada 1, nada 1)' },
      { id: 'opt-c', text: 'zǔnbèi (nada 3 tanpa h)' },
      { id: 'opt-d', text: 'zhǔnbǐ (nada 3, nada 3)' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: '准 adalah nada ke-3 (zhǔn) dengan inisial retrofleks zh, dan 备 adalah nada ke-4 (bèi).'
  },
  {
    id: 'diag-03',
    type: 'grammar_order',
    skill: 'grammar',
    level_estimate: 'HSK2',
    prompt: 'Manakah posisi keterangan waktu "minggu depan" (下个星期) yang paling tepat dalam kalimat "Saya pergi ke Beijing"?',
    options: [
      { id: 'opt-a', text: '我下个星期去北京。(Setelah subjek)' },
      { id: 'opt-b', text: '我去北京下个星期。(Di ujung kalimat setelah objek)' },
      { id: 'opt-c', text: '我去下个星期北京。(Di antara kata kerja dan tempat)' },
      { id: 'opt-d', text: '下个北京我星期去。(Kacau)' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: 'Dalam tata bahasa Mandarin, keterangan waktu diletakkan SEBELUM kata kerja: bisa di awal kalimat atau tepat setelah subjek (我下个星期去北京).'
  },
  {
    id: 'diag-04',
    type: 'listening_dialogue',
    skill: 'listening',
    level_estimate: 'HSK2',
    prompt: 'Dengarkan audio percakapan singkat berikut (atau baca transkrip jika audio dimatikan): "A: 你好，请问图书馆怎么走？ B: 一直往前走，在第二个路口向右拐。"',
    pinyin_prompt: 'A: Nǐ hǎo, qǐngwèn túshūguǎn zěnme zǒu? B: Yìzhí wǎng qián zǒu, zài dì-èr gè lùkǒu xiàng yòu guǎi.',
    audio_text: '你好，请问图书馆怎么走？一直往前走，在第二个路口向右拐。',
    options: [
      { id: 'opt-a', text: 'Jalan lurus ke depan, belok kanan di persimpangan kedua' },
      { id: 'opt-b', text: 'Belok kiri langsung, perpustakaan ada di seberang' },
      { id: 'opt-c', text: 'Naik bus nomor dua, turun di pemberhentian berikutnya' },
      { id: 'opt-d', text: 'Perpustakaan tutup hari ini' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: '一直往前走 (jalan lurus ke depan), 向右拐 (belok kanan) di 第二个路口 (persimpangan ke-2).'
  },
  {
    id: 'diag-05',
    type: 'reading_comprehension',
    skill: 'reading',
    level_estimate: 'HSK3',
    prompt: 'Bacalah kalimat berikut: "虽然小李学中文只有半年，但是他每天坚持看中国新闻，所以口语和听力进步得非常快。"',
    pinyin_prompt: 'Suīrán Xiǎo Lǐ xué Zhōngwén zhǐyǒu bàn nián, dànshì tā měitiān jiānchí kàn Zhōngguó xīnwén, suǒyǐ kǒuyǔ hé tīnglì jìnbù de fēicháng kuài.',
    options: [
      { id: 'opt-a', text: 'Meskipun baru belajar setengah tahun, kemampuannya berkembang pesat karena rajin membaca berita setiap hari' },
      { id: 'opt-b', text: 'Xiao Li sudah belajar selama setengah tahun tapi tidak ada kemajuan' },
      { id: 'opt-c', text: 'Xiao Li hanya bisa membaca berita, belum bisa berbicara sama sekali' },
      { id: 'opt-d', text: 'Xiao Li merasa berita berbahasa Mandarin terlalu sulit' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: 'Pasangan konjungsi 虽然...但是... (walaupun... tetapi...) dan Jadi (所以) menjelaskan kemajuan pesat (进步得非常快).'
  },
  {
    id: 'diag-06',
    type: 'grammar_order',
    skill: 'grammar',
    level_estimate: 'HSK3',
    prompt: 'Manakah kalimat penekanan 是...的 yang paling tepat secara kaidah tata bahasa?',
    options: [
      { id: 'opt-a', text: '我是去年坐飞机来中国的。(Wǒ shì qùnián zuò fēijī lái Zhōngguó de.)' },
      { id: 'opt-b', text: '我是去年坐飞机来中国了。(Wǒ shì qùnián zuò fēijī lái Zhōngguó le.)' },
      { id: 'opt-c', text: '我去年坐飞机是来中国的。(Posisi 是 keliru)' },
      { id: 'opt-d', text: '我是去年坐飞机了。(Kalimat terpotong)' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: 'Dalam konstruksi penekanan 是...的, penanda aspek 了 TIDAK boleh digunakan bersamaan dengan 的.'
  },
  {
    id: 'diag-07',
    type: 'listening_dialogue',
    skill: 'listening',
    level_estimate: 'HSK3',
    prompt: 'Dengarkan percakapan: "A: 这次周末的聚会你打算去吗？ B: 我本来想去的，但是公司临时安排了加班，去不了了。"',
    pinyin_prompt: 'A: Zhè cì zhōumò de jùhuì nǐ dǎsuàn qù ma? B: Wǒ běnlái xiǎng qù de, dànshì gōngsī línshí ānpái le jiābān, qù bù liǎo le.',
    audio_text: '这次周末的聚会你打算去吗？我本来想去的，但是公司临时安排了加班，去不了了。',
    options: [
      { id: 'opt-a', text: 'Orang B tidak bisa datang karena harus lembur mendadak di kantor' },
      { id: 'opt-b', text: 'Orang B sangat antusias dan pasti menghadiri kumpul akhir pekan' },
      { id: 'opt-c', text: 'Orang B mengajak orang A untuk lembur bersama di kantor' },
      { id: 'opt-d', text: 'Acara akhir pekan dibatalkan oleh pihak penyelenggara' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: 'Frasa 本来想 (tadinya ingin) dan 去不了了 (tidak bisa pergi) karena 临时安排加班 (kantor mendadak ada lembur).'
  },
  {
    id: 'diag-08',
    type: 'hanzi_recognition',
    skill: 'vocabulary',
    level_estimate: 'HSK4',
    prompt: 'Karakter "坚持" (jiānchí) memiliki arti:',
    options: [
      { id: 'opt-a', text: 'Gigih mempertahankan / konsisten bertekad' },
      { id: 'opt-b', text: 'Menolak dengan tegas' },
      { id: 'opt-c', text: 'Mengulur-ulur waktu' },
      { id: 'opt-d', text: 'Berubah pikiran' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: '坚持 (jiānchí) = konsisten, berpegang teguh, tidak menyerah.'
  },
  {
    id: 'diag-09',
    type: 'grammar_order',
    skill: 'grammar',
    level_estimate: 'HSK4',
    prompt: 'Manakah penggunaan kalimat disposisi 把 yang benar?',
    options: [
      { id: 'opt-a', text: '请把桌子上的书放回书架上。(Qǐng bǎ zhuōzi shàng de shū fàng huí shūjià shàng.)' },
      { id: 'opt-b', text: '请把书放。(Qǐng bǎ shū fàng.)' },
      { id: 'opt-c', text: '请把书在桌子上。(Qǐng bǎ shū zài zhuōzi shàng.)' },
      { id: 'opt-d', text: '请把看书在桌子上。(Qǐng bǎ kànshū zài zhuōzi shàng.)' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: 'Kalimat 把 membutuhkan objek spesifik (桌子上的书) dan kata kerja yang diikuti pelengkap arah/hasil (放回...上).'
  },
  {
    id: 'diag-10',
    type: 'reading_comprehension',
    skill: 'reading',
    level_estimate: 'HSK4',
    prompt: 'Bacalah teks singkat berikut: "语言不仅是一种交流工具，更是了解一种文化的重要桥梁。如果我们能用流利的语言与当地人交流，不仅能提高沟通效率，更能体会到文化深处的魅力。"',
    pinyin_prompt: 'Yǔyán bùjǐn shì yì zhǒng jiāoliú gōngjù, gèng shì liǎojiě yì zhǒng wénhuà de zhòngyào qiáoliáng...',
    options: [
      { id: 'opt-a', text: 'Bahasa bukan hanya alat komunikasi, melainkan jembatan penting untuk memahami kedalaman budaya' },
      { id: 'opt-b', text: 'Bahasa hanyalah sekadar alat transaksi praktis sehari-hari' },
      { id: 'opt-c', text: 'Mempelajari budaya lebih penting daripada berbicara dengan lancar' },
      { id: 'opt-d', text: 'Orang asing tidak perlu berbicara dengan fasih saat berkomunikasi' },
    ],
    correct_option_id: 'opt-a',
    explanation_id: 'Struktur 不仅...更... (bukan hanya... bahkan lebih...) menekankan nilai bahasa sebagai jembatan budaya (文化的重要桥梁).'
  }
];
