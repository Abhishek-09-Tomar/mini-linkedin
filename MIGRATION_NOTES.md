# PHP to MERN Conversion Notes

## What changed

- PHP pages were converted to a React single-page application.
- MySQL tables were converted to MongoDB/Mongoose models.
- PHP sessions were converted to JWT authentication stored by the React client.
- PHP file uploads were converted to Multer uploads inside `backend/uploads`.
- PHP server-rendered pages were converted to API endpoints and React pages.

## Old PHP -> New MERN mapping

| Old PHP file/table | New MERN equivalent |
|---|---|
| `signup.php`, `login.php`, `verify-otp.php` | `authController.js`, `authRoutes.js`, `Signup.jsx`, `Login.jsx` |
| `dashboard.php` | `Dashboard.jsx` + `/api/posts/feed` |
| `profile.php`, `edit-profile.php` | `Profile.jsx`, `EditProfile.jsx`, `userController.js` |
| `create-post.php`, `edit-post.php`, `delete-post.php` | `postController.js` |
| `like-post.php`, `add-comment.php`, `share-post.php` | `postController.js` post actions |
| `connections.php`, `connection-action.php` | `connectionController.js`, `Network.jsx` |
| `search.php` | `Search.jsx`, `/api/users/search` |
| `notifications` table | `Notification.js` model + notification routes |
| `users`, `posts`, `likes`, `comments`, `shares`, `connections` tables | Mongoose models and nested post arrays |

## Not included

- Real Google OAuth integration is not wired. The old PHP files had integration points; for production MERN, use Passport.js or Google Identity Services.
- Real SMS OTP is not wired. Development OTP is returned only when `APP_ENV=development`.
