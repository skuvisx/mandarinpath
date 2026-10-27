import { Lesson } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-mod1-01',
    slug: 'reaktivasi-percakapan-dan-kabar',
    level: 'HSK2',
    module_number: 1,
    lesson_number: 1,
    title: 'Menyapa Teman Lama & Menanyakan Kabar',
    title_chinese: '好久不见，最近怎么样？',
    title_pinyin: 'Hǎojiǔ bùjiàn, zuìjìn zěnmeyàng?',
    description: 'Mengaktifkan kembali kosakata percakapan alami setelah lama tidak berbicara Mandarin. Fokus pada intonasi dan pelafalan nada.',
    topic: 'Percakapan Sehari-hari',
    estimated_minutes: 20,
    learning_objectives: [
      'Menyapa teman lama menggunakan ekspresi alami 好久不见 (lama tidak jumpa)',
      'Menanyakan dan menjawab kondisi terkini menggunakan 最近 (akhir-akhir ini) dan 挺...的',
      'Membedakan penggunaan 还可以 (lumayan) dan 还行 dalam ragam lisan santai'
    ],
    dialogue: [
      {
        speaker: '王明 (Wang Ming)',
        chinese: '李华，好久不见！你最近在忙什么呢？',
        pinyin: 'Lǐ Huá, hǎojiǔ bùjiàn! Nǐ zuìjìn zài máng shénme ne?',
        indonesian: 'Li Hua, sudah lama tidak bertemu! Akhir-akhir ini kamu sedang sibuk apa?'
      },
      {
        speaker: '李华 (Li Hua)',
        chinese: '好久不见！我最近挺忙的，正在准备大学的期末考试。你呢？',
        pinyin: 'Hǎojiǔ bùjiàn! Wǒ zuìjìn tǐng máng de, zhèngzài zhǔnbèi dàxué de qīmò kǎoshì. Nǐ ne?',
        indonesian: 'Sudah lama tidak bertemu! Saya akhir-akhir ini lumayan sibuk, sedang mempersiapkan ujian akhir semester universitas. Kamu bagaimana?'
      },
      {
        speaker: '王明 (Wang Ming)',
        chinese: '我还可以，刚找到一份新实习，每天过得很充实。',
        pinyin: 'Wǒ hái kěyǐ, gāng zhǎodào yí fèn xīn shíxí, měitiān guò de hěn chōngshí.',
        indonesian: 'Saya lumayan, baru saja mendapatkan tempat magang baru, setiap hari dijalani dengan sangat produktif.'
      }
    ],
    grammar_points: [
      {
        pattern: '挺 + Kata Sifat + 的',
        title: 'Menyatakan Derajat Lumayan / Cukup',
        explanation_id: 'Pola lisan yang sangat sering digunakan untuk menyatakan tingkat "cukup/lumayan" tanpa terkesan kaku seperti 很 (hěn). "的" di akhir kalimat berfungsi memperhalus nada bicara.',
        structure: 'Subjek + 挺 + [Kata Sifat] + 的',
        examples: [
          {
            chinese: '这门课挺有意思的。',
            pinyin: 'Zhè mén kè tǐng yǒuyìsi de.',
            indonesian: 'Mata kuliah ini cukup menarik.',
            breakdown: '这门课 (mata kuliah ini) + 挺 (cukup) + 有意思 (menarik) + 的 (partikel penegas halus)'
          },
          {
            chinese: '这里的咖啡挺好喝的。',
            pinyin: 'Zhèlǐ de kāfēi tǐng hǎohē de.',
            indonesian: 'Kopi di sini lumayan enak diminum.'
          }
        ]
      },
      {
        pattern: '正 / 正在 / 在 + Kata Kerja + 呢',
        title: 'Menyatakan Tindakan yang Sedang Berlangsung (Aspek Progresif)',
        explanation_id: 'Menunjukkan aktivitas yang sedang berjalan pada saat dibicarakan. Partikel 呢 di akhir kalimat memperkuat rasa sedang berlangsung dalam ragam lisan.',
        structure: 'Subjek + 正在 + [Kata Kerja] + (Objek) + 呢',
        examples: [
          {
            chinese: '我们正在复习生词呢。',
            pinyin: 'Wǒmen zhèngzài fùxí shēngcí ne.',
            indonesian: 'Kami sedang mengulang kosakata baru nih.'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h1-01', 'v-h1-03', 'v-h3-03'],
    practice_questions: [
      {
        id: 'p-m1-01',
        type: 'word_order',
        prompt: 'Susun kata-kata berikut menjadi kalimat: "Saya akhir-akhir ini cukup sibuk mempersiapkan ujian."',
        tokens: ['我', '挺忙的', '最近', '准备考试'],
        correct_answer: '我 最近 挺忙的 准备考试',
        explanation: 'Keterangan waktu (最近) diletakkan setelah subjek atau di awal kalimat, diikuti predikat keadaan (挺忙的) dan tujuan aktivitas (准备考试).'
      },
      {
        id: 'p-m1-02',
        type: 'multiple_choice',
        prompt: 'Ketika bertemu teman yang sudah bertahun-tahun tidak dijumpai, ucapan pembuka yang paling alami adalah:',
        options: [
          '好久不见！(Hǎojiǔ bùjiàn!)',
          '对不起，你是谁？(Duìbuqǐ, nǐ shì shéi?)',
          '请问洗手间在哪里？(Qǐngwèn xǐshǒujiān zài nǎlǐ?)',
          '祝你生日快乐！(Zhù nǐ shēngrì kuàilè!)'
        ],
        correct_answer: '好久不见！(Hǎojiǔ bùjiàn!)',
        explanation: '好久不见 adalah idiom empat karakter klasik yang berarti "sudah lama sekali tidak bertemu".'
      }
    ]
  },
  {
    id: 'lesson-mod2-01',
    slug: 'struktur-penekanan-shi-de',
    level: 'HSK3',
    module_number: 2,
    lesson_number: 1,
    title: 'Penekanan Waktu, Tempat, dan Cara: Struktur 是...的',
    title_chinese: '你是哪一年开始学汉语的？',
    title_pinyin: 'Nǐ shì nǎ yì nián kāishǐ xué Hànyǔ de?',
    description: 'Kuasai konstruksi 是...的 yang penting untuk menjelaskan kapan, di mana, bersama siapa, atau bagaimana suatu kejadian masa lalu terjadi.',
    topic: 'Tata Bahasa Inti & Riwayat',
    estimated_minutes: 25,
    learning_objectives: [
      'Memahami fungsi penekanan 是...的 untuk peristiwa yang SUDAH PASTI terjadi',
      'Menggunakan 是...的 untuk menanyakan waktu kedatangan dan asal sekolah',
      'Menghindari kekeliruan umum menggunakan 了 ketika merinci cara atau tempat peristiwa masa lalu'
    ],
    dialogue: [
      {
        speaker: '王老师 (Guru Wang)',
        chinese: '小陈，你的发音很标准，你是在哪里学的汉语？',
        pinyin: 'Xiǎo Chén, nǐ de fāyīn hěn biāozhǔn, nǐ shì zài nǎlǐ xué de Hànyǔ?',
        indonesian: 'Xiao Chen, pelafalanmu sangat standar, di mana kamu belajar bahasa Mandarin?'
      },
      {
        speaker: '小陈 (Xiao Chen)',
        chinese: '老师，我是在印度尼西亚读中学的时候学的。',
        pinyin: 'Lǎoshī, wǒ shì zài Yìndùníxīyà dú zhōngxué de shíhou xué de.',
        indonesian: 'Guru, saya mempelajarinya saat bersekolah SMP/SMA di Indonesia.'
      },
      {
        speaker: '王老师 (Guru Wang)',
        chinese: '原来如此！你是坐飞机来的北京吗？',
        pinyin: 'Yuánláirúcǐ! Nǐ shì zuò fēijī lái de Běijīng ma?',
        indonesian: 'Oh ternyata begitu! Apakah kamu datang ke Beijing naik pesawat?'
      },
      {
        speaker: '小陈 (Xiao Chen)',
        chinese: '是的，我是上周一个人坐飞机来的。',
        pinyin: 'Shì de, wǒ shì shàng zhōu yí gè rén zuò fēijī lái de.',
        indonesian: 'Iya, saya datang naik pesawat sendirian minggu lalu.'
      }
    ],
    grammar_points: [
      {
        pattern: '是 + [Waktu / Tempat / Cara / Pelaku] + Kata Kerja + 的',
        title: 'Konstruksi Penekanan 是...的',
        explanation_id: 'Ketika kedua pihak sudah mengetahui bahwa suatu peristiwa telah terjadi, struktur 是...的 digunakan bukan untuk menyatakan terjadinya aksi, melainkan untuk MENEKANKAN detailnya: kapan (waktu), di mana (tempat), bagaimana (cara/kendaraan), atau oleh siapa (pelaku). Dalam kalimat positif, kata "是" kadang boleh dihilangkan, namun "的" di ujung wajib hadir. Dalam kalimat negatif, kata 不是 wajib ada.',
        structure: 'Subjek + (是) + [Detail yang Ditekankan] + Predikat + 的',
        examples: [
          {
            chinese: '这本书我是昨天在书店买的。',
            pinyin: 'Zhè běn shū wǒ shì zuótiān zài shūdiàn mǎi de.',
            indonesian: 'Buku ini saya beli kemarin di toko buku (Menekankan: kemarin & di toko buku).',
            breakdown: '这本书 (buku ini) + 我 (saya) + 是 (penanda fokus) + 昨天在书店 (kemarin di toko buku) + 买 (beli) + 的 (penutup fokus)'
          },
          {
            chinese: '我不是坐出租车来的，我是走路来的。',
            pinyin: 'Wǒ bú shì zuò chūzūchē lái de, wǒ shì zǒulù lái de.',
            indonesian: 'Saya bukan datang naik taksi, saya datang jalan kaki.'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h2-01', 'v-h2-02', 'v-h3-01'],
    practice_questions: [
      {
        id: 'p-m2-01',
        type: 'word_order',
        prompt: 'Susun kata-kata berikut dengan pola 是...的: "Saya datang ke Jakarta naik kereta api."',
        tokens: ['我', '坐火车', '是', '来雅加达的'],
        correct_answer: '我 是 坐火车 来雅加达的',
        explanation: 'Cara transportasi (坐火车) diletakkan di antara 是 dan kata kerja + 的.'
      },
      {
        id: 'p-m2-02',
        type: 'multiple_choice',
        prompt: 'Bentuk kalimat negatif dari "他是昨天买这辆车的" (Dia kemarin membeli mobil ini) adalah:',
        options: [
          '他不是昨天买这辆车的。(Tā bú shì zuótiān mǎi zhè liàng chē de.)',
          '他昨天没买这辆车。(Tā zuótiān méi mǎi zhè liàng chē.)',
          '他不昨天买这辆车。(Tā bù zuótiān mǎi zhè liàng chē.)',
          '他没有是昨天买这辆车。(Tā méiyǒu shì zuótiān mǎi zhè liàng chē.)'
        ],
        correct_answer: '他不是昨天买这辆车的。(Tā bú shì zuótiān mǎi zhè liàng chē de.)',
        explanation: 'Kalimat penekanan 是...的 dinegasikan dengan menempatkan 不 sebelum 是 (menjadi 不是...的).'
      }
    ]
  },
  {
    id: 'lesson-mod3-01',
    slug: 'pola-kalimat-ba-struktur',
    level: 'HSK3',
    module_number: 3,
    lesson_number: 1,
    title: 'Menguasai Kalimat Disposisi 把 (Ba Sentence)',
    title_chinese: '请把门关上，把作业交给我',
    title_pinyin: 'Qǐng bǎ mén guān shàng, bǎ zuòyè jiāo gěi wǒ',
    description: 'Pelajari salah satu struktur tata bahasa paling penting dan sering diuji dalam HSK 3-5: kalimat 把 untuk memindahkan atau mengubah kondisi benda.',
    topic: 'Tata Bahasa Tingkat Menengah',
    estimated_minutes: 30,
    learning_objectives: [
      'Memahami mengapa dan kapan kalimat 把 wajib digunakan',
      'Menempatkan objek definit sebelum kata kerja dengan bantuan partikel 把',
      'Menguasai pelengkap hasil (结语) seperti 放好, 看完, 关上 setelah kata kerja'
    ],
    dialogue: [
      {
        speaker: '妈妈 (Ibu)',
        chinese: '大伟，出门前请把空调关了，把垃圾带下去。',
        pinyin: 'Dàwěi, chūmén qián qǐng bǎ kōngtiáo guān le, bǎ lājī dài xiàqu.',
        indonesian: 'Dawei, sebelum keluar tolong matikan AC, dan bawa sampahnya ke bawah.'
      },
      {
        speaker: '大伟 (Dawei)',
        chinese: '好的妈妈，我已经把空调关上了。我马上把垃圾拿出去。',
        pinyin: 'Hǎo de māma, wǒ yǐjīng bǎ kōngtiáo guān shàng le. Wǒ mǎshàng bǎ lājī ná chūqù.',
        indonesian: 'Baik Bu, saya sudah mematikan AC-nya. Saya akan segera membawa sampahnya keluar.'
      }
    ],
    grammar_points: [
      {
        pattern: 'Subjek + 把 + Objek Spesifik + Kata Kerja + Pelengkap/Hasil',
        title: 'Kalimat 把 (Struktur Disposisi)',
        explanation_id: 'Kalimat 把 digunakan ketika subjek memberikan tindakan kepada sebuah benda tertentu (spesifik), dan menyebabkan benda tersebut berpindah tempat, berubah status, atau mengalami hasil tertentu. Syarat mutlak: Objek harus sudah diketahui (bukan benda sembarang), dan kata kerja TIDAK BISA berdiri sendiri (wajib diikuti pelengkap arah, hasil, atau 了).',
        structure: 'Pelaku + 把 + Benda + Tindakan + Hasil/Perubahan',
        examples: [
          {
            chinese: '请把你的护照拿出来。',
            pinyin: 'Qǐng bǎ nǐ de hùzhào ná chūlái.',
            indonesian: 'Tolong keluarkan paspor Anda.',
            breakdown: '把 + 你的护照 (paspor spesifik) + 拿 (ambil) + 出来 (keluar - pelengkap arah)'
          },
          {
            chinese: '我把今天的生词都复习完了。',
            pinyin: 'Wǒ bǎ jīntiān de shēngcí dōu fùxí wán le.',
            indonesian: 'Saya sudah selesai me-review semua kosakata baru hari ini.'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h1-03', 'v-h3-03', 'v-h4-02'],
    practice_questions: [
      {
        id: 'p-m3-01',
        type: 'word_order',
        prompt: 'Susun kata berikut menjadi kalimat 把 yang benar: "Tolong letakkan cangkir ini di atas meja."',
        tokens: ['请把', '放在', '桌子上', '这个杯子'],
        correct_answer: '请把 这个杯子 放在 桌子上',
        explanation: 'Pola 把: 请把 + Objek (这个杯子) + Kata Kerja (放) + Keterangan tempat hasil (在桌子上).'
      },
      {
        id: 'p-m3-02',
        type: 'multiple_choice',
        prompt: 'Manakah kalimat 把 yang strukturnya TIDAK TEPAT?',
        options: [
          '我把苹果吃。(Wǒ bǎ píngguǒ chī.) - [Kata kerja berdiri sendiri tanpa pelengkap]',
          '我把苹果吃了。(Wǒ bǎ píngguǒ chī le.)',
          '请把书放在桌子上。(Qǐng bǎ shū fàng zài zhuōzi shàng.)',
          '他把作业做完了。(Tā bǎ zuòyè zuò wán le.)'
        ],
        correct_answer: '我把苹果吃。(Wǒ bǎ píngguǒ chī.) - [Kata kerja berdiri sendiri tanpa pelengkap]',
        explanation: 'Dalam tata bahasa Mandarin, kata kerja dalam kalimat 把 tidak boleh berdiri telanjang (bare verb). Harus ada pelengkap (seperti 了, 完, 好, 在).'
      }
    ]
  }
];
