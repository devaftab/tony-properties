# Components Directory Structure

This directory contains all the React components organized in separate folders for better maintainability.

## Component Folders

### Header/
- `Header.tsx` - Main header component with navigation
- `index.ts` - Export file for clean imports and icons

### Hero/
- `Hero.tsx` - Hero section component
- `index.ts` - Export file for clean imports and icons

### About/
- `About.tsx` - About section component
- `index.ts` - Export file for clean imports and icons

### Services/
- `Services.tsx` - Services section component
- `index.ts` - Export file for clean imports and icons

### Properties/
- `Properties.tsx` - Properties listing component
- `index.ts` - Export file for clean imports and icons

### Features/
- `Features.tsx` - Features/amenities component
- `index.ts` - Export file for clean imports and icons

### Contact/
- `Contact.tsx` - Contact form component
- `index.ts` - Export file for clean imports and icons

### Footer/
- `Footer.tsx` - Footer component
- `index.ts` - Export file for clean imports and icons

### Shared Files
- `icons.ts` - Centralized icon exports from react-icons/io5
- `README.md` - This documentation file

## Import Usage

### Component Imports
```tsx
// Clean imports using index.ts files
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
// ... etc
```

### Icon Imports (within components)
```tsx
// Icons are imported from the component's own index.ts
import { IoMenuOutline, IoCloseOutline } from '.'
import { IoHomeOutline } from '.'
import { IoCheckmarkCircleOutline } from '.'
// ... etc
```

## Benefits of This Structure

1. **Better Organization** - Each component has its own folder
2. **Cleaner Imports** - Use index.ts files for simplified imports
3. **Centralized Icons** - All icons are managed in one place (`icons.ts`)
4. **Easier Maintenance** - Related files are grouped together
5. **Scalability** - Easy to add component-specific files (styles, tests, etc.)
6. **Consistent Pattern** - Follows React/Next.js best practices
7. **Icon Management** - Single source of truth for all icons used across components

## Icon Management

All icons are imported from `react-icons/io5` and re-exported through:
- `icons.ts` - Central repository of all icons
- Component `index.ts` files - Export only the icons needed by that component
- Components import icons from their own `index.ts` file using `import { IconName } from '.'`

This approach ensures:
- No duplicate icon imports across components
- Easy to change icon libraries in the future
- Better tree-shaking and bundle optimization
- Consistent icon usage across the application
