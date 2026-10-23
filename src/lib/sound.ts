const MUTE_KEY = 'mayhem-muted';

let ctx: AudioContext | null = null;
let muted = false;

try {
	muted = localStorage.getItem(MUTE_KEY) === '1';
} catch {
	// brak localStorage — dźwięk domyślnie włączony
}

export function isMuted() {
	return muted;
}

export function setMuted(value: boolean) {
	muted = value;
	try {
		localStorage.setItem(MUTE_KEY, value ? '1' : '0');
	} catch {
		// ignorujemy brak dostępu do localStorage
	}
}

function audio(): AudioContext | null {
	if (muted) return null;
	const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
	if (!Ctor) return null;
	ctx ??= new Ctor();
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

interface Tone {
	type: OscillatorType;
	from: number;
	to?: number;
	start: number;
	duration: number;
	volume: number;
}

function play(c: AudioContext, tones: Tone[]) {
	const t0 = c.currentTime;
	for (const t of tones) {
		const osc = c.createOscillator();
		const gain = c.createGain();
		const start = t0 + t.start;
		const end = start + t.duration;
		osc.type = t.type;
		osc.frequency.setValueAtTime(t.from, start);
		if (t.to) osc.frequency.exponentialRampToValueAtTime(t.to, end);
		gain.gain.setValueAtTime(0.0001, start);
		gain.gain.exponentialRampToValueAtTime(t.volume, start + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, end);
		osc.connect(gain).connect(c.destination);
		osc.start(start);
		osc.stop(end + 0.05);
	}
}

/** Syrena okrętowa na start pojedynku. */
export function playHorn() {
	const c = audio();
	if (!c) return;
	play(c, [
		{ type: 'sawtooth', from: 110, to: 104, start: 0, duration: 0.7, volume: 0.12 },
		{ type: 'square', from: 165, to: 156, start: 0, duration: 0.7, volume: 0.05 },
	]);
}

/** Dzwon z nabrzeża po załadowaniu wyników. */
export function playBell() {
	const c = audio();
	if (!c) return;
	play(c, [
		{ type: 'sine', from: 880, start: 0, duration: 1.2, volume: 0.15 },
		{ type: 'sine', from: 1760, start: 0, duration: 0.8, volume: 0.06 },
		{ type: 'sine', from: 1318, start: 0.18, duration: 1.2, volume: 0.1 },
	]);
}

/** Eksplozja przy błędzie. */
export function playExplosion() {
	const c = audio();
	if (!c) return;
	play(c, [
		{ type: 'sawtooth', from: 160, to: 28, start: 0, duration: 0.7, volume: 0.2 },
		{ type: 'square', from: 90, to: 20, start: 0, duration: 0.8, volume: 0.15 },
		{ type: 'square', from: 420, to: 40, start: 0, duration: 0.25, volume: 0.1 },
	]);
}
