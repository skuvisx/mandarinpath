import { HskLevel, VocabularyItem } from '@/types';

export interface RawHskEntry {
  s: string;       // Simplified Hanzi
  t?: string;      // Traditional Hanzi (if different)
  p: string;       // Pinyin with tone marks
  id: string;      // Indonesian meaning
  e: string[];     // English CC-CEDICT meanings
  pos?: string[];  // Indonesian part of speech tags
  r?: string;      // Radical character
  rn?: string;     // Radical explanation in Indonesian
  f?: number;      // Frequency rank (lower = more common)
  o?: number;      // HSK 2.0 level (1..6)
  n?: number;      // HSK 3.0 level (1..7, where 7 = band 7-9)
}

export interface HskMeta {
  generated_at: string;
  source: string;
  source_license: string;
  definitions_license: string;
  notes: string;
  hsk2: Record<string, number>;
  hsk3: Record<string, number>;
  handcrafted_indonesian_count?: number;
}

const levelCache = new Map<string, RawHskEntry[]>();
let metaCache: HskMeta | null = null;

export async function fetchHskMeta(): Promise<HskMeta | null> {
  if (metaCache) return metaCache;
  try {
    const res = await fetch('/data/hsk/meta.json');
    if (!res.ok) return null;
    metaCache = await res.json();
    return metaCache;
  } catch {
    return null;
  }
}

export async function fetchHskLevel(
  standard: 'hsk2' | 'hsk3',
  level: number
): Promise<RawHskEntry[]> {
  const key = `${standard}-${level}`;
  if (levelCache.has(key)) return levelCache.get(key)!;
  try {
    const res = await fetch(`/data/hsk/${key}.json`);
    if (!res.ok) return [];
    const data: RawHskEntry[] = await res.json();
    levelCache.set(key, data);
    return data;
  } catch {
    return [];
  }
}

/**
 * Generates a natural contextual sentence template when adding a raw corpus word
 * to the SRS deck or inspecting it in detail.
 */
export function buildContextualExample(entry: RawHskEntry): {
  chinese: string;
  pinyin: string;
  indonesian: string;
} {
  const pos = (entry.pos || []).join(', ');
  const firstMeaning = (entry.id || entry.e[0] || '').split(';')[0].trim();
  const primaryPinyin = entry.p.split(' / ')[0];

  if (pos.includes('idiom') || entry.s.length === 4) {
    return {
      chinese: `“${entry.s}”是一个非常实用的汉语表达。`,
      pinyin: `“${primaryPinyin}” shì yí gè fēicháng shíyòng de Hànyǔ biǎodá.`,
      indonesian: `"${entry.s}" (${firstMeaning}) adalah ungkapan bahasa Mandarin yang sangat berguna.`,
    };
  }
  if (pos.includes('kata kerja')) {
    return {
      chinese: `在日常生活中，我们经常会用到“${entry.s}”这个词。`,
      pinyin: `Zài rìcháng shēnghuó zhōng, wǒmen jīngcháng huì yòng dào “${primaryPinyin}” zhè gè cí.`,
      indonesian: `Dalam kehidupan sehari-hari, kita sering menggunakan kata "${entry.s}" (${firstMeaning}).`,
    };
  }
  if (pos.includes('kata sifat')) {
    return {
      chinese: `大家都觉得这样做非常${entry.s}。`,
      pinyin: `Dàjiā dōu juéde zhèyàng zuò fēicháng ${primaryPinyin}.`,
      indonesian: `Semua orang merasa melakukan hal ini sangat ${firstMeaning}.`,
    };
  }
  return {
    chinese: `今天我重点复习了“${entry.s}”的用法。`,
    pinyin: `Jīntiān wǒ zhòngdiǎn fùxí le “${primaryPinyin}” de yòngfǎ.`,
    indonesian: `Hari ini saya fokus mengulang penggunaan kata "${entry.s}" (${firstMeaning}).`,
  };
}

/**
 * Converts a RawHskEntry into a full VocabularyItem compatible with the SM-2 SRS system.
 */
export function rawEntryToVocabularyItem(entry: RawHskEntry): VocabularyItem {
  const lvlNum = Math.min(6, Math.max(1, entry.o || entry.n || 1));
  const hskLevel = `HSK${lvlNum}` as HskLevel;
  const ex = buildContextualExample(entry);

  return {
    id: `hsk-${entry.o ? `o${entry.o}` : `n${entry.n || 1}`}-${entry.s}`,
    hanzi: entry.s,
    pinyin: entry.p,
    meaning_id: entry.id || entry.e.slice(0, 3).join('; '),
    part_of_speech: (entry.pos || ['kosakata']).join(', '),
    hsk_level: hskLevel,
    hsk_version: entry.o && entry.n ? 'both' : entry.o ? '2.0' : '3.0',
    topic: entry.n && entry.n >= 7 ? 'HSK 3.0 Band 7–9' : `Kurikulum ${hskLevel}`,
    radicals: entry.r ? `${entry.r}${entry.rn ? ` — ${entry.rn}` : ''}` : undefined,
    component_breakdown: entry.t
      ? `Tradisional: ${entry.t} • Peringkat frekuensi: #${entry.f || '-'} • Definisi CC-CEDICT: ${entry.e.join('; ')}`
      : `Peringkat frekuensi: #${entry.f || '-'} • Definisi CC-CEDICT: ${entry.e.join('; ')}`,
    example_chinese: ex.chinese,
    example_pinyin: ex.pinyin,
    example_indonesian: ex.indonesian,
  };
}
