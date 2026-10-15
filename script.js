// --- Application State ---
let currentApp = '';
let pendingAppId = '';
let activeFlow = 'qr';
let currentStep = 0;
let currentInstallStep = 1;
let currentLang = 'en'; 
let audioEnabled = false;
let enteredPin = "";
let availableVoices = [];

// Practice Mode State
let practiceStep = 'home';
let practiceEnteredPin = '';
let practiceAmountEntered = false;

// Scam Help State
let currentScamType = '';
let currentScamStep = 0;
let govWindow = null;

// Loan Form State
let currentLoanType = '';

window.speechSynthesis.onvoiceschanged = () => {
    availableVoices = window.speechSynthesis.getVoices();
};

const appUrls = { gpay: 'tez://', phonepe: 'phonepe://', bhim: 'bhim://' };
const appData = {
    gpay: { name: 'Google Pay', icon: 'G', color: 'var(--gpay-blue)' },
    phonepe: { name: 'PhonePe', icon: 'P', color: 'var(--phonepe-purple)' },
    bhim: { name: 'BHIM UPI', icon: 'B', color: 'var(--bhim-orange)' }
};

// --- Translation Dictionary ---
const uiTranslations = {
    en: {
        tagline: "Select your payment app to learn", listen: "🔊 Listen", stop: "🔊 Stop", back: "← Back", next: "Next →", exit: "Exit to Home",
        scanBtn: "📷 Scan QR", contactsBtn: "👤 Pay Contacts", bankBtn: "🏦 Bank Transfer",
        alignNote: "Align the QR code within the frame", selectContactNote: "Select a contact to send money",
        enterBankNote: "Enter bank account details", accNum: "Account Number", ifsc: "IFSC Code", recipName: "Recipient Name",
        continueBtn: "Continue", payingText: "Paying", bankNameText: "Banking Name:", addNote: "Add a note (optional)", proceedPay: "Proceed to Pay",
        pinWarn: "Simulation Only: Never share real UPI PINs. Type any 4 digits to practice.", paySuccess: "Payment Successful", paidTo: "Paid to Devaraja Market Stores",
        simComplete: "Simulation completed successfully.", checkTitle: "Do you have this app installed?",
        btnYes: "Yes, open app", btnNo: "No, how to install?", skipCheck: "Skip to Tutorial",
        instStep1: "Step 1: Open the Google Play Store on your phone.", instStep2: "Step 2: Tap the search bar and type the name of the app.",
        instStep3: "Step 3: Find the official app and tap 'Install'.", instStep4: "Step 4: Once installed, tap 'Open', enter your number, and link your bank.",
        startTutorial: "Start Payment Tutorial", cancel: "Cancel",
        btnPracticeMode: "Go to Practice Mode", practiceModeTitle: "Practice Mode", practiceModeDesc: "Try making a payment on your own. No hints!",
        needHelp: "Need Help?", exitPractice: "Exit Practice", safeSimLabel: "Safe Practice Simulation - No real money is transferred",
        helpHome: "Hint: Tap to select any payment method (Scan QR, Pay Contacts, or Bank Transfer).",
        helpQR: "Hint: Tap the scanner box to simulate scanning a merchant's QR code.",
        helpContacts: "Hint: Tap on a contact name to select them.",
        helpBank: "Hint: Tap the 'Continue' button to proceed with the entered bank details.",
        helpAmount: "Hint: Tap the '₹ 0' box to enter an amount, then tap 'Proceed to Pay'.",
        helpPIN: "Hint: Enter any 4-digit demo PIN using the keypad and tap the checkmark.",
        chooseMode: "How would you like to proceed?", btnGuided: "Guided Tutorial", btnPractice: "Direct Practice Mode",
        scamHeader: "Have You Been Scammed? Get Help Here", scamSubheader: "Select an option below for simple step-by-step guidance on how to report fraud to the official authorities. We never ask for your PIN, OTP, or passwords.",
        scamMoney: "Money Stolen", scamCall: "Fraud Call or Message", scamFake: "Fake Website or App", scamBank: "Banking Complaint", scamInvest: "Investment or Deposit Scam",
        scamWarnTitle: "Safety Warning:", scamWarnText: "Never share your UPI PIN, OTP, or passwords. Click 'Next' here after you complete the step on the official website.",
        scamLockTitle: "Secure Official Website", scamLockDesc: "For your security, this official government website cannot be opened directly inside this panel.", scamLockBtn: "Open Website (Split Screen) ↗",
        
        // Evidence translations
        evHomeBtn: "Essential Scam Evidence Record", evTitle: "Essential Scam Evidence Record", evPrivacy: "Privacy Notice: Your details stay safely on this device. We do not save or upload anything to any server. Refreshing the page will clear this record.",
        evSec1: "1. What Evidence To Save", evSec1a: "📷 Take Screenshots: Capture scam messages, fake websites, or profiles immediately.", evSec1b: "🧾 Save Receipts: Download UPI/Bank transaction receipts showing the UTR number.", evSec1c: "📁 Keep Safe: Save everything in one easy-to-find folder on your phone.",
        evSec2: "2. Record Important Details", evDateLbl: "Date of Incident", evTimeLbl: "Time of Incident", evTypeLbl: "How did the scam happen?", evTypeOpt0: "-- Select Option --", evTypeOpt1: "Fraud Call or Message", evTypeOpt2: "Fake Website or App", evTypeOpt3: "Investment or Deposit Scam", evTypeOpt4: "Other",
        evAmountLbl: "Amount Lost (₹)", evTxnLbl: "Transaction ID / UTR Number", evScammerLbl: "Scammer Details", evRefLbl: "Cybercrime/Bank Complaint Number", evAttachLbl: "Attach Evidence Files (Local only)", evSaveBtn: "Save to Local Record",
        evSec3: "3. What To Do Next", evSec3a: "📞 Call 1930 immediately to report suspected financial fraud.", evSec3b: "🌐 Visit cybercrime.gov.in to file an official report.", evSec3c: "🏦 Contact your bank to block your account or card.", evSec3d: "⚠️ Never share OTPs, UPI PINs, or passwords with anyone.",
        evBtnExit: "Exit to Home", evSuccessTitle: "✅ Record Saved Locally", evResetBtn: "Edit / Start Over", evSavedMsg: "Your evidence has been recorded safely on your device.",
        evAmountPlaceholder: "e.g. 5000", evTxnPlaceholder: "Example: 312345678901", evScammerPlaceholder: "Example: Phone number, UPI ID, or Website link", evRefPlaceholder: "If already reported",
        evPrintBtn: "🖨️ Print / Save PDF",
        
        // Loan Translations (Main Headers)
        loanHomeTitle: "Need a Loan? Draft an Application", loanHomeBtn: "Start Loan Application Form", loanSelectTitle: "Select Loan Category", loanFormHeader: "Loan Application Form"
    },
    hi: {
        tagline: "सीखने के लिए अपना पेमेंट ऐप चुनें", listen: "🔊 सुनें", stop: "🔊 रोकें", back: "← पीछे", next: "आगे →", exit: "होम पर जाएं",
        scanBtn: "📷 QR स्कैन करें", contactsBtn: "👤 संपर्क को भुगतान", bankBtn: "🏦 बैंक ट्रांसफर",
        alignNote: "QR कोड को फ्रेम के अंदर रखें", selectContactNote: "पैसे भेजने के लिए संपर्क चुनें",
        enterBankNote: "बैंक खाते का विवरण दर्ज करें", accNum: "खाता संख्या", ifsc: "IFSC Code", recipName: "प्राप्तकर्ता का नाम",
        continueBtn: "जारी रखें", payingText: "भुगतान हो रहा है", bankNameText: "बैंक का नाम:", addNote: "नोट जोड़ें (वैकल्पिक)", proceedPay: "भुगतान करने के लिए आगे बढ़ें",
        pinWarn: "केवल सिमुलेशन: कभी भी असली UPI पिन साझा न करें। अभ्यास के लिए कोई भी 4 अंक टाइप करें।", paySuccess: "भुगतान सफल", paidTo: "देवराज मार्केट स्टोर्स को भुगतान किया",
        simComplete: "सिमुलेशन सफलतापूर्वक पूरा हुआ।", checkTitle: "क्या आपके फोन में यह ऐप इंस्टॉल है?",
        btnYes: "हाँ, ऐप खोलें", btnNo: "नहीं, इंस्टॉल कैसे करें?", skipCheck: "ट्यूटोरियल पर जाएं",
        instStep1: "चरण 1: अपने फोन पर Google Play Store खोलें।", instStep2: "चरण 2: सर्च बार पर टैप करें और ऐप का नाम टाइप करें।",
        instStep3: "चरण 3: आधिकारिक ऐप ढूंढें और 'Install' पर टैप करें।", instStep4: "चरण 4: इंस्टॉल होने के बाद 'Open' पर टैप करें, अपना नंबर डालें और बैंक लिंक करें।",
        startTutorial: "पेमेंट ट्यूटोरियल शुरू करें", cancel: "रद्द करें",
        btnPracticeMode: "अभ्यास मोड में जाएं", practiceModeTitle: "अभ्यास मोड", practiceModeDesc: "बिना किसी संकेत के स्वयं भुगतान करने का प्रयास करें!",
        needHelp: "मदद चाहिए?", exitPractice: "अभ्यास से बाहर निकलें", safeSimLabel: "सुरक्षित सिमुलेशन - कोई वास्तविक पैसा ट्रांसफर नहीं किया जाता",
        helpHome: "संकेत: कोई भी भुगतान विधि चुनें (QR स्कैन करें, संपर्क या बैंक ट्रांसफर)।", helpQR: "संकेत: मर्चेंट का QR कोड स्कैन करने के लिए स्कैनर बॉक्स पर टैप करें।", helpContacts: "संकेत: संपर्क चुनने के लिए उस पर टैप करें।", helpBank: "संकेत: बैंक विवरण के साथ आगे बढ़ने के लिए 'जारी रखें' पर टैप करें।", helpAmount: "संकेत: राशि दर्ज करने के लिए '₹ 0' पर टैप करें, फिर 'भुगतान करें' पर टैप करें।", helpPIN: "संकेत: कीपैड का उपयोग करके कोई भी 4 अंकों का पिन दर्ज करें और चेकमार्क पर टैप करें।",
        chooseMode: "आप कैसे आगे बढ़ना चाहेंगे?", btnGuided: "गाइडेड ट्यूटोरियल", btnPractice: "सीधा अभ्यास मोड",
        scamHeader: "क्या आपके साथ धोखाधड़ी हुई है? यहाँ मदद लें", scamSubheader: "आधिकारिक अधिकारियों को धोखाधड़ी की रिपोर्ट कैसे करें, इसके सरल चरण-दर-चरण मार्गदर्शन के लिए नीचे एक विकल्प चुनें। हम कभी भी आपका पिन, ओटीपी या पासवर्ड नहीं मांगते।",
        scamMoney: "पैसे चोरी हो गए", scamCall: "फर्जी कॉल या संदेश", scamFake: "फर्जी वेबसाइट या ऐप", scamBank: "बैंकिंग शिकायत", scamInvest: "निवेश या जमा घोटाला",
        scamWarnTitle: "सुरक्षा चेतावनी:", scamWarnText: "अपना UPI पिन, OTP, या पासवर्ड कभी साझा न करें। आधिकारिक वेबसाइट पर चरण पूरा करने के बाद यहां 'Next' पर क्लिक करें।",
        scamLockTitle: "सुरक्षित आधिकारिक वेबसाइट", scamLockDesc: "आपकी सुरक्षा के लिए, यह आधिकारिक सरकारी वेबसाइट सीधे इस पैनल के अंदर नहीं खोली जा सकती है।", scamLockBtn: "वेबसाइट खोलें (स्प्लिट स्क्रीन) ↗",
        
        evHomeBtn: "आवश्यक घोटाला साक्ष्य रिकॉर्ड", evTitle: "आवश्यक घोटाला साक्ष्य रिकॉर्ड", evPrivacy: "गोपनीयता सूचना: आपका विवरण इसी डिवाइस पर सुरक्षित रहता है। हम कुछ भी अपलोड नहीं करते हैं। पेज रीफ्रेश करने पर यह रिकॉर्ड मिट जाएगा।",
        evSec1: "1. क्या साक्ष्य सुरक्षित रखें", evSec1a: "📷 स्क्रीनशॉट लें: घोटाले के संदेश, फर्जी वेबसाइट या प्रोफाइल को तुरंत कैप्चर करें।", evSec1b: "🧾 रसीदें सहेजें: UTR नंबर दिखाने वाली UPI/बैंक लेन-देन रसीदें डाउनलोड करें।", evSec1c: "📁 सुरक्षित रखें: सब कुछ अपने फोन पर एक फोल्डर में सहेजें।",
        evSec2: "2. महत्वपूर्ण विवरण दर्ज करें", evDateLbl: "घटना की तारीख", evTimeLbl: "घटना का समय", evTypeLbl: "घोटाला कैसे हुआ?", evTypeOpt0: "-- विकल्प चुनें --", evTypeOpt1: "फर्जी कॉल या संदेश", evTypeOpt2: "फर्जी वेबसाइट या ऐप", evTypeOpt3: "निवेश या जमा घोटाला", evTypeOpt4: "अन्य",
        evAmountLbl: "खोई गई राशि (₹)", evTxnLbl: "लेन-देन आईडी / यूटीआर नंबर", evScammerLbl: "जालसाज़ का विवरण", evRefLbl: "साइबरक्राइम/बैंक शिकायत संख्या", evAttachLbl: "साक्ष्य फ़ाइलें संलग्न करें (केवल स्थानीय)", evSaveBtn: "स्थानीय रिकॉर्ड में सहेजें",
        evSec3: "3. आगे क्या करें", evSec3a: "📞 वित्तीय धोखाधड़ी की रिपोर्ट करने के लिए तुरंत 1930 पर कॉल करें।", evSec3b: "🌐 आधिकारिक रिपोर्ट दर्ज करने के लिए cybercrime.gov.in पर जाएं।", evSec3c: "🏦 अपना खाता या कार्ड ब्लॉक करने के लिए अपने बैंक से संपर्क करें।", evSec3d: "⚠️ कभी भी अपना OTP, UPI पिन या पासवर्ड किसी के साथ साझा न करें।",
        evBtnExit: "होम पर जाएं", evSuccessTitle: "✅ रिकॉर्ड स्थानीय रूप से सहेजा गया", evResetBtn: "संपादित करें / फिर से शुरू करें", evSavedMsg: "आपका साक्ष्य आपके डिवाइस पर सुरक्षित रूप से दर्ज कर लिया गया है।",
        evAmountPlaceholder: "उदा. 5000", evTxnPlaceholder: "उदाहरण: 312345678901", evScammerPlaceholder: "उदाहरण: फोन नंबर, यूपीआई आईडी या वेबसाइट लिंक", evRefPlaceholder: "यदि पहले से रिपोर्ट किया गया है",
        evPrintBtn: "🖨️ प्रिंट / PDF सेव करें",
        
        loanHomeTitle: "क्या आपको लोन चाहिए? आवेदन ड्राफ्ट करें", loanHomeBtn: "लोन आवेदन फॉर्म शुरू करें", loanSelectTitle: "लोन श्रेणी चुनें", loanFormHeader: "लोन आवेदन फॉर्म"
    },
    kn: {
        tagline: "ಕಲಿಯಲು ನಿಮ್ಮ ಪಾವತಿ ಅಪ್ಲಿಕೇಶನ್ ಆಯ್ಕೆಮಾಡಿ", listen: "🔊 ಆಲಿಸಿ", stop: "🔊 ನಿಲ್ಲಿಸಿ", back: "← ಹಿಂದೆ", next: "ಮುಂದೆ →", exit: "ಮುಖಪುಟಕ್ಕೆ ನಿರ್ಗಮಿಸಿ",
        scanBtn: "📷 QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", contactsBtn: "👤 ಸಂಪರ್ಕಗಳಿಗೆ ಪಾವತಿ", bankBtn: "🏦 ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ",
        alignNote: "QR ಕೋಡ್ ಅನ್ನು ಫ್ರೇಮ್ ಒಳಗೆ ಇರಿಸಿ", selectContactNote: "ಹಣ ಕಳುಹಿಸಲು ಸಂಪರ್ಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        enterBankNote: "ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ", accNum: "ಖಾತೆ ಸಂಖ್ಯೆ", ifsc: "IFSC Code", recipName: "ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು",
        continueBtn: "ಮುಂದುವರಿಸಿ", payingText: "ಪಾವತಿಸಲಾಗುತ್ತಿದೆ", bankNameText: "ಬ್ಯಾಂಕಿಂಗ್ ಹೆಸರು:", addNote: "ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)", proceedPay: "ಪಾವತಿಸಲು ಮುಂದುವರಿಯಿರಿ",
        pinWarn: "ಸಿಮ್ಯುಲೇಶನ್ ಮಾತ್ರ: ನಿಜವಾದ UPI ಪಿನ್ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಅಭ್ಯಾಸಕ್ಕಾಗಿ ಯಾವುದೇ 4 ಅಂಕಿಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ.", paySuccess: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ", paidTo: "ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ ಸ್ಟೋರ್ಸ್‌ಗೆ ಪಾವತಿಸಲಾಗಿದೆ",
        simComplete: "ಸಿಮ್ಯುಲೇಶನ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ.", checkTitle: "ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಈ ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಆಗಿದೆಯೇ?",
        btnYes: "ಹೌದು, ಆಪ್ ತೆರೆಯಿರಿ", btnNo: "ಇಲ್ಲ, ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವುದು ಹೇಗೆ?", skipCheck: "ಟ್ಯುಟೋರಿಯಲ್‌ಗೆ ತೆರಳಿ",
        instStep1: "ಹಂತ 1: ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ Google Play Store ತೆರೆಯಿರಿ.", instStep2: "ಹಂತ 2: ಸರ್ಚ್ ಬಾರ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ ಮತ್ತು ಆಪ್ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ.",
        instStep3: "ಹಂತ 3: ಅಧಿಕೃತ ಆಪ್ ಅನ್ನು ಹುಡುಕಿ ಮತ್ತು 'Install' ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.", instStep4: "ಹಂತ 4: ಇನ್‌ಸ್ಟಾಲ್ ಆದ ನಂತರ 'Open' ಟ್ಯಾಪ್ ಮಾಡಿ, ನಂಬರ್ ನಮೂದಿಸಿ ಬ್ಯಾಂಕ್ ಲಿಂಕ್ ಮಾಡಿ.",
        startTutorial: "ಪಾವತಿ ಟ್ಯುಟೋರಿಯಲ್ ಪ್ರಾರಂಭಿಸಿ", cancel: "ರದ್ದುಮಾಡಿ",
        btnPracticeMode: "ಅಭ್ಯಾಸ ಮೋಡ್‌ಗೆ ಹೋಗಿ", practiceModeTitle: "ಅಭ್ಯಾಸ ಮೋಡ್", practiceModeDesc: "ಯಾವುದೇ ಸುಳಿವುಗಳಿಲ್ಲದೆ ನೀವೇ ಪಾವತಿ ಮಾಡಲು ಪ್ರಯತ್ನಿಸಿ!",
        needHelp: "ಸಹಾಯ ಬೇಕೇ?", exitPractice: "ಅಭ್ಯಾಸದಿಂದ ನಿರ್ಗಮಿಸಿ", safeSimLabel: "ಸುರಕ್ಷಿತ ಸಿಮ್ಯುಲೇಶನ್ - ಯಾವುದೇ ನೈಜ ಹಣವನ್ನು ವರ್ಗಾಯಿಸಲಾಗುವುದಿಲ್ಲ",
        helpHome: "ಸುಳಿವು: ಯಾವುದೇ ಪಾವತಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ (QR, ಸಂಪರ್ಕಗಳು, ಅಥವಾ ಬ್ಯಾಂಕ್).", helpQR: "ಸುಳಿವು: QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಸ್ಕ್ಯಾನರ್ ಬಾಕ್ಸ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.", helpContacts: "ಸುಳಿವು: ಸಂಪರ್ಕವನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಅದರ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.", helpBank: "ಸುಳಿವು: ಬ್ಯಾಂಕ್ ವಿವರಗಳೊಂದಿಗೆ ಮುಂದುವರಿಯಲು 'ಮುಂದುವರಿಸಿ' ಟ್ಯಾಪ್ ಮಾಡಿ.", helpAmount: "ಸುಳಿವು: ಮೊತ್ತವನ್ನು ನಮೂದಿಸಲು '₹ 0' ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ, ನಂತರ 'ಪಾವತಿಸಿ' ಟ್ಯಾಪ್ ಮಾಡಿ.", helpPIN: "ಸುಳಿವು: ಕೀಪ್ಯಾಡ್ ಬಳಸಿ ಯಾವುದೇ 4-ಅಂಕಿಯ ಪಿನ್ ನಮೂದಿಸಿ ಮತ್ತು ಚೆಕ್‌ಮಾರ್ಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ.",
        chooseMode: "ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?", btnGuided: "ಮಾರ್ಗದರ್ಶಿ ಟ್ಯುಟೋರಿಯಲ್", btnPractice: "ನೇರ ಅಭ್ಯಾಸ ಮೋಡ್",
        scamHeader: "ನೀವು ವಂಚನೆಗೊಳಗಾಗಿದ್ದೀರಾ? ಇಲ್ಲಿ ಸಹಾಯ ಪಡೆಯಿರಿ", scamSubheader: "ಅಧಿಕೃತ ಅಧಿಕಾರಿಗಳಿಗೆ ವಂಚನೆಯನ್ನು ಹೇಗೆ ವರದಿ ಮಾಡುವುದು ಎಂಬುದರ ಸರಳ ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ. ನಿಮ್ಮ ಪಿನ್, ಒಟಿಪಿ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ನಾವು ಎಂದಿಗೂ ಕೇಳುವುದಿಲ್ಲ.",
        scamMoney: "ಹಣ ಕಳುವಾಗಿದೆ", scamCall: "ನಕಲಿ ಕರೆ ಅಥವಾ ಸಂದೇಶ", scamFake: "ನಕಲಿ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಆಪ್", scamBank: "ಬ್ಯಾಂಕಿಂಗ್ ದೂರು", scamInvest: "ಹೂಡಿಕೆ ಅಥವಾ ಠೇವಣಿ ವಂಚನೆ",
        scamWarnTitle: "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ:", scamWarnText: "ನಿಮ್ಮ UPI PIN, OTP, ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಹಂತವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ ನಂತರ ಇಲ್ಲಿ 'Next' ಕ್ಲಿಕ್ ಮಾಡಿ.",
        scamLockTitle: "ಸುರಕ್ಷಿತ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್", scamLockDesc: "ನಿಮ್ಮ ಭದ್ರತೆಗಾಗಿ, ಈ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ನೇರವಾಗಿ ಈ ಪ್ಯಾನೆಲ್‌ನಲ್ಲಿ ತೆರೆಯಲಾಗುವುದಿಲ್ಲ.", scamLockBtn: "ವೆಬ್‌ಸೈಟ್ ತೆರೆಯಿರಿ (ಸ್ಪ್ಲಿಟ್ ಸ್ಕ್ರೀನ್) ↗",
        
        evHomeBtn: "ಅಗತ್ಯ ವಂಚನೆ ಪುರಾವೆಗಳ ದಾಖಲೆ", evTitle: "ಅಗತ್ಯ ವಂಚನೆ ಪುರಾವೆಗಳ ದಾಖಲೆ", evPrivacy: "ಗೌಪ್ಯತೆ ಸೂಚನೆ: ನಿಮ್ಮ ವಿವರಗಳು ಈ ಸಾಧನದಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ. ನಾವು ಏನನ್ನೂ ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದಿಲ್ಲ. ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿದರೆ ಈ ದಾಖಲೆ ಅಳಿಸಿಹೋಗುತ್ತದೆ.",
        evSec1: "1. ಯಾವ ಪುರಾವೆಗಳನ್ನು ಉಳಿಸಬೇಕು", evSec1a: "📷 ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ: ವಂಚನೆಯ ಸಂದೇಶಗಳು ಅಥವಾ ನಕಲಿ ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ತಕ್ಷಣ ಕ್ಯಾಪ್ಚರ್ ಮಾಡಿ.", evSec1b: "🧾 ರಸೀದಿಗಳನ್ನು ಉಳಿಸಿ: UTR ಸಂಖ್ಯೆಯನ್ನು ತೋರಿಸುವ UPI/ಬ್ಯಾಂಕ್ ರಸೀದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.", evSec1c: "📁 ಸುರಕ್ಷಿತವಾಗಿರಿ: ಎಲ್ಲವನ್ನೂ ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಒಂದು ಫೋಲ್ಡರ್‌ನಲ್ಲಿ ಉಳಿಸಿ.",
        evSec2: "2. ಪ್ರಮುಖ ವಿವರಗಳನ್ನು ದಾಖಲಿಸಿ", evDateLbl: "ಘಟನೆಯ ದಿನಾಂಕ", evTimeLbl: "ಘಟನೆಯ ಸಮಯ", evTypeLbl: "ವಂಚನೆ ಹೇಗೆ ನಡೆಯಿತು?", evTypeOpt0: "-- ಆಯ್ಕೆ ಮಾಡಿ --", evTypeOpt1: "ನಕಲಿ ಕರೆ ಅಥವಾ ಸಂದೇಶ", evTypeOpt2: "ನಕಲಿ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಅಪ್ಲಿಕೇಶನ್", evTypeOpt3: "ಹೂಡಿಕೆ ಅಥವಾ ಠೇವಣಿ ವಂಚನೆ", evTypeOpt4: "ಇತರೆ",
        evAmountLbl: "ಕಳೆದುಕೊಂಡ ಮೊತ್ತ (₹)", evTxnLbl: "ವಹಿವಾಟು ID / UTR ಸಂಖ್ಯೆ", evScammerLbl: "ವಂಚಕನ ವಿವರಗಳು", evRefLbl: "ಸೈಬರ್ ಕ್ರೈಮ್/ಬ್ಯಾಂಕ್ ದೂರು ಸಂಖ್ಯೆ", evAttachLbl: "ಪುರಾವೆ ಫೈಲ್‌ಗಳನ್ನು ಲಗತ್ತಿಸಿ (ಸ್ಥಳೀಯ ಮಾತ್ರ)", evSaveBtn: "ಸ್ಥಳೀಯ ದಾಖಲೆಗೆ ಉಳಿಸಿ",
        evSec3: "3. ಮುಂದೆ ಏನು ಮಾಡಬೇಕು", evSec3a: "📞 ಆರ್ಥಿಕ ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡಲು ತಕ್ಷಣ 1930 ಗೆ ಕರೆ ಮಾಡಿ.", evSec3b: "🌐 ಅಧಿಕೃತ ವರದಿ ಸಲ್ಲಿಸಲು cybercrime.gov.in ಗೆ ಭೇಟಿ ನೀಡಿ.", evSec3c: "🏦 ನಿಮ್ಮ ಖಾತೆ ಅಥವಾ ಕಾರ್ಡ್ ಅನ್ನು ನಿರ್ಬಂಧಿಸಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.", evSec3d: "⚠️ ನಿಮ್ಮ OTP, UPI ಪಿನ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಯಾರಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
        evBtnExit: "ಮುಖಪುಟಕ್ಕೆ ನಿರ್ಗಮಿಸಿ", evSuccessTitle: "✅ ದಾಖಲೆಯನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾಗಿದೆ", evResetBtn: "ತಿದ್ದುಪಡಿ ಮಾಡಿ / ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ", evSavedMsg: "ನಿಮ್ಮ ಪುರಾವೆಗಳನ್ನು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.",
        evAmountPlaceholder: "ಉದಾ. 5000", evTxnPlaceholder: "ಉದಾಹರಣೆ: 312345678901", evScammerPlaceholder: "ಉದಾಹರಣೆ: ಫೋನ್ ಸಂಖ್ಯೆ, UPI ID ಅಥವಾ ವೆಬ್‌ಸೈಟ್ ಲಿಂಕ್", evRefPlaceholder: "ಈಗಾಗಲೇ ವರದಿ ಮಾಡಿದ್ದರೆ",
        evPrintBtn: "🖨️ ಪ್ರಿಂಟ್ / PDF ಉಳಿಸಿ",
        
        loanHomeTitle: "ಸಾಲ ಬೇಕೇ? ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ", loanHomeBtn: "ಸಾಲದ ಅರ್ಜಿ ಫಾರ್ಮ್ ಪ್ರಾರಂಭಿಸಿ", loanSelectTitle: "ಸಾಲದ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ", loanFormHeader: "ಸಾಲದ ಅರ್ಜಿ ನಮೂನೆ"
    }
};

const t = (key) => uiTranslations[currentLang][key] || uiTranslations['en'][key];

// --- TTS Function ---
function speakText(text) {
    window.speechSynthesis.cancel();
    if (!audioEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = currentLang === 'hi' ? 'hi-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = currentLang === 'kn' ? 0.8 : 0.85; 

    const matchingVoices = availableVoices.filter(v => v.lang.replace('_', '-').includes(langCode));
    let bestVoice = matchingVoices.find(v => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium'));
    if (!bestVoice) bestVoice = matchingVoices.find(v => v.name.toLowerCase().includes('online'));
    if (!bestVoice && matchingVoices.length > 0) bestVoice = matchingVoices[0];
    
    if (bestVoice) utterance.voice = bestVoice;
    window.speechSynthesis.speak(utterance);
}

// --- SCAM HELP DATA ---
const scamGuidance = {
    money: { url: 'https://cybercrime.gov.in/', steps: [ { en: "Step 1: Call 1930 immediately. Then, on the cybercrime.gov.in homepage, click 'Register a Complaint'.", hi: "चरण 1: तुरंत 1930 पर कॉल करें। फिर, cybercrime.gov.in होमपेज पर, 'Register a Complaint' पर क्लिक करें।", kn: "ಹಂತ 1: ತಕ್ಷಣ 1930 ಗೆ ಕರೆ ಮಾಡಿ. ನಂತರ, cybercrime.gov.in ಮುಖಪುಟದಲ್ಲಿ, 'Register a Complaint' ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px; background:#013a6b; color:white; font-weight:bold; font-size:1.2rem; display:flex; align-items:center; gap:10px;"><span style="font-size:2rem;">🛡️</span> Cyber Crime Portal</div><div style="padding:30px;"><div style="text-align:center; margin-bottom:20px; color:#d32f2f; font-weight:bold;">First, Call 1930</div><div class="sim-clickable highlight" style="background:#d32f2f; color:white; text-align:center; padding:15px; border-radius:8px; font-weight:bold; font-size:1.2rem;">Register a Complaint</div></div>` }, { en: "Step 2: Read the terms and conditions, scroll to the bottom, and click the 'I Accept' button.", hi: "चरण 2: नियम और शर्तें पढ़ें, नीचे स्क्रॉल करें, और 'I Accept' बटन पर क्लिक करें।", kn: "ಹಂತ 2: ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಓದಿ, ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ, ಮತ್ತು 'I Accept' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="height:150px; background:#eee; border-radius:8px; margin-bottom:20px; padding:10px; color:#666; font-size:0.8rem; overflow:hidden;">Terms and conditions text...<br><br>Read carefully...</div><div class="sim-clickable highlight" style="background:#1976d2; color:white; text-align:center; padding:12px; border-radius:8px; font-weight:bold;">I Accept</div></div>` }, { en: "Step 3: Click 'Report Cyber Crime'. Then log in by selecting your State, entering your Mobile Number, and verifying the OTP.", hi: "चरण 3: 'Report Cyber Crime' पर क्लिक करें। फिर अपना राज्य चुनकर, मोबाइल नंबर दर्ज करके और OTP सत्यापित करके लॉग इन करें।", kn: "ಹಂತ 3: 'Report Cyber Crime' ಕ್ಲಿಕ್ ಮಾಡಿ. ನಂತರ ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಮತ್ತು OTP ಪರಿಶೀಲಿಸಿ ಲಾಗ್ ಇನ್ ಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="border:1px solid #ccc; padding:10px; border-radius:8px; margin-bottom:15px; background:#f9f9f9;">Click &gt; <strong style="color:#d32f2f;">Report Cyber Crime</strong></div><div style="background:#eee; padding:10px; margin-bottom:10px;">Select State...</div><div style="background:#eee; padding:10px; margin-bottom:10px;">Mobile Number...</div><div class="sim-clickable highlight" style="background:#2e7d32; color:white; text-align:center; padding:12px; border-radius:8px; font-weight:bold;">Get OTP</div></div>` }, { en: "Step 4: In the Incident Details form, accurately select your bank, account number, the date, time, and exact amount lost.", hi: "चरण 4: घटना विवरण (Incident Details) फॉर्म में, अपने बैंक, खाता संख्या, तिथि, समय और खोई हुई सटीक राशि का सटीक चयन करें।", kn: "ಹಂತ 4: ಘಟನೆಯ ವಿವರಗಳ ಫಾರ್ಮ್‌ನಲ್ಲಿ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್, ಖಾತೆ ಸಂಖ್ಯೆ, ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಕಳೆದುಕೊಂಡ ನಿಖರವಾದ ಮೊತ್ತವನ್ನು ನಿಖರವಾಗಿ ಆಯ್ಕೆಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="font-weight:bold; margin-bottom:10px; font-size:1.1rem;">Incident Details Form</div><div style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #1976d2;">Select Bank...</div><div style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #1976d2;">Date & Time...</div><div style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #1976d2;">Amount Lost (₹)...</div></div>` }, { en: "Step 5: Review your complaint details, click 'Submit', and safely write down your Acknowledgement Number.", hi: "चरण 5: अपनी शिकायत के विवरण की समीक्षा करें, 'Submit' पर क्लिक करें, और सुरक्षित रूप से अपना पावती नंबर (Acknowledgement Number) लिख लें।", kn: "ಹಂತ 5: ನಿಮ್ಮ ದೂರಿನ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, 'Submit' ಕ್ಲಿಕ್ ಮಾಡಿ, ಮತ್ತು ನಿಮ್ಮ ಸ್ವೀಕೃತಿ ಸಂಖ್ಯೆಯನ್ನು (Acknowledgement Number) ಸುರಕ್ಷಿತವಾಗಿ ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ.", visual: `<div style="padding:20px; text-align:center;"><div class="sim-clickable highlight" style="background:#1976d2; color:white; padding:15px; border-radius:8px; font-weight:bold; margin-bottom:20px;">Submit</div><div style="border:2px dashed #4caf50; padding:10px; color:#2e7d32; font-weight:bold;">Save Acknowledgement No.</div></div>` } ] },
    call: { url: 'https://sancharsaathi.gov.in/', steps: [ { en: "Step 1: On sancharsaathi.gov.in, scroll down to 'Citizen Centric Services' and click on the 'Chakshu' box.", hi: "चरण 1: sancharsaathi.gov.in पर, 'Citizen Centric Services' तक नीचे स्क्रॉल करें और 'Chakshu' बॉक्स पर क्लिक करें।", kn: "ಹಂತ 1: sancharsaathi.gov.in ನಲ್ಲಿ, 'Citizen Centric Services' ಗೆ ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ ಮತ್ತು 'Chakshu' ಬಾಕ್ಸ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px; background:#fdf8e4; border-bottom:2px solid #e0e0e0;"><h3 style="color:#d84315;">Sanchar Saathi</h3></div><div style="padding:30px;"><div style="margin-bottom:10px; color:#666; font-weight:bold;">Citizen Centric Services</div><div class="sim-clickable highlight" style="background:#ff9800; color:white; padding:20px; border-radius:12px; text-align:center;"><h3>👁️ Chakshu</h3><p style="font-size:0.9rem; margin-top:5px;">Report Suspected Fraud</p></div></div>` }, { en: "Step 2: Scroll down the Chakshu page, read the information, and click 'Continue for reporting'.", hi: "चरण 2: चाक्षु पेज पर नीचे स्क्रॉल करें, जानकारी पढ़ें, और 'Continue for reporting' पर क्लिक करें।", kn: "ಹಂತ 2: ಚಕ್ಷು ಪುಟವನ್ನು ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ, ಮಾಹಿತಿಯನ್ನು ಓದಿ, ಮತ್ತು 'Continue for reporting' ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="height:100px; background:#eee; margin-bottom:20px; padding:10px; font-size:0.8rem;">Information text...</div><div class="sim-clickable highlight" style="border:2px solid #1976d2; padding:15px; border-radius:8px; text-align:center; color:#1976d2; font-weight:bold;">Continue for reporting</div></div>` }, { en: "Step 3: In the form, select the Medium (Call, SMS, or WhatsApp) and choose the appropriate Fraud Category.", hi: "चरण 3: फॉर्म में, माध्यम (कॉल, एसएमएस या व्हाट्सएप) चुनें और उचित धोखाधड़ी श्रेणी का चयन करें।", kn: "ಹಂತ 3: ಫಾರ್ಮ್‌ನಲ್ಲಿ, ಮಾಧ್ಯಮವನ್ನು (ಕರೆ, SMS, ಅಥವಾ WhatsApp) ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಸೂಕ್ತವಾದ ವಂಚನೆ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="font-weight:bold; margin-bottom:10px; font-size:1.1rem;">Fraud Details</div><div style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #ff9800;">Select Medium ▼</div><div style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #ff9800;">Fraud Category ▼</div></div>` }, { en: "Step 4: Attach a screenshot (if you have one), enter the fraudster's mobile number, and the exact date and time.", hi: "चरण 4: यदि आपके पास स्क्रीनशॉट है तो उसे संलग्न करें, जालसाज का मोबाइल नंबर, और सटीक तिथि और समय दर्ज करें।", kn: "ಹಂತ 4: ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಲಗತ್ತಿಸಿ (ನಿಮ್ಮ ಬಳಿ ಇದ್ದರೆ), ವಂಚಕನ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ಮತ್ತು ನಿಖರವಾದ ದಿನಾಂಕ ಮತ್ತು ಸಮಯವನ್ನು ನಮೂದಿಸಿ.", visual: `<div style="padding:20px;"><div style="border:1px dashed #999; padding:15px; text-align:center; margin-bottom:15px;">📎 Attach Screenshot</div><div style="background:#eee; padding:10px; margin-bottom:10px;">Fraudster's Number...</div><div style="background:#eee; padding:10px; margin-bottom:10px;">Date and Time...</div></div>` }, { en: "Step 5: Provide your personal Name and Mobile Number, click 'Verify OTP', and Submit the report.", hi: "चरण 5: अपना व्यक्तिगत नाम और मोबाइल नंबर प्रदान करें, 'Verify OTP' पर क्लिक करें, और रिपोर्ट जमा करें।", kn: "ಹಂತ 5: ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಹೆಸರು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ, 'Verify OTP' ಕ್ಲಿಕ್ ಮಾಡಿ, ಮತ್ತು ವರದಿಯನ್ನು ಸಲ್ಲಿಸಿ.", visual: `<div style="padding:20px;"><div style="background:#eee; padding:10px; margin-bottom:10px;">Your Name...</div><div style="background:#eee; padding:10px; margin-bottom:15px;">Your Mobile Number...</div><div class="sim-clickable highlight" style="background:#4caf50; color:white; text-align:center; padding:12px; border-radius:8px; font-weight:bold;">Verify OTP & Submit</div></div>` } ] },
    fake: { url: 'https://cybercrime.gov.in/', steps: [ { en: "Step 1: On cybercrime.gov.in, click 'Register a Complaint', accept the terms, and log in with your phone and OTP.", hi: "चरण 1: cybercrime.gov.in पर, 'Register a Complaint' पर क्लिक करें, शर्तें स्वीकार करें, और अपने फोन और OTP के साथ लॉग इन करें।", kn: "ಹಂತ 1: cybercrime.gov.in ನಲ್ಲಿ, 'Register a Complaint' ಕ್ಲಿಕ್ ಮಾಡಿ, ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ, ಮತ್ತು ನಿಮ್ಮ ಫೋನ್ ಮತ್ತು OTP ಬಳಸಿ ಲಾಗ್ ಇನ್ ಮಾಡಿ.", visual: `<div style="padding:20px; background:#013a6b; color:white; font-weight:bold; font-size:1.2rem; display:flex; align-items:center; gap:10px;"><span style="font-size:2rem;">🛡️</span> Cyber Crime Portal</div><div style="padding:20px;"><div class="sim-clickable highlight" style="background:#d32f2f; color:white; text-align:center; padding:12px; border-radius:8px; font-weight:bold; margin-bottom:10px;">Register a Complaint</div><div style="background:#eee; padding:10px; text-align:center;">Login with OTP...</div></div>` }, { en: "Step 2: In the Incident Details form, select the Category as 'Online and Social Media Related Crime'.", hi: "चरण 2: घटना विवरण फॉर्म में, श्रेणी को 'Online and Social Media Related Crime' के रूप में चुनें।", kn: "ಹಂತ 2: ಘಟನೆಯ ವಿವರಗಳ ಫಾರ್ಮ್‌ನಲ್ಲಿ, ವರ್ಗವನ್ನು 'Online and Social Media Related Crime' ಎಂದು ಆಯ್ಕೆಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="font-weight:bold; margin-bottom:10px;">Category of Complaint:</div><div class="sim-clickable highlight" style="border:1px solid #ccc; padding:12px; border-radius:8px; background:#f9f9f9; border-left:4px solid #1976d2;">Online and Social Media Crime ▼</div></div>` }, { en: "Step 3: Under Sub-Category, select 'Fraudulent Profile/Fake Website' (or the closest matching option).", hi: "चरण 3: उप-श्रेणी के अंतर्गत, 'Fraudulent Profile/Fake Website' (या सबसे करीब मिलने वाला विकल्प) चुनें।", kn: "ಹಂತ 3: ಉಪ-ವರ್ಗದ ಅಡಿಯಲ್ಲಿ, 'Fraudulent Profile/Fake Website' (ಅಥವಾ ಹತ್ತಿರದ ಹೊಂದಾಣಿಕೆಯ ಆಯ್ಕೆ) ಆಯ್ಕೆಮಾಡಿ.", visual: `<div style="padding:20px;"><div style="font-weight:bold; margin-bottom:10px;">Sub-Category:</div><div class="sim-clickable highlight" style="border:1px solid #ccc; padding:12px; border-radius:8px; background:#f9f9f9; border-left:4px solid #1976d2;">Fraudulent Profile / Fake Website ▼</div></div>` }, { en: "Step 4: Type or paste the exact Fake Website URL or Fake App name in the provided details box.", hi: "चरण 4: दिए गए विवरण बॉक्स में सटीक फर्जी वेबसाइट URL या फर्जी ऐप का नाम टाइप करें या पेस्ट करें।", kn: "ಹಂತ 4: ಒದಗಿಸಲಾದ ವಿವರಗಳ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ನಿಖರವಾದ ನಕಲಿ ವೆಬ್‌ಸೈಟ್ URL ಅಥವಾ ನಕಲಿ ಆಪ್ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಅಂಟಿಸಿ.", visual: `<div style="padding:20px;"><div style="background:#eee; padding:10px; margin-bottom:10px; height:80px; border-left:4px solid #1976d2; color:#666;">Paste Fake URL / App name here...</div></div>` }, { en: "Step 5: Click Submit at the end of the form and write down your Acknowledgement Number to track progress.", hi: "चरण 5: फॉर्म के अंत में Submit पर क्लिक करें और प्रगति को ट्रैक करने के लिए अपना पावती नंबर लिख लें।", kn: "ಹಂತ 5: ಫಾರ್ಮ್‌ನ ಕೊನೆಯಲ್ಲಿ Submit ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನಿಮ್ಮ ಸ್ವೀಕೃತಿ ಸಂಖ್ಯೆಯನ್ನು ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ.", visual: `<div style="padding:20px; text-align:center;"><div class="sim-clickable highlight" style="background:#1976d2; color:white; padding:15px; border-radius:8px; font-weight:bold; margin-bottom:20px;">Submit Complaint</div><div style="border:2px dashed #4caf50; padding:10px; color:#2e7d32; font-weight:bold;">Save Acknowledgement No.</div></div>` } ] },
    bank: { url: 'https://cms.rbi.org.in/', steps: [ { en: "Step 1: Wait 30 days after complaining directly to your bank. If unresolved, click the 'File A Complaint' box here.", hi: "चरण 1: सीधे अपने बैंक में शिकायत करने के बाद 30 दिनों तक प्रतीक्षा करें। यदि हल नहीं होता है, तो यहां 'File A Complaint' बॉक्स पर क्लिक करें।", kn: "ಹಂತ 1: ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ಗೆ ನೇರವಾಗಿ ದೂರು ನೀಡಿದ ನಂತರ 30 ದಿನ ಕಾಯಿರಿ. ಪರಿಹರಿಸದಿದ್ದರೆ, ಇಲ್ಲಿ 'File A Complaint' ಬಾಕ್ಸ್ ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:30px; text-align:center;"><div style="font-size:3rem;">🏦</div><p style="font-weight:bold; margin-bottom:20px;">RBI CMS Portal</p><div class="sim-clickable highlight" style="background:#2e7d32; color:white; padding:15px; border-radius:8px; font-weight:bold; font-size:1.2rem;">File A Complaint</div></div>` }, { en: "Step 2: Type the exact Captcha code shown on the screen into the box and click Next.", hi: "चरण 2: स्क्रीन पर दिखाया गया सटीक कैप्चा कोड बॉक्स में टाइप करें और Next पर क्लिक करें।", kn: "ಹಂತ 2: ಪರದೆಯ ಮೇಲೆ ತೋರಿಸಿರುವ ನಿಖರವಾದ ಕ್ಯಾಪ್ಚಾ ಕೋಡ್ ಅನ್ನು ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಮತ್ತು Next ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px; text-align:center;"><div style="background:#ddd; font-family:monospace; font-size:1.5rem; padding:10px; letter-spacing:5px; margin-bottom:10px;">X7Q9P</div><div class="sim-clickable highlight" style="background:#eee; padding:10px; border:1px solid #ccc; margin-bottom:15px;">Enter Captcha...</div><div style="background:#1976d2; color:white; padding:10px; border-radius:8px;">Next</div></div>` }, { en: "Step 3: Enter your Name and Mobile Number, click 'Get OTP', and verify your phone number.", hi: "चरण 3: अपना नाम और मोबाइल नंबर दर्ज करें, 'Get OTP' पर क्लिक करें, और अपना फोन नंबर सत्यापित करें।", kn: "ಹಂತ 3: ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ, 'Get OTP' ಕ್ಲಿಕ್ ಮಾಡಿ, ಮತ್ತು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.", visual: `<div style="padding:20px;"><div style="background:#eee; padding:10px; margin-bottom:10px;">Name of Complainant...</div><div style="background:#eee; padding:10px; margin-bottom:15px;">Mobile Number...</div><div class="sim-clickable highlight" style="background:#2e7d32; color:white; text-align:center; padding:12px; border-radius:8px; font-weight:bold;">Get OTP</div></div>` }, { en: "Step 4: Search for your Bank's name, select it, and enter your exact Account Number and branch details.", hi: "चरण 4: अपने बैंक का नाम खोजें, उसे चुनें, और अपना सटीक खाता संख्या और शाखा विवरण दर्ज करें।", kn: "ಹಂತ 4: ನಿಮ್ಮ ಬ್ಯಾಂಕಿನ ಹೆಸರನ್ನು ಹುಡುಕಿ, ಅದನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಮತ್ತು ನಿಮ್ಮ ನಿಖರವಾದ ಖಾತೆ ಸಂಖ್ಯೆ ಮತ್ತು ಶಾಖೆಯ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.", visual: `<div style="padding:20px;"><div class="sim-clickable highlight" style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #1976d2;">Search Entity (Bank)...</div><div style="background:#eee; padding:10px; margin-bottom:15px; border-left:4px solid #1976d2;">Account Number...</div></div>` }, { en: "Step 5: Write a brief explanation of your issue, upload any bank statements if required, and Submit.", hi: "चरण 5: अपनी समस्या का संक्षिप्त विवरण लिखें, यदि आवश्यक हो तो कोई बैंक विवरण (statements) अपलोड करें, और सबमिट करें।", kn: "ಹಂತ 5: ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆಯನ್ನು ಬರೆಯಿರಿ, ಅಗತ್ಯವಿದ್ದರೆ ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಮತ್ತು ಸಲ್ಲಿಸಿ.", visual: `<div style="padding:20px;"><div style="background:#eee; padding:10px; height:80px; margin-bottom:10px;">Brief facts of complaint...</div><div style="border:1px dashed #999; padding:10px; text-align:center; margin-bottom:15px;">📎 Upload Proof</div><div class="sim-clickable highlight" style="background:#1976d2; color:white; text-align:center; padding:12px; border-radius:8px; font-weight:bold;">Submit</div></div>` } ] },
    invest: { url: 'https://sachet.rbi.org.in/', steps: [ { en: "Step 1: On the sachet.rbi.org.in homepage, look at the top menu and click 'File a complaint'.", hi: "चरण 1: sachet.rbi.org.in होमपेज पर, शीर्ष मेनू को देखें और 'File a complaint' पर क्लिक करें।", kn: "ಹಂತ 1: sachet.rbi.org.in ಮುಖಪುಟದಲ್ಲಿ, ಮೇಲಿನ ಮೆನುವನ್ನು ನೋಡಿ ಮತ್ತು 'File a complaint' ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px; background:#fce4ec; border-bottom:2px solid #f8bbd0;"><h3 style="color:#c2185b;">Sachet (RBI)</h3></div><div style="padding:20px;"><div style="display:flex; justify-content:space-around; background:#eee; padding:10px; border-radius:8px;"><span style="color:#666;">Home</span> <span class="sim-clickable highlight" style="font-weight:bold; color:#c2185b;">File a Complaint</span></div></div>` }, { en: "Step 2: Choose the language, then carefully select the 'Entity Type' that scammed you (Company, Firm, or Individual).", hi: "चरण 2: भाषा चुनें, फिर सावधानीपूर्वक वह 'Entity Type' चुनें जिसने आपको धोखा दिया (कंपनी, फर्म या व्यक्ति)।", kn: "ಹಂತ 2: ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಂತರ ನಿಮಗೆ ವಂಚಿಸಿದ 'Entity Type' ಅನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಯ್ಕೆಮಾಡಿ (ಕಂಪನಿ, ಸಂಸ್ಥೆ ಅಥವಾ ವ್ಯಕ್ತಿ).", visual: `<div style="padding:20px;"><div style="font-weight:bold; margin-bottom:10px;">Select Entity Type:</div><div class="sim-clickable highlight" style="border:1px solid #ccc; padding:10px; border-radius:8px; margin-bottom:5px;">🔘 Company</div><div style="border:1px solid #ccc; padding:10px; border-radius:8px; margin-bottom:5px;">⚪ Firm</div><div style="border:1px solid #ccc; padding:10px; border-radius:8px;">⚪ Individual</div></div>` }, { en: "Step 3: Type the exact Name and Address of the fraudster or fake company in the Entity Details form.", hi: "चरण 3: एंटिटी विवरण (Entity Details) फॉर्म में जालसाज या फर्जी कंपनी का सटीक नाम और पता टाइप करें।", kn: "ಹಂತ 3: ಎಂಟಿಟಿ ವಿವರಗಳ ಫಾರ್ಮ್‌ನಲ್ಲಿ ವಂಚಕ ಅಥವಾ ನಕಲಿ ಕಂಪನಿಯ ನಿಖರವಾದ ಹೆಸರು ಮತ್ತು ವಿಳಾಸವನ್ನು ಟೈಪ್ ಮಾಡಿ.", visual: `<div style="padding:20px;"><div class="sim-clickable highlight" style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #c2185b;">Fraudster / Entity Name...</div><div style="background:#eee; padding:10px; margin-bottom:10px; height:60px;">Address details...</div></div>` }, { en: "Step 4: Enter your personal details, email, and the exact 'Amount Deposited' or lost in rupees.", hi: "चरण 4: अपना व्यक्तिगत विवरण, ईमेल और सटीक 'Amount Deposited' या रुपये में खोई गई राशि दर्ज करें।", kn: "ಹಂತ 4: ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳು, ಇಮೇಲ್ ಮತ್ತು ರೂಪಾಯಿಗಳಲ್ಲಿ ನಿಖರವಾದ 'Amount Deposited' ಅಥವಾ ಕಳೆದುಕೊಂಡ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ.", visual: `<div style="padding:20px;"><div style="background:#eee; padding:10px; margin-bottom:10px;">Your Name...</div><div class="sim-clickable highlight" style="background:#eee; padding:10px; margin-bottom:10px; border-left:4px solid #c2185b;">Amount Deposited (₹)...</div></div>` }, { en: "Step 5: Upload your payment receipts or screenshots as proof, enter the Captcha code, and click Submit.", hi: "चरण 5: अपनी भुगतान रसीदें या स्क्रीनशॉट प्रमाण के रूप में अपलोड करें, कैप्चा कोड दर्ज करें और Submit पर क्लिक करें।", kn: "ಹಂತ 5: ನಿಮ್ಮ ಪಾವತಿ ರಸೀದಿಗಳು ಅಥವಾ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ಪುರಾವೆಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಕ್ಯಾಪ್ಚಾ ಕೋಡ್ ನಮೂದಿಸಿ ಮತ್ತು Submit ಕ್ಲಿಕ್ ಮಾಡಿ.", visual: `<div style="padding:20px; text-align:center;"><div style="border:1px dashed #999; padding:15px; margin-bottom:15px;">📎 Choose File (Proof)</div><div style="background:#ddd; display:inline-block; padding:5px; margin-bottom:10px;">Captcha: ABCDE</div><div class="sim-clickable highlight" style="background:#4caf50; color:white; padding:15px; border-radius:8px; font-weight:bold;">Submit</div></div>` } ] }
};

function openPhysicalSplitWindows(event) {
    if (event) event.preventDefault();
    const url = document.getElementById('scam-external-link').href;
    document.getElementById('scam-help-screen').classList.add('physical-split-active');
    const screenW = window.screen.availWidth;
    const screenH = window.screen.availHeight;
    const govW = Math.floor(screenW * 0.6);
    const myW = screenW - govW;
    try { window.moveTo(govW, 0); window.resizeTo(myW, screenH); } catch(e) {}
    govWindow = window.open(url, 'GovWindow', `width=${govW},height=${screenH},left=0,top=0,resizable=yes,scrollbars=yes,status=yes`);
}

function openScamHelp(type) {
    currentScamType = type;
    currentScamStep = 0;
    document.getElementById('scam-help-screen').classList.remove('physical-split-active');
    deactivateScreens();
    document.getElementById('scam-help-screen').classList.add('active');
    
    const iframe = document.getElementById('scam-iframe');
    const fallback = document.getElementById('scam-blocked-fallback');
    const externalLink = document.getElementById('scam-external-link');
    
    if (type === 'bank') {
        iframe.style.display = 'block'; fallback.style.display = 'none'; iframe.src = scamGuidance[type].url;
    } else {
        iframe.style.display = 'none'; fallback.style.display = 'flex'; iframe.src = ''; externalLink.href = scamGuidance[type].url;
    }
    renderScamStep();
}

function renderScamStep() {
    const data = scamGuidance[currentScamType].steps[currentScamStep];
    document.getElementById('scam-instruction-text').innerText = data[currentLang];
    document.getElementById('scam-visual-content').innerHTML = data.visual;
    document.getElementById('btn-scam-back').style.visibility = currentScamStep === 0 ? 'hidden' : 'visible';
    document.getElementById('btn-scam-next').style.visibility = currentScamStep === scamGuidance[currentScamType].steps.length - 1 ? 'hidden' : 'visible';
    if (audioEnabled) speakText(data[currentLang]);
}

function nextScamStep() { if (currentScamStep < scamGuidance[currentScamType].steps.length - 1) { currentScamStep++; renderScamStep(); } }
function prevScamStep() { if (currentScamStep > 0) { currentScamStep--; renderScamStep(); } }

// --- EVIDENCE PORTAL LOGIC ---
function openEvidencePortal() {
    deactivateScreens();
    document.getElementById('evidence-screen').classList.add('active');
    if (audioEnabled) speakText(t('evTitle'));
}

function saveEvidence(event) {
    event.preventDefault();
    document.getElementById('evidence-form').style.display = 'none';
    document.getElementById('evidence-display').style.display = 'block';
    
    const date = document.getElementById('ev-date').value;
    const time = document.getElementById('ev-time').value;
    const type = document.getElementById('ev-type').value;
    const amount = document.getElementById('ev-amount').value;
    const txn = document.getElementById('ev-txn').value || "None provided";
    const scammer = document.getElementById('ev-scammer').value || "None provided";
    const ref = document.getElementById('ev-ref').value || "None provided";
    const files = document.getElementById('ev-file').files.length;

    const output = `
        <strong>${t('evDateLbl')}:</strong> ${date}<br>
        <strong>${t('evTimeLbl')}:</strong> ${time}<br>
        <strong>${t('evTypeLbl')}:</strong> ${type}<br>
        <strong>${t('evAmountLbl')}:</strong> ₹${amount}<br>
        <strong>${t('evTxnLbl')}:</strong> ${txn}<br>
        <strong>${t('evScammerLbl')}:</strong> ${scammer}<br>
        <strong>${t('evRefLbl')}:</strong> ${ref}<br>
        <strong>Attached Files:</strong> ${files} file(s) selected locally.<br>
    `;
    document.getElementById('evidence-output').innerHTML = output;
    if (audioEnabled) speakText(t('evSavedMsg'));
}

function resetEvidenceForm() {
    document.getElementById('evidence-form').style.display = 'block';
    document.getElementById('evidence-display').style.display = 'none';
}

function printEvidence() {
    document.body.classList.add('printing-evidence');
    window.print();
    document.body.classList.remove('printing-evidence');
}

// --- LOAN APPLICATION LOGIC ---
function openLoanSelection() {
    deactivateScreens();
    document.getElementById('loan-selection-screen').classList.add('active');
    if (audioEnabled) speakText(t('loanSelectTitle'));
}

function openLoanForm(type) {
    currentLoanType = type;
    deactivateScreens();
    
    // Hide all dynamic sections first
    document.querySelectorAll('.dynamic-loan-spec').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.dynamic-loan-spec input, .dynamic-loan-spec select').forEach(el => el.required = false);
    
    // Show selected section and apply required tags
    document.getElementById(`loan-spec-${type}`).style.display = 'block';
    document.querySelectorAll(`.req-${type}`).forEach(el => el.required = true);
    
    document.getElementById('loan-form-screen').classList.add('active');
    document.getElementById('loan-error-msg').style.display = 'none';
    if (audioEnabled) speakText(t('loanFormHeader'));
}

function toggleOtherBank() {
    const sel = document.getElementById('loan-bank-select');
    const otherDiv = document.getElementById('loan-bank-other-group');
    const otherInput = document.getElementById('loan-bank-other');
    if (sel.value === 'Other') {
        otherDiv.style.display = 'block';
        otherInput.required = true;
    } else {
        otherDiv.style.display = 'none';
        otherInput.required = false;
        otherInput.value = '';
    }
}

function updateAgriFields() {
    const activity = document.getElementById('agri-activity').value;
    const cropGroup = document.getElementById('agri-crop-group');
    const cropLabel = cropGroup.querySelector('label');
    const cropInput = document.getElementById('agri-crop');
    
    if (activity === 'Crop Cultivation') {
        cropGroup.style.display = 'flex'; cropLabel.innerText = "Crop Name"; cropInput.placeholder = "e.g. Wheat, Rice";
    } else if (activity === 'Dairy / Poultry') {
        cropGroup.style.display = 'flex'; cropLabel.innerText = "Livestock Details"; cropInput.placeholder = "e.g. 10 Cows, Poultry farm";
    } else if (activity === 'Farm Mechanization (Tractor/Equipment)') {
        cropGroup.style.display = 'flex'; cropLabel.innerText = "Equipment Details"; cropInput.placeholder = "e.g. Tractor, Harvester";
    } else {
        cropGroup.style.display = 'none'; cropInput.value = "";
    }
}

function calculateAge() {
    const dob = document.getElementById('loan-dob').value;
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    document.getElementById('loan-age').value = age > 0 ? age : 0;
}

function submitLoanForm(event) {
    event.preventDefault();
    document.getElementById('loan-error-msg').style.display = 'none';
    
    // Check validation natively via required tags
    if (!document.getElementById('main-loan-form').checkValidity()) {
        document.getElementById('loan-error-msg').style.display = 'block';
        return;
    }

    deactivateScreens();
    populateReviewScreen();
    document.getElementById('loan-review-screen').classList.add('active');
}

function populateReviewScreen() {
    const v = (id) => document.getElementById(id).value || 'N/A';
    
    let bankName = v('loan-bank-select');
    if (bankName === 'Other') bankName = v('loan-bank-other');
    document.getElementById('print-bank-name').innerText = bankName.toUpperCase();
    
    const types = { 'medical': 'MEDICAL LOAN', 'gold': 'GOLD LOAN', 'agri': 'AGRICULTURAL LOAN', 'home': 'HOME LOAN' };
    document.getElementById('print-loan-type').innerText = "Category: " + types[currentLoanType];

    document.getElementById('p-name').innerText = v('loan-name');
    document.getElementById('p-dob').innerText = v('loan-dob');
    document.getElementById('p-age').innerText = v('loan-age');
    document.getElementById('p-gender').innerText = v('loan-gender');
    document.getElementById('p-marital').innerText = v('loan-marital');
    document.getElementById('p-mobile').innerText = v('loan-mobile');
    document.getElementById('p-email').innerText = v('loan-email');
    document.getElementById('p-relative').innerText = v('loan-relative');
    document.getElementById('p-address').innerText = v('loan-address');
    document.getElementById('p-state').innerText = v('loan-state');
    document.getElementById('p-district').innerText = v('loan-district');
    document.getElementById('p-pin').innerText = v('loan-pin');

    let idType = v('loan-id-type');
    let idRef = v('loan-id-ref');
    if (idRef !== 'N/A' && idRef !== '') {
        // Redaction rule: Mask ID for safety in printout
        idRef = idRef.replace(/./g, '*');
    } else {
        idRef = "Not Provided";
    }
    
    document.getElementById('p-id-type').innerText = idType;
    document.getElementById('p-id-ref').innerText = idRef;
    document.getElementById('p-addr-type').innerText = v('loan-address-type');
    document.getElementById('p-acc-status').innerText = v('loan-acc-status');

    document.getElementById('p-emp-type').innerText = v('loan-emp-type');
    document.getElementById('p-emp-name').innerText = v('loan-emp-name');
    document.getElementById('p-inc-month').innerText = v('loan-income-monthly');
    document.getElementById('p-inc-year').innerText = v('loan-income-annual') === 'N/A' ? '0' : v('loan-income-annual');
    document.getElementById('p-emi').innerText = v('loan-existing-emi') === 'N/A' ? '0' : v('loan-existing-emi');
    const coapp = v('loan-coapp');
    document.getElementById('p-coapp').innerText = coapp;
    document.getElementById('print-coapp-sig').style.display = coapp === 'Yes' ? 'block' : 'none';

    // Dynamic Section D build
    let html = '';
    if (currentLoanType === 'medical') {
        html = `<tr><td><strong>Purpose:</strong></td><td>${v('med-purpose')}</td><td><strong>Hospital Name:</strong></td><td>${v('med-hospital')}</td></tr>
                <tr><td><strong>Est. Expenses:</strong></td><td>₹${v('med-est-cost')}</td><td><strong>Amount Requested:</strong></td><td>₹${v('med-req-amount')}</td></tr>`;
    } else if (currentLoanType === 'gold') {
        html = `<tr><td><strong>Purpose:</strong></td><td>${v('gold-purpose')}</td><td><strong>Quantity:</strong></td><td>${v('gold-qty')} grams</td></tr>
                <tr><td><strong>Type/Purity:</strong></td><td>${v('gold-type')} (${v('gold-purity')})</td><td><strong>Est. Value:</strong></td><td>₹${v('gold-est-value')}</td></tr>
                <tr><td><strong>Amount Requested:</strong></td><td>₹${v('gold-req-amount')}</td><td><strong>Existing Loans:</strong></td><td>${v('gold-existing')}</td></tr>`;
    } else if (currentLoanType === 'agri') {
        html = `<tr><td><strong>Activity:</strong></td><td>${v('agri-activity')}</td><td><strong>Land Status:</strong></td><td>${v('agri-land-status')} (${v('agri-area')})</td></tr>
                <tr><td><strong>Crop/Details:</strong></td><td>${v('agri-crop')}</td><td><strong>Purpose:</strong></td><td>${v('agri-purpose')}</td></tr>
                <tr><td><strong>Amount Requested:</strong></td><td>₹${v('agri-req-amount')}</td><td><strong>Est. Agri Income:</strong></td><td>₹${v('agri-est-income')}</td></tr>
                <tr><td><strong>Scheme:</strong></td><td colspan="3">${v('agri-scheme')}</td></tr>`;
    } else if (currentLoanType === 'home') {
        html = `<tr><td><strong>Purpose:</strong></td><td>${v('home-purpose')}</td><td><strong>Property Type:</strong></td><td>${v('home-prop-type')}</td></tr>
                <tr><td><strong>Location:</strong></td><td>${v('home-loc')}</td><td><strong>Est. Value:</strong></td><td>₹${v('home-est-value')}</td></tr>
                <tr><td><strong>Amount Requested:</strong></td><td>₹${v('home-req-amount')}</td><td><strong>Tenure:</strong></td><td>${v('home-tenure')} Years</td></tr>`;
    }
    document.getElementById('print-dynamic-d').innerHTML = html;

    // Generate Checklist
    generateChecklist();
}

function generateChecklist() {
    const list = document.getElementById('print-checklist');
    list.innerHTML = '';
    const add = (text) => { const li = document.createElement('li'); li.innerText = text; list.appendChild(li); };
    
    const empType = document.getElementById('loan-emp-type').value;
    const idType = document.getElementById('loan-id-type').value;
    const addrType = document.getElementById('loan-address-type').value;
    
    add(`Copy of Identity Proof (${idType})`);
    if(addrType !== 'Same as ID Proof') add(`Copy of Address Proof (${addrType})`);
    add("2 Passport Size Photographs");
    
    if (empType === 'Salaried') {
        add("Latest 3 Months Salary Slips");
        add("Last 6 Months Bank Statement");
    } else if (empType === 'Self-employed' || empType === 'Business Owner') {
        add("ITR (Income Tax Returns) for last 2 years");
        add("Business Proof / Trade License");
        add("Last 6 Months Bank Statement");
    } else if (empType === 'Farmer' && currentLoanType !== 'gold') {
        add("Land ownership records (Pahani / RTC / 1x12)");
    }

    if (currentLoanType === 'medical') {
        add("Hospital Estimation Letter / Bill");
    } else if (currentLoanType === 'gold') {
        add("Gold Ornaments ready for bank appraisal");
    } else if (currentLoanType === 'home') {
        add("Property Documents (Sale Agreement, Title Deed, etc.)");
        add("Approved Construction Plan (if applicable)");
    }
}

function editLoanForm() {
    deactivateScreens();
    document.getElementById('loan-form-screen').classList.add('active');
}

function printLoanForm() {
    document.body.classList.add('printing-loan');
    window.print();
    document.body.classList.remove('printing-loan');
}

function viewOfficialBankForms() {
    // We direct users safely to search or general official portals since specific deep links break often.
    const bankName = document.getElementById('loan-bank-select').value;
    let url = 'https://www.rbi.org.in/'; // safe default fallback
    
    if (bankName === 'State Bank of India') url = 'https://bank.sbi/web/personal-banking/loans';
    else if (bankName === 'Punjab National Bank') url = 'https://www.pnbindia.in/loans.html';
    else if (bankName === 'Bank of Baroda') url = 'https://www.bankofbaroda.in/personal-banking/loans';
    else if (bankName === 'HDFC Bank') url = 'https://www.hdfcbank.com/personal/borrow';
    else if (bankName === 'ICICI Bank') url = 'https://www.icicibank.com/Personal-Banking/loans/loans.page';
    else {
        alert("Please contact the selected bank branch directly or visit their verified official website for the latest forms.");
        return;
    }
    window.open(url, '_blank');
}

// --- App Checking, Deep Linking & Simulators ---
function promptAppCheck(appId) {
    pendingAppId = appId;
    document.getElementById('check-title').innerText = t('checkTitle');
    document.getElementById('btn-yes').innerText = t('btnYes');
    document.getElementById('btn-no').innerText = t('btnNo');
    document.getElementById('btn-skip-check').innerText = t('skipCheck');
    deactivateScreens();
    document.getElementById('app-check-screen').classList.add('active');
    if (audioEnabled) speakText(t('checkTitle'));
}

function hasApp(yes) {
    if (yes) { window.location.href = appUrls[pendingAppId]; setTimeout(() => { promptModeSelection(); }, 800); }
    else { startInstallTutorial(); }
}

function getVisualInstallHTML(step, appId) {
    const app = appData[appId];
    if (step === 1) return `<div style="background: #f0f3f4; height: 100%; padding: 20px; text-align: center;"><div style="margin-top: 80px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;"><div style="background: #ddd; height: 50px; border-radius: 12px;"></div><div style="background: #ddd; height: 50px; border-radius: 12px;"></div><div style="background: #ddd; height: 50px; border-radius: 12px;"></div><div style="background: #ddd; height: 50px; border-radius: 12px;"></div><div class="sim-clickable highlight" style="background: white; padding: 10px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center;" onclick="nextInstallStep()"><div style="width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 20px solid #34A853;"></div><div style="font-size: 0.6rem; margin-top: 8px; color: #333;">Play Store</div></div></div></div>`;
    else if (step === 2) return `<div style="background: white; height: 100%;"><div style="padding: 15px; border-bottom: 1px solid #eee;"><div class="sim-clickable highlight" style="background: #f1f3f4; padding: 12px 20px; border-radius: 30px; display: flex; justify-content: space-between; align-items: center;" onclick="nextInstallStep()"><span style="color: #1F2937; font-weight: 500;">${app.name}</span><span style="font-size: 1.2rem;">🔍</span></div></div><div style="padding: 30px 20px; color: #9ca3af; text-align: center;">Type here to search apps...</div></div>`;
    else if (step === 3) return `<div style="background: white; height: 100%; padding: 20px;"><div style="display: flex; gap: 15px; align-items: center; margin-bottom: 25px; margin-top: 10px;"><div style="width: 65px; height: 65px; background: ${app.color}; color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${app.icon}</div><div style="text-align: left;"><div style="font-size: 1.2rem; font-weight: 700; color: #1F2937;">${app.name}</div><div style="color: #01875f; font-size: 0.8rem; font-weight: 600; margin-top: 4px;">✓ Verified by Google Play</div></div></div><div class="sim-clickable highlight" style="background: #01875f; color: white; padding: 12px; text-align: center; border-radius: 8px; font-weight: bold; font-size: 1.1rem;" onclick="nextInstallStep()">Install</div></div>`;
    else if (step === 4) return `<div style="background: white; height: 100%; padding: 20px;"><div style="display: flex; gap: 15px; align-items: center; margin-bottom: 25px; margin-top: 10px;"><div style="width: 65px; height: 65px; background: ${app.color}; color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${app.icon}</div><div style="text-align: left;"><div style="font-size: 1.2rem; font-weight: 700; color: #1F2937;">${app.name}</div><div style="color: #6B7280; font-size: 0.8rem; font-weight: 500; margin-top: 4px;">Installed</div></div></div><div class="sim-clickable highlight" style="background: var(--muted-teal); color: white; padding: 12px; text-align: center; border-radius: 8px; font-weight: bold; font-size: 1.1rem;" onclick="promptModeSelection()">Open</div></div>`;
}

function startInstallTutorial() {
    currentInstallStep = 1;
    document.getElementById('app-check-screen').classList.remove('active');
    document.getElementById('install-screen').classList.add('active');
    updateInstallUI();
}

function updateInstallUI() {
    document.getElementById('install-instruction').innerText = t('instStep' + currentInstallStep);
    document.getElementById('install-phone-content').innerHTML = getVisualInstallHTML(currentInstallStep, pendingAppId);
    document.getElementById('btn-inst-back').style.display = currentInstallStep === 1 ? 'none' : 'block';
    document.getElementById('btn-inst-next').style.display = currentInstallStep === 4 ? 'none' : 'block';
    
    const btnDone = document.getElementById('btn-inst-done');
    btnDone.innerText = t('startTutorial');
    btnDone.style.display = currentInstallStep === 4 ? 'block' : 'none';
    
    document.getElementById('btn-inst-cancel').innerText = t('cancel');
    if (audioEnabled) speakText(t('instStep' + currentInstallStep));
}

function nextInstallStep() { if (currentInstallStep < 4) { currentInstallStep++; updateInstallUI(); } }
function prevInstallStep() { if (currentInstallStep > 1) { currentInstallStep--; updateInstallUI(); } }

function promptModeSelection() {
    document.getElementById('app-check-screen').classList.remove('active');
    document.getElementById('install-screen').classList.remove('active');
    
    document.getElementById('mode-title').innerText = t('chooseMode');
    document.getElementById('btn-mode-guided').innerText = t('btnGuided');
    document.getElementById('btn-mode-practice').innerText = t('btnPractice');
    document.getElementById('btn-mode-cancel').innerText = t('cancel');
    
    document.getElementById('mode-selection-screen').classList.add('active');
    if (audioEnabled) speakText(t('chooseMode'));
}

function startGuidedMode() { selectApp(pendingAppId); }

function startDirectPractice() {
    currentApp = pendingAppId;
    walkthroughData = { gpay: { themeClass: 'gpay-theme', flows: getFlows('gpay') }, phonepe: { themeClass: 'phonepe-theme', flows: getFlows('phonepe') }, bhim: { themeClass: 'bhim-theme', flows: getFlows('bhim') } };
    startPracticeMode();
}

const buildHomeUI = (appName, highlightFlow) => `<div class="sim-header">${appName}</div><div class="sim-body"><div class="sim-box sim-clickable ${highlightFlow === 'qr' ? 'highlight' : ''}" onclick="switchFlow('qr')">${t('scanBtn')}</div><div class="sim-box sim-clickable ${highlightFlow === 'contacts' ? 'highlight' : ''}" onclick="switchFlow('contacts')">${t('contactsBtn')}</div><div class="sim-box sim-clickable ${highlightFlow === 'bank' ? 'highlight' : ''}" onclick="switchFlow('bank')">${t('bankBtn')}</div></div>`;
const buildScannerUI = () => `<div class="sim-header" style="background: #000; color: #fff;">${t('scanBtn')}</div><div class="sim-body" style="background: #111; color: white;"><div class="sim-educational-note">${t('alignNote')}</div><div class="sim-scanner sim-clickable highlight" onclick="nextStep()"></div></div>`;
const buildContactsUI = () => `<div class="sim-header" style="background: #1F2937; color: white;">${t('contactsBtn')}</div><div class="sim-body"><div class="sim-educational-note">${t('selectContactNote')}</div><div class="sim-box sim-clickable highlight" onclick="nextStep()"><div class="sim-recipient">Ramesh (Devaraja Market)</div><div class="sim-title">+91 98765 43210</div></div><div class="sim-box">Suresh<br>+91 87654 32109</div></div>`;
const buildBankUI = () => `<div class="sim-header" style="background: #1F2937; color: white;">${t('bankBtn')}</div><div class="sim-body"><div class="sim-educational-note">${t('enterBankNote')}</div><div class="sim-box" style="text-align:left;"><div class="sim-title">${t('accNum')}</div><div style="border-bottom: 1px solid #ccc; padding: 5px 0; margin-bottom: 10px;">1234567890</div><div class="sim-title">${t('ifsc')}</div><div style="border-bottom: 1px solid #ccc; padding: 5px 0; margin-bottom: 10px;">SBIN0001234</div><div class="sim-title">${t('recipName')}</div><div style="border-bottom: 1px solid #ccc; padding: 5px 0;">Devaraja Market Stores</div></div><div class="sim-pay-btn sim-clickable highlight" onclick="nextStep()">${t('continueBtn')}</div></div>`;
const buildAmountUI = (appName) => `<div class="sim-header">${appName}</div><div class="sim-body"><div class="sim-box"><div class="sim-title">${t('payingText')}</div><div class="sim-recipient">Devaraja Market Stores</div><div class="sim-title">${t('bankNameText')} DEVARAJA MARKET</div></div><div class="sim-box"><div class="sim-amount">₹ 150</div><div class="sim-title" style="margin-top: 10px;">${t('addNote')}</div></div><div class="sim-pay-btn sim-clickable highlight" onclick="nextStep()">${t('proceedPay')}</div></div>`;
const buildPinUI = () => `<div class="sim-header" style="background: #1F2937; color: white;">Enter UPI PIN</div><div class="sim-body"><div class="sim-educational-note"><strong>${t('pinWarn')}</strong></div><div class="sim-box"><div class="sim-title">Devaraja Market Stores</div><div class="sim-amount" style="font-size: 1.5rem;">₹ 150</div></div><div class="sim-pin-display" id="sim-pin-display">○ ○ ○ ○</div><div class="sim-keypad"><div class="sim-key" onclick="addPinDigit('1')">1</div><div class="sim-key" onclick="addPinDigit('2')">2</div><div class="sim-key" onclick="addPinDigit('3')">3</div><div class="sim-key" onclick="addPinDigit('4')">4</div><div class="sim-key" onclick="addPinDigit('5')">5</div><div class="sim-key" onclick="addPinDigit('6')">6</div><div class="sim-key" onclick="addPinDigit('7')">7</div><div class="sim-key" onclick="addPinDigit('8')">8</div><div class="sim-key" onclick="addPinDigit('9')">9</div><div class="sim-key" onclick="deletePinDigit()" style="color: #e63946; font-size: 1.2rem;">⌫</div><div class="sim-key" onclick="addPinDigit('0')">0</div><div class="sim-key sim-key-submit" id="sim-pin-submit" onclick="submitPin()">✓</div></div></div>`;
const buildSuccessUI = () => `<div class="sim-header" style="background: var(--bhim-green);">${t('paySuccess')}</div><div class="sim-body" style="background: #e8f5e9;"><div class="sim-success"><div class="sim-success-icon">✓</div><div class="sim-recipient">${t('paidTo')}</div><div class="sim-amount">₹ 150</div></div><div class="sim-educational-note" style="margin-top: 2rem;">${t('simComplete')}</div><button class="sim-pay-btn sim-clickable" style="margin-top: 1rem; width: 100%; border: none; font-size: 1.1rem; background: var(--midnight-navy);" onclick="startPracticeMode()">${t('btnPracticeMode')}</button></div>`;

function renderPinDisplay() {
    const display = document.getElementById('sim-pin-display');
    const submitBtn = document.getElementById('sim-pin-submit');
    if(!display) return;
    let dots = "";
    for(let i = 0; i < 4; i++) { dots += (i < enteredPin.length) ? "● " : "○ "; }
    display.innerText = dots.trim();
    if(enteredPin.length === 4) submitBtn.classList.add('active-submit', 'highlight');
    else submitBtn.classList.remove('active-submit', 'highlight');
}
function addPinDigit(d) { if(enteredPin.length < 4) { enteredPin += d; renderPinDisplay(); } }
function deletePinDigit() { if(enteredPin.length > 0) { enteredPin = enteredPin.slice(0, -1); renderPinDisplay(); } }
function submitPin() { if(enteredPin.length === 4) nextStep(); }

function getFlows(appId) {
    const appName = appData[appId].name;
    const sharedSteps = [
        { en: "Step 3: Check the recipient's name and amount. Then tap 'Proceed to Pay'.", hi: "चरण 3: प्राप्तकर्ता का नाम और राशि जांचें। फिर 'Proceed to Pay' पर टैप करें।", kn: "ಹಂತ 3: ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು ಮತ್ತು ಮೊತ್ತವನ್ನು ಪರಿಶೀಲಿಸಿ. ನಂತರ 'Proceed to Pay' ಟ್ಯಾಪ್ ಮಾಡಿ.", uiBuilder: () => buildAmountUI(appName) },
        { en: "Step 4: Practice entering your UPI PIN. Type any 4 digits on the keypad and tap the checkmark.", hi: "चरण 4: अपना UPI पिन दर्ज करने का अभ्यास करें। कीपैड पर कोई भी 4 अंक टाइप करें और चेकमार्क पर टैप करें।", kn: "ಹಂತ 4: ನಿಮ್ಮ UPI ಪಿನ್ ನಮೂದಿಸುವುದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ. ಕೀಪ್ಯಾಡ್‌ನಲ್ಲಿ ಯಾವುದೇ 4 ಅಂಕಿಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ ಮತ್ತು ಚೆಕ್‌ಮಾರ್ಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ.", uiBuilder: () => buildPinUI() },
        { en: "Step 5: The screen will show a success message when the money is sent.", hi: "चरण 5: पैसे भेजे जाने पर स्क्रीन एक सफलता का संदेश दिखाएगी।", kn: "ಹಂತ 5: ಹಣವನ್ನು ಕಳುಹಿಸಿದಾಗ ಪರದೆಯು ಯಶಸ್ಸಿನ ಸಂದೇಶವನ್ನು ತೋರಿಸುತ್ತದೆ.", uiBuilder: () => buildSuccessUI() }
    ];
    return {
        qr: [{ en: `Step 1: Open ${appName} and tap 'Scan QR'.`, hi: `चरण 1: ${appName} खोलें और 'QR स्कैन करें' पर टैप करें।`, kn: `ಹಂತ 1: ${appName} ತೆರೆಯಿರಿ ಮತ್ತು 'QR ಸ್ಕ್ಯಾನ್' ಟ್ಯಾಪ್ ಮಾಡಿ.`, uiBuilder: () => buildHomeUI(appName, 'qr') },
             { en: "Step 2: Center the merchant's QR code inside the box on your screen.", hi: "चरण 2: मर्चेंट के QR कोड को अपनी स्क्रीन के बॉक्स के बीच में रखें।", kn: "ಹಂತ 2: ವ್ಯಾಪಾರಿಯ QR ಕೋಡ್ ಅನ್ನು ನಿಮ್ಮ ಪರದೆಯ ಚೌಕದ ಮಧ್ಯದಲ್ಲಿ ಇರಿಸಿ.", uiBuilder: () => buildScannerUI() }, ...sharedSteps],
        contacts: [{ en: `Step 1: Open ${appName} and tap 'Pay Contacts'.`, hi: `चरण 1: ${appName} खोलें और 'संपर्क को भुगतान' पर टैप करें।`, kn: `ಹಂತ 1: ${appName} ತೆರೆಯಿರಿ ಮತ್ತು 'ಸಂಪರ್ಕಗಳಿಗೆ ಪಾವತಿ' ಟ್ಯಾಪ್ ಮಾಡಿ.`, uiBuilder: () => buildHomeUI(appName, 'contacts') },
                   { en: "Step 2: Select the person you want to pay from your contact list.", hi: "चरण 2: अपनी संपर्क सूची से उस व्यक्ति को चुनें जिसे आप भुगतान करना चाहते हैं।", kn: "ಹಂತ 2: ನಿಮ್ಮ ಸಂಪರ್ಕ ಪಟ್ಟಿಯಿಂದ ನೀವು ಪಾವತಿಸಲು ಬಯಸುವ ವ್ಯಕ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.", uiBuilder: () => buildContactsUI() }, ...sharedSteps],
        bank: [{ en: `Step 1: Open ${appName} and tap 'Bank Transfer'.`, hi: `चरण 1: ${appName} खोलें और 'बैंक ट्रांसफर' पर टैप करें।`, kn: `ಹಂತ 1: ${appName} ತೆರೆಯಿರಿ ಮತ್ತು 'ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ' ಟ್ಯಾಪ್ ಮಾಡಿ.`, uiBuilder: () => buildHomeUI(appName, 'bank') },
               { en: "Step 2: Enter the exact Account Number and IFSC code, then tap Continue.", hi: "चरण 2: सटीक खाता संख्या और IFSC कोड दर्ज करें, फिर Continue पर टैप करें।", kn: "ಹಂತ 2: ನಿಖರವಾದ ಖಾತೆ ಸಂಖ್ಯೆ ಮತ್ತು IFSC ಕೋಡ್ ನಮೂದಿಸಿ, ನಂತರ Continue ಟ್ಯಾಪ್ ಮಾಡಿ.", uiBuilder: () => buildBankUI() }, ...sharedSteps]
    };
}

function startPracticeMode() {
    document.getElementById('walkthrough-screen').classList.remove('active');
    document.getElementById('mode-selection-screen').classList.remove('active');
    document.getElementById('practice-screen').classList.add('active');
    practiceStep = 'home'; practiceEnteredPin = ''; practiceAmountEntered = false;
    const phoneContent = document.getElementById('practice-phone-content');
    phoneContent.className = `phone-content ${walkthroughData[currentApp].themeClass}`;
    updatePracticeUI();
}

function handlePracticeWrongClick(e) {
    if(e) e.stopPropagation();
    const phone = document.getElementById('practice-phone-content');
    phone.classList.remove('shake'); void phone.offsetWidth; phone.classList.add('shake');
}

function handlePracticeAction(action, e) {
    if(e) e.stopPropagation();
    if (action === 'qr') practiceStep = 'qr_scan';
    else if (action === 'contacts') practiceStep = 'contacts_select';
    else if (action === 'bank') practiceStep = 'bank_enter';
    else if (action === 'amount') practiceStep = 'amount_enter';
    else if (action === 'pin') practiceStep = 'pin_enter';
    else if (action === 'result') practiceStep = 'result';
    updatePracticeUI();
}

function enterPracticeAmount(e) { if(e) e.stopPropagation(); practiceAmountEntered = true; updatePracticeUI(); }

const buildPracticeHomeUI = (appName) => `<div class="sim-header">${appName}</div><div class="sim-body" onclick="handlePracticeWrongClick(event)"><div class="sim-box sim-clickable" onclick="handlePracticeAction('qr', event)">${t('scanBtn')}</div><div class="sim-box sim-clickable" onclick="handlePracticeAction('contacts', event)">${t('contactsBtn')}</div><div class="sim-box sim-clickable" onclick="handlePracticeAction('bank', event)">${t('bankBtn')}</div></div>`;
const buildPracticeScannerUI = () => `<div class="sim-header" style="background: #000; color: #fff;">${t('scanBtn')}</div><div class="sim-body" style="background: #111; color: white;" onclick="handlePracticeWrongClick(event)"><div class="sim-educational-note" style="margin-bottom: auto; background: #333; color: #eee; border:none;">${t('safeSimLabel')}</div><div class="sim-scanner sim-clickable" style="cursor:pointer;" onclick="handlePracticeAction('amount', event)"></div><div style="margin-top: auto; text-align: center; color: #666;">Align QR code</div></div>`;
const buildPracticeContactsUI = () => `<div class="sim-header" style="background: #1F2937; color: white;">${t('contactsBtn')}</div><div class="sim-body" onclick="handlePracticeWrongClick(event)"><div class="sim-educational-note">${t('safeSimLabel')}</div><div class="sim-box sim-clickable" onclick="handlePracticeAction('amount', event)"><div class="sim-recipient">Ramesh (Devaraja Market)</div><div class="sim-title">+91 98765 43210</div></div><div class="sim-box sim-clickable" onclick="handlePracticeAction('amount', event)"><div class="sim-recipient">Suresh</div><div class="sim-title">+91 87654 32109</div></div></div>`;
const buildPracticeBankUI = () => `<div class="sim-header" style="background: #1F2937; color: white;">${t('bankBtn')}</div><div class="sim-body" onclick="handlePracticeWrongClick(event)"><div class="sim-educational-note">${t('safeSimLabel')}</div><div class="sim-box" style="text-align:left;"><div class="sim-title">${t('accNum')}</div><div style="border-bottom: 1px solid #ccc; padding: 5px 0; margin-bottom: 10px;">1234567890</div><div class="sim-title">${t('ifsc')}</div><div style="border-bottom: 1px solid #ccc; padding: 5px 0; margin-bottom: 10px;">SBIN0001234</div><div class="sim-title">${t('recipName')}</div><div style="border-bottom: 1px solid #ccc; padding: 5px 0;">Devaraja Market Stores</div></div><div class="sim-pay-btn sim-clickable" onclick="handlePracticeAction('amount', event)">${t('continueBtn')}</div></div>`;
const buildPracticeAmountUI = (appName) => `<div class="sim-header">${appName}</div><div class="sim-body" onclick="handlePracticeWrongClick(event)"><div class="sim-box"><div class="sim-title">${t('payingText')}</div><div class="sim-recipient">Devaraja Market Stores</div><div class="sim-title">${t('bankNameText')} DEVARAJA MARKET</div></div><div class="sim-box"><div class="sim-amount sim-clickable" style="padding: 10px; background: #f8f9fa; border-radius: 8px;" onclick="enterPracticeAmount(event)">${practiceAmountEntered ? '₹ 500' : '₹ 0'}</div><div class="sim-title" style="margin-top: 10px;">${t('addNote')}</div></div><div class="sim-pay-btn sim-clickable" style="opacity: ${practiceAmountEntered ? '1' : '0.5'}; transition: opacity 0.3s;" onclick="${practiceAmountEntered ? "handlePracticeAction('pin', event)" : "handlePracticeWrongClick(event)"}">${t('proceedPay')}</div></div>`;
const buildPracticePinUI = () => `<div class="sim-header" style="background: #1F2937; color: white;">Enter UPI PIN</div><div class="sim-body" onclick="handlePracticeWrongClick(event)"><div class="sim-educational-note"><strong>${t('safeSimLabel')}</strong></div><div class="sim-box"><div class="sim-title">Devaraja Market Stores</div><div class="sim-amount" style="font-size: 1.5rem;">₹ 500</div></div><div class="sim-pin-display" id="practice-pin-display">○ ○ ○ ○</div><div class="sim-keypad"><div class="sim-key" onclick="addPracticePinDigit('1', event)">1</div><div class="sim-key" onclick="addPracticePinDigit('2', event)">2</div><div class="sim-key" onclick="addPracticePinDigit('3', event)">3</div><div class="sim-key" onclick="addPracticePinDigit('4', event)">4</div><div class="sim-key" onclick="addPracticePinDigit('5', event)">5</div><div class="sim-key" onclick="addPracticePinDigit('6', event)">6</div><div class="sim-key" onclick="addPracticePinDigit('7', event)">7</div><div class="sim-key" onclick="addPracticePinDigit('8', event)">8</div><div class="sim-key" onclick="addPracticePinDigit('9', event)">9</div><div class="sim-key" onclick="deletePracticePinDigit(event)" style="color: #e63946; font-size: 1.2rem;">⌫</div><div class="sim-key" onclick="addPracticePinDigit('0', event)">0</div><div class="sim-key sim-key-submit" id="practice-pin-submit" onclick="submitPracticePin(event)">✓</div></div></div>`;
const buildPracticeResultUI = () => {
    const isSuccess = Math.random() > 0.2; 
    return `<div class="sim-header" style="background: ${isSuccess ? 'var(--bhim-green)' : '#f59e0b'};">${isSuccess ? t('paySuccess') : 'Payment Pending'}</div><div class="sim-body" style="background: ${isSuccess ? '#e8f5e9' : '#fef3c7'};"><div class="sim-success"><div class="sim-success-icon">${isSuccess ? '✓' : '⏱'}</div><div class="sim-recipient">${t('paidTo')}</div><div class="sim-amount">₹ 500</div></div><div class="sim-educational-note" style="margin-top: 2rem;">${t('safeSimLabel')}</div><button class="btn-primary" style="margin-top: 2rem; width: 100%;" onclick="goHome()">${t('exitPractice')}</button></div>`;
};

function renderPracticePinDisplay() {
    const display = document.getElementById('practice-pin-display');
    const submitBtn = document.getElementById('practice-pin-submit');
    if(!display) return;
    let dots = "";
    for(let i = 0; i < 4; i++) { dots += (i < practiceEnteredPin.length) ? "● " : "○ "; }
    display.innerText = dots.trim();
    if(practiceEnteredPin.length === 4) submitBtn.classList.add('active-submit');
    else submitBtn.classList.remove('active-submit');
}
function addPracticePinDigit(d, e) { if(e) e.stopPropagation(); if(practiceEnteredPin.length < 4) { practiceEnteredPin += d; renderPracticePinDisplay(); } }
function deletePracticePinDigit(e) { if(e) e.stopPropagation(); if(practiceEnteredPin.length > 0) { practiceEnteredPin = practiceEnteredPin.slice(0, -1); renderPracticePinDisplay(); } }
function submitPracticePin(e) { if(e) e.stopPropagation(); if(practiceEnteredPin.length === 4) handlePracticeAction('result'); else handlePracticeWrongClick(e); }

function updatePracticeUI() {
    const appName = appData[currentApp].name;
    const phone = document.getElementById('practice-phone-content');
    document.getElementById('practice-title').innerText = t('practiceModeTitle');
    document.getElementById('practice-desc').innerText = t('practiceModeDesc');
    document.getElementById('btn-practice-help').innerText = t('needHelp');
    document.getElementById('btn-practice-exit').innerText = t('exitPractice');
    document.getElementById('practice-help-text').style.display = 'none';

    let html = '';
    if (practiceStep === 'home') html = buildPracticeHomeUI(appName);
    else if (practiceStep === 'qr_scan') html = buildPracticeScannerUI();
    else if (practiceStep === 'contacts_select') html = buildPracticeContactsUI();
    else if (practiceStep === 'bank_enter') html = buildPracticeBankUI();
    else if (practiceStep === 'amount_enter') html = buildPracticeAmountUI(appName);
    else if (practiceStep === 'pin_enter') html = buildPracticePinUI();
    else if (practiceStep === 'result') html = buildPracticeResultUI();
    
    phone.innerHTML = html;
    if (practiceStep === 'pin_enter') renderPracticePinDisplay();
}

function showPracticeHelp() {
    const helpBox = document.getElementById('practice-help-text');
    let helpMsg = '';
    if (practiceStep === 'home') helpMsg = t('helpHome');
    else if (practiceStep === 'qr_scan') helpMsg = t('helpQR');
    else if (practiceStep === 'contacts_select') helpMsg = t('helpContacts');
    else if (practiceStep === 'bank_enter') helpMsg = t('helpBank');
    else if (practiceStep === 'amount_enter') helpMsg = t('helpAmount');
    else if (practiceStep === 'pin_enter') helpMsg = t('helpPIN');
    if (helpMsg) { helpBox.innerText = helpMsg; helpBox.style.display = 'block'; }
}

// --- Global Navigation & Language ---
const selectionScreen = document.getElementById('selection-screen');
const walkthroughScreen = document.getElementById('walkthrough-screen');
const phoneContent = document.getElementById('phone-content');
const instructionText = document.getElementById('instruction-text');
const audioToggleBtn = document.getElementById('audioToggle');

function setLang(langCode) {
    currentLang = langCode;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-lang-${langCode}`).classList.add('active');
    
    document.getElementById('tagline').innerText = t('tagline');
    document.getElementById('btn-back').innerText = t('back');
    document.getElementById('btn-next').innerText = t('next');
    document.getElementById('btn-exit').innerText = t('exit');

    if (document.getElementById('check-title')) {
        document.getElementById('check-title').innerText = t('checkTitle');
        document.getElementById('btn-yes').innerText = t('btnYes');
        document.getElementById('btn-no').innerText = t('btnNo');
        document.getElementById('btn-skip-check').innerText = t('skipCheck');
    }
    if (document.getElementById('mode-title')) {
        document.getElementById('mode-title').innerText = t('chooseMode');
        document.getElementById('btn-mode-guided').innerText = t('btnGuided');
        document.getElementById('btn-mode-practice').innerText = t('btnPractice');
        document.getElementById('btn-mode-cancel').innerText = t('cancel');
    }
    
    document.getElementById('scam-header').innerText = t('scamHeader');
    document.getElementById('scam-subheader').innerText = t('scamSubheader');
    document.getElementById('scam-lbl-money').innerText = t('scamMoney');
    document.getElementById('scam-lbl-call').innerText = t('scamCall');
    document.getElementById('scam-lbl-fake').innerText = t('scamFake');
    document.getElementById('scam-lbl-bank').innerText = t('scamBank');
    document.getElementById('scam-lbl-invest').innerText = t('scamInvest');
    document.getElementById('scam-warning-title').innerText = t('scamWarnTitle');
    document.getElementById('scam-warning-text').innerText = t('scamWarnText');
    
    if (document.getElementById('scam-lock-title')) {
        document.getElementById('scam-lock-title').innerText = t('scamLockTitle');
        document.getElementById('scam-lock-desc').innerText = t('scamLockDesc');
        document.getElementById('scam-lock-btn').innerText = t('scamLockBtn');
    }

    if (document.getElementById('ev-home-btn')) {
        document.getElementById('ev-home-btn').innerText = t('evHomeBtn');
        document.getElementById('ev-title').innerText = t('evTitle');
        document.getElementById('ev-privacy').innerText = t('evPrivacy');
        document.getElementById('ev-sec1').innerText = t('evSec1');
        document.getElementById('ev-sec1a').innerHTML = t('evSec1a');
        document.getElementById('ev-sec1b').innerHTML = t('evSec1b');
        document.getElementById('ev-sec1c').innerHTML = t('evSec1c');
        document.getElementById('ev-sec2').innerText = t('evSec2');
        document.getElementById('ev-date-lbl').innerText = t('evDateLbl');
        document.getElementById('ev-time-lbl').innerText = t('evTimeLbl');
        document.getElementById('ev-type-lbl').innerText = t('evTypeLbl');
        document.getElementById('ev-type-opt0').innerText = t('evTypeOpt0');
        document.getElementById('ev-type-opt1').innerText = t('evTypeOpt1');
        document.getElementById('ev-type-opt2').innerText = t('evTypeOpt2');
        document.getElementById('ev-type-opt3').innerText = t('evTypeOpt3');
        document.getElementById('ev-type-opt4').innerText = t('evTypeOpt4');
        document.getElementById('ev-amount-lbl').innerText = t('evAmountLbl');
        document.getElementById('ev-txn-lbl').innerText = t('evTxnLbl');
        document.getElementById('ev-scammer-lbl').innerText = t('evScammerLbl');
        document.getElementById('ev-ref-lbl').innerText = t('evRefLbl');
        document.getElementById('ev-attach-lbl').innerText = t('evAttachLbl');
        document.getElementById('ev-save-btn').innerText = t('evSaveBtn');
        document.getElementById('ev-sec3').innerText = t('evSec3');
        document.getElementById('ev-sec3a').innerHTML = t('evSec3a');
        document.getElementById('ev-sec3b').innerHTML = t('evSec3b');
        document.getElementById('ev-sec3c').innerHTML = t('evSec3c');
        document.getElementById('ev-sec3d').innerHTML = t('evSec3d');
        document.getElementById('ev-btn-exit').innerText = t('evBtnExit');
        document.getElementById('ev-success-title').innerText = t('evSuccessTitle');
        document.getElementById('ev-reset-btn').innerText = t('evResetBtn');
        document.getElementById('ev-print-btn').innerText = t('evPrintBtn');

        document.getElementById('ev-amount').placeholder = t('evAmountPlaceholder');
        document.getElementById('ev-txn').placeholder = t('evTxnPlaceholder');
        document.getElementById('ev-scammer').placeholder = t('evScammerPlaceholder');
        document.getElementById('ev-ref').placeholder = t('evRefPlaceholder');
    }

    if (document.getElementById('loan-home-title')) {
        document.getElementById('loan-home-title').innerText = t('loanHomeTitle');
        document.getElementById('loan-home-btn').innerText = t('loanHomeBtn');
        document.getElementById('loan-select-title').innerText = t('loanSelectTitle');
        document.getElementById('loan-form-header').innerText = t('loanFormHeader');
    }

    if (audioToggleBtn) { audioToggleBtn.innerText = audioEnabled ? t('stop') : t('listen'); }
    
    if (document.getElementById('install-screen').classList.contains('active')) updateInstallUI();
    else if (document.getElementById('app-check-screen').classList.contains('active')) { if (audioEnabled) speakText(t('checkTitle')); } 
    else if (document.getElementById('mode-selection-screen').classList.contains('active')) { if (audioEnabled) speakText(t('chooseMode')); }
    else if (document.getElementById('practice-screen').classList.contains('active')) updatePracticeUI();
    else if (document.getElementById('scam-help-screen').classList.contains('active')) renderScamStep();
    else if (document.getElementById('evidence-screen').classList.contains('active')) { if (audioEnabled) speakText(t('evTitle')); }
    else if (currentApp && document.getElementById('walkthrough-screen').classList.contains('active')) updateStepUI();
}

if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioToggleBtn.style.backgroundColor = audioEnabled ? "#e63946" : "var(--muted-teal)";
        audioToggleBtn.innerText = audioEnabled ? t('stop') : t('listen');
        window.speechSynthesis.cancel();
        
        if (audioEnabled) {
            if (document.getElementById('install-screen').classList.contains('active')) speakText(t('instStep' + currentInstallStep));
            else if (document.getElementById('app-check-screen').classList.contains('active')) speakText(t('checkTitle'));
            else if (document.getElementById('mode-selection-screen').classList.contains('active')) speakText(t('chooseMode'));
            else if (document.getElementById('scam-help-screen').classList.contains('active')) speakText(scamGuidance[currentScamType].steps[currentScamStep][currentLang]);
            else if (document.getElementById('evidence-screen').classList.contains('active')) speakText(t('evTitle'));
            else if (document.getElementById('walkthrough-screen').classList.contains('active') && currentApp) speakInstruction();
        }
    });
}

function selectApp(appId) {
    currentApp = appId || pendingAppId;
    activeFlow = 'qr';
    currentStep = 0;
    deactivateScreens();
    walkthroughData = { gpay: { themeClass: 'gpay-theme', flows: getFlows('gpay') }, phonepe: { themeClass: 'phonepe-theme', flows: getFlows('phonepe') }, bhim: { themeClass: 'bhim-theme', flows: getFlows('bhim') } };
    phoneContent.className = `phone-content ${walkthroughData[currentApp].themeClass}`;
    walkthroughScreen.classList.add('active');
    updateStepUI();
}

function switchFlow(flowName) { activeFlow = flowName; currentStep = 1; updateStepUI(); }

function updateStepUI() {
    const stepData = walkthroughData[currentApp].flows[activeFlow][currentStep];
    instructionText.innerText = stepData[currentLang];
    phoneContent.innerHTML = stepData.uiBuilder();
    enteredPin = "";
    renderPinDisplay();
    if (audioEnabled) speakInstruction();
}

function speakInstruction() {
    if (!audioEnabled || !currentApp) return;
    speakText(walkthroughData[currentApp].flows[activeFlow][currentStep][currentLang]);
}

function nextStep() { if (currentStep < walkthroughData[currentApp].flows[activeFlow].length - 1) { currentStep++; updateStepUI(); } }
function prevStep() { if (currentStep > 0) { currentStep--; updateStepUI(); } }

function deactivateScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
}

function goHome() {
    window.speechSynthesis.cancel();
    currentApp = ''; pendingAppId = ''; currentScamType = ''; currentLoanType = '';
    document.getElementById('scam-help-screen').classList.remove('physical-split-active');
    
    try { if (govWindow && !govWindow.closed) { govWindow.close(); } } catch(e) {}
    try { window.moveTo(0, 0); window.resizeTo(window.screen.availWidth, window.screen.availHeight); } catch(e) {}
    
    deactivateScreens();
    const iframe = document.getElementById('scam-iframe');
    if(iframe) iframe.src = "";
    
    selectionScreen.classList.add('active');
}