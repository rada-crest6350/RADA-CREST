const siteDictionary = {
  hi: {
    store_title: "राडा क्रस्ट स्टोर",
    buy_now: "अभी खरीदें",
    help_supp: "सहायता और समर्थन",
    act_center: "गतिविधि केंद्र",
    wishlist: "विशलिस्ट",
    my_orders: "मेरे ऑर्डर",
    delivery_addr: "डिलीवरी का पता",
    notifications: "सूचनाएं",
    account: "खाता",
    cart: "कार्ट"
  },
  te: {
    store_title: "రాడా క్రెస్ట్ స్టోర్",
    buy_now: "ఇప్పుడే కొనండి",
    help_supp: "సహాయం & మద్దతు",
    act_center: "యాక్టివిటీ సెంటర్",
    wishlist: "విష్‌లిస్ట్",
    my_orders: "నా ఆర్డర్లు",
    delivery_addr: "డెలివరీ చిరునామా",
    notifications: "నోటిఫికేషన్‌లు",
    account: "ఖాతా",
    cart: "కార్ట్"
  },
  ta: {
    store_title: "ராடா கிரெஸ்ட் ஸ்டோர்",
    buy_now: "இப்போது வாங்கு",
    help_supp: "உதவி & ஆதரவு",
    act_center: "செயல்பாட்டு மையம்",
    wishlist: "விருப்பப் பட்டியல்",
    my_orders: "எனது ஆர்டர்கள்",
    delivery_addr: "டெலிவரி முகவரி",
    notifications: "அறிவிப்புகள்",
    account: "கணக்கு",
    cart: "கூடை"
  },
  kn: {
    store_title: "ರಾಡಾ ಕ್ರೆಸ್ಟ್ ಸ್ಟೋರ್",
    buy_now: "ಈಗ ಖರೀದಿಸಿ",
    help_supp: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
    act_center: "ಚಟುವಟಿಕೆ ಕೇಂದ್ರ",
    wishlist: "ವಿಶ್‌ಲಿಸ್ಟ್",
    my_orders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    delivery_addr: "ವಿಳಾಸ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    account: "ಖಾತೆ",
    cart: "ಕಾರ್ಟ್"
  },
  mr: {
    store_title: "राडा क्रेस्ट स्टोअर",
    buy_now: "आता खरेदी करा",
    help_supp: "मदत आणि समर्थन",
    act_center: "ॲक्टिव्हिटी सेंटर",
    wishlist: "विशलिस्ट",
    my_orders: "माझ्या ऑर्डर्स",
    delivery_addr: "पत्ता",
    notifications: "सूचना",
    account: "खाते",
    cart: "कार्ट"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const currentLang = localStorage.getItem('rc_lang') || 'en';
  if (currentLang === 'en' || !siteDictionary[currentLang]) return;

  const dict = siteDictionary[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
});
