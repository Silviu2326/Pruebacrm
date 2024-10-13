import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Función auxiliar para combinar clases CSS
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Configuración de variantes de input
const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-muted",
        outlined: "bg-transparent border-2",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Definición de tipos del input
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, // Omitimos 'size' del input nativo
    VariantProps<typeof inputVariants> {
  size?: 'default' | 'sm' | 'lg'; // Redefinimos 'size' para que coincida con las variantes
}

// Componente Input
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", variant, size = "default", ...props }, ref) => { // Aquí aseguramos que el valor sea una cadena válida
      return (
        <input
          className={cn(inputVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        />
      );
    }
  );
  
Input.displayName = "Input";

export { Input, inputVariants };