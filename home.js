/**
 * RADA CREST - Dynamic Homepage Engine
 */
const SUPABASE_URL = 'https://ynpsnkvrjhaxdynmurzj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHNua3ZyamhheGR5bm11cnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNTc5NjAsImV4cCI6MjEwMTgzMzk2MH0.I3xFYthE0JNfGnD6N1BaNBybSq7m0G6MRILzq3NXihg';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const DEFAULT_PRODUCT_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%2312141a'/%3E%3Cpath d='M150 60 C120 60 95 85 95 120 C95 145 110 165 125 180 L125 210 L175 210 L175 180 C190 165 205 145 205 120 C205 85 180 60 150 60 Z' fill='%23FF7A00' opacity='0.85'/%3E%3Crect x='130' y='215' width='40' height='8' rx='3' fill='%23ffffff' opacity='0.4'/%3E%3Crect x='135' y='226' width='30' height='6' rx='3' fill='%23ffffff' opacity='0.3'/%3E%3Ctext x='150' y='265' fill='%23ffffff' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3ERADA CREST%3C/text%3E%3C/svg%3E";
const DEFAULT_CAT_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%231a1d26' stroke='%23FF7A00' stroke-width='2'/%3E%3Cpath d='M50 25 C40 25 32 33 32 44 C32 52 37 58 42 63 L42 72 L58 72 L58 63 C63 58 68 52 68 44 C68 33 60 25 50 25 Z' fill='%23FF7A00'/%3E%3C/svg%3E";

document.addEventListener('DOMContentLoaded', () => {
  initBrandSettings();
  initDeliveryAddress();
  initCartCounter();
  initBannerSlider();
  initCategories();
  loadLiveProducts();
  initSmartSearch();
  initVoiceSearch();
  initPhotoSearch();
});

function navigateToProduct(productId) {
  if (!productId) return;
  window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.onclick = () => navigateToProduct(product.id);

  const discountBadge = product.oldPrice && product.oldPrice > product.price 
    ? `<span style="position: absolute; top: 10px; left: 10px; background: #FF7A00; color:#000; font-size: 0.65rem; font-weight: 800; padding: 2px 5px; border-radius: 4px;">${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>` 
    : '';

  const imgSrc = (product.image && product.image.trim() !== '') ? product.image : DEFAULT_PRODUCT_IMG;

  card.innerHTML = `
    ${discountBadge}
    <img src="${imgSrc}" alt="${product.name}" onerror="this.src='${DEFAULT_PRODUCT_IMG}'" />
    <div class="product-title" title="${product.name}">${product.name}</div>
    <div class="rating-badge"><i class="fa-solid fa-star"></i> ${product.rating || '5'}</div>
    <div class="price-row">
      <span class="current-price">₹${product.price}</span>
      ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice}</span>` : ''}
    </div>
  `;
  return card;
}

async function loadLiveProducts() {
  let allProducts = [];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        allProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          oldPrice: p.old_price,
          image: p.image,
          rating: p.rating || 5,
          category: p.category
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch fallback active:", e);
    }
  }

  // Fallback demo product agar cloud empty ho
  if (allProducts.length === 0) {
    allProducts = [
      {
        id: 'default_bulb',
        name: '9W Inverter LED Bulb',
        price: 50,
        oldPrice: 500,
        rating: 5,
        image: DEFAULT_PRODUCT_IMG,
        category: 'led'
      }
    ];
  }

  const suggestedList = document.getElementById('suggestedProductsList');
  const trendingList = document.getElementById('trendingProductsList');
  const grid = document.getElementById('allProductsGrid');

  if (suggestedList) {
    suggestedList.innerHTML = '';
    allProducts.slice(0, 8).forEach(p => suggestedList.appendChild(createProductCard(p)));
  }
  if (trendingList) {
    trendingList.innerHTML = '';
    allProducts.slice(0, 8).forEach(p => trendingList.appendChild(createProductCard(p)));
  }
  if (grid) {
    grid.innerHTML = '';
    allProducts.forEach(p => grid.appendChild(createProductCard(p)));
  }
}

function initBrandSettings() {
  const storeSettings = JSON.parse(localStorage.getItem('rc_store_settings')) || {
    name: 'RADA CREST',
    logoUrl: DEFAULT_PRODUCT_IMG,
    showLogo: true
  };
  const brandName = document.getElementById('brandName');
  const brandLogo = document.getElementById('brandLogo');

  if (brandName && storeSettings.name) brandName.innerText = storeSettings.name;
  if (brandLogo) {
    if (storeSettings.showLogo !== false && storeSettings.logoUrl) {
      brandLogo.src = storeSettings.logoUrl;
      brandLogo.style.display = 'block';
    } else {
      brandLogo.style.display = 'none';
    }
  }
}

function initDeliveryAddress() {
  const activeAddr = JSON.parse(localStorage.getItem('rc_selected_address'));
  const currentAddressEl = document.getElementById('currentAddress');
  if (currentAddressEl) {
    if (activeAddr && activeAddr.addressLine) {
      currentAddressEl.innerText = `${activeAddr.name ? activeAddr.name + ' - ' : ''}${activeAddr.addressLine}`;
    } else {
      currentAddressEl.innerText = 'Add delivery address';
    }
  }
}

function initCartCounter() {
  const cartItems = JSON.parse(localStorage.getItem('rc_cart_items')) || [];
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.innerText = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }
}

function initBannerSlider() {
  const banners = [{ image: DEFAULT_PRODUCT_IMG, link: 'category.html?cat=led' }];
  const track = document.getElementById('slidesTrack');
  const dots = document.getElementById('sliderDots');
  if (!track || !dots) return;

  track.innerHTML = '';
  dots.innerHTML = '';

  banners.forEach((b, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `<img src="${b.image}" alt="Deal" />`;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dots.appendChild(dot);
  });
}

function initCategories() {
  const defaultCats = [
    { name: 'LED Bulbs', slug: 'led', icon: DEFAULT_CAT_IMG },
    { name: 'Extension', slug: 'extension', icon: DEFAULT_CAT_IMG },
    { name: 'T-Bulbs', slug: 't-bulb', icon: DEFAULT_CAT_IMG },
    { name: 'Accessories', slug: 'accessories', icon: DEFAULT_CAT_IMG }
  ];
  const grid = document.getElementById('categoriesGrid');
  if (grid) {
    grid.innerHTML = '';
    defaultCats.forEach(cat => {
      const card = document.createElement('a');
      card.className = 'category-card';
      card.href = `category.html?cat=${encodeURIComponent(cat.slug)}`;
      card.innerHTML = `
        <div class="cat-img-box">
          <img src="${cat.icon}" alt="${cat.name}" />
        </div>
        <span>${cat.name}</span>
      `;
      grid.appendChild(card);
    });
  }
}

function executeSearch(query) {
  if (!query || !query.trim()) return;
  window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
}

function initSmartSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn && searchInput) {
    searchBtn.onclick = () => executeSearch(searchInput.value);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') executeSearch(searchInput.value);
    });
  }
}

function initVoiceSearch() {
  const voiceBtn = document.getElementById('voiceSearchBtn');
  const searchInput = document.getElementById('searchInput');
  if (!voiceBtn || !searchInput) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN';

  recognition.onstart = () => {
    voiceBtn.style.color = '#FF7A00';
    searchInput.placeholder = 'Listening...';
  };
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    executeSearch(transcript);
  };
  recognition.onend = () => {
    voiceBtn.style.color = '';
    searchInput.placeholder = "Search '9W LED Bulb'...";
  };

  voiceBtn.onclick = () => {
    try { recognition.start(); } catch (e) { recognition.stop(); }
  };
}

function initPhotoSearch() {
  const photoBtn = document.getElementById('photoSearchBtn');
  const modal = document.getElementById('photoModal');
  const closeBtn = document.getElementById('closePhotoModal');
  const cameraInput = document.getElementById('cameraInput');
  const galleryInput = document.getElementById('galleryInput');

  if (!photoBtn || !modal) return;
  photoBtn.onclick = () => modal.classList.add('active');
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

  const handleImage = (file) => {
    if (!file) return;
    modal.classList.remove('active');
    window.location.href = `search.html?visualSearch=true&name=${encodeURIComponent(file.name)}`;
  };

  if (cameraInput) cameraInput.onchange = (e) => handleImage(e.target.files[0]);
  if (galleryInput) galleryInput.onchange = (e) => handleImage(e.target.files[0]);
}
