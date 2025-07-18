// name treat as key
export interface Recipe {
  name: string
  image: string
  author: string
  description: string
  cuisines: string[]
  categories: string[]
  ingredients: string[]
  instructions: string[]
  isFavorite?: boolean
  isLocal?: boolean
}

export interface RecipeForm {
  name: string
  image: string
  author: string
  description: string
  cuisines: string[]
  categories: string[]
  ingredients: string[]
  instructions: string[]
  isFavorite?: boolean
  isLocal?: boolean
}
