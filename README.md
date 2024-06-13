# Skruenøglen API

Dette er SkruenøglensForum Backend/API.

Dette API tilbyder omfattende funktionalitet til SkruenøglensForum Frontend til at administrere brugere, opslag, kommentarer og biler.

APIet bruger basepath `[hostname]/api/v1/`

## Funktioner

-   **Registering:** Opret bruger konto
-   **Sikker log ind:** Log ind for bruger og admin.
-   **Brugere:** Redigere bruger, slette bruger og skift password 
-   **Opslag og kommentarer:** Opret opslag, redigere opslag, slette opslag, Kommentere på opslag og markere kommentarer som løsning.
-   **Biler:** Opret, rediger og slet biler.
-   **Admin:** Admin kan interagere med alt og bandlyse brugere.
-   **Søgning og filtrering:** Hent opslag ud fra kategori, nummerplade og søgeord.

## Teknologi

-   **Frontend**: SvelteKit
-   **Backend**: Node.js
-   **Database**: MySql
-   **Deployment**: Docker

## Projekt Opsætning
### Lokalt:

1. **Klon Repositoriet**

    ```
    git clone https://github.com/Skruenoglens-forum/skruenoeglensbackend_api.git
    ```

2. change directory to the project folder

    ```
    cd skruenoeglensbackend_api
    ```

3. **Installer Dependencies**

    ```
    npm install
    ```

4. **Init database**

    1. Hvis du vil køre projektet lokalt, skal du først omdøbe filen `.env.example` til `.env` og derefter udfylde de nødvendige felter.
    2. Nu skal du kopiere indholdet i filen `dump.sql` og køre queryen på din MySQL-server.

5. **Starte Projektet Lokalt**

    ```
    npm run dev
    ```

### Docker:
For at bygge og køre projektet ved hjælp af Docker, følg disse trin:
1. **Byg Docker Image**
    ```
    docker build -t skruenoeglen_backend .
    ```
2. **Kør Containeren**
    ```
    docker run -p 8686:8686 skruenoeglen_backend
    ```
    Herefter er applikationen tilgængelig på `localhost:8686`.

## Endpoints
### Users

**GET** `/users/` - Henter alle brugere.

**GET** `/users/:id` - Henter specifik bruger.

**GET** `/users/:id/image` - Henter brugers billeder.

**POST** `/users/` - Opretter en ny bruger.

**PUT** `/users/:id` - Opdaterer den aktuelt indloggede brugers profil.

**PUT** `/users/:id:/ban` - Bandlyser en bruger.

**PUT** `/users/:id/unban` - Fjerner bandlysning af en bruger.

**DELETE** `/users/:id` - Sletter bruger ud fra id.

---
### Posts
**GET** `/posts?brand=ford&model=focus&category_id=1&search=motor` - Henter en liste over opslag.

**GET** `/posts/:id` - Henter et specifikt opslag baseret på Id.

**GET** `/posts/users/:id` - Henter et specifikt opslag baseret på brugerens Id.

**GET** `/posts/:id/images` - Henter billeder for et opslag baseret på id Id.

**GET** `/image/:id` - Henter et specifikt billede baseret på opslagets id Id.

**POST** `/posts` - Opretter et nyt opslag.

**PUT** `/posts/:id` - Opdaterer et eksisterende opslag. 

**DELETE** `/posts/:id` - Sletter et opslag. 

---
### Comments
**GET** `/comments/` - Henter alle kommentarer.

**GET** `/comments/:id:` - Henter kommentarer til et specifikt opslag.

**GET** `/comments/posts/:id` - Henter alle kommentarer ud fra post id.

**POST** `/comments/posts/:id` - Tilføjer en kommentar til et opslag.

**PUT** `/comments/:id` - Opdatere en kommentar til et opslag.

**PUT** `/comments/:id/solution/{isSolution}` - Markere en kommentar som svar til et opslag.

**DELETE** `/comments/:id` - Sletter kommentar til opslag.

---
### Cars
**GET** `/cars/` - Henter alle biler.

**GET** `/cars/:id` - Henter bil ud fra id.

**GET** `/cars/users/:id` - Henter alle biler til for en specifik brugers id.

**GET** `/cars/:id/image` - Henter billede fra bil id.

**POST** `/cars/` - Opretter en ny bil til brugeren som har accesstoken.

**PUT** `/cars/:id` - Opdatere en bil, ud fra bil id og tilsendt data.

**DELETE** `/cars/:id` - Sletter en bil baseret på bil id.

© Emil Storgaard Andersen, 2024.