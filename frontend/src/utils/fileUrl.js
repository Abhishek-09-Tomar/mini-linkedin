const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const fileUrl = (path) => {
  if (!path) return '/default-avatar.svg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${backendUrl}${path}`;
  return path;
};
