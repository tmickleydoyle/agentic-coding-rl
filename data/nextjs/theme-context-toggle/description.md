# Theme via React Context

This task spans **4 files**:

- `components/ThemeContext.tsx` — creates and exports a React Context `ThemeContext` with shape `{ theme: 'light' | 'dark'; toggle: () => void }`. Default value: `{ theme: 'light', toggle: () => {} }`. Also exports a hook `useTheme()` that returns the context value.
- `components/ThemeProvider.tsx` — exports a default `ThemeProvider({ children })` component that holds `theme` in state (`useState('light')`), implements `toggle` to flip it, and wraps `children` in `ThemeContext.Provider`.
- `components/ThemeToggle.tsx` — uses `useTheme()`; renders `<button data-testid="toggle">Switch to <next></button>` where `<next>` is the opposite of the current theme. Clicking it calls `toggle`.
- `components/App.tsx` (entry, default export) — wraps a `<div data-testid="root" data-theme={theme}>` containing `<ThemeToggle />` inside a `<ThemeProvider>`. Use `useTheme()` to read the theme for the `data-theme` attribute.

The data flow must go through Context — components should NOT receive `theme` via props.
