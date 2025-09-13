# Uteeni & Co. Parts & Scrap (E-commerce API Security Kata)

Welcome to **Uteeni & Co.**, a Jawa-run parts shop outside **Mos Espa** on Tatooine. Clans prowl the dunes in towering **sandcrawlers**, salvaging droids and scrap, then offload the good bits here for farmers and spacers. Your mission: secure our rickety API before the next sandstorm!

## Era & flavor

- **Where:** Mos Espa, Tatooine  
- **When:** Around *A New Hope* (or during *The Mandalorian*)  
- **Why sandcrawlers?** Jawas travel/lodge in huge treaded sandcrawlers—multi-deck mobile fortresses many meters tall. :contentReference[oaicite:0]{index=0}  
- **Origins (lore):** Many sandcrawlers trace to the **Corellia Mining Corporation**; mining rigs were abandoned and later taken over by Jawa clans (some details are Legends). :contentReference[oaicite:1]{index=1}  
- **Common stock:** droid restraining bolts + callers, GNK “gonk” power droids, moisture-farm parts (e.g., **GX-8** condenser units), crawler mobility + smelter spares. :contentReference[oaicite:2]{index=2}

> Canon touchpoints:
> - Sandcrawler basics: Star Wars Databank (“huge treaded fortresses,” Jawa transport/shelter). :contentReference[oaicite:3]{index=3}  
> - Jawas as sandcrawler clans: Star Wars Databank. :contentReference[oaicite:4]{index=4}  
> - CMC connection to sandcrawlers (Legends/Wookieepedia). :contentReference[oaicite:5]{index=5}  
> - Restraining bolts work with “droid callers.” :contentReference[oaicite:6]{index=6}  
> - GNK (“gonk”) power droids are walking batteries. :contentReference[oaicite:7]{index=7}  
> - GX-8 condenser (Pretormin) appears in Databank. :contentReference[oaicite:8]{index=8}

---

## What’s in this kata

Two implementations of the same API:

- `bad/` — intentionally vulnerable (your starting point)
- `good/` — one reference fix (for facilitators or reveal)

Both serve:
- `GET /products` — product catalog (with/without sensitive fields)  
- `GET /products/search` — catalog search  
- `GET /orders/:orderId` — read an order  
- `POST /orders` — checkout  
- `GET /admin/users` — admin list (bad) / admin-only minimal (good)  
- `GET /whoami` — helper (shows token mapping)

### Tokens (simulated Bearer)
- `token-alice` (user), `token-bob` (user), `token-admin` (admin)

---

## How to run

```bash
# vulnerable API
cd bad
npm install
npm run start   # http://localhost:3001

# secure API
cd ../good
npm install
npm run start   # http://localhost:3002

Participant objectives (read this first)

Find and fix the 5 issues (OWASP-style):

Excessive Data Exposure / Property-level auth
GET /products leaks supplierCost, inventoryCount, internalNotes.
Fix: whitelist fields returned. (DTOs/serializers)

Injection
GET /products/search?q=<expr> uses dynamic evaluation to filter.
Fix: remove eval/new Function; accept only safe text input, use parameterized queries.

BOLA/IDOR
GET /orders/:orderId authenticates but fails to verify ownership.
Fix: require owner or admin for the specific order.

Mass assignment / Logic flaw
POST /orders trusts client unitPrice, total, discount, isPaid.
Fix: price from server product catalog; compute totals; ignore flags; set isPaid=false until real payment.

Broken Function-Level Authorization
GET /admin/users is public and over-shares.
Fix: require admin; minimize fields.

(Optional) Add Jest/Supertest tests that encode the desired secure behavior.

Data set (Tatooine & sandcrawler inventory)

See data/products.json. Includes droid security gear (restraining bolts/callers), GNK droids, GX-8 vaporator spares, crawler tread/sprocket/tensioner/viewport, and smelter/salvage bits to keep a sandcrawler rolling. Canon notes in README above; names/SKUs/prices are for gameplay. 
StarWars.com
+3
StarWars.com
+3
StarWars.com
+3

Suggested workshop flow

Explore the bad/ API with curl/Postman.

Write failing tests (any language) for intended behavior.

Patch one issue at a time, rerun tests.

Compare with good/ only at the end.

Good hunting, scavver. Uteeni! 🧡
---

## Running Tests

# Vulnerable project (should FAIL):
cd ecommerce-kata/bad
npm i
npm test

# Secure project (should PASS):
cd ../good
npm i
npm test

# data/products.json

```json
[
  { "id": 501, "sku": "RB-MK4", "name": "Restraining Bolt Mk.IV", "price": 45, "category": "Droid Security", "description": "Limits droid behavior; pairs with caller.", "supplierCost": 9, "inventoryCount": 120, "internalNotes": "High demand near Mos Espa" },
  { "id": 502, "sku": "CALL-STD", "name": "Droid Caller (Signal Box)", "price": 65, "category": "Droid Security", "description": "Handheld device to summon bolted droids.", "supplierCost": 14, "inventoryCount": 80, "internalNotes": "Pairs with RB-MK4" },
  { "id": 503, "sku": "R2-MOTIV", "name": "Astromech Motivator (R-series)", "price": 220, "category": "Droid Parts", "description": "Replacement motivator for R-series units.", "supplierCost": 95, "inventoryCount": 17, "internalNotes": "Check returns for R5 units" },
  { "id": 504, "sku": "ION-JAWA-KIT", "name": "Ion Blaster Parts Kit (Jawa Pattern)", "price": 160, "category": "Tools/Weapons", "description": "Disable droids/non-lethal ion components.", "supplierCost": 60, "inventoryCount": 22, "internalNotes": "Must verify export permit" },
  { "id": 505, "sku": "GNK-REFURB", "name": "GNK Power Droid (Refurb)", "price": 1900, "category": "Power", "description": "Walking battery for field recharging.", "supplierCost": 1100, "inventoryCount": 3, "internalNotes": "Battery cores tested: 2/3 good" },

  { "id": 520, "sku": "GX8-FLTR", "name": "GX-8 Vaporator Filter & Seal Pack", "price": 75, "category": "Moisture Farm", "description": "Seals/filters for GX-8 units.", "supplierCost": 22, "inventoryCount": 64, "internalNotes": "Bulk discount 10+" },
  { "id": 521, "sku": "VAP-CTRL", "name": "Vaporator Control Board (Universal)", "price": 140, "category": "Moisture Farm", "description": "Swap-in board for most farm vaporators.", "supplierCost": 52, "inventoryCount": 33, "internalNotes": "Refurb from Anchorhead lot" },
  { "id": 522, "sku": "PWR-CONV-T", "name": "Type-T Power Converter", "price": 95, "category": "Power", "description": "General-purpose converter for field rigs.", "supplierCost": 38, "inventoryCount": 41, "internalNotes": "Ask about Tosche Station pickup" },

  { "id": 540, "sku": "CMC-TRD-11", "name": "Sandcrawler Tread Segment (Heavy)", "price": 320, "category": "Crawler Mobility", "description": "Heavy plate segment for main treads.", "supplierCost": 180, "inventoryCount": 12, "internalNotes": "Fits CMC bogies" },
  { "id": 541, "sku": "CMC-SPRK-DR", "name": "Drive Sprocket (Forward Bogie)", "price": 410, "category": "Crawler Mobility", "description": "Drive sprocket for forward bogie cluster.", "supplierCost": 240, "inventoryCount": 7, "internalNotes": "Core charge applies" },
  { "id": 542, "sku": "CMC-IDL-KIT", "name": "Idler Wheel + Axle Kit", "price": 280, "category": "Crawler Mobility", "description": "Idler wheel assembly with axle/hardware.", "supplierCost": 150, "inventoryCount": 10, "internalNotes": "Left/right interchangeable" },
  { "id": 543, "sku": "CMC-TENS-ASM", "name": "Track Tensioner Assembly", "price": 390, "category": "Crawler Mobility", "description": "Hydraulic tensioner for tread alignment.", "supplierCost": 210, "inventoryCount": 6, "internalNotes": "Don’t over-pressurize" },
  { "id": 544, "sku": "CMC-BOG-4R", "name": "Suspension Bogie (Quad Roller)", "price": 760, "category": "Crawler Mobility", "description": "Four-roller bogie for mid-bay cluster.", "supplierCost": 420, "inventoryCount": 3, "internalNotes": "Remanufactured" },
  { "id": 545, "sku": "CMC-RAMP-HYD", "name": "Ramp Hydraulic Servo & Seals", "price": 240, "category": "Crawler Systems", "description": "Hydraulic servo pack for loading ramp.", "supplierCost": 120, "inventoryCount": 11, "internalNotes": "Seal kit included" },
  { "id": 546, "sku": "CMC-VIEW-TRI", "name": "Cockpit Viewport (Triangular, Armored)", "price": 600, "category": "Crawler Structure", "description": "Armored triangular viewport glazing.", "supplierCost": 340, "inventoryCount": 2, "internalNotes": "Scratched but sealed" },
  { "id": 547, "sku": "CMC-HULL-1x2", "name": "Hull Plate Panel (1×2 m, Rust-Patina)", "price": 150, "category": "Crawler Structure", "description": "Armor panel for exterior hull repair.", "supplierCost": 60, "inventoryCount": 18, "internalNotes": "Cosmetic patina ok" },

  { "id": 560, "sku": "SMELT-GR8", "name": "Ore Hopper Grate (Heat-treated)", "price": 180, "category": "Smelter", "description": "Replacement grate for hopper throat.", "supplierCost": 90, "inventoryCount": 8, "internalNotes": "Warped grid is still usable" },
  { "id": 561, "sku": "IND-COIL-R", "name": "Induction Coil Relay (Smelter)", "price": 230, "category": "Smelter", "description": "High-temp induction relay module.", "supplierCost": 120, "inventoryCount": 5, "internalNotes": "Test @ 80% duty" },
  { "id": 562, "sku": "MAG-HOOK-2T", "name": "Magnetic Crane Hook (2-ton)", "price": 210, "category": "Salvage", "description": "2-ton magnetized crane hook.", "supplierCost": 105, "inventoryCount": 9, "internalNotes": "Demag on return" },
  { "id": 563, "sku": "SALV-EMAG", "name": "Salvage Electromagnet (Deck Crane Head)", "price": 520, "category": "Salvage", "description": "Deck-crane electromagnet head.", "supplierCost": 290, "inventoryCount": 4, "internalNotes": "Cables frayed—warn buyer" }
]




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
