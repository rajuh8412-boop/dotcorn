// --- CONFIGURATION ---
const whatsappNumber = "919380686624"; 

// --- 1. DATA GENERATOR CONFIGURATION ---
// Define specific price lists for each category as requested
const categoryConfig = {
    birthday: { 
        prefix: 'BDC', count: 50, prices: [49, 99, 199, 499] 
    },
    anniversary: { 
        prefix: 'ADC', count: 50, prices: [49, 99, 199, 499] 
    },
    wedding: { 
        prefix: 'WDC', count: 50, prices: [199, 499, 999, 2999] 
    },
    festival: { 
        prefix: 'FDC', count: 50, prices: [49, 99, 199, 499] 
    },
    other: { 
        prefix: 'ODC', count: 50, prices: [99, 499, 999, 1999] 
    }
};

// Override specific IDs with real files if you have them
const realData = {
    'BDC101': { src: 'media/52107442.mp4', thumb: 'media/thum.png', title: 'Kids Cinematic Birthday', price: 299 }
};

let allVideos = [];

// --- GENERATE DATA ---
for (const [type, config] of Object.entries(categoryConfig)) {
    for (let i = 1; i <= config.count; i++) {
        let fullId = `${config.prefix}${100 + i}`;
        let custom = realData[fullId];

        // Pick a random price from the ALLOWED list for this category
        let randomPrice = config.prices[Math.floor(Math.random() * config.prices.length)];

        allVideos.push({
            id: fullId,
            category: type,
            title: custom ? custom.title : `${type.charAt(0).toUpperCase() + type.slice(1)} Template`,
            desc: "Premium cinematic video edit.",
            // If custom data exists, use it. Otherwise use random price from list.
            price: custom ? custom.price : randomPrice, 
            src: custom ? custom.src : "",       
            thumb: custom ? custom.thumb : ""    
        });
    }
}

// --- 2. HTML GENERATOR (Card) ---
function getCardHTML(video) {
    let media = video.src 
        ? `<div class="video-wrapper" id="wrap-${video.id}"><video class="custom-video" src="${video.src}" poster="${video.thumb}" onclick="togglePlay('${video.id}')"></video><div class="big-play-btn" onclick="togglePlay('${video.id}')"><i class="fas fa-play"></i></div></div>`
        : `<div class="placeholder"><i class="fas fa-play"></i></div>`;

    return `
        <div class="card">
            <div class="video-box">${media}</div>
            <div class="card-content">
                <div><h3 class="card-title">${video.title}</h3><p class="card-desc">${video.desc}</p></div>
                <div class="card-meta"><span class="meta-id">ID: ${video.id}</span><span class="meta-price">₹${video.price}</span></div>
                <button class="btn-buy" onclick="orderNow('${video.id}', '${video.price}')">Order <i class="fab fa-whatsapp"></i></button>
            </div>
        </div>
    `;
}

// --- 3. FILTER & RENDER LOGIC ---

// State to track how many shown per category
const pageState = {
    latest: 0,
    birthday: 12,
    anniversary: 12,
    wedding: 12,
    festival: 12,
    other: 12
};

// Current Active Price Filters (null means show all)
const activeFilters = {
    birthday: null,
    anniversary: null,
    wedding: null,
    festival: null,
    other: null
};

// Initialize the Sections
function initCategory(category) {
    // 1. Render Price Buttons
    const filterContainer = document.getElementById(`filters-${category}`);
    const prices = categoryConfig[category].prices;
    
    let buttonsHTML = `<button class="price-btn active" onclick="applyFilter('${category}', null, this)">All</button>`;
    
    prices.forEach(price => {
        buttonsHTML += `<button class="price-btn" onclick="applyFilter('${category}', ${price}, this)">₹${price}</button>`;
    });
    filterContainer.innerHTML = buttonsHTML;

    // 2. Render Initial Grid (First 12)
    renderGrid(category);
}

// Function to handle clicking a Price Button
function applyFilter(category, price, btnElement) {
    // Update active visual state
    const container = document.getElementById(`filters-${category}`);
    const buttons = container.getElementsByClassName('price-btn');
    for (let btn of buttons) btn.classList.remove('active');
    btnElement.classList.add('active');

    // Set filter and reset page count
    activeFilters[category] = price;
    pageState[category] = 12; // Reset to first page
    
    renderGrid(category);
}

// Function to Render cards based on Filter & Page Limit
function renderGrid(category) {
    const container = document.getElementById(`grid-${category}`);
    let videos = allVideos.filter(v => v.category === category);

    // Apply Price Filter if one is selected
    if (activeFilters[category] !== null) {
        videos = videos.filter(v => v.price == activeFilters[category]);
    }

    // Apply Pagination (Slice 0 to Current Limit)
    let visibleVideos = videos.slice(0, pageState[category]);

    if (visibleVideos.length > 0) {
        container.innerHTML = visibleVideos.map(v => getCardHTML(v)).join('');
    } else {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#777;">No templates found for ₹${activeFilters[category]}</p>`;
    }
}

// "Load More" Button Logic
function loadMoreCategory(category) {
    pageState[category] += 12; // Add 12 more
    renderGrid(category);
}

function loadMoreLatest() {
    const container = document.getElementById('grid-latest');
    const start = pageState.latest * 3; 
    const slice = allVideos.slice(start, start + 3);
    if (slice.length === 0) return;
    slice.forEach(v => container.innerHTML += getCardHTML(v));
    pageState.latest++;
}

// --- 4. SEARCH & UTILS ---
// (Keep your existing Search Logic Here)
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const searchSection = document.getElementById('search-results-section');
const searchGrid = document.getElementById('search-grid');
const mainElements = document.querySelectorAll('section:not(#search-results-section), header');

function performSearch() {
    let query = searchInput.value.toLowerCase().trim();
    if (query === "") return;
    
    let results = allVideos.filter(v => v.title.toLowerCase().includes(query) || v.id.toLowerCase().includes(query));
    
    mainElements.forEach(el => el.style.display = 'none');
    searchSection.style.display = 'block';
    searchGrid.innerHTML = results.length ? results.map(v => getCardHTML(v)).join('') : '<p style="color:#fff;text-align:center;">No results</p>';
}

function closeSearch() {
    searchSection.style.display = 'none';
    mainElements.forEach(el => el.style.display = ''); 
    document.querySelector('.search-section').style.display = 'flex'; // Fix flex issue
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });

// --- 5. INITIALIZATION ---
window.onload = function() {
    loadMoreLatest(); 
    loadMoreLatest(); 
    
    // Initialize specific categories with filters
    initCategory('birthday');
    initCategory('anniversary');
    initCategory('wedding');
    initCategory('festival');
    initCategory('other');
};

function orderNow(id, price) {
    let msg = `Hello! I want Template ID: *${id}* (₹${price}).`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}
// (Include togglePlay and other video control functions here)
function togglePlay(id) { /* ... keep your existing video logic ... */ }
function toggleMenu() { document.querySelector('.nav-links').classList.toggle('active'); }