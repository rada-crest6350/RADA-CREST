/**
 * RADA CREST - Dynamic Homepage Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  initBrandSettings();
  initDeliveryAddress();
  initCartCounter();
  initBannerSlider();
  initFestivalAndFallback();
  initCategories();
  initSmartPickAndTrending();
  initDynamicProductSections();
  initAllProductsListing();
  initSmartSearch();
  initVoiceSearch();
  initPhotoSearch();
});

/* 1. Global Product Fetcher with Live Fallback */
function getStoredProducts() {
  let products = [];
  const possibleKeys = ['rc_all_products', 'products', 'rc_products', 'admin_products'];
  
  for (let key of possibleKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          products = parsed;
          break;
        }
      } catch (e) {}
    }
  }

  // Fallback Product agar storage empty ho
  if (!products || products.length === 0) {
    return [
      {
        id: 'prod_default_1',
        name: '9W Inverter LED Bulb',
        price: 50,
        oldPrice: 500,
        rating: 5,
        image: 'assets/placeholder_product.jpg',
        category: 'led',
        isSuggested: true,
        isTrending: true
      }
    ];
  }

  return products;
}

/* 2. Global Safe Route */
function navigateToProduct(productId) {
  if (!productId) return;
  window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
}

/* 3. Product Card Component Builder */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.onclick = () => navigateToProduct(product.id);

  const discountBadge = product.oldPrice && product.oldPrice > product.price 
    ? `<span style="position: absolute; top: 10px; left: 10px; background: #FF7A00; color:#000; font-size: 0.65rem; font-weight: 800; padding: 2px 5px; border-radius: 4px;">${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>` 
    : '';

  card.innerHTML = `
    ${discountBadge}
    <img src="${product.image || 'assets/placeholder_product.jpg'}" alt="${product.name}" onerror="this.src='https://placehold.co/400x400/12141a/FF7A00?text=RADA+CREST'" />
    <div class="product-title" title="${product.name}">${product.name}</div>
    <div class="rating-badge"><i class="fa-solid fa-star"></i> ${product.rating || '5'}</div>
    <div class="price-row">
      <span class="current-price">₹${product.price}</span>
      ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice}</span>` : ''}
    </div>
  `;
  return card;
}

/* 4. Suggested & Trending Lists */
function initSmartPickAndTrending() {
  const allProducts = getStoredProducts();
  const suggestedList = document.getElementById('suggestedProductsList');
  const trendingList = document.getElementById('trendingProductsList');

  if (suggestedList) suggestedList.innerHTML = '';
  if (trendingList) trendingList.innerHTML = '';

  allProducts.slice(0, 8).forEach(p => {
    if (suggestedList) suggestedList.appendChild(createProductCard(p));
    if (trendingList) trendingList.appendChild(createProductCard(p));
  });
}

/* 5. All Products Grid Listing & Filtering */
function initAllProductsListing() {
  const allProducts = getStoredProducts();
  const grid = document.getElementById('allProductsGrid');
  const catFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');

  function render(items) {
    if (!grid) return;
    grid.innerHTML = '';
    if (!items || !items.length) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 20px;">No products found.</p>`;
      return;
    }
    items.forEach(p => grid.appendChild(createProductCard(p)));
  }

  function applyFilters() {
    let filtered = [...allProducts];
    const cat = catFilter ? catFilter.value.toLowerCase().trim() : 'all';
    const sort = sortFilter ? sortFilter.value : 'default';

    if (cat !== 'all') {
      filtered = filtered.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        return pCat.includes(cat) || cat.includes(pCat);
      });
    }

    if (sort === 'low-high') filtered.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'high-low') filtered.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'rating') filtered.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

    render(filtered);
  }

  if (catFilter) catFilter.onchange = applyFilters;
  if (sortFilter) sortFilter.onchange = applyFilters;

  render(allProducts);
}

/* 6. Admin Brand Settings */
function initBrandSettings() {
  const storeSettings = JSON.parse(localStorage.getItem('rc_store_settings')) || {
    name: 'RADA CREST',
    logoUrl: 'assets/logo.png',
    showLogo: true
  };
  
  const brandName = document.getElementById('brandName');
  const brandLogo = document.getElementById('brandLogo');

  if (brandName && storeSettings.name) brandName.innerText = storeSettings.name;
  if (brandLogo) {
    if (storeSettings.showLogo !== false && storeSettings.logoUrl) {
      brandLogo.src = storeSettings.logoUrl;
      brandLogo.style.display = 'block';
      brandLogo.onerror = () => { brandLogo.style.display = 'none'; };
    } else {
      brandLogo.style.display = 'none';
    }
  }
}

/* 7. Delivery Address Sync */
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

/* 8. Cart Count */
function initCartCounter() {
  const cartItems = JSON.parse(localStorage.getItem('rc_cart_items')) || [];
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.innerText = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }
}

/* 9. Banner Slider */
function initBannerSlider() {
  const defaultBanners = [
    { image: 'assets/banner1.jpg', link: 'category.html?cat=led' },
    { image: 'assets/banner2.jpg', link: 'festival.html' }
  ];
  
  const banners = (JSON.parse(localStorage.getItem('rc_admin_banners')) || defaultBanners)
    .filter(b => b.active !== false)
    .slice(0, 10);

  const track = document.getElementById('slidesTrack');
  const dots = document.getElementById('sliderDots');
  if (!track || !dots) return;

  track.innerHTML = '';
  dots.innerHTML = '';

  banners.forEach((b, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `<img src="${b.image}" alt="Deal" onerror="this.src='https://placehold.co/800x350/12141a/FF7A00?text=RADA+CREST+OFFERS'" />`;
    slide.onclick = () => { if (b.link) window.location.href = b.link; };
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dots.appendChild(dot);
  });

  let currentIndex = 0;
  const updateSlide = (idx) => {
    if (!banners.length) return;
    currentIndex = (idx + banners.length) % banners.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };

  const nextBtn = document.getElementById('sliderNext');
  const prevBtn = document.getElementById('sliderPrev');
  if (nextBtn) nextBtn.onclick = () => updateSlide(currentIndex + 1);
  if (prevBtn) prevBtn.onclick = () => updateSlide(currentIndex - 1);
  setInterval(() => updateSlide(currentIndex + 1), 4500);
}

/* 10. Festival Sale Section */
function initFestivalAndFallback() {
  const festivalData = JSON.parse(localStorage.getItem('rc_festival_sale')) || { active: false };
  const festivalSection = document.getElementById('festivalSection');

  if (festivalSection) {
    if (festivalData.active) {
      festivalSection.style.display = 'block';
      if (festivalData.title) document.getElementById('festivalTitle').innerText = festivalData.title;
      const list = document.getElementById('festivalProductsList');
      if (list) {
        list.innerHTML = '';
        (festivalData.products || []).forEach(p => list.appendChild(createProductCard(p)));
      }
    } else {
      festivalSection.style.display = 'none';
    }
  }
}

/* 11. Categories */
function initCategories() {
  const defaultCats = [
    { name: 'LED Bulbs', slug: 'led', icon: 'assets/cat_led.png' },
    { name: 'Extension', slug: 'extension', icon: 'assets/cat_ext.png' },
    { name: 'T-Bulbs', slug: 't-bulb', icon: 'assets/cat_tbulb.png' },
    { name: 'Accessories', slug: 'accessories', icon: 'assets/cat_acc.png' }
  ];
  const categories = JSON.parse(localStorage.getItem('rc_categories')) || defaultCats;
  const grid = document.getElementById('categoriesGrid');
  const catFilter = document.getElementById('categoryFilter');
  
  if (grid) {
    grid.innerHTML = '';
    categories.forEach(cat => {
      const card = document.createElement('a');
      card.className = 'category-card';
      card.href = `category.html?cat=${encodeURIComponent(cat.slug || cat.name.toLowerCase())}`;
      card.innerHTML = `
        <div class="cat-img-box">
          <img src="${cat.icon || 'assets/cat_default.png'}" alt="${cat.name}" onerror="this.src='https://placehold.co/100x100/12141a/FF7A00?text=RC'" />
        </div>
        <span>${cat.name}</span>
      `;
      grid.appendChild(card);
    });
  }

  if (catFilter && catFilter.options.length <= 1) {
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.slug || cat.name.toLowerCase();
      opt.innerText = cat.name;
      catFilter.appendChild(opt);
    });
  }
}

/* 12. Dynamic Product Sections */
function initDynamicProductSections() {
  const sections = JSON.parse(localStorage.getItem('rc_custom_sections')) || [];
  const container = document.getElementById('dynamicSectionsContainer');
  if (!container) return;
  container.innerHTML = '';

  sections.forEach(sec => {
    if (!sec.active) return;
    const secEl = document.createElement('section');
    secEl.className = 'product-section';
    secEl.innerHTML = `
      <div class="section-header">
        <h2>${sec.title}</h2>
      </div>
      <div class="product-scroller" id="sec_${sec.id}"></div>
    `;
    container.appendChild(secEl);

    const scroller = secEl.querySelector(`#sec_${sec.id}`);
    (sec.products || []).forEach(p => scroller.appendChild(createProductCard(p)));
  });
}

/* 13. Search Systems */
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
    searchInput.placeholder = 'Search';
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
