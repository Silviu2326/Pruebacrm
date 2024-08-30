// Archivo: utils.ts

// Función para combinar clases de CSS de manera condicional
export function cn(...classes: (string | false | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  