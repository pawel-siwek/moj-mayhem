export interface ContributionDay {
	weekday: number;
	count: number;
	level: number;
}

export interface ContributionWeek {
	index: number;
	first_day: string;
	contribution_days: ContributionDay[];
}

export interface ContribsResponse {
	from: string;
	to: string;
	total_contributions: number;
	colors_full: string[];
	weeks: ContributionWeek[];
}
