export interface Ingredient {
  name: string;
  amount?: string;
}

export interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  servings: number;
  sustainabilityScore: number; // 1-10
  ecoTip: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface AiState {
  isLoading: boolean;
  error: string | null;
  recipes: Recipe[];
}

export interface ResourceDefinition {
  title: string;
  description: string;
  icon: any;
  color: string;
  content: {
    intro: string;
    sections: { title: string; body: string }[];
  };
}

export enum ViewState {
  HOME = 'HOME',
  KITCHEN = 'KITCHEN',
  SAVED_RECIPES = 'SAVED_RECIPES',
  MEAL_PLAN = 'MEAL_PLAN',
  ABOUT = 'ABOUT',
  RESOURCES = 'RESOURCES',
  RESOURCE_DETAILS = 'RESOURCE_DETAILS',
  RECIPE_DETAILS = 'RECIPE_DETAILS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  MANIFESTO = 'MANIFESTO'
}

export interface DailyPlan {
  day: string;
  breakfast: Recipe;
  lunch: Recipe;
  snack: Recipe;
  dinner: Recipe;
}