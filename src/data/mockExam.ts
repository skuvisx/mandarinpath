import { QuizQuestion } from '@/types';

export interface MockExamSection {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export const HSK3_MOCK_EXAM_SECTIONS: MockExamSection[] = [
  {
    id: 'section-listening',
    title: 'Bagian I: Mendengarkan (听力 - Tīnglì)',
    description: 'Dengarkan rekaman audio singkat dan pilih kesimpulan atau jawaban yang paling tepat.',
    timeLimitMinutes: 8,
    questions: [
      {
        id: 'mock-listen-01',
        category: 'listening',
        hsk_level: 'HSK3',
        prompt: 'Dengarkan dialog: "男：请问，去火车站坐几路公共汽车？女：你可以坐302路，不过现在是下班高峰期，可能坐地铁更快一些。"',
        pinyin_prompt: 'Nán: Qǐngwèn, qù huǒchēzhàn zuò jǐ lù gōnggòng qìchē? Nǚ: Nǐ kěyǐ zuò 302 lù, búguò xiànzài shì xiàbān gāofēngqī, kěnéng zuò dìtiě gèng kuài yìxiē.',
        audio_text: '请问，去火车站坐几路公共汽车？你可以坐三百零二路，不过现在是下班高峰期，可能坐地铁更快一些。',
        options: [
          'Perempuan menyarankan naik kereta bawah tanah (subway) karena sedang jam sibuk',
          'Perempuan menyarankan jalan kaki ke stasiun',
          'Bus nomor 302 sudah tidak beroperasi lagi',
          'Laki-laki ingin pergi ke bandara'
        ],
        correct_index: 0,
        explanation: 'Perempuan menyebut bahwa sekarang 下班高峰期 (jam sibuk pulang kerja) sehingga 坐地铁更快 (naik subway lebih cepat).'
      },
      {
        id: 'mock-listen-02',
        category: 'listening',
        hsk_level: 'HSK3',
        prompt: 'Dengarkan narasi: "虽然医生让我多休息，但为了完成这个项目，小张昨晚又工作到了深夜。"',
        pinyin_prompt: 'Suīrán yīshēng ràng wǒ duō xiūxi, dàn wèile wánchéng zhè gè xiàngmù, Xiǎo Zhāng zuówǎn yòu gōngzuò dào le shēnyè.',
        audio_text: '虽然医生让我多休息，但为了完成这个项目，小张昨晚又工作到了深夜。',
        options: [
          'Xiao Zhang tetap bekerja lembur hingga larut malam meskipun dokter menyuruh istirahat',
          'Xiao Zhang semalam beristirahat sepanjang malam di rumah sakit',
          'Dokter membatalkan proyek Xiao Zhang',
          'Xiao Zhang menolak mengerjakan proyek'
        ],
        correct_index: 0,
        explanation: '小张 (Xiao Zhang) bekerja sampai 深夜 (larut malam) demi menyelesaikan proyek.'
      },
      {
        id: 'mock-listen-03',
        category: 'listening',
        hsk_level: 'HSK3',
        prompt: 'Dengarkan dialog: "女：服务员，我们这桌的糖醋鱼怎么还没上？男：真抱歉，今天客人比较多，厨房正在做，我马上去催一下。"',
        pinyin_prompt: 'Nǚ: Fúwùyuán, wǒmen zhè zhuō de tángcùyú zěnme hái méi shàng? Nán: Zhēn bàoqiàn, jīntiān kèrén bǐjiào duō, chúfáng zhèngzài zuò, wǒ mǎshàng qù cuī yíxià.',
        audio_text: '服务员，我们这桌的糖醋鱼怎么还没上？真抱歉，今天客人比较多，厨房正在做，我马上去催一下。',
        options: [
          'Pelayan meminta maaf dan akan segera memeriksa ke dapur untuk mempercepat pesanan',
          'Ikan asam manis sudah habis terjual',
          'Tamu salah masuk restoran',
          'Pelayan meminta tamu memasak sendiri'
        ],
        correct_index: 0,
        explanation: 'Pelayan berkata: 厨房正在做，我马上去催一下 (dapur sedang memasak, saya segera mempercepatnya).'
      }
    ]
  },
  {
    id: 'section-reading',
    title: 'Bagian II: Membaca & Pemahaman (阅读 - Yuèdú)',
    description: 'Pahami teks bacaan dan pilih jawaban yang paling sesuai dengan isi informasi teks.',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'mock-read-01',
        category: 'reading',
        hsk_level: 'HSK3',
        prompt: 'Baca penggalan teks: "经常喝茶对身体有很多好处。绿茶不仅能让人保持清醒，还能帮助消化。但是，晚上睡觉前最好不要喝浓茶，否则可能会影响睡眠。"',
        pinyin_prompt: 'Jīngcháng hē chá duì shēntǐ yǒu hěn duō hǎochù. Lǜchá bùjǐn néng ràng rén bǎochí qīngxǐng...',
        options: [
          'Minum teh pekat sebelum tidur dapat mengganggu kualitas tidur',
          'Teh hijau sama sekali tidak baik untuk pencernaan',
          'Minum teh hanya boleh dilakukan saat malam hari',
          'Semua jenis teh membuat orang langsung mengantuk'
        ],
        correct_index: 0,
        explanation: 'Teks menyatakan: 晚上睡觉前最好不要喝浓茶，否则可能会影响睡眠 (sebelum tidur jangan minum teh kental, kalau tidak bisa mengganggu tidur).'
      },
      {
        id: 'mock-read-02',
        category: 'reading',
        hsk_level: 'HSK3',
        prompt: 'Pilihlah kata yang paling tepat untuk melengkapi kalimat: "你刚才说的那个问题，我_____考虑过了，明天给你答复。"',
        pinyin_prompt: 'Nǐ gāngcái shuō de nà gè wèntí, wǒ _____ kǎolǜ guò le, míngtiān gěi nǐ dáfù.',
        options: [
          '认真 (rènzhēn - bersungguh-sungguh / cermat)',
          '热情 (rèqíng - ramah hangat)',
          '马虎 (mǎhu - ceroboh)',
          '着急 (zháojí - panik terburu-buru)'
        ],
        correct_index: 0,
        explanation: '认真考虑 (mempertimbangkan dengan cermat/serius) adalah kolokasi yang paling natural.'
      },
      {
        id: 'mock-read-03',
        category: 'reading',
        hsk_level: 'HSK3',
        prompt: 'Baca kalimat: "因为大雪的原因，今天上午所有飞往上海的航班都推迟起飞了。"',
        pinyin_prompt: 'Yīnwèi dàxuě de yuányīn, jīntiān shàngwǔ suǒyǒu fēi wǎng Shànghǎi de hángbān dōu tuīchí qǐfēi le.',
        options: [
          'Penerbangan ke Shanghai ditunda karena salju lebat',
          'Semua penumpang terlambat tiba di bandara Shanghai',
          'Penerbangan dipercepat karena cuaca cerah',
          'Bandara Shanghai ditutup selamanya'
        ],
        correct_index: 0,
        explanation: '推迟起飞 (tuīchí qǐfēi) berarti penundaan lepas landas.'
      }
    ]
  },
  {
    id: 'section-grammar',
    title: 'Bagian III: Tata Bahasa & Struktur Kalimat (语法 - Yǔfǎ)',
    description: 'Uji penguasaan struktur sintaksis kalimat Mandarin, pola 把, penanda aspek, dan komparatif.',
    timeLimitMinutes: 7,
    questions: [
      {
        id: 'mock-gram-01',
        category: 'sentence_structure',
        hsk_level: 'HSK3',
        prompt: 'Manakah susunan kalimat komparatif (比) yang tepat untuk menyatakan "Xiao Lin 3 cm lebih tinggi dari saya"?',
        options: [
          '小林比我高三厘米。(Subjek + 比 + Pembanding + Sifat + Selisih)',
          '小林比我三厘米高。(Selisih sebelum kata sifat)',
          '小林高三厘米比我。(Posisi pembanding di ujung)',
          '比我小林三厘米高。(Struktur terbalik)'
        ],
        correct_index: 0,
        explanation: 'Rumus perbandingan bertingkat kuantitas: A + 比 + B + Kata Sifat + Selisih Kuantitas (小林比我高三厘米).'
      },
      {
        id: 'mock-gram-02',
        category: 'grammar',
        hsk_level: 'HSK3',
        prompt: 'Lengkapilah kalimat: "请你在离开教室的时候，把灯_____。"',
        pinyin_prompt: 'Qǐng nǐ zài líkāi jiàoshì de shíhou, bǎ dēng _____.',
        options: [
          '关上 (guān shàng - matikan rapat)',
          '关 (guān - kata kerja tanpa pelengkap)',
          '看 (kàn - melihat)',
          '开着 (kāi zhe - biarkan menyala)'
        ],
        correct_index: 0,
        explanation: 'Dalam kalimat 把, predikat membutuhkan pelengkap hasil seperti 关上 (mematikan lampu).'
      },
      {
        id: 'mock-gram-03',
        category: 'grammar',
        hsk_level: 'HSK3',
        prompt: 'Pilihlah kalimat yang menggunakan penanda aspek pengalaman "过" (guò) dengan tepat:',
        options: [
          '我去过两次北京，非常喜欢那里的烤鸭。(Saya pernah pergi ke Beijing 2 kali)',
          '我正在去过北京。(Kontradiksi antara 正在 dan 过)',
          '我明天去过北京。(Kontradiksi waktu masa depan dan 过)',
          '我去过了北京两次。(Posisi kuantitas frekuensi keliru)'
        ],
        correct_index: 0,
        explanation: '过 menandakan pengalaman masa lalu (pernah melakukan). Frekuensi (两次) diletakkan setelah predikat dan objek tempat atau di antaranya.'
      }
    ]
  }
];
