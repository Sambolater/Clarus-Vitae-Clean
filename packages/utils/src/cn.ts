/**
 * Class Name Utility
 *
 * Simple utility for conditionally joining class names.
 * Lightweight alternative to clsx/classnames.
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Conditionally join class names
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const result = cn(...input);
      if (result) classes.push(result);
    }
  }

  return classes.join(' ');
}
