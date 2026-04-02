import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { ChatbotEntry } from "../backend.d";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

const GOLD = "oklch(0.72 0.14 78)";
const NAVY_BG = "#0a0f1e";
const CARD_BG = "rgba(17,25,55,0.85)";
const BORDER = "rgba(212,175,55,0.25)";

const DISCLAIMERS: Record<string, string> = {
  "en-IN":
    "This is legal guidance, not legal advice. Please consult a qualified lawyer for your specific situation.",
  "hi-IN":
    "यह कानूनी मार्गदर्शन है, कानूनी सलाह नहीं। कृपया अपनी विशिष्ट स्थिति के लिए एक योग्य वकील से परामर्श लें।",
  "kn-IN":
    "ಇದು ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ, ಕಾನೂನು ಸಲಹೆ ಅಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪರಿಸ್ಥಿತಿಗಾಗಿ ಅರ್ಹ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
  "ta-IN":
    "இது சட்ட வழிகாட்டுதல், சட்ட ஆலோசனை அல்ல. உங்கள் குறிப்பிட்ட சூழ்நிலைக்கு தகுதிவாய்ந்த வழக்கறிஞரை அணுகவும்.",
  "te-IN":
    "ఇది చట్ట మార్గదర్శకం, చట్టపరమైన సలహా కాదు. దయచేసి మీ నిర్దిష్ట పరిస్థితి కోసం అర్హులైన న్యాయవాదిని సంప్రదించండి.",
  "bn-IN":
    "এটি আইনি নির্দেশিকা, আইনি পরামর্শ নয়। আপনার নির্দিষ্ট পরিস্থিতির জন্য একজন যোগ্য আইনজীবীর সাথে পরামর্শ করুন।",
};

// ─── HINDI ENTRIES ───────────────────────────────────────────────────────────
const HINDI_ENTRIES: ChatbotEntry[] = [
  {
    id: 1n,
    topicKey: "land_dispute",
    icon: "🏠",
    title: "जमीन विवाद स्वामित्व",
    keywords: [
      "जमीन",
      "विवाद",
      "स्वामित्व",
      "संपत्ति",
      "land",
      "property",
      "ownership",
      "dispute",
      "plot",
      "deed",
      "zameen",
      "zamini",
      "jamin",
      "jameen",
      "pareshani",
      "vivad",
      "sampatti",
      "bhoomi",
      "bhumi",
      "jagah",
      "property problem",
      "land problem",
      "zameen ka vivad",
      "zamini pareshani",
      "property dispute",
      "जमीन विवाद",
      "भूमि विवाद",
      "जमीन का झगड़ा",
      "प्रॉपर्टी विवाद",
      "मालिकाना विवाद",
      "जमीन किसकी है",
      "jameen vivad",
      "zameen dispute",
      "land dispute india",
      "property dispute india",
      "jameen ka jhagda",
      "ownership issue land",
      "property ownership problem",
      "zameen kiska hai",
      "jamin vivad",
    ],
    intro:
      "यह तब होता है जब दो या अधिक लोग एक ही संपत्ति पर दावा करते हैं। चिंता न करें — भारत में यह बहुत आम है।",
    whatToDo:
      "सबसे पहले, अपने सभी संपत्ति दस्तावेज इकट्ठा करें। फिर स्वामित्व को कानूनी रूप से साबित करने के लिए स्थानीय सिविल कोर्ट में घोषणा और निषेधाज्ञा के लिए सिविल मुकदमा दायर करें।",
    documents: [
      "सेल डीड / टाइटल डीड",
      "एन्कम्ब्रेंस सर्टिफिकेट (EC)",
      "प्रॉपर्टी टैक्स रसीदें",
      "भूमि रिकॉर्ड (RTC/पट्टा)",
      "कोई भी एग्रीमेंट पेपर्स",
    ],
    lawyerType: "प्रॉपर्टी / सिविल वकील",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "2–10 वर्ष",
    successRate: "यदि दस्तावेज मजबूत हों तो अधिक",
    tip: "कानूनी प्रक्रिया के बिना आपको आपकी संपत्ति से हटाया नहीं जा सकता।",
  },
  {
    id: 2n,
    topicKey: "encroachment",
    icon: "🚧",
    title: "अवैध कब्जा (एन्क्रोचमेंट)",
    keywords: [
      "अवैध",
      "कब्जा",
      "एन्क्रोचमेंट",
      "encroachment",
      "trespass",
      "illegal occupation",
      "kabza",
      "avaidh",
      "qabza",
      "occupied",
      "illegal kabza",
      "zameen pe kabza",
      "land occupied",
      "जमीन पर कब्जा",
      "जबरदस्ती कब्जा",
      "जमीन छीन ली",
      "अतिक्रमण",
      "avaidh kabja",
      "illegal possession land",
      "kabza problem",
      "kisi ne zameen le li",
      "zabardasti kabza",
      "encroachment india",
      "kabja ka case",
      "jameen par kabja",
    ],
    intro: "यदि किसी ने आपकी जमीन बिना अनुमति के ले ली है, तो यह गैरकानूनी है।",
    whatToDo:
      "अतिक्रमण (ट्रेसपास) के लिए पुलिस में शिकायत दर्ज करें और बेदखली के लिए सिविल केस भी दायर करें।",
    documents: ["स्वामित्व प्रमाण", "भूमि रिकॉर्ड", "अतिक्रमण की फोटो/वीडियो"],
    lawyerType: "सिविल + आपराधिक वकील",
    cost: "₹20,000 – ₹1,50,000",
    timeRequired: "1–5 वर्ष",
    successRate: "मध्यम–उच्च",
    tip: "आपको अपनी संपत्ति को कानूनी रूप से वापस पाने का पूरा अधिकार है।",
  },
  {
    id: 3n,
    topicKey: "fir_police",
    icon: "👮",
    title: "पुलिस FIR दर्ज नहीं कर रही",
    keywords: [
      "fir",
      "पुलिस",
      "शिकायत",
      "police",
      "complaint",
      "report",
      "refuse",
      "police nahi sun raha",
      "fir nahi likh raha",
      "thana",
      "darj",
      "shikayat",
      "police complaint",
      "fir darz",
      "पुलिस FIR नहीं ले रही",
      "FIR दर्ज नहीं हो रही",
      "पुलिस मना कर रही",
      "शिकायत नहीं ले रहे",
      "police FIR nahi le rahi",
      "FIR not registered",
      "police complaint reject",
      "FIR kaise kare",
      "FIR nahi ho rahi",
      "police refuse FIR",
      "FIR ka problem",
    ],
    intro:
      "यदि पुलिस आपकी FIR दर्ज करने से मना करती है, तो चिंता न करें — कानून पूरी तरह आपका समर्थन करता है।",
    whatToDo: "सुपरिंटेंडेंट ऑफ पुलिस (SP) के पास जाएं या मजिस्ट्रेट के सामने शिकायत दर्ज करें।",
    documents: ["लिखित शिकायत", "सबूत (फोटो, चैट)", "पहचान पत्र"],
    lawyerType: "आपराधिक वकील",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "कुछ दिन",
    successRate: "बहुत अधिक",
    tip: "संज्ञेय अपराधों के लिए पुलिस को FIR दर्ज करना अनिवार्य है।",
  },
  {
    id: 4n,
    topicKey: "bail",
    icon: "⚖️",
    title: "जमानत प्रक्रिया",
    keywords: [
      "जमानत",
      "bail",
      "custody",
      "arrest",
      "गिरफ्तारी",
      "जेल",
      "jail",
      "release",
      "jamaanat",
      "zamanat",
      "giraftari",
      "band",
      "chhutkara",
      "police ne pakda",
      "जमानत कैसे मिले",
      "बेल कैसे लें",
      "जमानत प्रक्रिया",
      "जेल से बाहर कैसे आए",
      "jamanat kaise mile",
      "bail process india",
      "bail kaise le",
      "jail se bahar kaise aaye",
      "bail apply kaise kare",
      "jamanat mil sakti hai kya",
    ],
    intro: "जमानत का मतलब है कि केस चलते समय अस्थायी रूप से हिरासत से रिहाई।",
    whatToDo: "एक वकील रखें और तुरंत कोर्ट में जमानत के लिए आवेदन करें।",
    documents: ["FIR की कॉपी", "पहचान पत्र", "जमानतदार के दस्तावेज"],
    lawyerType: "आपराधिक वकील",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "1 दिन–कुछ सप्ताह",
    successRate: "उच्च",
    tip: "'जमानत नियम है, जेल अपवाद है' — सहयोग करने से जमानत मिलने की संभावना बढ़ती है।",
  },
  {
    id: 5n,
    topicKey: "divorce",
    icon: "👩‍⚖️",
    title: "तलाक प्रक्रिया",
    keywords: [
      "तलाक",
      "divorce",
      "separation",
      "विवाह",
      "marriage",
      "wife",
      "husband",
      "पत्नी",
      "पति",
      "alimony",
      "talak",
      "talaak",
      "shaadi khatam",
      "alag hona",
      "pati patni vivad",
      "shadi tod",
      "divorce karna",
      "तलाक कैसे लें",
      "शादी खत्म कैसे करें",
      "पति पत्नी विवाद",
      "म्यूचुअल डिवोर्स",
      "talak kaise le",
      "divorce process india",
      "husband wife problem",
      "mutual divorce india",
      "shadi todna hai",
      "divorce kaise file kare",
    ],
    intro:
      "तलाक आपसी सहमति से (आसान) या विवादित (लंबा) हो सकता है। आपसी तलाक हमेशा सरल और सस्ता होता है।",
    whatToDo: "फैमिली कोर्ट में याचिका दायर करें।",
    documents: [
      "विवाह प्रमाण पत्र",
      "पहचान/पता प्रमाण",
      "सबूत (यदि विवादित)",
      "आय का प्रमाण",
    ],
    lawyerType: "फैमिली वकील",
    cost: "₹20,000 – ₹2,00,000",
    timeRequired: "आपसी: 6 महीने–1 वर्ष | विवादित: 2–5 वर्ष",
    successRate: "उच्च",
    tip: "आपसी तलाक हमेशा आसान, सस्ता और कम तनावपूर्ण होता है।",
  },
  {
    id: 6n,
    topicKey: "domestic_violence",
    icon: "🛡️",
    title: "घरेलू हिंसा",
    keywords: [
      "घरेलू हिंसा",
      "domestic violence",
      "abuse",
      "harassment",
      "मारपीट",
      "दहेज",
      "dowry",
      "beating",
      "ghar mein maar",
      "pati maarta hai",
      "ghar mein hinsa",
      "darr",
      "darpok",
      "dahez",
      "maar peet",
      "ghar ki ladai",
      "पति मारता है",
      "घर में मारपीट",
      "मानसिक उत्पीड़न",
      "ghar me hinsa",
      "domestic violence complaint",
      "pati maar raha hai",
      "abuse case india",
      "ghar ka torture",
      "DV case",
      "ghar me problem husband",
    ],
    intro: "शारीरिक, मानसिक या आर्थिक किसी भी प्रकार का उत्पीड़न गैरकानूनी है।",
    whatToDo: "घरेलू हिंसा अधिनियम के तहत शिकायत दर्ज करें या पुलिस से संपर्क करें।",
    documents: ["मेडिकल रिपोर्ट", "संदेश/सबूत", "गवाह"],
    lawyerType: "फैमिली / आपराधिक वकील",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "त्वरित राहत संभव",
    successRate: "उच्च यदि सबूत हों",
    tip: "आप सुरक्षा आदेश, रहने का अधिकार और भरण-पोषण पा सकते हैं।",
  },
  {
    id: 7n,
    topicKey: "salary",
    icon: "💼",
    title: "वेतन नहीं मिला",
    keywords: [
      "वेतन",
      "salary",
      "wages",
      "employer",
      "नौकरी",
      "job",
      "labour",
      "तनख्वाह",
      "payment",
      "tankhwah nahi mili",
      "paisa nahi mila",
      "maalik ne nahi diya",
      "naukri mein paisa",
      "boss ne salary nahi di",
      "job payment",
      "सैलरी नहीं मिली",
      "वेतन नहीं दिया",
      "कंपनी पैसा नहीं दे रही",
      "salary nahi mili",
      "salary not paid india",
      "company ne paisa nahi diya",
      "employer salary problem",
      "salary delay case",
      "paisa nahi mila job ka",
    ],
    intro: "नियोक्ता आपके वेतन को रोक नहीं सकता।",
    whatToDo: "लेबर कमिश्नर के पास शिकायत करें।",
    documents: ["ऑफर लेटर", "सैलरी स्लिप", "बैंक स्टेटमेंट"],
    lawyerType: "लेबर वकील",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "2–6 महीने",
    successRate: "बहुत अधिक",
    tip: "अपने सभी रोजगार दस्तावेज हमेशा सुरक्षित रखें।",
  },
  {
    id: 8n,
    topicKey: "cheque_bounce",
    icon: "🏦",
    title: "चेक बाउंस",
    keywords: [
      "चेक",
      "cheque",
      "check",
      "बाउंस",
      "bounce",
      "dishonour",
      "loan",
      "chek",
      "cheque bounce",
      "check bounce",
      "paisa wapas nahi aaya",
      "udhar nahi mila",
      "चेक वापस आ गया",
      "पैसे नहीं मिले चेक से",
      "cheque bounce case",
      "check bounce india",
      "cheque return problem",
      "paisa nahi mila cheque se",
      "cheque dishonour",
      "check bounce kya kare",
    ],
    intro: "चेक बाउंस एक आपराधिक अपराध है।",
    whatToDo: "30 दिन में नोटिस भेजें, फिर केस फाइल करें।",
    documents: ["चेक", "बैंक मेमो", "नोटिस कॉपी"],
    lawyerType: "आपराधिक / सिविल वकील",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 महीने–2 वर्ष",
    successRate: "उच्च",
    tip: "हर वित्तीय लेनदेन का प्रमाण हमेशा रखें।",
  },
  {
    id: 9n,
    topicKey: "cyber_fraud",
    icon: "🌐",
    title: "ऑनलाइन धोखाधड़ी",
    keywords: [
      "ऑनलाइन",
      "धोखाधड़ी",
      "cyber",
      "online",
      "fraud",
      "scam",
      "upi",
      "hack",
      "पैसा",
      "money stolen",
      "online thagi",
      "paisa cut gaya",
      "account hack",
      "otp fraud",
      "upi se paisa gaya",
      "net banking fraud",
      "online dhoka",
      "ऑनलाइन धोखा",
      "पैसा कट गया",
      "UPI फ्रॉड",
      "बैंक फ्रॉड",
      "online fraud india",
      "paise kat gaye",
      "UPI fraud kya kare",
      "scam ho gaya",
      "online cheating",
      "bank fraud complaint",
    ],
    intro: "अगर पैसा ऑनलाइन चोरी हो गया है, तुरंत कार्रवाई करें।",
    whatToDo: "1930 पर कॉल करें + cybercrime.gov.in पर रिपोर्ट करें।",
    documents: ["ट्रांजेक्शन प्रूफ", "स्क्रीनशॉट"],
    lawyerType: "साइबर वकील (वैकल्पिक)",
    cost: "अधिकतर मुफ्त",
    timeRequired: "तुरंत",
    successRate: "मध्यम (रिपोर्ट की गति पर निर्भर)",
    tip: "धोखाधड़ी के कुछ घंटों के भीतर रिपोर्ट करें — पैसा वापस मिलने की संभावना बढ़ती है।",
  },
  {
    id: 10n,
    topicKey: "consumer",
    icon: "🛍️",
    title: "उपभोक्ता शिकायत",
    keywords: [
      "उपभोक्ता",
      "consumer",
      "product",
      "खराब",
      "defective",
      "refund",
      "service",
      "cheated",
      "kharab saman",
      "wapas nahi liya",
      "refund nahi mila",
      "cheating in shop",
      "kharida hua saman",
      "product kharab",
      "खराब सामान",
      "प्रोडक्ट खराब है",
      "पैसा वापस चाहिए",
      "defective product complaint",
      "product kharab hai",
      "refund chahiye",
      "consumer complaint india",
      "online shopping problem",
      "paisa wapas kaise mile",
    ],
    intro: "आपको रिफंड या रिप्लेसमेंट का अधिकार है।",
    whatToDo:
      "कंज्यूमर कोर्ट में शिकायत करें। आप edaakhil.nic.in पर ऑनलाइन भी कर सकते हैं।",
    documents: ["बिल/इनवॉइस", "वारंटी", "शिकायत प्रूफ"],
    lawyerType: "उपभोक्ता वकील (वैकल्पिक)",
    cost: "₹1,000 – ₹20,000",
    timeRequired: "3–12 महीने",
    successRate: "उच्च",
    tip: "₹50 लाख से कम के छोटे मामलों में कंज्यूमर कोर्ट में वकील की जरूरत नहीं।",
  },
  {
    id: 11n,
    topicKey: "builder_rera",
    icon: "🏗️",
    title: "बिल्डर धोखाधड़ी / RERA",
    keywords: [
      "बिल्डर",
      "builder",
      "possession",
      "rera",
      "फ्लैट",
      "flat",
      "apartment",
      "delay",
      "project",
      "ghar nahi mila",
      "makaan nahi diya",
      "builder dhoka",
      "flat nahi mila",
      "property deliver nahi ki",
      "naya ghar pareshani",
      "बिल्डर घर नहीं दे रहा",
      "फ्लैट नहीं मिला",
      "प्रोजेक्ट लेट",
      "builder fraud india",
      "flat possession delay",
      "builder ne ghar nahi diya",
      "RERA complaint",
      "property delay issue",
      "flat delay case",
    ],
    intro: "बिल्डर की देरी गैरकानूनी है।",
    whatToDo: "RERA में शिकायत करें।",
    documents: ["एग्रीमेंट", "पेमेंट प्रूफ", "बिल्डर से संवाद"],
    lawyerType: "प्रॉपर्टी वकील",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 महीने–3 वर्ष",
    successRate: "उच्च RERA में",
    tip: "RERA सिविल कोर्ट से बहुत तेज है — इसका उपयोग करें।",
  },
  {
    id: 12n,
    topicKey: "fundamental_rights",
    icon: "⚖️",
    title: "मौलिक अधिकार उल्लंघन",
    keywords: [
      "अधिकार",
      "rights",
      "fundamental",
      "मौलिक",
      "government",
      "सरकार",
      "violation",
      "writ",
      "constitutional",
      "adhikar",
      "sarkar ne galat kiya",
      "mera haq",
      "maulik adhikar",
      "govt ne mara",
      "haq ki ladai",
      "अधिकारों का उल्लंघन",
      "सरकार ने गलत किया",
      "fundamental rights violation india",
      "rights violation",
      "government against me",
      "writ petition kya hai",
      "court jana hai",
      "adhikar ka ullanghan",
    ],
    intro: "सरकार आपके अधिकार तोड़े तो आप सीधे कोर्ट जा सकते हैं।",
    whatToDo:
      "हाई कोर्ट (अनुच्छेद 226) या सुप्रीम कोर्ट (अनुच्छेद 32) में रिट याचिका दायर करें।",
    documents: ["उल्लंघन का प्रमाण", "पहचान पत्र", "सहायक सबूत"],
    lawyerType: "संवैधानिक वकील",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "कुछ सप्ताह–महीने",
    successRate: "केस पर निर्भर",
    tip: "कोर्ट अधिकार उल्लंघन को गंभीरता से लेती है — सब कुछ दस्तावेज करें।",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// ─── KANNADA ENTRIES ─────────────────────────────────────────────────────────
const KANNADA_ENTRIES: ChatbotEntry[] = [
  {
    id: 1n,
    topicKey: "land_dispute",
    icon: "🏠",
    title: "ಭೂಮಿ ಹಕ್ಕು ವಿವಾದ",
    keywords: [
      "ಭೂಮಿ",
      "ಜಮೀನು",
      "ಆಸ್ತಿ",
      "ಸ್ವಾಮ್ಯ",
      "ಭೂಮಿ ವಿವಾದ",
      "ಆಸ್ತಿ ವಿವಾದ",
      "ಜಮೀನಿನ ಸಮಸ್ಯೆ",
      "ಭೂಮಿ ಜಗಳ",
      "ಮಾಲೀಕತ್ವ ವಿವಾದ",
      "ಜಮೀನು ಯಾರದ್ದು",
      "ಸ್ವಾಮ್ಯ ವಿವಾದ",
      "ಆಸ್ತಿ ಹಕ್ಕು",
      "ಭೂಮಿ ಹಕ್ಕು",
      "ಪ್ರಾಪರ್ಟಿ ವಿವಾದ",
      "land",
      "property",
      "ownership",
      "dispute",
      "bhoomi vivad",
      "jameen problem",
      "sampatti vivad",
      "property dispute",
      "land dispute india",
      "land ownership problem",
      "bhoomi",
      "jameen",
      "jamin",
      "sampatti",
      "land problem",
    ],
    intro:
      "ಒಂದೇ ಆಸ್ತಿಗೆ ಎರಡು ಅಥವಾ ಹೆಚ್ಚು ಜನರು ಹಕ್ಕು ಕೇಳಿದಾಗ ಇದು ಸಂಭವಿಸುತ್ತದೆ. ಚಿಂತಿಸಬೇಡಿ — ಇದು ಭಾರತದಲ್ಲಿ ತುಂಬಾ ಸಾಮಾನ್ಯವಾಗಿದೆ.",
    whatToDo:
      "ಮೊದಲು, ನಿಮ್ಮ ಎಲ್ಲಾ ಆಸ್ತಿ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ. ನಂತರ ಸ್ಥಳೀಯ ಸಿವಿಲ್ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಘೋಷಣೆ ಮತ್ತು ನಿರ್ಬಂಧಾಜ್ಞೆಗಾಗಿ ಸಿವಿಲ್ ಮೊಕದ್ದಮೆ ಹೂಡಿ.",
    documents: [
      "ಸೆಲ್ ಡೀಡ್ / ಟೈಟಲ್ ಡೀಡ್",
      "ಎಂಕಂಬ್ರನ್ಸ್ ಸರ್ಟಿಫಿಕೆಟ್ (EC)",
      "ಪ್ರಾಪರ್ಟಿ ತೆರಿಗೆ ರಸೀದಿ",
      "ಭೂಮಿ ದಾಖಲೆ (RTC/ಪಟ್ಟಾ)",
    ],
    lawyerType: "ಪ್ರಾಪರ್ಟಿ / ಸಿವಿಲ್ ವಕೀಲ",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "2–10 ವರ್ಷಗಳು",
    successRate: "ದಾಖಲೆ ಬಲವಾಗಿದ್ದರೆ ಹೆಚ್ಚು",
    tip: "ಖರೀದಿ ಮಾಡುವ ಮೊದಲು ಭೂಮಿ ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ.",
  },
  {
    id: 2n,
    topicKey: "encroachment",
    icon: "🚧",
    title: "ಅಕ್ರಮ ಕಬಳಿಕೆ (ಎನ್ಕ್ರೋಚ್‍ಮೆಂಟ್)",
    keywords: [
      "ಅಕ್ರಮ ಕಬಳಿಕೆ",
      "ಅನಧಿಕೃತ ಆಕ್ರಮಣ",
      "ಜಮೀನು ಕಬಳಿಸಿದ್ದಾರೆ",
      "ಅಕ್ರಮ ನಿರ್ಮಾಣ",
      "ಭೂಮಿ ಆಕ್ರಮಣ",
      "ಕಬಳಿಕೆ ಆಗಿದೆ",
      "ಅನುಮತಿ ಇಲ್ಲದೆ ತೆಗೆದಿದ್ದಾರೆ",
      "ಜಮೀನು ಅಕ್ರಮವಾಗಿ ತೆಗೆದಿದ್ದಾರೆ",
      "ಕಬಳಿಕೆ",
      "ಅಕ್ರಮ",
      "ಆಕ್ರಮಣ",
      "encroachment",
      "trespass",
      "illegal possession",
      "kabalize",
      "land grabbed",
      "akrama kabalize",
      "kabja",
      "akrama",
    ],
    intro: "ಯಾರಾದರೂ ನಿಮ್ಮ ಜಮೀನನ್ನು ಅನುಮತಿಯಿಲ್ಲದೆ ತೆಗೆದುಕೊಂಡಿದ್ದರೆ, ಅದು ಕಾನೂನುಬಾಹಿರ.",
    whatToDo: "ಅತಿಕ್ರಮಣಕ್ಕಾಗಿ ಪೊಲೀಸ್ ದೂರು ನೀಡಿ ಮತ್ತು ತೆರವುಗೊಳಿಸಲು ಸಿವಿಲ್ ಪ್ರಕರಣವನ್ನು ಕೂಡ ದಾಖಲಿಸಿ.",
    documents: ["ಸ್ವಾಮ್ಯ ಸಾಬೀತು", "ಭೂಮಿ ದಾಖಲೆಗಳು", "ಅತಿಕ್ರಮಣದ ಫೋಟೋ/ವೀಡಿಯೋಗಳು"],
    lawyerType: "ಸಿವಿಲ್ + ಕ್ರಿಮಿನಲ್ ವಕೀಲ",
    cost: "₹20,000 – ₹1,50,000",
    timeRequired: "1–5 ವರ್ಷಗಳು",
    successRate: "ಮಧ್ಯಮ–ಹೆಚ್ಚು",
    tip: "ನಿಮ್ಮ ಆಸ್ತಿಯನ್ನು ಕಾನೂನುಬದ್ಧವಾಗಿ ಮರಳಿ ಪಡೆಯುವ ಪೂರ್ಣ ಹಕ್ಕು ನಿಮಗೆ ಇದೆ.",
  },
  {
    id: 3n,
    topicKey: "police_fir",
    icon: "👮",
    title: "ಪೊಲೀಸ್ FIR ದಾಖಲಿಸುತ್ತಿಲ್ಲ",
    keywords: [
      "FIR",
      "ಪೊಲೀಸ್",
      "ದೂರು",
      "ಪ್ರಕರಣ",
      "FIR ದಾಖಲಿಸುತ್ತಿಲ್ಲ",
      "ಪೊಲೀಸ್ ಸಹಾಯ ಮಾಡುತ್ತಿಲ್ಲ",
      "ದೂರು ದಾಖಲಿಸಿಲ್ಲ",
      "ಪೊಲೀಸ್ ನಿರಾಕರಿಸಿದ್ದಾರೆ",
      "ಪ್ರಕರಣ ದಾಖಲಿಸುತ್ತಿಲ್ಲ",
      "FIR ತೆಗೆದುಕೊಳ್ಳುತ್ತಿಲ್ಲ",
      "police",
      "fir",
      "complaint",
      "police nahi sunta",
      "shikayat nahi",
      "FIR not registered",
      "police refuse FIR",
      "police complaint reject",
    ],
    intro:
      "ಪೊಲೀಸರು ನಿಮ್ಮ FIR ದಾಖಲಿಸಲು ನಿರಾಕರಿಸಿದರೆ, ಚಿಂತಿಸಬೇಡಿ — ಕಾನೂನು ಸಂಪೂರ್ಣವಾಗಿ ನಿಮ್ಮ ಬೆಂಬಲದಲ್ಲಿದೆ.",
    whatToDo:
      "SP ಬಳಿ ಹೋಗಿ ಅಥವಾ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಮುಂದೆ ದೂರು ಸಲ್ಲಿಸಿ. ಅನೇಕ ರಾಜ್ಯಗಳಲ್ಲಿ ಆನ್‌ಲೈನ್ FIR ಕೂಡ ಸಾಧ್ಯ.",
    documents: ["ಲಿಖಿತ ದೂರು", "ಸಾಕ್ಷ್ಯ (ಫೋಟೋ, ಚಾಟ್)", "ಗುರುತಿನ ಚೀಟಿ"],
    lawyerType: "ಕ್ರಿಮಿನಲ್ ವಕೀಲ",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "ಕೆಲವು ದಿನಗಳು",
    successRate: "ಬಹಳ ಹೆಚ್ಚು",
    tip: "ಗಂಭೀರ ಅಪರಾಧಗಳಿಗೆ FIR ದಾಖಲಿಸುವುದು ಪೊಲೀಸರ ಕರ್ತವ್ಯ.",
  },
  {
    id: 4n,
    topicKey: "bail",
    icon: "⚖️",
    title: "ಜಾಮೀನು ಪ್ರಕ್ರಿಯೆ",
    keywords: [
      "ಜಾಮೀನು",
      "ಜೈಲಿನಿಂದ ಬಿಡುಗಡೆ",
      "ಬಂಧನ",
      "ಬಿಡುಗಡೆ",
      "ಜಾಮೀನು ಬೇಕು",
      "ಜೈಲು",
      "ಬಂಧಿಸಲಾಗಿದೆ",
      "ಬಿಡಿಸಿಕೊಳ್ಳಬೇಕು",
      "bail",
      "custody",
      "arrest",
      "jail",
      "jailu",
      "bail apply",
      "bail kaise mile",
      "jamanat",
      "release from jail",
    ],
    intro: "ಜಾಮೀನು ಎಂದರೆ ಪ್ರಕರಣ ಮುಂದುವರಿಯುವ ವೇಳೆ ತಾತ್ಕಾಲಿಕ ಬಿಡುಗಡೆ.",
    whatToDo: "ವಕೀಲರನ್ನು ನೇಮಿಸಿ ತಕ್ಷಣ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಜಾಮೀನು ಅರ್ಜಿ ಹಾಕಿ.",
    documents: ["FIR ಪ್ರತಿ", "ಗುರುತಿನ ಚೀಟಿ", "ಜಾಮೀನುದಾರರ ದಾಖಲೆ"],
    lawyerType: "ಕ್ರಿಮಿನಲ್ ವಕೀಲ",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "1 ದಿನ – ಕೆಲವು ವಾರಗಳು",
    successRate: "ಸಣ್ಣ ಅಪರಾಧಗಳಿಗೆ ಹೆಚ್ಚು",
    tip: "ತನಿಖೆಯಲ್ಲಿ ಸಹಕರಿಸಿ — ಜಾಮೀನು ಸಿಗುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚಾಗುತ್ತದೆ.",
  },
  {
    id: 5n,
    topicKey: "divorce",
    icon: "👩‍⚖️",
    title: "ವಿಚ್ಛೇದನ ಪ್ರಕ್ರಿಯೆ",
    keywords: [
      "ವಿಚ್ಛೇದನ",
      "ಮದುವೆ ರದ್ದು",
      "ಪತಿ ಪತ್ನಿ ವಿವಾದ",
      "ವಿಭಜನೆ",
      "ಮದುವೆ ಮುರಿಯಬೇಕು",
      "ತಲಾಕ್",
      "ವಿಚ್ಛೇದನ ಬೇಕು",
      "ಸಂಸಾರ ಮುರಿದಿದೆ",
      "divorce",
      "separation",
      "talak",
      "marriage problem",
      "husband wife problem",
      "mutual divorce",
      "maduve raddu",
      "vicchedana",
    ],
    intro: "ವಿಚ್ಛೇದನ ಪರಸ್ಪರ ಒಪ್ಪಿಗೆಯಿಂದ (ಸುಲಭ) ಅಥವಾ ವಿವಾದಾತ್ಮಕ (ದೀರ್ಘ) ಆಗಿರಬಹುದು.",
    whatToDo: "ಫ್ಯಾಮಿಲಿ ಕೋರ್ಟ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
    documents: ["ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ", "ಗುರುತಿನ ಚೀಟಿ", "ಆದಾಯ ದಾಖಲೆ", "ಸಾಕ್ಷ್ಯ (ವಿವಾದ ಇದ್ದರೆ)"],
    lawyerType: "ಫ್ಯಾಮಿಲಿ ವಕೀಲ",
    cost: "₹20,000 – ₹2,00,000",
    timeRequired: "6 ತಿಂಗಳು – 5 ವರ್ಷಗಳು",
    successRate: "ಕಾನೂನು ಆಧಾರ ಇದ್ದರೆ ಹೆಚ್ಚು",
    tip: "ಪರಸ್ಪರ ಒಪ್ಪಿಗೆ ವಿಚ್ಛೇದನ ಯಾವಾಗಲೂ ಸುಲಭ ಮತ್ತು ಕಡಿಮೆ ವೆಚ್ಚದಾಯಕ.",
  },
  {
    id: 6n,
    topicKey: "domestic_violence",
    icon: "👩",
    title: "ಗೃಹ ಹಿಂಸೆ",
    keywords: [
      "ಗೃಹ ಹಿಂಸೆ",
      "ಮನೆಯಲ್ಲಿ ಹೊಡೆಯುತ್ತಾರೆ",
      "ಗಂಡ ಹೊಡೆಯುತ್ತಾನೆ",
      "ಮಾನಸಿಕ ಕಿರುಕುಳ",
      "ಆರ್ಥಿಕ ಶೋಷಣೆ",
      "ದೈಹಿಕ ಹಿಂಸೆ",
      "ಹಿಂಸೆ",
      "ಕಿರುಕುಳ",
      "ಶೋಷಣೆ",
      "domestic violence",
      "abuse",
      "violence",
      "husband hitting",
      "DV case",
      "ghar mein maar",
      "gruha hinse",
      "mane hinse",
    ],
    intro: "ದೇಹಾತ್ಮಕ, ಮಾನಸಿಕ ಅಥವಾ ಆರ್ಥಿಕ ಹಿಂಸೆ ಕಾನೂನುಬಾಹಿರ.",
    whatToDo: "ಗೃಹ ಹಿಂಸೆ ಕಾಯ್ದೆಯಡಿ ದೂರು ನೀಡಿ ಅಥವಾ ಪೊಲೀಸರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    documents: ["ವೈದ್ಯಕೀಯ ವರದಿ", "ಸಾಕ್ಷ್ಯ (ಸಂದೇಶಗಳು, ಫೋಟೋ)", "ಸಾಕ್ಷಿದಾರರ ವಿವರ"],
    lawyerType: "ಫ್ಯಾಮಿಲಿ / ಕ್ರಿಮಿನಲ್ ವಕೀಲ",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "ತ್ವರಿತ ರಕ್ಷಣೆ ಸಾಧ್ಯ",
    successRate: "ಸಾಕ್ಷ್ಯ ಇದ್ದರೆ ಹೆಚ್ಚು",
    tip: "ರಕ್ಷಣೆ, ವಾಸ ಮತ್ತು ಭರಣೆ ಎಲ್ಲ ಪಡೆಯಬಹುದು.",
  },
  {
    id: 7n,
    topicKey: "salary",
    icon: "💼",
    title: "ಸಂಬಳ ಸಿಗದಿರುವುದು",
    keywords: [
      "ಸಂಬಳ",
      "ವೇತನ",
      "ಸಂಬಳ ಸಿಗಲಿಲ್ಲ",
      "ಕಂಪನಿ ಹಣ ಕೊಡಲಿಲ್ಲ",
      "ವೇತನ ಬರಲಿಲ್ಲ",
      "ನಿಯೋಜಕ ಹಣ ನೀಡಲಿಲ್ಲ",
      "ಸಂಬಳ ತಡವಾಗಿದೆ",
      "salary",
      "wages",
      "payment",
      "employer",
      "salary nahi mili",
      "company paisa nahi diya",
      "sambala silla",
      "vetana barlilla",
    ],
    intro: "ನಿಯೋಜಕರು ನಿಮ್ಮ ಸಂಬಳವನ್ನು ನಿರಾಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    whatToDo: "ಲೇಬರ್ ಕಮಿಷನರ್ ಬಳಿ ದೂರು ನೀಡಿ.",
    documents: ["ಆಫರ್ ಲೆಟರ್", "ಸಂಬಳ ಸ್ಲಿಪ್", "ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್ಮೆಂಟ್"],
    lawyerType: "ಲೇಬರ್ ವಕೀಲ",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "2–6 ತಿಂಗಳುಗಳು",
    successRate: "ಬಹಳ ಹೆಚ್ಚು",
    tip: "ಎಲ್ಲ ಉದ್ಯೋಗ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇಡಿ.",
  },
  {
    id: 8n,
    topicKey: "cheque_bounce",
    icon: "🏦",
    title: "ಚೆಕ್ ಬೌನ್ಸ್",
    keywords: [
      "ಚೆಕ್ ಬೌನ್ಸ್",
      "ಚೆಕ್ ವಾಪಸ್ ಬಂತು",
      "ಚೆಕ್ ಅಮಾನ್ಯ",
      "ಬ್ಯಾಂಕ್ ಚೆಕ್ ತಿರಸ್ಕರಿಸಿದೆ",
      "ಚೆಕ್ ಹಣ ಬರಲಿಲ್ಲ",
      "cheque",
      "check",
      "bounce",
      "cheque bounce",
      "check bounce",
      "cheque dishonour",
      "bank memo",
      "cheque return",
    ],
    intro: "ಚೆಕ್ ಬೌನ್ಸ್ ಒಂದು ಅಪರಾಧ.",
    whatToDo: "30 ದಿನಗಳಲ್ಲಿ ನೋಟಿಸ್ ನೀಡಿ, ನಂತರ ಪ್ರಕರಣ ಹೂಡಿ.",
    documents: ["ಚೆಕ್", "ಬ್ಯಾಂಕ್ ಮೆಮೊ", "ನೋಟಿಸ್ ಪ್ರತಿ"],
    lawyerType: "ಕ್ರಿಮಿನಲ್ / ಸಿವಿಲ್ ವಕೀಲ",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 ತಿಂಗಳು – 2 ವರ್ಷಗಳು",
    successRate: "ದಾಖಲೆ ಸರಿಯಾಗಿದ್ದರೆ ಹೆಚ್ಚು",
    tip: "ಯಾವಾಗಲೂ ವಹಿವಾಟಿನ ಸಾಕ್ಷ್ಯ ಇಡಿ.",
  },
  {
    id: 9n,
    topicKey: "online_fraud",
    icon: "🌐",
    title: "ಆನ್‌ಲೈನ್ ಮೋಸ",
    keywords: [
      "ಮೋಸ",
      "ಆನ್‌ಲೈನ್ ವಂಚನೆ",
      "ಹಣ ಕಳೆದು ಹೋಯಿತು",
      "UPI ಮೋಸ",
      "ಸೈಬರ್ ಅಪರಾಧ",
      "ಆನ್‌ಲೈನ್ ಮೋಸ",
      "ಹಣ ಕಟ್ ಆಯಿತು",
      "fraud",
      "online",
      "cyber",
      "scam",
      "UPI fraud",
      "online fraud",
      "paisa gaya",
      "hack",
      "bank fraud",
      "mosa",
      "cyber crime",
    ],
    intro: "ಹಣ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಳವಾಗಿದ್ದರೆ ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ.",
    whatToDo: "1930 ಗೆ ಕರೆ ಮಾಡಿ + ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ವರದಿ ಮಾಡಿ.",
    documents: ["ಟ್ರಾನ್ಸಾಕ್ಷನ್ ಪ್ರೂಫ್", "ಸ್ಕ್ರೀನ್‌ಶಾಟ್", "ಬ್ಯಾಂಕ್ ವಿವರ"],
    lawyerType: "ಸೈಬರ್ ವಕೀಲ (ಐಚ್ಛಿಕ)",
    cost: "ಉಚಿತ ದೂರು",
    timeRequired: "ತಕ್ಷಣ ಕ್ರಮ ಅಗತ್ಯ",
    successRate: "ವೇಗ ಅನುಸರಿಸಿ ಮಧ್ಯಮ",
    tip: "ಕೆಲವು ಗಂಟೆಗಳಲ್ಲಿ ವರದಿ ಮಾಡಿದರೆ ಚೇತರಿಕೆ ಸಾಧ್ಯ.",
  },
  {
    id: 10n,
    topicKey: "consumer",
    icon: "🛍️",
    title: "ಗ್ರಾಹಕ ದೂರು",
    keywords: [
      "ಗ್ರಾಹಕ ದೂರು",
      "ಕೆಟ್ಟ ಸಾಮಾನು",
      "ಹಣ ವಾಪಸ್ ಬೇಕು",
      "ಉತ್ಪನ್ನ ಹಾಳಾಗಿದೆ",
      "ರಿಫಂಡ್ ಬೇಕು",
      "ಕಂಪನಿ ಹಣ ಹಿಂತಿರುಗಿಸುತ್ತಿಲ್ಲ",
      "consumer",
      "product",
      "refund",
      "defective",
      "consumer complaint",
      "product kharab",
      "paisa wapas",
      "ketta samanu",
    ],
    intro: "ನಿಮಗೆ ರಿಫಂಡ್ ಅಥವಾ ಬದಲಾವಣೆ ಪಡೆಯುವ ಹಕ್ಕು ಇದೆ.",
    whatToDo: "ಕನ್ಸ್ಯೂಮರ್ ಕೋರ್ಟ್‌ನಲ್ಲಿ ದೂರು ನೀಡಿ.",
    documents: ["ಬಿಲ್/ಇನ್‌ವಾಯ್ಸ್", "ವಾರಂಟಿ", "ದೂರು ಸಾಕ್ಷ್ಯ"],
    lawyerType: "ಕನ್ಸ್ಯೂಮರ್ ವಕೀಲ (ಐಚ್ಛಿಕ)",
    cost: "₹1,000 – ₹20,000",
    timeRequired: "3–12 ತಿಂಗಳುಗಳು",
    successRate: "ಹೆಚ್ಚು",
    tip: "ಸಣ್ಣ ಪ್ರಕರಣಗಳಿಗೆ ವಕೀಲ ಬೇಕಿಲ್ಲ.",
  },
  {
    id: 11n,
    topicKey: "builder",
    icon: "🏠",
    title: "ಬಿಲ್ಡರ್ ಮೋಸ",
    keywords: [
      "ಬಿಲ್ಡರ್ ಮೋಸ",
      "ಮನೆ ಕೊಡಲಿಲ್ಲ",
      "ಫ್ಲ್ಯಾಟ್ ಸಿಕ್ಕಿಲ್ಲ",
      "ಬಿಲ್ಡರ್ ತಡ ಮಾಡಿದ",
      "ಯೋಜನೆ ತಡ",
      "ಮನೆ ಪೊಸೆಷನ್ ಸಿಕ್ಕಿಲ್ಲ",
      "builder",
      "RERA",
      "possession",
      "flat",
      "ಮನೆ",
      "builder fraud",
      "flat delay",
      "builder ne ghar nahi diya",
      "mane kodlilla",
      "rera complaint",
    ],
    intro: "ಬಿಲ್ಡರ್ ವಿಳಂಬ ಕಾನೂನುಬಾಹಿರ.",
    whatToDo: "RERA ನಲ್ಲಿ ದೂರು ನೀಡಿ.",
    documents: ["ಒಪ್ಪಂದ", "ಪಾವತಿ ಸಾಕ್ಷ್ಯ", "ಬಿಲ್ಡರ್ ಪತ್ರ ವ್ಯವಹಾರ"],
    lawyerType: "ಪ್ರಾಪರ್ಟಿ ವಕೀಲ",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 ತಿಂಗಳು – 3 ವರ್ಷಗಳು",
    successRate: "RERA ನಲ್ಲಿ ಹೆಚ್ಚು",
    tip: "RERA ಸಿವಿಲ್ ಕೋರ್ಟ್‌ಗಿಂತ ವೇಗವಾಗಿದೆ.",
  },
  {
    id: 12n,
    topicKey: "fundamental_rights",
    icon: "⚖️",
    title: "ಮೂಲಭೂತ ಹಕ್ಕು ಉಲ್ಲಂಘನೆ",
    keywords: [
      "ಮೂಲಭೂತ ಹಕ್ಕು",
      "ಅಧಿಕಾರ ಉಲ್ಲಂಘನೆ",
      "ಸರ್ಕಾರ ತಪ್ಪು ಮಾಡಿದೆ",
      "ಸಂವಿಧಾನ ಹಕ್ಕು",
      "ಮೂಲ ಹಕ್ಕು",
      "ಹಕ್ಕು ಮೀರಲಾಗಿದೆ",
      "ಹಕ್ಕು",
      "ಉಲ್ಲಂಘನೆ",
      "rights",
      "fundamental",
      "violation",
      "constitution",
      "writ petition",
      "rights violation",
      "government wrong",
      "adhikara ullangane",
      "mula hakku",
      "sarkar tappu",
    ],
    intro: "ಸರ್ಕಾರ ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ಉಲ್ಲಂಘಿಸಿದರೆ, ನೀವು ನೇರವಾಗಿ ನ್ಯಾಯಾಲಯಕ್ಕೆ ಹೋಗಬಹುದು.",
    whatToDo: "ರಿಟ್ ಅರ್ಜಿ ಹಾಕಿ.",
    documents: ["ಉಲ್ಲಂಘನೆ ಸಾಕ್ಷ್ಯ", "ಗುರುತಿನ ಚೀಟಿ", "ಪೋಷಕ ಸಾಕ್ಷ್ಯ"],
    lawyerType: "ಸಾಂವಿಧಾನಿಕ ವಕೀಲ",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "ಕೆಲವು ವಾರಗಳು – ತಿಂಗಳುಗಳು",
    successRate: "ಪ್ರಕರಣದ ಬಲ ಅನುಸರಿಸಿ",
    tip: "ಕೋರ್ಟ್ ಹಕ್ಕು ಉಲ್ಲಂಘನೆಯನ್ನು ಗಂಭೀರವಾಗಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ — ಎಲ್ಲ ದಾಖಲಿಸಿ.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_ENTRIES: ChatbotEntry[] = [
  {
    id: 1n,
    topicKey: "land_dispute",
    icon: "🏞️",
    title: "Land Dispute / Ownership",
    keywords: [
      "land",
      "property",
      "ownership",
      "dispute",
      "plot",
      "deed",
      "title",
      "encumbrance",
    ],
    intro:
      "This usually happens when two people claim the same land or ownership is unclear. This is very common in India.",
    whatToDo:
      "Start by checking your property documents and then file a case in the civil court for ownership declaration.",
    documents: [
      "Sale deed / Title deed",
      "Encumbrance certificate",
      "Property tax receipts",
      "Any agreement papers",
    ],
    lawyerType: "Civil / Property Lawyer",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "2–10 years",
    successRate: "Good if documents are clear",
    tip: "Always verify land records before buying to avoid future disputes.",
  },
  {
    id: 2n,
    topicKey: "fir_police",
    icon: "👮",
    title: "Police Not Filing FIR",
    keywords: [
      "fir",
      "police",
      "complaint",
      "station",
      "report",
      "filing",
      "refuse",
      "refused",
    ],
    intro:
      "If police refuse to file your FIR, it is your legal right to escalate.",
    whatToDo:
      "Go to the Superintendent of Police (SP), or file a complaint before the Magistrate under Section 156(3) CrPC.",
    documents: [
      "Written complaint",
      "Proof (photos, messages, etc.)",
      "ID proof",
    ],
    lawyerType: "Criminal Lawyer",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "Few days to a few weeks",
    successRate: "Very high",
    tip: "You can also file an FIR online in many states via the state police portal.",
  },
  {
    id: 3n,
    topicKey: "bail",
    icon: "⚖️",
    title: "Bail Process",
    keywords: [
      "bail",
      "custody",
      "arrest",
      "arrested",
      "jail",
      "release",
      "interim",
      "anticipatory",
    ],
    intro:
      "Bail means temporary release from custody. It is not freedom from the case.",
    whatToDo:
      "Hire a criminal lawyer immediately and apply for bail in the nearest court.",
    documents: ["FIR copy", "ID proof", "Surety documents"],
    lawyerType: "Criminal Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "1 day to a few weeks",
    successRate: "High for minor offences",
    tip: "Cooperating with the investigation increases your chances of getting bail.",
  },
  {
    id: 4n,
    topicKey: "divorce",
    icon: "👩‍⚖️",
    title: "Divorce Procedure",
    keywords: [
      "divorce",
      "separation",
      "marriage",
      "wife",
      "husband",
      "mutual",
      "contested",
      "family court",
      "alimony",
      "file a divorce",
      "want divorce",
      "getting divorce",
    ],
    intro:
      "Divorce can be mutual (faster) or contested (longer). Mutual divorce saves time and reduces stress.",
    whatToDo:
      "File a divorce petition in the family court. Hiring a family lawyer is strongly recommended.",
    documents: [
      "Marriage certificate",
      "Address proof",
      "Evidence (if contested)",
      "Income details",
    ],
    lawyerType: "Family Lawyer",
    cost: "₹20,000 – ₹2,00,000",
    timeRequired: "Mutual: 6 months–1 year | Contested: 2–5 years",
    successRate: "Very high if legally valid grounds exist",
    tip: "Mutual divorce is always smoother, cheaper, and less emotionally draining.",
  },
  {
    id: 5n,
    topicKey: "domestic_violence",
    icon: "🛡️",
    title: "Domestic Violence",
    keywords: [
      "domestic",
      "violence",
      "abuse",
      "harassment",
      "beating",
      "threat",
      "dowry",
    ],
    intro:
      "You are legally protected. Physical, emotional, and financial abuse are all punishable under Indian law.",
    whatToDo:
      "File a complaint under the Protection of Women from Domestic Violence Act or approach the nearest police women's cell.",
    documents: [
      "Medical reports (if any)",
      "Messages / evidence",
      "Witness details",
    ],
    lawyerType: "Family / Criminal Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "Immediate protection orders are possible",
    successRate: "High if evidence exists",
    tip: "You can get protection orders, residence rights, and maintenance through the court.",
  },
  {
    id: 6n,
    topicKey: "salary",
    icon: "💼",
    title: "Salary Not Paid",
    keywords: [
      "salary",
      "wages",
      "payment",
      "employer",
      "company",
      "job",
      "work",
      "labour",
      "fired",
      "terminated",
    ],
    intro: "Employers cannot legally withhold your salary.",
    whatToDo:
      "File a complaint with the Labour Commissioner or approach the Labour Court.",
    documents: ["Offer letter", "Salary slips", "Bank statements"],
    lawyerType: "Labour Lawyer",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "2–6 months",
    successRate: "Very high",
    tip: "Always keep all employment documents safely.",
  },
  {
    id: 7n,
    topicKey: "cheque_bounce",
    icon: "🏦",
    title: "Cheque Bounce",
    keywords: [
      "cheque",
      "check",
      "bounce",
      "dishonour",
      "neft",
      "rtgs",
      "loan",
    ],
    intro:
      "A bounced cheque is a criminal offence under Section 138 of the Negotiable Instruments Act.",
    whatToDo:
      "Send a legal notice to the defaulter within 30 days of receiving the bank memo, then file a case.",
    documents: ["Bounced cheque", "Bank memo", "Legal notice copy"],
    lawyerType: "Criminal / Civil Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 months – 2 years",
    successRate: "High if all documents are in order",
    tip: "Always keep proof of every financial transaction.",
  },
  {
    id: 8n,
    topicKey: "consumer",
    icon: "🛍️",
    title: "Consumer / Defective Product",
    keywords: [
      "consumer",
      "product",
      "defective",
      "refund",
      "service",
      "fraud",
      "cheated",
      "amazon",
      "flipkart",
    ],
    intro:
      "If you received a bad product or poor service, you can claim a full refund or compensation.",
    whatToDo:
      "File a complaint in consumer court. You can also file online at edaakhil.nic.in.",
    documents: ["Bill / Invoice", "Warranty card", "Complaint proof"],
    lawyerType: "Consumer Lawyer (optional)",
    cost: "₹1,000 – ₹20,000",
    timeRequired: "3–12 months",
    successRate: "High",
    tip: "For small claims below ₹50 lakh, you do not need a lawyer in consumer court.",
  },
  {
    id: 9n,
    topicKey: "cyber_fraud",
    icon: "🌐",
    title: "Online Fraud / Cyber Crime",
    keywords: [
      "cyber",
      "online",
      "fraud",
      "scam",
      "hack",
      "otp",
      "upi",
      "phishing",
      "money",
      "stolen",
      "internet",
    ],
    intro:
      "If money was stolen online, act FAST. Time is critical for recovery.",
    whatToDo:
      "Immediately call the cyber helpline 1930, then report online at cybercrime.gov.in.",
    documents: [
      "Transaction details",
      "Screenshots of fraud",
      "Bank account information",
    ],
    lawyerType: "Cyber Lawyer (optional)",
    cost: "Mostly free to file a complaint",
    timeRequired: "Immediate action needed",
    successRate: "Medium (depends on how quickly you report)",
    tip: "Report within hours of the fraud for the best chance of recovering your money.",
  },
  {
    id: 10n,
    topicKey: "builder_rera",
    icon: "🏠",
    title: "Builder Not Giving Possession",
    keywords: [
      "builder",
      "possession",
      "flat",
      "apartment",
      "rera",
      "construction",
      "delay",
      "project",
      "housing",
      "developer",
    ],
    intro:
      "Builder delays are common in India, but the law strongly protects buyers under RERA.",
    whatToDo:
      "File a complaint in the RERA authority of your state or approach the consumer court.",
    documents: ["Sale agreement", "Payment receipts", "Builder communication"],
    lawyerType: "Property Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 months – 3 years",
    successRate: "High in RERA",
    tip: "RERA is specifically designed for such disputes and is much faster than civil courts.",
  },
  {
    id: 11n,
    topicKey: "fundamental_rights",
    icon: "⚖️",
    title: "Rights Violation by Authority",
    keywords: [
      "rights",
      "fundamental",
      "authority",
      "government",
      "violation",
      "constitutional",
      "writ",
      "high court",
      "supreme court",
    ],
    intro:
      "If your basic constitutional rights are violated by any authority, you can directly approach the High Court or Supreme Court.",
    whatToDo:
      "File a writ petition in the High Court (Article 226) or Supreme Court (Article 32) of India.",
    documents: [
      "Proof of rights violation",
      "Identity proof",
      "Supporting evidence",
    ],
    lawyerType: "Constitutional Lawyer",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "A few weeks to several months",
    successRate: "Depends on strength of evidence",
    tip: "Courts take rights violations very seriously. Document everything carefully.",
  },
];

type SpeechRecognitionEvent = {
  results: { [key: number]: { [key: number]: { transcript: string } } };
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

function matchEntry(
  query: string,
  entries: ChatbotEntry[],
): ChatbotEntry | null {
  if (!query.trim() || entries.length === 0) return null;
  const lower = query.toLowerCase();
  for (const entry of entries) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) return entry;
    }
  }
  return null;
}

// For Kannada users typing in English, cross-match English keywords to Kannada entries
const KANNADA_ENGLISH_KEYWORD_MAP: Record<string, string> = {
  land: "ಭೂಮಿ",
  property: "ಆಸ್ತಿ",
  ownership: "ಹಕ್ಕು",
  dispute: "ವಿವಾದ",
  encroachment: "ಕಬಳಿಕೆ",
  trespass: "ಅಕ್ರಮ",
  fir: "FIR",
  police: "ಪೊಲೀಸ್",
  bail: "ಜಾಮೀನು",
  arrest: "ಬಂಧನ",
  divorce: "ವಿಚ್ಛೇದನ",
  separation: "ವಿಚ್ಛೇದನ",
  "domestic violence": "ಗೃಹ ಹಿಂಸೆ",
  abuse: "ಹಿಂಸೆ",
  salary: "ಸಂಬಳ",
  wages: "ಸಂಬಳ",
  payment: "ಸಂಬಳ",
  cheque: "ಚೆಕ್",
  check: "ಚೆಕ್",
  bounce: "ಬೌನ್ಸ್",
  fraud: "ಮೋಸ",
  "online fraud": "ಮೋಸ",
  cyber: "ಸೈಬರ್",
  scam: "ಮೋಸ",
  consumer: "ಗ್ರಾಹಕ",
  refund: "ರಿಫಂಡ್",
  builder: "ಬಿಲ್ಡರ್",
  rera: "ಬಿಲ್ಡರ್",
  possession: "ಮನೆ",
  rights: "ಹಕ್ಕು",
  fundamental: "ಮೂಲಭೂತ",
  violation: "ಉಲ್ಲಂಘನೆ",
  // Romanized Kannada additions
  bhoomi: "ಭೂಮಿ",
  jameen: "ಜಮೀನು",
  jamin: "ಜಮೀನು",
  sampatti: "ಆಸ್ತಿ",
  kabalize: "ಅಕ್ರಮ ಕಬಳಿಕೆ",
  akrama: "ಅಕ್ರಮ ಕಬಳಿಕೆ",
  "FIR nahi": "FIR ದಾಖಲಿಸುತ್ತಿಲ್ಲ",
  "shikayat nahi": "ದೂರು",
  jailu: "ಜಾಮೀನು",
  jamanat: "ಜಾಮೀನು",
  talak: "ವಿಚ್ಛೇದನ",
  maduve: "ವಿಚ್ಛೇದನ",
  "gruha hinse": "ಗೃಹ ಹಿಂಸೆ",
  "mane hinse": "ಗೃಹ ಹಿಂಸೆ",
  "ganda hodeyuttane": "ಗೃಹ ಹಿಂಸೆ",
  sambala: "ಸಂಬಳ",
  vetana: "ಸಂಬಳ",
  "cheque bounce": "ಚೆಕ್ ಬೌನ್ಸ್",
  "check bounce": "ಚೆಕ್ ಬೌನ್ಸ್",
  "online mosa": "ಮೋಸ",
  "cyber crime": "ಮೋಸ",
  "UPI fraud": "ಮೋಸ",
  "ketta samanu": "ಗ್ರಾಹಕ ದೂರು",
  "paisa wapas": "ಗ್ರಾಹಕ ದೂರು",
  "mane kodlilla": "ಬಿಲ್ಡರ್ ಮೋಸ",
  "flat sigilla": "ಬಿಲ್ಡರ್ ಮೋಸ",
  adhikara: "ಮೂಲಭೂತ ಹಕ್ಕು",
  "mula hakku": "ಮೂಲಭೂತ ಹಕ್ಕು",
  "sarkar tappu": "ಮೂಲಭೂತ ಹಕ್ಕು",
};

function matchEntryKannada(
  query: string,
  entries: ChatbotEntry[],
): ChatbotEntry | null {
  const direct = matchEntry(query, entries);
  if (direct) return direct;
  const lower = query.toLowerCase();
  for (const [engKw, knKw] of Object.entries(KANNADA_ENGLISH_KEYWORD_MAP)) {
    if (lower.includes(engKw)) {
      return matchEntry(knKw, entries) ?? null;
    }
  }
  return null;
}

// For Hindi users typing in English, cross-match English keywords to Hindi entries
const HINDI_ENGLISH_KEYWORD_MAP: Record<string, string> = {
  land: "जमीन",
  property: "जमीन",
  ownership: "स्वामित्व",
  dispute: "विवाद",
  encroachment: "अवैध कब्जा",
  trespass: "अवैध कब्जा",
  zameen: "जमीन",
  zamini: "जमीन",
  jamin: "जमीन",
  jameen: "जमीन",
  bhoomi: "जमीन",
  bhumi: "जमीन",
  jagah: "जमीन",
  pareshani: "विवाद",
  vivad: "विवाद",
  sampatti: "जमीन",
  kabza: "अवैध कब्जा",
  qabza: "अवैध कब्जा",
  talak: "तलाक",
  talaak: "तलाक",
  jamaanat: "जमानत",
  zamanat: "जमानत",
  giraftari: "गिरफ्तारी",
  thana: "FIR",
  shikayat: "शिकायत",
  tankhwah: "वेतन",
  naukri: "वेतन",
  makaan: "बिल्डर",
  adhikar: "अधिकार",
  fir: "FIR",
  police: "पुलिस",
  bail: "जमानत",
  arrest: "गिरफ्तारी",
  jail: "जेल",
  divorce: "तलाक",
  separation: "तलाक",
  "domestic violence": "घरेलू हिंसा",
  abuse: "घरेलू हिंसा",
  salary: "वेतन",
  wages: "वेतन",
  payment: "वेतन",
  cheque: "चेक",
  check: "चेक",
  bounce: "बाउंस",
  "online fraud": "ऑनलाइन धोखाधड़ी",
  cyber: "ऑनलाइन",
  scam: "धोखाधड़ी",
  consumer: "उपभोक्ता",
  refund: "उपभोक्ता",
  builder: "बिल्डर",
  rera: "बिल्डर",
  possession: "बिल्डर",
  rights: "अधिकार",
  fundamental: "मौलिक",
  writ: "अधिकार",
  "jameen vivad": "जमीन",
  "zameen dispute": "जमीन",
  "jameen ka jhagda": "जमीन",
  "ownership issue": "स्वामित्व",
  "zameen kiska": "जमीन",
  "jamin vivad": "जमीन",
  "avaidh kabja": "अवैध कब्जा",
  "illegal possession": "अवैध कब्जा",
  "kabza problem": "अवैध कब्जा",
  "kisi ne zameen": "अवैध कब्जा",
  "zabardasti kabza": "अवैध कब्जा",
  "kabja ka case": "अवैध कब्जा",
  "jameen par kabja": "अवैध कब्जा",
  "fir nahi": "FIR",
  "police complaint reject": "FIR",
  "fir kaise": "FIR",
  "police refuse": "FIR",
  "fir ka problem": "FIR",
  "jamanat kaise": "जमानत",
  "bail kaise": "जमानत",
  "jail se bahar": "जमानत",
  "bail apply": "जमानत",
  "talak kaise": "तलाक",
  "husband wife problem": "तलाक",
  "mutual divorce": "तलाक",
  "shadi todna": "तलाक",
  "divorce kaise": "तलाक",
  "pati maar": "घरेलू हिंसा",
  "ghar me hinsa": "घरेलू हिंसा",
  "domestic violence complaint": "घरेलू हिंसा",
  "abuse case": "घरेलू हिंसा",
  "ghar ka torture": "घरेलू हिंसा",
  "dv case": "घरेलू हिंसा",
  "salary nahi": "वेतन",
  "company ne paisa nahi": "वेतन",
  "employer salary": "वेतन",
  "salary delay": "वेतन",
  "paisa nahi mila job": "वेतन",
  "cheque bounce case": "चेक",
  "cheque return": "चेक",
  "paisa nahi mila cheque": "चेक",
  "cheque dishonour": "चेक",
  "check bounce kya": "चेक",
  "paise kat gaye": "ऑनलाइन धोखाधड़ी",
  "upi fraud": "ऑनलाइन धोखाधड़ी",
  "scam ho gaya": "ऑनलाइन धोखाधड़ी",
  "online cheating": "ऑनलाइन धोखाधड़ी",
  "bank fraud": "ऑनलाइन धोखाधड़ी",
  "product kharab": "उपभोक्ता",
  "refund chahiye": "उपभोक्ता",
  "online shopping problem": "उपभोक्ता",
  "paisa wapas": "उपभोक्ता",
  "builder fraud": "बिल्डर",
  "flat possession delay": "बिल्डर",
  "builder ne ghar nahi": "बिल्डर",
  "property delay": "बिल्डर",
  "flat delay": "बिल्डर",
  "fundamental rights violation": "अधिकार",
  "rights violation": "अधिकार",
  "government against": "अधिकार",
  "writ petition": "अधिकार",
  "court jana": "अधिकार",
  "adhikar ka ullanghan": "अधिकार",
};

function matchEntryHindi(
  query: string,
  entries: ChatbotEntry[],
): ChatbotEntry | null {
  // First try direct match (works for Hindi and English keywords in HINDI_ENTRIES)
  const direct = matchEntry(query, entries);
  if (direct) return direct;
  // Fallback: try cross-language keyword translation
  const lower = query.toLowerCase();
  for (const [engKw, hindiKw] of Object.entries(HINDI_ENGLISH_KEYWORD_MAP)) {
    if (lower.includes(engKw)) {
      return matchEntry(hindiKw, entries) ?? null;
    }
  }
  return null;
}

interface VoiceAssistantProps {
  onBack: () => void;
}

export function VoiceAssistant({ onBack }: VoiceAssistantProps) {
  const { t } = useTranslation();
  const { actor, isFetching } = useActor();
  const langCode = t.welcome_speech_lang;
  const disclaimer = DISCLAIMERS[langCode] ?? DISCLAIMERS["en-IN"];
  const isHindi = langCode === "hi-IN";
  const isKannada = langCode === "kn-IN";

  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [matchedEntry, setMatchedEntry] = useState<ChatbotEntry | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const shouldStopRef = useRef<boolean>(false);

  const splitIntoChunks = (text: string, maxLen = 180): string[] => {
    const chunks: string[] = [];
    let remaining = text.trim();
    while (remaining.length > maxLen) {
      let splitAt = remaining.lastIndexOf(". ", maxLen);
      if (splitAt < 50) splitAt = remaining.lastIndexOf(" ", maxLen);
      if (splitAt < 0) splitAt = maxLen;
      chunks.push(remaining.slice(0, splitAt + 1).trim());
      remaining = remaining.slice(splitAt + 1).trim();
    }
    if (remaining.length > 0) chunks.push(remaining);
    return chunks;
  };

  const playChunks = (chunks: string[], index: number) => {
    if (shouldStopRef.current || index >= chunks.length) {
      if (!shouldStopRef.current) setIsSpeaking(false);
      return;
    }
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(chunks[index])}`;
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.play().catch(() => {
      setIsSpeaking(false);
    });
    audio.onended = () => {
      if (!shouldStopRef.current) playChunks(chunks, index + 1);
    };
    audio.onerror = () => {
      setIsSpeaking(false);
    };
  };

  const { data: entries = [], isLoading } = useQuery<ChatbotEntry[]>({
    queryKey: ["chatbotEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getChatbotEntries();
    },
    enabled: !!actor && !isFetching,
  });

  // Choose the right entries based on language
  const baseEntries = isHindi
    ? HINDI_ENTRIES
    : isKannada
      ? KANNADA_ENTRIES
      : entries.length > 0
        ? entries
        : FALLBACK_ENTRIES;
  const activeEntries = baseEntries;

  const stopCurrentSpeech = () => {
    shouldStopRef.current = true;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const speakEntry = (entry: ChatbotEntry) => {
    stopCurrentSpeech();
    shouldStopRef.current = false;

    const disclaimer = DISCLAIMERS[langCode] || DISCLAIMERS["en-IN"];
    const docsList = entry.documents.join(", ");

    // Use language-native labels so TTS sounds natural
    const docsLbl = isHindi
      ? "आवश्यक दस्तावेज"
      : isKannada
        ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು"
        : "Documents needed";
    const lawyerLbl = isHindi
      ? "वकील का प्रकार"
      : isKannada
        ? "ವಕೀಲ ಪ್ರಕಾರ"
        : "Lawyer type";
    const costLbl = isHindi
      ? "अनुमानित लागत"
      : isKannada
        ? "ಅಂದಾಜು ವೆಚ್ಚ"
        : "Estimated cost";
    const timeLbl = isHindi
      ? "आवश्यक समय"
      : isKannada
        ? "ಅಗತ್ಯ ಸಮಯ"
        : "Time required";
    const successLbl = isHindi
      ? "सफलता दर"
      : isKannada
        ? "ಯಶಸ್ಸಿನ ಪ್ರಮಾಣ"
        : "Success rate";
    const tipLbl = isHindi ? "सुझाव" : isKannada ? "ಸಲಹೆ" : "Tip";

    const fullText = [
      entry.intro,
      entry.whatToDo,
      `${docsLbl}: ${docsList}`,
      `${lawyerLbl}: ${entry.lawyerType}`,
      `${costLbl}: ${entry.cost}`,
      `${timeLbl}: ${entry.timeRequired}`,
      `${successLbl}: ${entry.successRate}`,
      `${tipLbl}: ${entry.tip}`,
      disclaimer,
    ].join(". ");

    const chunks = splitIntoChunks(fullText, 180);
    setIsSpeaking(true);
    playChunks(chunks, 0);
  };

  const toggleSpeak = (entry: ChatbotEntry) => {
    if (isSpeaking) {
      stopCurrentSpeech();
    } else {
      speakEntry(entry);
    }
  };

  const processQuery = (query: string) => {
    stopCurrentSpeech();
    const found = isHindi
      ? matchEntryHindi(query, HINDI_ENTRIES)
      : isKannada
        ? matchEntryKannada(query, KANNADA_ENTRIES)
        : matchEntry(query, activeEntries);
    if (found) {
      setMatchedEntry(found);
      setNoMatch(false);
    } else {
      setMatchedEntry(null);
      setNoMatch(true);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setTranscript(textInput);
    processQuery(textInput);
  };

  const handleTopicClick = (entry: ChatbotEntry) => {
    setTranscript(entry.title);
    setTextInput(entry.title);
    setMatchedEntry(entry);
    setNoMatch(false);
    stopCurrentSpeech();
  };

  const handleReset = () => {
    stopCurrentSpeech();
    setMatchedEntry(null);
    setNoMatch(false);
    setTranscript("");
    setTextInput("");
  };

  const startListening = () => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = langCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setTextInput(result);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      if (recognitionRef.current) {
        const lastTranscript = textInput;
        if (lastTranscript) processQuery(lastTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const searchPlaceholder = isHindi
    ? "अपनी कानूनी समस्या यहाँ लिखें (हिंदी या English में)..."
    : isKannada
      ? "ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆ ಇಲ್ಲಿ ಬರೆಯಿರಿ (ಕನ್ನಡ ಅಥವಾ English ನಲ್ಲಿ)..."
      : "Describe your legal problem...";

  const browseTopicsLabel = isHindi
    ? "विषय चुनें"
    : isKannada
      ? "ವಿಷಯ ಆರಿಸಿ"
      : "Browse Topics";
  const otherTopicsLabel = isHindi
    ? "अन्य विषय"
    : isKannada
      ? "ಇತರ ವಿಷಯಗಳು"
      : "Other Topics";
  const whatToDoLabel = isHindi
    ? "👉 क्या करें"
    : isKannada
      ? "👉 ಏನು ಮಾಡಬೇಕು"
      : "👉 What to do";
  const docsLabel = isHindi
    ? "📄 आवश्यक दस्तावेज"
    : isKannada
      ? "📄 ಅಗತ್ಯ ದಾಖಲೆಗಳು"
      : "📄 Documents needed";
  const lawyerLabel = isHindi
    ? "👨‍⚖️ वकील"
    : isKannada
      ? "👨‍⚖️ ವಕೀಲ"
      : "👨‍⚖️ Lawyer type";
  const costLabel = isHindi ? "💰 लागत" : isKannada ? "💰 ವೆಚ್ಚ" : "💰 Cost";
  const timeLabel = isHindi ? "⏳ समय" : isKannada ? "⏳ ಸಮಯ" : "⏳ Time";
  const successLabel = isHindi
    ? "📊 सफलता दर"
    : isKannada
      ? "📊 ಯಶಸ್ಸಿನ ಪ್ರಮಾಣ"
      : "📊 Success rate";
  const tipLabel = isHindi ? "💡 सुझाव" : isKannada ? "💡 ಸಲಹೆ" : "💡 Tip";
  const hearLabel = isHindi ? "🔊 सुनें" : isKannada ? "🔊 ಕೇಳಿ" : "🔊 Hear";
  const stopLabel = isHindi ? "रोकें" : isKannada ? "ನಿಲ್ಲಿಸಿ" : "Stop";
  const connectLabel = isHindi
    ? "WhatsApp पर वकील से जुड़ें"
    : isKannada
      ? "WhatsApp ನಲ್ಲಿ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ"
      : "Connect with a Real Lawyer on WhatsApp";
  const noMatchText = isHindi
    ? "हमें सीधा जवाब नहीं मिला। WhatsApp पर अपनी समस्या बताएं — हमारी टीम मदद करेगी।"
    : isKannada
      ? "ನಮಗೆ ನೇರ ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. WhatsApp ನಲ್ಲಿ ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ — ನಮ್ಮ ತಂಡ ಸಹಾಯ ಮಾಡುತ್ತದೆ."
      : "We couldn't find a direct answer. Please describe your problem on WhatsApp and our legal team will help you.";
  const chatOnWhatsApp = isHindi
    ? "WhatsApp पर चैट करें"
    : isKannada
      ? "WhatsApp ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ"
      : "Chat on WhatsApp";

  return (
    <div className="min-h-screen screen-enter" style={{ background: NAVY_BG }}>
      <header
        style={{
          background: "rgba(17,25,55,0.95)",
          borderBottom: `1px solid ${BORDER}`,
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          type="button"
          data-ocid="voice_assistant.back.button"
          onClick={() => {
            stopCurrentSpeech();
            onBack();
          }}
          style={{
            color: "rgba(255,255,255,0.6)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <VakyomLogo size={36} />
        <span
          className="font-display font-bold"
          style={{ color: GOLD, fontSize: "1.1rem" }}
        >
          {t.talk_to_vakyom}
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Input
              data-ocid="voice_assistant.search_input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
              placeholder={searchPlaceholder}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${BORDER}`,
                color: "white",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
              }}
            />
          </div>
          <Button
            data-ocid="voice_assistant.submit_button"
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            style={{
              background: "rgba(212,175,55,0.9)",
              color: "#0a0f1e",
              border: "none",
              borderRadius: "12px",
              padding: "0 1rem",
              fontWeight: 700,
            }}
          >
            <Send size={16} />
          </Button>
          <button
            type="button"
            data-ocid="voice_assistant.mic.toggle"
            onClick={isListening ? stopListening : startListening}
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: isListening
                ? "rgba(239,68,68,0.2)"
                : "rgba(212,175,55,0.15)",
              border: `1px solid ${isListening ? "rgba(239,68,68,0.5)" : BORDER}`,
              color: isListening ? "#f87171" : GOLD,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        {/* Transcript indicator */}
        {transcript && (
          <div
            style={{
              background: "rgba(212,175,55,0.08)",
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              padding: "0.5rem 1rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              &ldquo;{transcript}&rdquo;
            </span>
            <button
              type="button"
              data-ocid="voice_assistant.reset.button"
              onClick={handleReset}
              style={{
                color: "rgba(255,255,255,0.35)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && entries.length === 0 && !isHindi && !isKannada && (
          <div
            data-ocid="voice_assistant.loading_state"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.8rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            {isHindi
              ? "नवीनतम उत्तर लोड हो रहे हैं..."
              : isKannada
                ? "ಇತ್ತೀಚಿನ ಉತ್ತರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                : "Syncing latest responses..."}
          </div>
        )}

        {/* Topic quick-buttons */}
        {!matchedEntry && !noMatch && activeEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              {browseTopicsLabel}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {activeEntries.map((entry, i) => (
                <button
                  key={entry.topicKey}
                  type="button"
                  data-ocid={`voice_assistant.topic.item.${i + 1}`}
                  onClick={() => handleTopicClick(entry)}
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "9999px",
                    padding: "0.4rem 0.9rem",
                    color: "rgba(212,175,55,0.9)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: 500,
                    transition: "background 0.2s",
                  }}
                >
                  <span>{entry.icon}</span>
                  <span>{entry.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Matched result card */}
        <AnimatePresence mode="wait">
          {matchedEntry && (
            <motion.div
              key={matchedEntry.topicKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              data-ocid="voice_assistant.result.card"
              style={{
                background: CARD_BG,
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "18px",
                padding: "1.5rem",
                marginTop: "1.5rem",
                boxShadow: "0 4px 32px rgba(212,175,55,0.08)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span style={{ fontSize: "1.6rem" }}>
                    {matchedEntry.icon}
                  </span>
                  <h2
                    style={{
                      color: GOLD,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      margin: 0,
                    }}
                  >
                    {matchedEntry.title}
                  </h2>
                </div>
                <button
                  type="button"
                  data-ocid="voice_assistant.speak.toggle"
                  onClick={() => toggleSpeak(matchedEntry)}
                  style={{
                    background: isSpeaking
                      ? "rgba(212,175,55,0.2)"
                      : "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "8px",
                    padding: "0.4rem 0.7rem",
                    color: GOLD,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  {isSpeaking ? stopLabel : hearLabel}
                </button>
              </div>

              {/* Intro */}
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  marginBottom: "1.25rem",
                }}
              >
                {matchedEntry.intro}
              </p>

              {/* What to do */}
              <div
                style={{
                  background: "rgba(212,175,55,0.07)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "12px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: GOLD,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {whatToDoLabel}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {matchedEntry.whatToDo}
                </p>
              </div>

              {/* Documents */}
              {matchedEntry.documents.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {docsLabel}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                    }}
                  >
                    {matchedEntry.documents.map((doc) => (
                      <li
                        key={doc}
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.6rem",
                  marginBottom: "1rem",
                }}
              >
                {[
                  {
                    icon: "👨‍⚖️",
                    label: lawyerLabel,
                    val: matchedEntry.lawyerType,
                  },
                  { icon: "💰", label: costLabel, val: matchedEntry.cost },
                  {
                    icon: "⏳",
                    label: timeLabel,
                    val: matchedEntry.timeRequired,
                  },
                  {
                    icon: "📊",
                    label: successLabel,
                    val: matchedEntry.successRate,
                  },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "10px",
                      padding: "0.6rem 0.8rem",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.84rem",
                        margin: 0,
                      }}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: "rgba(134,239,172,0.9)",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  {tipLabel}: {matchedEntry.tip}
                </p>
              </div>

              {/* Disclaimer */}
              <div
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    color: "rgba(252,165,165,0.85)",
                    fontSize: "0.8rem",
                    margin: 0,
                  }}
                >
                  ⚠️ {disclaimer}
                </p>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/918152889991"
                target="_blank"
                rel="noreferrer"
                data-ocid="voice_assistant.whatsapp.button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: "#25D366",
                  color: "white",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={18} /> {connectLabel}
              </a>
            </motion.div>
          )}

          {/* No match fallback */}
          {noMatch && (
            <motion.div
              key="no-match"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="voice_assistant.no_match.card"
              style={{
                background: CARD_BG,
                border: "1px dashed rgba(212,175,55,0.25)",
                borderRadius: "18px",
                padding: "2rem",
                marginTop: "1.5rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "1rem",
                  lineHeight: 1.6,
                }}
              >
                {noMatchText}
              </p>
              <a
                href="https://wa.me/918152889991"
                target="_blank"
                rel="noreferrer"
                data-ocid="voice_assistant.whatsapp_fallback.button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#25D366",
                  color: "white",
                  borderRadius: "12px",
                  padding: "0.7rem 1.5rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={18} /> {chatOnWhatsApp}
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other topics at bottom */}
        {matchedEntry && activeEntries.length > 1 && (
          <div style={{ marginTop: "1.5rem" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6rem",
              }}
            >
              {otherTopicsLabel}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {activeEntries
                .filter((e) => e.topicKey !== matchedEntry.topicKey)
                .map((entry, i) => (
                  <button
                    key={entry.topicKey}
                    type="button"
                    data-ocid={`voice_assistant.other_topic.item.${i + 1}`}
                    onClick={() => handleTopicClick(entry)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "9999px",
                      padding: "0.3rem 0.8rem",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span>{entry.icon}</span>
                    <span>{entry.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
