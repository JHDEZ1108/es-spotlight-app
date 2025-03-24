// Define the structure for colors within each theme
declare module 'ThemeTypes' {
  export interface ThemeColors {
    primary: string;
    primaryVariant: string;
    secondary: string;
    secondaryVariant: string;
    background: string;
    surface: string;
    error: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onError: string;
    onSurface: string;
    disabled: string;
    border: string;
    divider: string;
  }

  export interface Theme {
    light: ThemeColors;
    dark: ThemeColors;
  }
}
