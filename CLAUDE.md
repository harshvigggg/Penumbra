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

Tech Stack:

Frontend: React + TypeScript + Tailwind CSS
Backend: Node.js + Express
Database: PostgreSQL
ORM: Prisma
Lyrics source: Genius API
Audio: Spotify embed (iframe only)
Auth: JWT built from scratch
Deployment: Railway

Core Features to build:

User auth (register, login, JWT sessions)
Song pages with lyrics fetched from Genius API
Line by line annotation system (highlight a line, write interpretation)
Upvote/downvote on interpretations
Genre/language communities
Song discussion section (general comments per song)
User profiles with reputation score
Search by song, artist, language, genre
Discovery feed (trending, new, by community)
Manual lyrics input for songs Genius doesn't have