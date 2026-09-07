// RADA CREST Global Multi-Language Engine for All Pages
const siteDictionary = {
  hi: {
    "RADA CREST Store": "राडा क्रस्ट स्टोर",
    "Buy Now": "अभी खरीदें",
    "Help & Support": "सहायता और समर्थन",
    "Activity Center": "गतिविधि केंद्र",
    "Wishlist": "विशलिस्ट",
    "My Orders": "मेरे ऑर्डर",
    "Delivery Address": "डिलीवरी का पता",
    "Track My Requests": "मेरे अनुरोध को ट्रैक करें",
    "Notifications": "सूचनाएं",
    "Account": "खाता"
  },
  te: {
    "RADA CREST Store": "రాడా క్రెస్ట్ స్టోర్",
    "Buy Now": "ఇప్పుడే కొనండి",
    "Help & Support": "సహాయం & మద్దతు",
    "Activity Center": "యాక్టివిటీ సెంటర్",
    "Wishlist": "విష్‌లిస్ట్",
    "My Orders": "నా ఆర్డర్లు",
    "Delivery Address": "డెలివరీ చిరునామా",
    "Track My Requests": "నా అభ్యర్థనలను ట్రాక్ చేయండి",
    "Notifications": "నోటిఫికేషన్‌లు",
    "Account": "ఖాతా"
  },
  ta: {
    "RADA CREST Store": "ராடா கிரெஸ்ட் ஸ்டோர்",
    "Buy Now": "இப்போது வாங்கு",
    "Help & Support": "உதவி & ஆதரவு",
    "Activity Center": "செயல்பாட்டு மையம்",
    "Wishlist": "விருப்பப் பட்டியல்",
    "My Orders": "எனது ஆர்டர்கள்",
    "Delivery Address": "டெலிவரி முகவரி",
    "Track My Requests": "எனது கோரிக்கையை கண்காணிக்கவும்",
    "Notifications": "அறிவிப்புகள்",
    "Account": "கணக்கு"
  },
  kn: {
    "RADA CREST Store": "ರಾಡಾ ಕ್ರೆಸ್ಟ್ ಸ್ಟೋರ್",
    "Buy Now": "ಈಗ ಖರೀದಿಸಿ",
    "Help & Support": "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
    "Activity Center": "ಚಟುವಟಿಕೆ ಕೇಂದ್ರ",
    "Wishlist": "ವಿಶ್‌ಲಿಸ್ಟ್",
    "My Orders": "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    "Delivery Address": "ವಿಳಾಸ",
    "Track My Requests": "ನನ್ನ ವಿನಂತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "Notifications": "ಅಧಿಸೂಚನೆಗಳು",
    "Account": "ಖಾತೆ"
  },
  mr: {
    "RADA CREST Store": "राडा क्रेस्ट स्टोअर",
    "Buy Now": "आता खरेदी करा",
    "Help & Support": "मदत आणि समर्थन",
    "Activity Center": "ॲक्टिव्हिटी सेंटर",
    "Wishlist": "विशलिस्ट",
    "My Orders": "माझ्या ऑर्डर्स",
    "Delivery Address": "पत्ता",
    "Track My Requests": "विनंती ट्रॅक करा",
    "Notifications": "सूचना",
    "Account": "खाते"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const currentLang = localStorage.getItem('rc_lang') || 'en';
  if (currentLang === 'en' || !siteDictionary[currentLang]) return;

  const dict = siteDictionary[currentLang];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  
  while (node = walker.nextNode()) {
    let text = node.nodeValue.trim();
    if (text && dict[text]) {
      node.nodeValue = node.nodeValue.replace(text, dict[text]);
    }
  }
});
