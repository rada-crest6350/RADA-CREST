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

/* 1. Global Product Fetch Helper (Sabhi keys check karega) */
function getStoredProducts() {
  return JSON.parse(localStorage.getItem('products')) || 
         JSON.parse(localStorage.getItem('rc_all_products')) || 
         JSON.parse(localStorage.getItem('rc_products')) || [];
}

/* 2. Suggested & Trending Sync Fix */
function initSmartPickAndTrending() {
  const allProducts = getStoredProducts();
  const suggestedList = document.getElementById('suggestedProductsList');
  const trendingList = document.getElementById('trendingProductsList');

  suggestedList.innerHTML = '';
  trendingList.innerHTML = '';

  if (!allProducts.length) return;

  // Agar products hain toh pehle 8 products ko suggested aur trending me dikhao
  allProducts.slice(0, 8).forEach(p => {
    suggestedList.appendChild(createProductCard(p));
    trendingList.appendChild(createProductCard(p));
  });
}

/* 3. All Products Grid Listing Fix */
function initAllProductsListing() {
  const allProducts = getStoredProducts();
  const grid = document.getElementById('allProductsGrid');
  const catFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');

  function render(items) {
    grid.innerHTML = '';
    if (!items || !items.length) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 20px;">No products found.</p>`;
      return;
    }
    items.forEach(p => grid.appendChild(createProductCard(p)));
  }

  function applyFilters() {
    let filtered = [...allProducts];
    const cat = (catFilter.value || '').toLowerCase().trim();
    const sort = sortFilter.value;

    if (cat !== 'all') {
      filtered = filtered.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        return pCat.includes(cat) || cat.includes(pCat);
      });
    }

    if (sort === 'low-high') filtered.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'high-low') filtered.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    render(filtered);
  }

  if (catFilter) catFilter.onchange = applyFilters;
  if (sortFilter) sortFilter.onchange = applyFilters;

  render(allProducts);
}

/* 2. Admin Logo & Brand Dynamics (Real-time Sync) */
function initBrandSettings() {
  const defaultSettings = {
    name: 'RADA CREST',
    logoUrl: 'assets/logo.png',
    showLogo: true
  };
  
  const storeSettings = JSON.parse(localStorage.getItem('rc_store_settings')) || defaultSettings;
  
  const brandName = document.getElementById('brandName');
  const brandLogo = document.getElementById('brandLogo');

  if (storeSettings.name) {
    brandName.innerText = storeSettings.name;
  }

  if (storeSettings.showLogo !== false && storeSettings.logoUrl) {
    brandLogo.src = storeSettings.logoUrl;
    brandLogo.style.display = 'block';
    
    // Fallback agar image load na ho toh text initials ya hide karne ke liye
    brandLogo.onerror = () => {
      brandLogo.style.display = 'none';
    };
  } else {
    brandLogo.style.display = 'none';
  }
}

/* 3. Delivery Address State Sync */
function initDeliveryAddress() {
  const activeAddr = JSON.parse(localStorage.getItem('rc_selected_address'));
  const currentAddressEl = document.getElementById('currentAddress');
  if (activeAddr && activeAddr.addressLine) {
    currentAddressEl.innerText = `${activeAddr.name ? activeAddr.name + ' - ' : ''}${activeAddr.addressLine}, ${activeAddr.city || ''}`;
  } else {
    currentAddressEl.innerText = 'Add delivery address';
  }
}

/* 4. Cart Count */
function initCartCounter() {
  const cartItems = JSON.parse(localStorage.getItem('rc_cart_items')) || [];
  const cartCountEl = document.getElementById('cartCount');
  cartCountEl.innerText = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
}

/* 5. Main Banner Slider (Max 10) */
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
  track.innerHTML = '';
  dots.innerHTML = '';

  if (!banners.length) {
    document.querySelector('.banner-section').style.display = 'none';
    return;
  }

  banners.forEach((b, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `<img src="${b.image}" alt="Special Deal" onerror="this.src='assets/placeholder_banner.jpg'" />`;
    slide.onclick = () => { if (b.link) window.location.href = b.link; };
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dots.appendChild(dot);
  });

  let currentIndex = 0;
  const updateSlide = (idx) => {
    currentIndex = (idx + banners.length) % banners.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };

  document.getElementById('sliderNext').onclick = () => updateSlide(currentIndex + 1);
  document.getElementById('sliderPrev').onclick = () => updateSlide(currentIndex - 1);
  setInterval(() => updateSlide(currentIndex + 1), 4500);
}

/* 6. Product Card Component Builder */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.onclick = () => navigateToProduct(product.id);

  const discountBadge = product.oldPrice && product.oldPrice > product.price 
    ? `<span style="position: absolute; top: 12px; left: 12px; background: #FF7A00; color:#000; font-size: 0.65rem; font-weight: 800; padding: 2px 4px; border-radius: 4px;">${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>` 
    : '';

  card.innerHTML = `
    ${discountBadge}
    <img src="${product.image || 'assets/placeholder_product.jpg'}" alt="${product.name}" onerror="this.src='assets/placeholder_product.jpg'" />
    <div class="product-title" title="${product.name}">${product.name}</div>
    <div class="rating-badge"><i class="fa-solid fa-star"></i> ${product.rating || '4.5'}</div>
    <div class="price-row">
      <span class="current-price">₹${product.price}</span>
      ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice}</span>` : ''}
    </div>
  `;
  return card;
}

/* 7. Festival Sale Banner / Fallback Section */
function initFestivalAndFallback() {
  const festivalData = JSON.parse(localStorage.getItem('rc_festival_sale')) || { active: false };
  const festivalSection = document.getElementById('festivalSection');

  if (festivalData.active) {
    festivalSection.style.display = 'block';
    if (festivalData.title) document.getElementById('festivalTitle').innerText = festivalData.title;
    if (festivalData.pageLink) document.getElementById('festivalViewAll').href = festivalData.pageLink;

    const list = document.getElementById('festivalProductsList');
    list.innerHTML = '';
    (festivalData.products || []).forEach(p => list.appendChild(createProductCard(p)));
  } else {
    // Fallback: Ensure Suggested/Trending is visibly prioritized if Festival is inactive
    festivalSection.style.display = 'none';
  }
}

/* 8. Dynamic Categories */
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
  
  grid.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('a');
    card.className = 'category-card';
    card.href = `category.html?cat=${encodeURIComponent(cat.slug || cat.name.toLowerCase())}`;
    card.innerHTML = `
      <div class="cat-img-box">
        <img src="${cat.icon || 'assets/cat_default.png'}" alt="${cat.name}" onerror="this.src='assets/cat_default.png'" />
      </div>
      <span>${cat.name}</span>
    `;
    grid.appendChild(card);

    // Populate Filter dropdown
    const opt = document.createElement('option');
    opt.value = cat.slug || cat.name.toLowerCase();
    opt.innerText = cat.name;
    catFilter.appendChild(opt);
  });
}

/* 9. Suggested & Trending Lists */
function initSmartPickAndTrending() {
  const allProducts = JSON.parse(localStorage.getItem('rc_all_products')) || [];
  
  const suggestedList = document.getElementById('suggestedProductsList');
  const trendingList = document.getElementById('trendingProductsList');

  const suggested = allProducts.filter(p => p.isSuggested || p.rating >= 4.5).slice(0, 8);
  const trending = allProducts.filter(p => p.isTrending || p.salesCount > 10).slice(0, 8);

  suggested.forEach(p => suggestedList.appendChild(createProductCard(p)));
  trending.forEach(p => trendingList.appendChild(createProductCard(p)));
}

/* 10. Dynamic Product Sections (Admin Controlled) */
function initDynamicProductSections() {
  const sections = JSON.parse(localStorage.getItem('rc_custom_sections')) || [];
  const container = document.getElementById('dynamicSectionsContainer');
  container.innerHTML = '';

  sections.forEach(sec => {
    if (!sec.active) return;
    const secEl = document.createElement('section');
    secEl.className = 'product-section';
    secEl.innerHTML = `
      <div class="section-header">
        <h2>${sec.title}</h2>
        ${sec.viewAllLink ? `<a href="${sec.viewAllLink}" class="view-all">View All <i class="fa-solid fa-chevron-right"></i></a>` : ''}
      </div>
      <div class="product-scroller" id="sec_${sec.id}"></div>
    `;
    container.appendChild(secEl);

    const scroller = secEl.querySelector(`#sec_${sec.id}`);
    (sec.products || []).forEach(p => scroller.appendChild(createProductCard(p)));
  });
}

/* 11. Listing, Sorting & Filtering */
function initAllProductsListing() {
  const allProducts = JSON.parse(localStorage.getItem('rc_all_products')) || [];
  const grid = document.getElementById('allProductsGrid');
  const catFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');

  function render(items) {
    grid.innerHTML = '';
    if (!items.length) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 20px;">No products found.</p>`;
      return;
    }
    items.forEach(p => grid.appendChild(createProductCard(p)));
  }

  function applyFilters() {
    let filtered = [...allProducts];
    const cat = catFilter.value;
    const sort = sortFilter.value;

    if (cat !== 'all') {
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase());
    }

    if (sort === 'low-high') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'high-low') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    render(filtered);
  }

  catFilter.onchange = applyFilters;
  sortFilter.onchange = applyFilters;
  render(allProducts);
}

/* 12. Smart Intent Search Router */
function executeSearch(query) {
  if (!query || !query.trim()) return;
  window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
}

function initSmartSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.onclick = () => executeSearch(searchInput.value);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch(searchInput.value);
  });
}

/* 13. Voice Search Integration with Permission Handling */
function initVoiceSearch() {
  const voiceBtn = document.getElementById('voiceSearchBtn');
  const searchInput = document.getElementById('searchInput');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.onclick = () => alert('Voice search is not supported on this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN';
  recognition.interimResults = false;

  recognition.onstart = () => {
    voiceBtn.style.color = 'var(--primary)';
    searchInput.placeholder = 'Listening... Speak now';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    executeSearch(transcript);
  };

  recognition.onerror = (event) => {
    voiceBtn.style.color = '';
    searchInput.placeholder = "Search '9W LED Bulb'...";
    if (event.error === 'not-allowed') {
      alert('Microphone permission was denied. Please allow microphone access in settings.');
    }
  };

  recognition.onend = () => {
    voiceBtn.style.color = '';
    searchInput.placeholder = "Search '9W LED Bulb'...";
  };

  voiceBtn.onclick = () => {
    try {
      recognition.start();
    } catch (e) {
      recognition.stop();
    }
  };
}

/* 14. Photo Search Modal & Device Permission Handling */
function initPhotoSearch() {
  const photoBtn = document.getElementById('photoSearchBtn');
  const modal = document.getElementById('photoModal');
  const closeBtn = document.getElementById('closePhotoModal');
  const cameraInput = document.getElementById('cameraInput');
  const galleryInput = document.getElementById('galleryInput');

  photoBtn.onclick = () => modal.classList.add('active');
  closeBtn.onclick = () => modal.classList.remove('active');

  const handleImage = (file) => {
    if (!file) return;
    modal.classList.remove('active');
    // Directing to Visual Search Processor
    window.location.href = `search.html?visualSearch=true&name=${encodeURIComponent(file.name)}`;
  };

  cameraInput.onchange = (e) => handleImage(e.target.files[0]);
  galleryInput.onchange = (e) => handleImage(e.target.files[0]);
}
