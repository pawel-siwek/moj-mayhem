import type { ContribsResponse } from './contributions';

export function longestStreak(data: ContribsResponse): number {
	let best = 0;
	let current = 0;
	for (const week of data.weeks) {
		for (const day of week.contribution_days) {
			current = day.count > 0 ? current + 1 : 0;
			if (current > best) best = current;
		}
	}
	return best;
}
