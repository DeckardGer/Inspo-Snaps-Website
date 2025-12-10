import { createServerFn } from "@tanstack/react-start";

export type FavouriteFolder = {
	id: string;
	name: string;
	url: string;
};

export const getFavouriteFolders = createServerFn({ method: "GET" }).handler(
	async () => {
		// TODO: Replace with actual database query
		// Mock data for now
		await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay

		return [
			{
				id: "1",
				name: "Project Management & Task Tracking",
				url: "/folders/project-management",
			},
			{
				id: "2",
				name: "Family Recipe Collection & Meal Planning",
				url: "/folders/family-recipes",
			},
			{
				id: "3",
				name: "Fitness Tracker & Workout Routines",
				url: "/folders/fitness",
			},
			{
				id: "4",
				name: "Book Notes & Reading List",
				url: "/folders/books",
			},
			{
				id: "5",
				name: "Sustainable Gardening Tips & Plant Care",
				url: "/folders/gardening",
			},
			{
				id: "6",
				name: "Language Learning Progress & Resources",
				url: "/folders/language-learning",
			},
			{
				id: "7",
				name: "Home Renovation Ideas & Budget Tracker",
				url: "/folders/home-renovation",
			},
			{
				id: "8",
				name: "Personal Finance & Investment Portfolio",
				url: "/folders/finance",
			},
			{
				id: "9",
				name: "Movie & TV Show Watchlist with Reviews",
				url: "/folders/movies",
			},
			{
				id: "10",
				name: "Daily Habit Tracker & Goal Setting",
				url: "/folders/habits",
			},
		] satisfies FavouriteFolder[];
	},
);
