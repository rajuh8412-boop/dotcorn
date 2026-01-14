// --- CONFIGURATION ---
const whatsappNumber = "919380686625"; 

// --- 1. DATA GENERATOR ---
const categoryConfig = {
    // BIRTHDAY SUB-CATEGORIES
    birthday_friend:  { prefix: 'BFDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_couples: { prefix: 'BCDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_kids:    { prefix: 'BKDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_parents: { prefix: 'BPDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_other:   { prefix: 'BODC', count: 50, prices: [49, 99, 199, 499] },

    // OTHER MAIN CATEGORIES
    anniversary: { prefix: 'ADC', count: 50, prices: [49, 99, 199, 499] },
    wedding:     { prefix: 'WDC', count: 50, prices: [199, 499, 999, 2999] },
    festival:    { prefix: 'FDC', count: 50, prices: [49, 99, 199, 499] },
    main_other:  { prefix: 'ODC', count: 50, prices: [99, 499, 999, 1999] }
};

// Override specific IDs with real files
const realData = {
    'BFDC101': { src: 'media/52107442.mp4', thumb: 'media/thum.png', title: 'Bestie Forever', price: 99 },
    'BFDC104': { src: 'media/103 birthday.mp4', thumb: 'media/thum.png', title: 'Bestie Forever', price: 49 }
};

let allVideos = [];

// GENERATE ALL VIDEO DATA
for (const [type, config] of Object.entries(categoryConfig)) {
    for (let i = 1; i <= config.count; i++) {
        let fullId = `${config.prefix}${100 + i}`;
        let custom = realData[fullId];
        let randomPrice = config.prices[Math.floor(Math.random() * config.prices.length)];

        allVideos.push({
            id: fullId,
            category: type,
            title: custom ? custom.title : `${formatTitle(type)} Template`,
            desc: "Premium cinematic video edit.",
            price: custom ? custom.price : randomPrice, 
            src: custom ? custom.src : "",       
            thumb: custom ? custom.thumb : ""    
        });
    }
}

// Helpers
function formatTitle(str) {
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let latestVideos = [...allVideos]; 
shuffleArray(latestVideos);

// --- 2. HTML GENERATOR (CLEAN PLAYER) ---
function getCardHTML(video) {
    let media = video.src 
        ? `<div class="video-wrapper" id="wrap-${video.id}" onclick="togglePlay('${video.id}')">
             <video class="custom-video" src="${video.src}" poster="${video.thumb}" ontimeupdate="updateProgress('${video.id}')"></video>
             
             <div class="custom-controls" onclick="event.stopPropagation()">
                <button class="control-btn" onclick="togglePlay('${video.id}')" id="btn-${video.id}"><i class="fas fa-play"></i></button>
                <input type="range" class="seek-bar" value="0" min="0" max="100" oninput="scrubVideo('${video.id}', this)" id="range-${video.id}">
                <button class="control-btn" onclick="toggleMute('${video.id}', this)"><i class="fas fa-volume-up"></i></button>
                <button class="control-btn" onclick="enterFullScreen('${video.id}')"><i class="fas fa-expand"></i></button>
             </div>
           </div>`
        : `<div class="placeholder"><i class="fas fa-play"></i></div>`;

    return `
        <div class="card">
            <div class="video-box">${media}</div>
            <div class="card-content">
                <div><h3 class="card-title">${video.title}</h3></div>
                <div class="card-meta"><span class="meta-id">ID: ${video.id}</span><span class="meta-price">₹${video.price}</span></div>
                <button class="btn-buy" onclick="orderNow('${video.id}', '${video.price}')">Order <i class="fab fa-whatsapp"></i></button>
            </div>
        </div>
    `;
}

// --- 3. FILTERING & RENDER LOGIC ---
const pageState = {};
const activeFilters = {};

for (const key of Object.keys(categoryConfig)) {
    pageState[key] = 12;
    activeFilters[key] = null;
}
pageState['latest'] = 12;

function initCategory(category) {
    const filterContainer = document.getElementById(`filters-${category}`);
    if(!filterContainer) return; 
    
    const prices = categoryConfig[category].prices;
    let buttonsHTML = `<button class="price-btn active" onclick="applyFilter('${category}', null, this)">All</button>`;
    prices.forEach(price => {
        buttonsHTML += `<button class="price-btn" onclick="applyFilter('${category}', ${price}, this)">₹${price}</button>`;
    });
    filterContainer.innerHTML = buttonsHTML;
    renderGrid(category);
}

function applyFilter(category, price, btnElement) {
    const container = document.getElementById(`filters-${category}`);
    for (let btn of container.getElementsByClassName('price-btn')) btn.classList.remove('active');
    btnElement.classList.add('active');

    activeFilters[category] = price;
    pageState[category] = 12; 
    renderGrid(category);
}

function renderGrid(category) {
    const container = document.getElementById(`grid-${category}`);
    let videos = allVideos.filter(v => v.category === category);
    
    if (activeFilters[category] !== null) {
        videos = videos.filter(v => v.price == activeFilters[category]);
    }
    
    let visibleVideos = videos.slice(0, pageState[category]);
    
    if (visibleVideos.length > 0) {
        container.innerHTML = visibleVideos.map(v => getCardHTML(v)).join('');
    } else {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#777;">No templates found for ₹${activeFilters[category]}.</p>`;
    }
}

function loadMoreCategory(category) {
    pageState[category] += 12;
    renderGrid(category);
}

function loadMoreLatest() {
    const container = document.getElementById('grid-latest');
    const start = (pageState.latest - 12); 
    const slice = latestVideos.slice(start, pageState.latest);
    if (slice.length === 0) return;
    slice.forEach(v => container.innerHTML += getCardHTML(v));
    pageState.latest += 12;
}

// --- INIT ---
window.onload = function() {
    const latestContainer = document.getElementById('grid-latest');
    latestVideos.slice(0, 12).forEach(v => latestContainer.innerHTML += getCardHTML(v));
    
    Object.keys(categoryConfig).forEach(key => initCategory(key));
};

// --- CONTROLS ---
function togglePlay(id) {
    const wrapper = document.getElementById(`wrap-${id}`);
    const video = wrapper.querySelector('.custom-video');
    const btnIcon = document.querySelector(`#btn-${id} i`);
    if (video.paused) {
        document.querySelectorAll('video').forEach(v => { if(v!==video) v.pause(); });
        video.play(); btnIcon.className = 'fas fa-pause';
    } else {
        video.pause(); btnIcon.className = 'fas fa-play';
    }
}
function updateProgress(id) {
    const wrapper = document.getElementById(`wrap-${id}`);
    const video = wrapper.querySelector('video');
    const range = document.getElementById(`range-${id}`);
    range.value = (video.currentTime / video.duration) * 100 || 0;
    if(video.ended) { document.querySelector(`#btn-${id} i`).className = 'fas fa-play'; }
}
function scrubVideo(id, range) {
    const video = document.querySelector(`#wrap-${id} video`);
    video.currentTime = (range.value / 100) * video.duration;
}
function toggleMute(id, btn) {
    const video = document.querySelector(`#wrap-${id} video`);
    video.muted = !video.muted;
    btn.querySelector('i').className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}
function enterFullScreen(id) {
    const video = document.querySelector(`#wrap-${id} video`);
    if(video.requestFullscreen) video.requestFullscreen();
    else if(video.webkitRequestFullscreen) video.webkitRequestFullscreen();
}

// --- UTILS ---
function orderNow(id, price) {
    let msg = `Hello! I want Template ID: *${id}* (₹${price}).`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}
function toggleMenu() { document.querySelector('.nav-links').classList.toggle('active'); }
function contactSupport() { window.open(`https://wa.me/${whatsappNumber}?text=Enquiry`, '_blank'); }

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
    document.querySelector('.search-section').style.display = 'flex';
}
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });