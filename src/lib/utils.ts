import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Simple hash function to generate a deterministic number from a string
 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash);
}

/**
 * Generates a seeded random number between 0 and 1
 */
function seededRandom(seed: number): number {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

/**
 * Generates a deterministic gradient based on a username
 * Same username will always produce the same gradient with 3 colors
 */
export function generateUserGradient(username: string) {
	const hash = hashString(username);

	// Generate seeds for different aspects
	const baseHueSeed = seededRandom(hash);
	const offsetSeed = seededRandom(hash + 1);
	const angleSeed = seededRandom(hash + 2);

	// Generate one base hue and create harmonious offsets
	const baseHue = Math.floor(baseHueSeed * 360);

	// Determine offset pattern (analogous or triadic)
	const useTriadic = offsetSeed > 0.5;
	const hue1 = baseHue;
	const hue2 = useTriadic
		? (baseHue + 120) % 360 // Triadic: 120 degrees apart
		: (baseHue + 30 + Math.floor(seededRandom(hash + 3) * 30)) % 360; // Analogous: 30-60 degrees
	const hue3 = useTriadic
		? (baseHue + 240) % 360 // Triadic: 240 degrees apart
		: (baseHue - 30 - Math.floor(seededRandom(hash + 4) * 30)) % 360; // Analogous: -30 to -60 degrees

	// Use more consistent saturations and lightness for harmony
	const baseSaturation = 70 + Math.floor(seededRandom(hash + 5) * 15); // 70-85%
	const saturation1 = baseSaturation;
	const saturation2 = baseSaturation - 5 + Math.floor(seededRandom(hash + 6) * 10); // ±5%
	const saturation3 = baseSaturation - 5 + Math.floor(seededRandom(hash + 7) * 10); // ±5%

	const baseLightness = 50 + Math.floor(seededRandom(hash + 8) * 10); // 50-60%
	const lightness1 = baseLightness;
	const lightness2 = baseLightness - 5 + Math.floor(seededRandom(hash + 9) * 10); // ±5%
	const lightness3 = baseLightness - 5 + Math.floor(seededRandom(hash + 10) * 10); // ±5%

	const color1 = `hsl(${hue1}, ${saturation1}%, ${lightness1}%)`;
	const color2 = `hsl(${hue2}, ${saturation2}%, ${lightness2}%)`;
	const color3 = `hsl(${hue3}, ${saturation3}%, ${lightness3}%)`;

	// Generate angle for gradient direction (0-360 degrees)
	const angle = Math.floor(angleSeed * 360);

	// Generate varied positions for smoother, more organic transitions
	const pos1 = Math.floor(seededRandom(hash + 11) * 15); // 0-15%
	const pos2 = 40 + Math.floor(seededRandom(hash + 12) * 20); // 40-60%
	const pos3 = 85 + Math.floor(seededRandom(hash + 13) * 15); // 85-100%

	// Always use linear gradient with 3 color steps
	const css = `linear-gradient(${angle}deg, ${color1} ${pos1}%, ${color2} ${pos2}%, ${color3} ${pos3}%)`;

	return {
		colors: [color1, color2, color3],
		angle,
		css,
		svg: {
			id: `gradient-${hash}`,
			x1: "0%",
			y1: "0%",
			x2: `${Math.cos((angle * Math.PI) / 180) * 100}%`,
			y2: `${Math.sin((angle * Math.PI) / 180) * 100}%`,
		},
	};
}
