# Uteeni & Co. Parts & Scrap 

Welcome to **Uteeni & Co.**, a Jawa-run parts shop outside **Mos Espa** on Tatooine. Clans prowl the dunes in towering **sandcrawlers**, salvaging droids and scrap, then offload the good bits here for farmers and spacers. 

Most of our revenue is from online parts sales. Unfortunately, we've recently experienced several cyber attacks against our apis. We need help making our api more secure.

Your mission: secure our rickety API before the next sandstorm!

## Era & flavor

- **Where:** Mos Espa, Tatooine  
- **When:** Around *A New Hope* (or during *The Mandalorian*)  
- **Why sandcrawlers?** Jawas travel/lodge in huge treaded sandcrawlers—multi-deck mobile fortresses many meters tall. :contentReference[oaicite:0]{index=0}  
- **Origins (lore):** Many sandcrawlers trace to the **Corellia Mining Corporation**; mining rigs were abandoned and later taken over by Jawa clans (some details are Legends). :contentReference[oaicite:1]{index=1}  
- **Common stock:** droid restraining bolts + callers, GNK “gonk” power droids, moisture-farm parts (e.g., **GX-8** condenser units), crawler mobility + smelter spares. :contentReference[oaicite:2]{index=2}

---

## What’s in this kata

Two implementations of the same API:

- `bad/` — our current api
- `good/` — a place to put your fix

End Points:
- `GET /products` — product catalog   
- `GET /products/search` — catalog search  
- `GET /orders/:orderId` — read an order  
- `POST /orders` — checkout  
- `GET /admin/users` — admin list  
- `GET /whoami` — helper (shows token mapping - set bearer token)

TODO:
1. Identify the security issue with each of the first 5 endpoints.
2. Determine which of the OWASP top 10 each endpoint violates.
3. Implement a fix for each of the issus.

### Tokens (simulated Bearer)
- `token-alice` (user), `token-bob` (user), `token-admin` (admin)


## How to run

```bash
# vulnerable API
cd bad
npm install
npm run start   # http://localhost:3001

# secure API
cd good
npm install
npm run start   # http://localhost:3002
```

## Running Tests
```
# Vulnerable project (should FAIL):
cd bad
npm i
npm test

# Secure project (should PASS):
cd good
npm i
npm test
```
## OWASP Top 10 API Security Risks
1. API1: Broken Object Level Authorization (BOLA) — ID-based endpoints must enforce object ownership/permissions; missing checks enable horizontal/vertical access abuse. 
OWASP Foundation

2. API2: Broken Authentication — Weak or flawed auth lets attackers steal or forge tokens and impersonate users. 
OWASP Foundation

3. API3: Broken Object Property Level Authorization — Missing/weak checks at the field level lead to overexposure (read) or mass assignment (write). (2023 merges 2019’s Excessive Data Exposure + Mass Assignment.) 
OWASP Foundation

4. API4: Unrestricted Resource Consumption — Absent/weak rate limiting or expensive flows cause DoS or bill shock (bandwidth/CPU/memory/3rd-party costs). 
OWASP Foundation

5. API5: Broken Function Level Authorization — Admin/privileged routes callable by regular users due to missing or misapplied role checks. 
OWASP Foundation

6. API6: Unrestricted Access to Sensitive Business Flows — Business actions (e.g., checkout, ticketing) lack protections against abuse/automation even when technically “valid.” 
OWASP Foundation

7. API7: Server-Side Request Forgery (SSRF) — API fetches remote URIs supplied by users without validation, letting attackers pivot to internal networks. 
OWASP Foundation

8. API8: Security Misconfiguration — Insecure defaults, missing hardening, exposed debug/config lead to compromise. 
OWASP Foundation

9. API9: Improper Inventory Management — Unknown/shadow endpoints, deprecated versions, and poor documentation increase risk. 
OWASP Foundation

10. API10: Unsafe Consumption of APIs — Trusting third-party APIs’ data or behavior without validation/hardening introduces indirect compromise paths.




# C3ProjectTemplate

See solutions in different languages in the "Templates" directory. Once you decide which language you'd like to use,
simply open that directory in your favorite IDE, and you should be able to run the included unit tests "out of the box".

## Duplicating this Repo

To create a duplicate repository from this one, follow these steps:

1. Create your new repository. For example, MyNewRepo.

2. Open Git Bash.

3. Create a bare clone of the repository.

    ```
    git clone --bare https://github.com/Ingage-Meetup/MyNewRepo.git
    ```

4. Mirror-push to the new repository.
  
    ```
    cd MyNewRepo.git
    git push --mirror https://github.com/Ingage-Meetup/MyNewRepo.git
    ```

5. Remove the temporary local repository you created earlier.

    ```
    cd ..
    rm -rf OLD-REPOSITORY.git
    ```

Your new repository now contains a mirror of this repo.

The recommended IDEs are as follows, but feel free to use whatever IDE you are comfortable with.

-   [C#](Templates/C%23) - [Microsoft Visual Studio](https://visualstudio.microsoft.com/vs/community/)
-   [Java](Templates/Java) - [IntelliJ Idea](https://www.jetbrains.com/idea/download) (Community Edition is fine)
-   [JavaScript](Templates/JavaScript) - [Microsoft Visual Studio Code](https://code.visualstudio.com/)
-   [Kotlin](Templates/Kotlin) - [IntelliJ Idea](https://www.jetbrains.com/idea/download) (Community Edition is fine)
-   [Python](Templates/Python) - [Pycharm](https://www.jetbrains.com/pycharm/download/?section=windows) (Community Edition is fine)
-   [TypeScript](Templates/TypeScript) - [Microsoft Visual Studio Code](https://code.visualstudio.com/)
