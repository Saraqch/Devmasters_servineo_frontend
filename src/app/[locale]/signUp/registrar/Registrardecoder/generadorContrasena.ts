export interface PasswordOptions {
  length?: number;
  lower?: boolean;
  upper?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  avoidAmbiguous?: boolean;
}

export function generarContrasena(options: PasswordOptions = {}): string {
  const {
    length = 16,
    lower = true,
    upper = true,
    numbers = true,
    symbols = true,
    avoidAmbiguous = true,
  } = options;

  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()-_=+[]{};:,.<>?";

  let charset = "";
  if (lower) charset += lowerChars;
  if (upper) charset += upperChars;
  if (numbers) charset += numberChars;
  if (symbols) charset += symbolChars;

  if (avoidAmbiguous) {
    charset = charset.replace(/[O0Il1]/g, ""); 
  }

  if (charset.length === 0) {
    throw new Error("Debe incluirse al menos un conjunto de caracteres.");
  }

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}
