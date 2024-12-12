import crypto from 'crypto';

export const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  // Generate a unique identifier using SHA256 hash
  const uniqueId = crypto
    .createHash('sha256')
    .update(new Date().toString()) // You can also use the title or a combination
    .digest('hex')
    .slice(0, 12); // Take the first 12 characters

  return `${baseSlug}-${uniqueId}`;
};
