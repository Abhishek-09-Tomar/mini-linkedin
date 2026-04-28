<h1 align="center">Mini LinkedIn</h1>

</div>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=34&pause=900&color=4F8EF7&center=true&vCenter=true&width=900&lines=Full-Stack%20Social%20Platform;Scalable%20Backend%20Architecture;Production-Grade%20System%20Design" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=22&pause=1200&color=38D9A9&center=true&vCenter=true&width=850&lines=Clean%20APIs;Modular%20Design;Real-World%20Logic;Interview-Ready" />

</div>

<p align="center">
  <b>Production-grade full-stack social platform</b><br/>
  Built phase-by-phase with clean architecture, scalable APIs, and real-world engineering patterns
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-0A0E1A?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Framework-Express-111827?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-1A2235?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Auth-JWT-4F8EF7?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-111827?style=for-the-badge&logo=next.js" />
</p>

---

<h2 align="center">Architecture</h2>

<p align="center">
<code>Auth → Users → Posts → Engagement → Feed → Media → Frontend</code>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Auth-Completed-38d9a9?style=flat-square" />
  <img src="https://img.shields.io/badge/Users-Completed-38d9a9?style=flat-square" />
  <img src="https://img.shields.io/badge/Posts-In%20Progress-4f8ef7?style=flat-square" />
  <img src="https://img.shields.io/badge/Engagement-Pending-7a85a0?style=flat-square" />
  <img src="https://img.shields.io/badge/Feed-Pending-7a85a0?style=flat-square" />
  <img src="https://img.shields.io/badge/Media-Pending-7a85a0?style=flat-square" />
  <img src="https://img.shields.io/badge/Frontend-Pending-7a85a0?style=flat-square" />
</p>

---

<h2 align="center">Progress</h2>

<p align="center">
<code>██████░░░░░░░░░░░░░░░░░░░░</code><br/>
<b>Phase 2 of 8 — 25% Complete</b>
</p>

---

<h2 align="center">Build Phases</h2>

---

<h3>Phase 1 — Authentication</h3>

<b>Objective</b>  
Identity and access control layer

<b>Capabilities</b>
- User registration and login  
- JWT-based authentication  
- Protected routes (`/me`)  
- Password hashing (bcrypt)  

<b>Outcome</b>  
System can reliably identify users  

---

<h3>Phase 2 — User System & Social Graph</h3>

<p>
  <img src="https://img.shields.io/badge/Status-Testing-4f8ef7?style=flat-square" />
</p>

<b>Capabilities</b>
- Profile update and retrieval  
- Follow / unfollow system  
- Followers and following counts  

<b>Core Concepts</b>
- Social graph modeling  
- Bidirectional relationships  

<b>Outcome</b>  
Users can establish connections  

---

<h3>Phase 3 — Post System</h3>

<p>
  <img src="https://img.shields.io/badge/Status-Up%20Next-f9a825?style=flat-square" />
</p>

<b>Capabilities</b>
- Create post (text + image)  
- Retrieve global feed  
- Delete post (owner restricted)  

<b>Structure</b>
models/Post.js
controllers/postController.js
routes/postRoutes.js


<b>Core Concepts</b>
- One-to-many relationships  
- Content aggregation  
- File handling  

<b>Outcome</b>  
Platform becomes content-driven  

---

<h3>Phase 4 — Engagement System</h3>

<b>Capabilities</b>
- Like / unlike posts  
- Comment system  
- Delete own comments  

<b>Core Concepts</b>
- Nested data  
- Atomic updates  

<b>Outcome</b>  
Interaction layer introduced  

---

<h3>Phase 5 — Smart Feed</h3>

<b>Capabilities</b>
- Filter posts from followed users  
- Sort by timestamp  
- Pagination (cursor-based)  

<b>Core Concepts</b>
- Query optimization  
- Filtering pipelines  
- Pagination strategies  

<b>Outcome</b>  
Personalized feed experience  

---

<h3>Phase 6 — Media Handling</h3>

<b>Capabilities</b>
- File uploads (Multer)  
- Cloud storage (Cloudinary)  
- Media linking  

<b>Core Concepts</b>
- Streaming  
- External storage integration  

<b>Outcome</b>  
Real media support  

---

<h3>Phase 7 — Frontend Integration</h3>

<b>Capabilities</b>
- Authentication UI  
- Profile UI  
- Feed UI  
- Post creation UI  

<b>Core Concepts</b>
- Client-server integration  
- State management (Zustand)  
- API handling (Axios)  

<b>Outcome</b>  
Full-stack application  

---

<h3>Phase 8 — Advanced Systems</h3>

<p>
  <img src="https://img.shields.io/badge/Optional-Advanced-ab47bc?style=flat-square" />
</p>

<b>Capabilities</b>
- Real-time messaging  
- Notifications  
- Job posting module  

<b>Core Concepts</b>
- WebSockets  
- Event-driven systems  
- Scalable architecture  

<b>Outcome</b>  
Production-level platform  

---

<h2 align="center">Engineering Principle</h2>

<p align="center">
Clean structure · Working APIs · Real-world logic
</p>

<p align="center">
<code>Build → Test → Stabilize → Advance</code>
</p>

---

<h2 align="center">Current Status</h2>

<p align="center">
<b>Phase:</b> User System<br/>
<b>State:</b> Testing<br/>
<b>Next:</b> Post System
</p>

---

<h2 align="center">Future Enhancements</h2>

- API documentation (Swagger / OpenAPI)  
- Deployment (AWS / Vercel / Render)  
- CI/CD pipeline  
- Unit & integration testing  

---

<h2 align="center">License</h2>

<p align="center">MIT License</p>

---

<h2 align="center">Closing Statement</h2>

<p align="center">
This is not a demo project.<br/>
It is a system design implementation executed as production-grade software.
</p>
