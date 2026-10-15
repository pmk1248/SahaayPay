# SahaayPay – Help Me Make a Payment 

SahaayPay is a privacy-first, highly accessible web application designed to help elderly and digitally illiterate users navigate the world of digital payments securely. It provides interactive, risk-free simulations of popular Indian payment apps, offers step-by-step guidance for reporting digital fraud, and simplifies the process of completing complex bank loan applications.

##  Key Features

### 1. Payment App Simulators & Tutorials
* **Supported Apps:** Google Pay, PhonePe, and BHIM UPI.
* **Guided Mode:** Step-by-step visual walkthroughs teaching users how to scan QR codes, pay contacts, and make bank transfers.
* **Direct Practice Mode:** A safe, simulated sandbox where users can practice entering amounts and dummy UPI PINs without the risk of losing real money.

### 2. Multi-Language & Accessibility Support
* **Languages:** Fully localized in English, Hindi, and Kannada.
* **Text-to-Speech (TTS):** A built-in "Listen" feature reads instructions aloud in the user's selected language to assist visually impaired or illiterate users.
* **Accessible UI:** High-contrast buttons, large fonts, and clear icons designed specifically for elderly users.

### 3. Scam Help & Hybrid Split-Screen Guidance
Provides step-by-step walkthroughs for reporting money theft, fraud calls, fake websites, and investment scams.
* **Embedded Split-Screen:** For permitted sites like the RBI Banking Complaint portal, the official site loads directly inside SahaayPay (60% width) next to our guidance panel (40% width).
* **Physical Window Split:** For secure government sites (like cybercrime.gov.in) that block embedding, SahaayPay automatically pops the official site into a new window on the left, while moving the guidance instructions to the right, keeping both visible simultaneously.

### 4. Essential Scam Evidence Record
* A dedicated, easy-to-use form to help victims collect and organize crucial evidence (Date, Time, Amount Lost, Scammer Details, UTR Numbers).
* **100% Private:** Built entirely on the client-side. No data or uploaded files are ever sent to a server. Data is kept locally in the browser session.

### 5. Loan Form Guidance & Auto-Completion
Simplifies banking paperwork for users who struggle with complex forms.
* **Four Loan Categories:** Tailored guidance for four specific types of bank loans.
* **Simple Explanations:** Translates difficult banking terminology into easy-to-understand questions and instructions.
* **Print-Ready Output:** The user answers simple prompts, and SahaayPay automatically generates a perfectly filled, fully formatted form. The user can simply print the document, sign it, and submit it directly to the bank. 

##  Technologies Used
* **HTML5:** Semantic structure and native date/time pickers.
* **CSS3:** Custom variables, responsive Flexbox/Grid layouts, and CSS animations for the simulators (no external CSS frameworks required).
* **JavaScript (Vanilla ES6):** State management, DOM manipulation, multi-language dictionary mapping, Text-to-Speech API integration, and physical window resizing logic.

##  How to Run Locally
Because SahaayPay is a pure front-end application with no backend dependencies, running it is incredibly simple:
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/sahaaypay.git](https://github.com/your-username/sahaaypay.git)
