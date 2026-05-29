import fs from 'fs';
import path from 'path';

export const removeLocalFile = (relativePath) => {
  if (!relativePath || relativePath.includes('default-avatar.svg')) return;
  const clean = relativePath.replace(/^\/+/, '');
  const fullPath = path.join(process.cwd(), clean);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

export const toPublicPath = (file) => {
  if (!file) return null;
  const normalized = file.path.replaceAll('\\', '/');
  const uploadIndex = normalized.indexOf('uploads/');
  return uploadIndex >= 0 ? `/${normalized.slice(uploadIndex)}` : `/${normalized}`;
};

export const detectMediaType = (mimetype = '') => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'none';
};
