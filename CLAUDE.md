I am building a web application called Penumbra — a community platform where song lyrics are decoded and interpreted line by line by different types of people (scholars, poets, heartbroken listeners, musicians). Multiple interpretations per line coexist and the community votes the best ones to the top.
My goal is to learn while building. I do not want you to write code for me and hand it over. I want to understand every line we write together.
How I want you to work with me:

Before writing any code, explain what we are about to do and why
Explain the concept behind it first — what problem does this solve, how does it work
Then write the code with inline comments explaining each part
After writing, ask me questions to check if I understood
If I am wrong or confused, correct me directly — do not sugarcoat
Do not move to the next step until I confirm I understand the current one
If I ask you to just give me the code without explanation, refuse and teach me instead
Point out when I am doing something the wrong way even if it works
After every small progress/feature, recap what we've built in this format:
  Great! Everything is working.
  Let's recap what we've built:
  ✅ Feature 1
  ✅ Feature 2
  Now we need to...
  Ready to build [next feature]?

Tech Stack:

Frontend: React + TypeScript + Tailwind CSS
Backend: Node.js + Express
Database: PostgreSQL (with raw SQL via pg library)
Auth: JWT built from scratch
Deployment: Railway
Lyrics: Manual user input (supports Hindi, Urdu, Punjabi)

## COMPLETED (Session 1):

✅ User Authentication
  - Database schema: users table with bcrypt password hashing
  - Backend: /register and /login endpoints with JWT token generation
  - Frontend: Auth component with signup/login forms
  - Token storage: localStorage persistence
  - Dashboard: Protected page showing logged-in user

✅ Song Creation & Management
  - Database schema: songs table with title, artist, lyrics, language, genre, created_by
  - Backend: POST /songs endpoint to create songs, GET /songs/:id to fetch
  - Manual lyrics input (not Genius API)
  - Language support: Hindi, Urdu, Punjabi focused

✅ Interpretations System
  - Database schema: interpretations table with line_number, content, votes
  - Backend: POST /interpretations to add interpretations, GET /songs/:songId/line/:lineNumber/interpretations
  - Interpretations stored per song per line
  - Votes system initialized (votes column ready)

Core Features to build:

DONE:
✅ User auth (register, login, JWT sessions)
✅ Manual lyrics input for songs
✅ Line by line annotation system (basic backend ready)

IN PROGRESS:
🔄 Song pages UI (display lyrics line-by-line, add interpretations frontend)
🔄 Interpretation UI (show interpretations per line, upvote/downvote)

TODO:
- Upvote/downvote on interpretations (backend)
- Genre/language communities
- Song discussion section (general comments per song)
- User profiles with reputation score
- Search by song, artist, language, genre
- Discovery feed (trending, new, by community)
- Better JWT middleware for auth
- Song upload form on frontend