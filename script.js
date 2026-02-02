// --- CONFIGURATION ---
const whatsappNumber = "919380686624"; 

// --- 1. DATA GENERATOR ---
const categoryConfig = {
    birthday_friend:  { prefix: 'BFDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_couples: { prefix: 'BCDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_kids:    { prefix: 'BKDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_parents: { prefix: 'BPDC', count: 50, prices: [49, 99, 199, 499] },
    birthday_other:   { prefix: 'BODC', count: 50, prices: [49, 99, 199, 499] },
    anniversary:      { prefix: 'ADC', count: 50, prices: [49, 99, 199, 499] },
    wedding:          { prefix: 'WDC', count: 50, prices: [199, 499, 999, 2999] },
    festival:         { prefix: 'FDC', count: 50, prices: [49, 99, 199, 499] },
    main_other:       { prefix: 'ODC', count: 50, prices: [99, 499, 999, 1999] }
};

// --- REAL DATA ---
const realData = {
    'BFDC101': { 
        src: 'https://www.youtube.com/shorts/3DO0iriMRPA?feature=share', 
        thumb: 'https://img.youtube.com/vi/3DO0iriMRPA/maxresdefault.jpg', 
        title: 'Friend Birthday Boy Girl', 
        price: 49,
        reqImages: 22 },

    'BFDC102': { 
        src: 'https://www.youtube.com/shorts/jXJ0PSXheCI?feature=share', 
        thumb: 'https://img.youtube.com/vi/jXJ0PSXheCI/maxresdefault.jpg', 
        title: 'Friend Birthday Boy Girl', 
        price: 49,
        reqImages: 20},

    'BFDC103': { 
        src: 'https://www.youtube.com/shorts/_fqrDXvifr0?feature=share',
        thumb: 'https://img.youtube.com/vi/_fqrDXvifr0/maxresdefault.jpg',
        title: 'Friend Birthday Boy Girl', 
        price: 49,
        reqImages: 35},
        
    'BKDC101': { 
        src: 'https://video-previews.elements.envatousercontent.com/h264-video-previews/d27556c2-4aa3-4e02-8422-f1f80b920f90/34303271.mp4', 
        thumb: 'https://img.youtube.com/vi/jXJ0PSXheCI/maxresdefault.jpg', 
        title: 'Kids Birthday Boy Girl', 
        price: 199,
        reqImages: 25},

    'BKDC102': {
        // Path based on your screenshot folder structure:
        src: 'https://video-previews.elements.envatousercontent.com/h264-video-previews/d5adcb2d-4f56-470c-828f-85e5679eee47/42887147.mp4', 
        thumb: 'media/thumb.png', // Make sure to add a thumbnail image here later!
        title: 'Kid Birthday Boy Girl',
        price: 199,
        reqImages: 25
    },
        
    //Birthday Other templates can be added similarly//

    'BODC101': { 
        src: 'https://video-previews.elements.envatousercontent.com/h264-video-previews/87a16c21-a8ff-434c-b8bb-8a5c2286bed5/11270591.mp4', 
        thumb: 'media/thumb.png', 
        title: 'Birthday Invitation Wishes',
        price: 99,
        reqImages: 25 },
    'BODC102': { 
        src: 'https://drive.google.com/file/d/1Q_SxBjVZIMstqQeKErGH3uPUkmfPZ_3c/view?usp=drive_link',
        thumb: 'media/thumb.png', // Don't forget to change this thumbnail!
        title: 'Drive Video Template',
        price: 149,
        reqImages: 8}
};

let allVideos = [];
for (const [type, config] of Object.entries(categoryConfig)) {
    for (let i = 1; i <= config.count; i++) {
        let fullId = `${config.prefix}${100 + i}`;
        let custom = realData[fullId];
        
        // Skip empty templates
        if (!custom) continue; 

        let randomPrice = config.prices[Math.floor(Math.random() * config.prices.length)];
        allVideos.push({
            id: fullId, category: type,
            title: custom ? custom.title : `${formatTitle(type)} Template`,
            desc: "Premium cinematic video edit.",
            price: custom ? custom.price : randomPrice, 
            src: custom ? custom.src : "", 
            thumb: custom ? custom.thumb : "",
            reqImages: custom.reqImages || "5-10"
        });
    }
}
function formatTitle(str) { return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }
function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } }
let latestVideos = [...allVideos]; shuffleArray(latestVideos);

// --- DETECTORS ---
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function formatTime(seconds) {
    if (!seconds) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = "0" + secs;
    return `${mins}:${secs}`;
}

// --- STOP ALL OTHERS (Using Unique Context IDs) ---
function stopAllOthers(currentUniqueId) {
    // 1. Pause all MP4 Videos
    document.querySelectorAll('video').forEach(vid => {
        const wrapper = vid.closest('.video-wrapper');
        const vidUniqueId = wrapper ? wrapper.id.replace('wrap-', '') : null;
        
        if (vidUniqueId && vidUniqueId !== currentUniqueId) {
            vid.pause();
            vid.currentTime = 0; // Reset to start
            const btn = document.querySelector(`#btn-${vidUniqueId} i`);
            if(btn) btn.className = 'fas fa-play';
        }
    });

    // 2. Reset all YouTube Videos
    document.querySelectorAll('.youtube-iframe').forEach(iframe => {
        const iframeUniqueId = iframe.id.replace('iframe-', '');
        
        if (iframeUniqueId !== currentUniqueId) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            const thumb = document.getElementById(`thumb-${iframeUniqueId}`);
            const btn = document.querySelector(`#btn-${iframeUniqueId} i`);
            
            if(thumb) thumb.style.display = 'block';
            if(btn) btn.className = 'fas fa-play';
            
            stopFakeProgress(iframeUniqueId);
        }
    });
}

// --- 2. HTML GENERATOR (PREMIUM PLAYER) ---
function getCardHTML(video, context) {
    // GENERATE UNIQUE ID based on location (latest vs cat)
    let uniqueID = `${video.id}-${context}`;
    
    let media = '';
    let ytID = getYouTubeID(video.src);

    if (ytID) {
        // --- YOUTUBE MODE ---
        media = `
           <div class="video-wrapper" id="wrap-${uniqueID}" data-type="youtube" data-ytid="${ytID}">
             <img class="custom-video" src="${video.thumb}" style="object-fit: cover;" id="thumb-${uniqueID}">
             <div id="frame-box-${uniqueID}" style="position:absolute; top:0; left:0; width:100%; height:100%; display:none;"></div>
             <div class="youtube-shield" onclick="toggleHybridPlay('${uniqueID}', '${ytID}')"></div>

             <div class="custom-controls" style="opacity:0;" id="ctrl-${uniqueID}">
                <button class="control-btn" onclick="toggleHybridPlay('${uniqueID}', '${ytID}')" id="btn-${uniqueID}"><i class="fas fa-play"></i></button>
                
                <div class="seek-bar" style="background:rgba(255,255,255,0.3); height:4px; border-radius:2px; flex-grow:1; position:relative; margin:0 10px;">
                    <div id="prog-${uniqueID}" style="width:0%; height:100%; background:#FFD700; border-radius:2px;"></div>
                </div>
                
                <button class="control-btn" onclick="toggleHybridMute('${uniqueID}')"><i class="fas fa-volume-up"></i></button>
                <button class="control-btn" onclick="toggleFullScreen('${uniqueID}', this)"><i class="fas fa-expand"></i></button>
             </div>
           </div>`;
    } else if (video.src) {
        // --- MP4 PLAYER (CLEANED UP) ---
        media = `
           <div class="video-wrapper" id="wrap-${uniqueID}" onclick="togglePlay('${uniqueID}')">
             <video class="custom-video" src="${video.src}" poster="${video.thumb}" ontimeupdate="updateProgress('${uniqueID}')" onloadedmetadata="initTime('${uniqueID}')"></video>
             
             <div class="custom-controls" onclick="event.stopPropagation()">
                <button class="control-btn" onclick="togglePlay('${uniqueID}')" id="btn-${uniqueID}"><i class="fas fa-play"></i></button>
                
                <input type="range" class="seek-bar" value="0" min="0" max="100" 
                    oninput="startDragging('${uniqueID}')" 
                    onchange="stopDragging('${uniqueID}', this)"
                    onclick="scrubVideo('${uniqueID}', this)"
                    id="range-${uniqueID}">

                <span class="time-display" id="time-${uniqueID}">00:00 / 00:00</span>
                
                <button class="control-btn" onclick="toggleMute('${uniqueID}', this)"><i class="fas fa-volume-up"></i></button>
                
                <button class="control-btn" onclick="toggleFullScreen('${uniqueID}', this)"><i class="fas fa-expand"></i></button>
             </div>
           </div>`;
    }

    return `
        <div class="card">
            <div class="video-box">${media}</div>
            <div class="card-content">
                <div><h3 class="card-title">${video.title}</h3></div>
                
                <div style="font-size: 0.8rem; color: #888; margin-top: 5px;">
                    <i class="fas fa-images" style="color: #FFD700; margin-right: 5px;"></i> Needs: ${video.reqImages} Images
                </div>

                <div class="card-meta"><span class="meta-id">ID: ${video.id}</span><span class="meta-price">₹${video.price}</span></div>
                <button class="btn-buy" onclick="orderNow('${video.id}', '${video.price}', '${video.reqImages}')">Order <i class="fab fa-whatsapp"></i></button>
            </div>
        </div>
    `;
}

// --- CONTROLS LOGIC ---
let isDragging = false; 
function startDragging(id) { isDragging = true; }
function stopDragging(id, range) { isDragging = false; scrubVideo(id, range); }

function togglePlay(uniqueId) {
    const video = document.querySelector(`#wrap-${uniqueId} video`);
    const btn = document.querySelector(`#btn-${uniqueId} i`);
    
    // STOP ALL OTHERS
    if(video.paused) stopAllOthers(uniqueId);

    if(video.paused) { 
        video.play(); 
        btn.className='fas fa-pause'; 
    } else { 
        video.pause(); 
        btn.className='fas fa-play'; 
    }
}

function initTime(id) {
    const video = document.querySelector(`#wrap-${id} video`);
    const timeDisplay = document.getElementById(`time-${id}`);
    if(video.duration) { timeDisplay.innerText = `00:00 / ${formatTime(video.duration)}`; }
}

function updateProgress(id) {
    if (isDragging) return;
    const wrapper = document.getElementById(`wrap-${id}`);
    const video = wrapper.querySelector('video');
    const range = document.getElementById(`range-${id}`);
    const timeDisplay = document.getElementById(`time-${id}`);

    if (video.duration) {
        let current = formatTime(video.currentTime);
        let total = formatTime(video.duration);
        timeDisplay.innerText = `${current} / ${total}`;
    }
    if (!isDragging && video.duration) {
        range.value = (video.currentTime / video.duration) * 100;
    }
    if(video.ended) { document.querySelector(`#btn-${id} i`).className = 'fas fa-play'; }
}

function scrubVideo(id, range) {
    const video = document.querySelector(`#wrap-${id} video`);
    if (video.duration) { video.currentTime = (range.value / 100) * video.duration; }
}
// skipTime() REMOVED because buttons are gone

function toggleMute(id, btn) { 
    const video = document.querySelector(`#wrap-${id} video`);
    video.muted = !video.muted;
    btn.querySelector('i').className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}
function toggleFullScreen(id, btn) {
    const wrapper = document.getElementById(`wrap-${id}`);
    const icon = btn.querySelector('i');
    if (!document.fullscreenElement) {
        if(wrapper.requestFullscreen) wrapper.requestFullscreen();
        icon.className = 'fas fa-compress';
    } else {
        if(document.exitFullscreen) document.exitFullscreen();
        icon.className = 'fas fa-expand';
    }
}

// --- YOUTUBE LOGIC ---
const ytTimers = {}; 

function toggleHybridPlay(uniqueId, ytID) {
    const thumb = document.getElementById(`thumb-${uniqueId}`);
    const frameBox = document.getElementById(`frame-box-${uniqueId}`);
    const smallBtn = document.querySelector(`#btn-${uniqueId} i`);
    const controls = document.getElementById(`ctrl-${uniqueId}`);

    const isFirstLoad = (frameBox.innerHTML === "");
    const isPaused = (thumb.style.display !== 'none');
    
    // STOP ALL OTHERS
    if (isFirstLoad || isPaused) stopAllOthers(uniqueId);

    if (isFirstLoad) {
        thumb.style.display = 'none';
        frameBox.style.display = 'block';
        controls.style.opacity = '1';

        frameBox.innerHTML = `
            <iframe id="iframe-${uniqueId}" class="youtube-iframe" 
            width="100%" height="100%" 
            src="https://www.youtube.com/embed/${ytID}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${ytID}" 
            frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
        
        smallBtn.className = 'fas fa-pause';
        startFakeProgress(uniqueId);
    } else {
        const iframe = document.getElementById(`iframe-${uniqueId}`).contentWindow;
        if (smallBtn.className.includes('pause')) {
            iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            smallBtn.className = 'fas fa-play';
            thumb.style.display = 'block';
            stopFakeProgress(uniqueId);
        } else {
            iframe.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            smallBtn.className = 'fas fa-pause';
            thumb.style.display = 'none';
            startFakeProgress(uniqueId);
        }
    }
}

function toggleHybridMute(id) {
    const iframe = document.getElementById(`iframe-${id}`);
    if(iframe) iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
}

function startFakeProgress(id) {
    const bar = document.getElementById(`prog-${id}`);
    if (ytTimers[id]) clearInterval(ytTimers[id]);
    let width = parseFloat(bar.style.width) || 0;
    ytTimers[id] = setInterval(() => {
        if(width >= 100) width = 0;
        width += 0.5;
        if(bar) bar.style.width = width + '%';
    }, 200); 
}

function stopFakeProgress(id) {
    if (ytTimers[id]) { clearInterval(ytTimers[id]); ytTimers[id] = null; }
}

// --- INIT ---
const pageState = {};
const activeFilters = {};
for (const key of Object.keys(categoryConfig)) { pageState[key] = 12; activeFilters[key] = null; }
pageState['latest'] = 12;

function initCategory(category) {
    const filterContainer = document.getElementById(`filters-${category}`);
    if(!filterContainer) return; 
    const prices = categoryConfig[category].prices;
    let buttonsHTML = `<button class="price-btn active" onclick="applyFilter('${category}', null, this)">All</button>`;
    prices.forEach(price => { buttonsHTML += `<button class="price-btn" onclick="applyFilter('${category}', ${price}, this)">₹${price}</button>`; });
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
    if (activeFilters[category] !== null) videos = videos.filter(v => v.price == activeFilters[category]);
    let visibleVideos = videos.slice(0, pageState[category]);
    
    // Pass 'cat' context
    if (visibleVideos.length > 0) container.innerHTML = visibleVideos.map(v => getCardHTML(v, 'cat')).join('');
    else container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#777;">No templates found.</p>`;
}

function loadMoreCategory(category) { pageState[category] += 12; renderGrid(category); }

function loadMoreLatest() {
    const container = document.getElementById('grid-latest');
    const start = (pageState.latest - 12); 
    const slice = latestVideos.slice(start, pageState.latest);
    if (slice.length === 0) return;
    // Pass 'latest' context
    slice.forEach(v => container.innerHTML += getCardHTML(v, 'latest'));
    pageState.latest += 12;
}

window.onload = function() {
    const latestContainer = document.getElementById('grid-latest');
    // Pass 'latest' context
    latestVideos.slice(0, 12).forEach(v => latestContainer.innerHTML += getCardHTML(v, 'latest'));
    Object.keys(categoryConfig).forEach(key => initCategory(key));
};

function orderNow(id, price, imgs) {
    let msg = `Hello! I want Template ID: *${id}* (₹${price}). I have the required ${imgs} images.`;
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
    // Pass 'search' context
    searchGrid.innerHTML = results.length ? results.map(v => getCardHTML(v, 'search')).join('') : '<p style="color:#fff;text-align:center;">No results</p>';
}
function closeSearch() {
    searchSection.style.display = 'none';
    mainElements.forEach(el => el.style.display = ''); 
    document.querySelector('.search-section').style.display = 'flex';
}
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });