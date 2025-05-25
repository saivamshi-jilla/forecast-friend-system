
export const validateEmail = (email: string): boolean => {
  // Comprehensive email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional checks
  if (!email || email.length === 0) return false;
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes('..')) return false; // No consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false; // No leading/trailing dots
  
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domainPart] = parts;
  if (localPart.length > 64) return false; // RFC 5321 limit for local part
  if (domainPart.length > 253) return false; // RFC 5321 limit for domain part
  
  return emailRegex.test(email);
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const validateCity = (city: string): boolean => {
  // Basic city name validation
  const cityRegex = /^[a-zA-Z\s-']{2,50}$/;
  return cityRegex.test(city.trim());
};

export const validateName = (name: string): boolean => {
  // Basic name validation
  const nameRegex = /^[a-zA-Z\s-']{2,50}$/;
  return nameRegex.test(name.trim());
};
