export interface TTSOptions {
  rate?: number; // 0.75, 1.0, 1.25
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isAvailable: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isAvailable = true;
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize zh-CN / cmn voices (Mandarin Chinese)
    const chineseVoice = voices.find(
      (v) => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh')
    );
    if (chineseVoice) {
      this.selectedVoice = chineseVoice;
    }
  }

  public isSupported(): boolean {
    return this.isAvailable;
  }

  public getVoiceInfo(): { name: string; isMandarin: boolean; syntheticLabel: string } {
    if (!this.isAvailable || !this.selectedVoice) {
      return {
        name: 'Browser Default',
        isMandarin: false,
        syntheticLabel: 'Web Speech API (Sintetis)',
      };
    }
    return {
      name: this.selectedVoice.name,
      isMandarin: this.selectedVoice.lang.toLowerCase().includes('zh'),
      syntheticLabel: 'Web Speech API Standar Browser',
    };
  }

  public speak(text: string, options: TTSOptions = {}): void {
    if (!this.synth) {
      options.onError?.(new Error('Speech Synthesis tidak didukung pada browser ini.'));
      return;
    }

    // Cancel ongoing speech if any
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      options.onError?.(e);
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
