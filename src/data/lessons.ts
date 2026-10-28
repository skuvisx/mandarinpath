import { Lesson } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-mod0-01',
    slug: 'fondasi-nada-dan-perkenalan-hsk1',
    level: 'HSK1',
    module_number: 1,
    lesson_number: 1,
    title: 'Fondasi Nada, Sapaan & Struktur Kalimat Dasar SVO',
    title_chinese: '很高兴认识你！你是哪国人？',
    title_pinyin: 'Hěn gāoxìng rènshi nǐ! Nǐ shì nǎ guó rén?',
    description: 'Menyegarkan kembali urutan kalimat dasar Mandarin (Subjek–Waktu–Tempat–Kata Kerja–Objek), perubahan nada (tone sandhi) pada 不 dan 一, serta perkenalan diri yang luwes.',
    topic: 'Fondasi & Perkenalan',
    estimated_minutes: 20,
    learning_objectives: [
      'Menguasai aturan perubahan nada (Tone Sandhi): 不 (bù → bú sebelum nada 4) dan 一 (yī → yí / yì)',
      'Membedakan kalimat predikat kata sifat (Subjek + 很 + Kata Sifat, tanpa 是)',
      'Menyusun keterangan waktu dan tempat sebelum kata kerja secara otomatis'
    ],
    dialogue: [
      {
        speaker: '安迪 (Andi)',
        chinese: '你好！我叫安迪，来自印度尼西亚雅加达。很高兴认识你！',
        pinyin: 'Nǐ hǎo! Wǒ jiào Āndí, láizì Yìndùníxīyà Yǎjiādá. Hěn gāoxìng rènshi nǐ!',
        indonesian: 'Halo! Nama saya Andi, berasal dari Jakarta, Indonesia. Senang sekali mengenalmu!'
      },
      {
        speaker: '林美玲 (Lin Meiling)',
        chinese: '你好安迪！我是林美玲。你的中文说得真不错！',
        pinyin: 'Nǐ hǎo Āndí! Wǒ shì Lín Měilíng. Nǐ de Zhōngwén shuō de zhēn búcuò!',
        indonesian: 'Halo Andi! Saya Lin Meiling. Bahasa Mandarinmu bagus sekali!'
      },
      {
        speaker: '安迪 (Andi)',
        chinese: '哪里哪里，我以前学过十二年，但是好几年没说了，现在每天复习二十分钟。',
        pinyin: 'Nǎlǐ nǎlǐ, wǒ yǐqián xué guò shí\'èr nián, dànshì hǎo jǐ nián méi shuō le, xiànzài měitiān fùxí èrshí fēnzhōng.',
        indonesian: 'Ah belum seberapa, dulu saya pernah belajar 12 tahun, tapi sudah beberapa tahun tidak dipakai bicara, sekarang setiap hari saya mengulang 20 menit.'
      }
    ],
    grammar_points: [
      {
        pattern: 'Subjek + 很 (hěn) + Kata Sifat (Tanpa 是)',
        title: 'Kalimat Predikat Kata Sifat dalam Bahasa Mandarin',
        explanation_id: 'Berbeda dengan bahasa Inggris ("I am busy"), bahasa Mandarin TIDAK menggunakan 是 (shì) di depan kata sifat biasa. Gunakan kata keterangan derajat seperti 很 (hěn - sangat/netral), 非常 (fēicháng - sangat), atau 挺...的 (tǐng...de - lumayan). Penggunaan 是 di depan kata sifat hanya dipakai untuk penegasan kontras.',
        structure: 'Subjek + 很 / 非常 / 真 + [Kata Sifat]',
        examples: [
          {
            chinese: '今天天气很好。',
            pinyin: 'Jīntiān tiānqì hěn hǎo.',
            indonesian: 'Cuaca hari ini sangat bagus.',
            breakdown: '今天 (hari ini) + 天气 (cuaca) + 很 (penanda derajat) + 好 (bagus) — tanpa 是'
          },
          {
            chinese: '汉字很有意思。',
            pinyin: 'Hànzì hěn yǒuyìsi.',
            indonesian: 'Karakter Hanzi sangat menarik.'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h1-01', 'v-h1-02'],
    practice_questions: [
      {
        id: 'p-m0-01',
        type: 'word_order',
        prompt: 'Susun kata berikut menjadi kalimat yang benar: "Saya setiap hari di rumah belajar bahasa Mandarin."',
        tokens: ['我', '每天', '在家里', '学中文'],
        correct_answer: '我 每天 在家里 学中文',
        explanation: 'Urutan baku Mandarin: Subjek (我) + Waktu (每天) + Tempat (在家里) + Kata Kerja & Objek (学中文).'
      },
      {
        id: 'p-m0-02',
        type: 'multiple_choice',
        prompt: 'Bagaimana pelafalan Pinyin yang tepat untuk "不错" (lumayan / bagus) sesuai aturan perubahan nada (Tone Sandhi)?',
        options: [
          'búcuò (不 berubah menjadi nada ke-2 karena diikuti 错 nada ke-4)',
          'bùcuò (tetap nada ke-4 + nada ke-4)',
          'būcuò (nada ke-1 + nada ke-4)',
          'bǔcuò (nada ke-3 + nada ke-4)'
        ],
        correct_answer: 'búcuò (不 berubah menjadi nada ke-2 karena diikuti 错 nada ke-4)',
        explanation: 'Kata 不 (bù, nada 4) wajib berubah menjadi nada 2 (bú) apabila langsung diikuti oleh suku kata bernada 4.'
      }
    ]
  },
  {
    id: 'lesson-mod1-01',
    slug: 'reaktivasi-percakapan-dan-kabar',
    level: 'HSK2',
    module_number: 2,
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
  },
  {
    id: 'lesson-mod4-01',
    slug: 'kalimat-pasif-bei-dan-transisi-hsk4',
    level: 'HSK4',
    module_number: 4,
    lesson_number: 1,
    title: 'Kalimat Pasif 被 (Bèi) & Penalaran Sebab-Akibat Formal',
    title_chinese: '既能提高沟通效率，又能积累经验',
    title_pinyin: 'Jì néng tígāo gōutōng xiàolǜ, yòu néng jīlěi jīngyàn',
    description: 'Menguasai struktur pasif 被/叫/让 serta konjungsi korelatif HSK 4 (不仅…而且…, 既…又…, 无论…都…) untuk diskusi kampus dan dunia kerja.',
    topic: 'Komunikasi Akademik & Kerja',
    estimated_minutes: 25,
    learning_objectives: [
      'Membentuk kalimat pasif dengan 被 (bèi), 让 (ràng), dan 叫 (jiào) beserta aturan penempatan kata negasi',
      'Menggunakan 既…又… (sekaligus dua sifat/tindakan setara) dan 无论…都… (tanpa peduli kondisi apa pun)',
      'Membedakan sinonim HSK 4 yang sering tertukar: 适合 vs 合适, 经验 vs 经历'
    ],
    dialogue: [
      {
        speaker: '陈经理 (Manajer Chen)',
        chinese: '小王，昨天那份中印双语合同已经被客户签好了吗？',
        pinyin: 'Xiǎo Wáng, zuótiān nà fèn Zhōng-Yìn shuāngyǔ hétong yǐjīng bèi kèhù qiān hǎo le ma?',
        indonesian: 'Xiao Wang, apakah kontrak dwibahasa Mandarin–Indonesia kemarin sudah ditandatangani oleh klien?'
      },
      {
        speaker: '小王 (Xiao Wang)',
        chinese: '已经签好了！无论遇到什么困难，只要我们坚持跟客户耐心交流，问题都能解决。',
        pinyin: 'Yǐjīng qiān hǎo le! Wúlùn yùdào shénme kùnnan, zhǐyào wǒmen jiānchí gēn kèhù nàixīn jiāoliú, wèntí dōu néng jiějué.',
        indonesian: 'Sudah ditandatangani! Tanpa peduli kesulitan apa pun yang dihadapi, asalkan kita konsisten berkomunikasi dengan sabar bersama klien, masalah pasti bisa diselesaikan.'
      }
    ],
    grammar_points: [
      {
        pattern: 'Subjek (Penerima) + 被 + (Pelaku) + Kata Kerja + Pelengkap',
        title: 'Struktur Kalimat Pasif 被 (Bèi)',
        explanation_id: 'Digunakan ketika fokus pembicaraan adalah pihak/benda yang dikenai tindakan. Sama seperti kalimat 把, kata kerja setelah 被 wajib disertai pelengkap hasil/arah atau partikel 了. Kata keterangan waktu atau negasi (没/不) wajib diletakkan SEBELUM 被.',
        structure: 'Penerima + (没/已经) + 被 + (Pelaku) + Kata Kerja + Hasil',
        examples: [
          {
            chinese: '我的词典被弟弟借走了。',
            pinyin: 'Wǒ de cídiǎn bèi dìdi jiè zǒu le.',
            indonesian: 'Kamus saya dipinjam (dibawa pergi) oleh adik laki-laki.',
            breakdown: '我的词典 (objek terkena aksi) + 被 (oleh) + 弟弟 (pelaku) + 借走了 (dipinjam pergi)'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h3-02', 'v-h4-01', 'v-h4-02', 'v-h4-03'],
    practice_questions: [
      {
        id: 'p-m4-01',
        type: 'word_order',
        prompt: 'Susun kalimat pasif berikut: "Kue di atas meja sudah dimakan habis oleh adik."',
        tokens: ['桌子上的蛋糕', '已经被', '弟弟', '吃完了'],
        correct_answer: '桌子上的蛋糕 已经被 弟弟 吃完了',
        explanation: 'Subjek penerima aksi (桌子上的蛋糕) + 已经被 + Pelaku (弟弟) + Kata kerja + Pelengkap hasil (吃完了).'
      },
      {
        id: 'p-m4-02',
        type: 'multiple_choice',
        prompt: 'Pilih pasangan kata yang tepat: "Pekerjaan ini sangat _____ untuk saya, gajinya juga sangat _____."',
        options: [
          '适合 (shìhé - cocok untuk [kata kerja]) ... 合适 (héshì - tepat/pas [kata sifat])',
          '合适 ... 适合',
          '经验 ... 经历',
          '认识 ... 知道'
        ],
        correct_answer: '适合 (shìhé - cocok untuk [kata kerja]) ... 合适 (héshì - tepat/pas [kata sifat])',
        explanation: '适合 adalah kata kerja transitif yang bisa diikuti objek (适合我 = cocok untuk saya), sedangkan 合适 adalah kata sifat yang tidak diikuti objek (很合适 = sangat pas).'
      }
    ]
  },
  {
    id: 'lesson-mod5-01',
    slug: 'wacana-profesional-dan-argumen-hsk5',
    level: 'HSK5',
    module_number: 5,
    lesson_number: 1,
    title: 'Komunikasi Bisnis, Negosiasi & Wacana Argumen HSK 5',
    title_chinese: '把握机遇，提高团队沟通效率',
    title_pinyin: 'Bǎwò jīyù, tígāo tuánduì gōutōng xiàolǜ',
    description: 'Menyusun argumen terstruktur menggunakan konektor ragam tulis-lisan menengah-atas (之所以…是因为…, 从而, 反而) untuk presentasi akademik dan profesional.',
    topic: 'Karir & Argumen Formal',
    estimated_minutes: 30,
    learning_objectives: [
      'Menggunakan 之所以…是因为… untuk menekankan alasan di balik suatu fenomena',
      'Membedakan 反而 (justru sebaliknya) dari 但是 (tetapi biasa)',
      'Menguasai kolokasi formal HSK 5: 把握机会, 提高效率, 深入沟通'
    ],
    dialogue: [
      {
        speaker: '林总监 (Direktur Lin)',
        chinese: '我们团队之所以能按时完成这个跨国项目，是因为大家保持了高效的沟通。',
        pinyin: 'Wǒmen tuánduì zhīsuǒyǐ néng ànshí wánchéng zhè gè kuàguó xiàngmù, shì yīnwèi dàjiā bǎochí le gāoxiào de gōutōng.',
        indonesian: 'Alasan mengapa tim kita dapat menyelesaikan proyek lintas negara ini tepat waktu adalah karena semua orang menjaga komunikasi yang berefisiensi tinggi.'
      },
      {
        speaker: '张华 (Zhang Hua)',
        chinese: '没错，遇到分歧时我们没有互相推卸责任，反而主动寻找解决方案。',
        pinyin: 'Méicuò, yùdào fēnqí shí wǒmen méiyǒu hùxiāng tuīxiè zérèn, fǎn\'ér zhǔdòng xúnzhǎo jiějué fāng\'àn.',
        indonesian: 'Benar sekali, saat menemui perbedaan pendapat kita tidak saling lempar tanggung jawab, melainkan justru proaktif mencari solusi.'
      }
    ],
    grammar_points: [
      {
        pattern: 'Subjek + 之所以 + [Akibat/Hasil]，是因为 + [Sebab]',
        title: 'Struktur Penekanan Alasan 之所以…是因为…',
        explanation_id: 'Membalik urutan sebab-akibat standar (因为…所以…) dengan menyebutkan hasil terlebih dahulu untuk memberi penekanan kuat pada penyebab utamanya ("Alasan mengapa X terjadi adalah karena Y").',
        structure: '(Topik) + 之所以 + Akibat, 是因为 + Sebab',
        examples: [
          {
            chinese: '他之所以听说读写都很流利，是因为每天坚持练习。',
            pinyin: 'Tā zhīsuǒyǐ tīng-shuō-dú-xiě dōu hěn liúlì, shì yīnwèi měitiān jiānchí liànxí.',
            indonesian: 'Alasan mengapa kemampuan mendengar, berbicara, membaca, dan menulisnya begitu lancar adalah karena ia konsisten berlatih setiap hari.'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h5-01', 'v-h5-02', 'v-h5-03'],
    practice_questions: [
      {
        id: 'p-m5-01',
        type: 'word_order',
        prompt: 'Susun kalimat berikut: "Angin tidak berhenti, justru semakin bertiup semakin kencang."',
        tokens: ['风没有停，', '反而', '越刮越大了'],
        correct_answer: '风没有停， 反而 越刮越大了',
        explanation: '反而 digunakan untuk menyatakan hasil yang berlawanan dari ekspektasi setelah klausa negatif.'
      }
    ]
  },
  {
    id: 'lesson-mod6-01',
    slug: 'idiom-chengyu-dan-retorika-hsk6',
    level: 'HSK6',
    module_number: 6,
    lesson_number: 1,
    title: 'Idiom Empat Karakter (成语) & Retorika Akademik HSK 6',
    title_chinese: '持之以恒，在潜移默化中融会贯通',
    title_pinyin: 'Chízhīyǐhéng, zài qiányímòhuà zhōng rónghuìguàntōng',
    description: 'Menguasai penggunaan idiom empat karakter (成语 chéngyǔ) dan struktur retoris tingkat lanjut (非但…反而…, 唯有…才…) untuk mencapai kefasihan setara penutur terpelajar.',
    topic: 'Sastra, Idiom & Retorika',
    estimated_minutes: 30,
    learning_objectives: [
      'Memahami struktur internal dan fungsi sintaksis idiom empat karakter (成语) dalam kalimat',
      'Menggunakan pola eksklusif 唯有…才… (hanya dengan... barulah...) dalam tulisan dan pidato',
      'Mengenali kesalahan logika kalimat (病句) yang diujikan pada bagian membaca HSK 6'
    ],
    dialogue: [
      {
        speaker: '周教授 (Profesor Zhou)',
        chinese: '学习一门语言绝非一朝一夕之功，唯有持之以恒地阅读与思考，才能真正做到融会贯通。',
        pinyin: 'Xuéxí yì mén yǔyán jué fēi yìzhāo-yìxī zhī gōng, wéiyǒu chízhīyǐhéng de yuèdú yǔ sīkǎo, cáinéng zhēnzhèng zuò dào rónghuìguàntōng.',
        indonesian: 'Mempelajari suatu bahasa sama sekali bukan hasil kerja semalam; hanya dengan membaca dan berpikir secara tekun barulah kita benar-benar dapat memadukan pemahaman secara menyeluruh.'
      },
      {
        speaker: '学生 (Mahasiswa)',
        chinese: '教授说得太对了，优秀的作品总能在潜移默化中拓宽我们的视野。',
        pinyin: 'Jiàoshòu shuō de tài duì le, yōuxiù de zuòpǐn zǒng néng zài qiányímòhuà zhōng tuòkuān wǒmen de shìyě.',
        indonesian: 'Apa yang Profesor sampaikan sangat tepat, karya-karya unggulan selalu dapat memperluas wawasan kita secara perlahan tanpa disadari.'
      }
    ],
    grammar_points: [
      {
        pattern: '唯有 + [Syarat Mutlak]，才(能) + [Hasil]',
        title: 'Konstruksi Kondisi Eksklusif 唯有…才…',
        explanation_id: 'Merupakan bentuk ragam formal/literer dari 只有…才… ("Hanya dengan X, barulah Y dapat tercapai"). Sangat efektif untuk kalimat kesimpulan esai atau pidato.',
        structure: '唯有 + Usaha/Syarat, 才(能) + Hasil yang Dicapai',
        examples: [
          {
            chinese: '唯有脚踏实地，才能实现远大的目标。',
            pinyin: 'Wéiyǒu jiǎotàshídì, cáinéng shíxiàn yuǎndà de mùbiāo.',
            indonesian: 'Hanya dengan berpijak nyata (bekerja keras dengan membumi), barulah kita dapat mewujudkan cita-cita besar.'
          }
        ]
      }
    ],
    vocabulary_ids: ['v-h6-01', 'v-h6-02', 'v-h6-03'],
    practice_questions: [
      {
        id: 'p-m6-01',
        type: 'multiple_choice',
        prompt: 'Idiom (成语) manakah yang paling tepat untuk melengkapi kalimat: "Anak-anak yang tumbuh di keluarga yang gemar membaca akan menyukai buku secara _____ (perlahan tanpa disadari)"?',
        options: [
          '潜移默化 (qiányímòhuà)',
          '半途而废 (bàntú\'érfèi - berhenti di tengah jalan)',
          '画蛇添足 (huàshétiānzú - melakukan hal berlebihan yang merusak)',
          '刻舟求剑 (kèzhōuqiújiàn - kaku tidak mengikuti perubahan)'
        ],
        correct_answer: '潜移默化 (qiányímòhuà)',
        explanation: '潜移默化 menggambarkan pengaruh lingkungan atau kebiasaan yang membentuk seseorang secara halus dan bertahap.'
      }
    ]
  }
];
