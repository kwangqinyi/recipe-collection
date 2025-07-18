## 🛠 Stack
- **Framework**: Vue 3 + TypeScript
- **Build tool**: Vite
- **UI Library**: Element Plus
- **CSS Framework**: Tailwind CSS
- **Node Version**: v22.17.1

## 🏃‍♂️ Getting Started
  1. npm install
  2. npm run dev

## ✨ Features
- Browse and search recipes
- List and Grid view
- Filter by category, cuisine, or favorite status
- Add, edit, and delete any recipe
- Local data persistence using Pinia

## 🧠 Design Decisions
- **ColumnConfig Structure**: Table columns and advanced filters are defined using a shared `ColumnConfig` schema, making it easy to extend features like sorting, filtering, and display customization.
- **Pinia Store**: Recipe data and filter state are managed centrally via Pinia, with localStorage persistence for a consistent user experience.
- **Reusable Components**: Both `Toolbar` and `ToolbarAdvancedFilter` are built to be flexible and reusable — ready to plug into other modules that need similar filtering features.
- **Dynamic Filtering**: Advanced filters are generated from `ColumnConfig`, allowing scalable and type-safe filter logic without hardcoding UI fields.
- **Shared Form Modal**: Both add and edit actions use the same `RecipeFormModal` component, reducing duplication and ensuring consistent validation and layout.

- ## ⚠️ Note
- To enable CRUD operations on recipes fetched from the JSON API, the data is stored in Pinia on first load.
- If you want to re-fetch the original data, please clear your localStorage to reset the state.
