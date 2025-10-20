import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula a luminosidade relativa de uma cor hexadecimal
 * @param hexColor - Cor em formato hexadecimal (#RRGGBB ou #RGB)
 * @returns Valor entre 0 (preto) e 1 (branco)
 */
export function getLuminance(hexColor: string): number {
  // Remove o # se existir
  const hex = hexColor.replace("#", "");

  // Converte hex para RGB
  let r: number, g: number, b: number;

  if (hex.length === 3) {
    // Formato #RGB
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Formato #RRGGBB
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return 0; // Valor padrão para cores inválidas
  }

  // Normaliza para 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Aplica correção gamma
  const rLinear =
    rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gLinear =
    gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bLinear =
    bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  // Calcula luminosidade relativa (fórmula ITU-R BT.709)
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determina se uma cor de fundo é clara ou escura
 * @param hexColor - Cor em formato hexadecimal
 * @returns true se a cor for clara, false se for escura
 */
export function isLightColor(hexColor: string | null | undefined): boolean {
  if (!hexColor) return false; // Padrão: escuro
  return getLuminance(hexColor) > 0.5;
}
