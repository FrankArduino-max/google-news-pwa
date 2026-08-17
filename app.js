if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registrato'))
        .catch(err => console.log('Errore Service Worker:', err));
}

const newsList = document.getElementById('newsList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const tabs = document.querySelectorAll('.tab-btn');

let currentCategory = 'top';
let currentArticles = [];

const newsDatabase = {
    top: [
        {
            title: 'Nuove scoperte scientifiche rivoluzionano la medicina',
            description: 'Ricercatori internazionali annunciano una grande scoperta nel campo della genetica che potrebbe cambiare il modo di curare molte malattie.',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop',
            url: 'https://www.repubblica.it/scienze',
            source: 'Scienza Oggi',
            date: Date.now()
        },
        {
            title: 'Le migliori innovazioni tecnologiche del 2026',
            description: 'Un anno ricco di novità nel mondo della tecnologia e dell\'intelligenza artificiale con nuovi device rivoluzionari.',
            image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=200&h=200&fit=crop',
            url: 'https://www.wired.it/tech',
            source: 'Tech News',
            date: Date.now() - 3600000
        },
        {
            title: 'Mercati finanziari in crescita durante il trimestre',
            description: 'Gli indici borsistici registrano performance positive grazie alla ripresa economica globale e ai nuovi investimenti.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
            url: 'https://www.ilsole24ore.com/mercati',
            source: 'Business World',
            date: Date.now() - 7200000
        },
        {
            title: 'Nuovo record nello sport mondiale',
            description: 'Un atleta stabilisce un nuovo primato assoluto nella sua disciplina superando il precedente record di ben 5 secondi.',
            image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop',
            url: 'https://www.gazzetta.it/sport',
            source: 'Sports Daily',
            date: Date.now() - 10800000
        },
        {
            title: 'Clima: rapporto allarmante dell\'ONU',
            description: 'L\'organizzazione mondiale rilancia l\'allarme sul cambiamento climatico chiedendo azioni immediati da parte dei governi.',
            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
            url: 'https://www.greenreport.it/clima',
            source: 'Ambiente News',
            date: Date.now() - 14400000
        }
    ],
    technology: [
        {
            title: 'Intelligenza Artificiale: il futuro della programmazione',
            description: 'Gli sviluppatori utilizzano sempre più AI per ottimizzare il codice e aumentare la produttività del team di sviluppo.',
            image: 'https://images.unsplash.com/photo-1677442d019cecf8a424a9c7f1dbee8b35dddcb5?w=200&h=200&fit=crop',
            url: 'https://www.wired.it/intelligenza-artificiale',
            source: 'Tech Insider',
            date: Date.now()
        },
        {
            title: 'Quantum Computing: primi successi pratici',
            description: 'Le aziende iniziano a utilizzare computer quantistici per risolvere problemi reali e complessi in tempi mai visti prima.',
            image: 'https://images.unsplash.com/photo-1635070041078-e51fe1bca585?w=200&h=200&fit=crop',
            url: 'https://www.italiaoggi.it/tech',
            source: 'Quantum Weekly',
            date: Date.now() - 3600000
        }
    ],
    business: [
        {
            title: 'Fusioni e acquisizioni record nel 2026',
            description: 'Il mercato M&A raggiunge i massimi storici con miliardi di dollari in transazioni strategiche tra grandi aziende.',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
            url: 'https://www.ilsole24ore.com/finanza',
            source: 'Bloomberg Italia',
            date: Date.now()
        }
    ],
    health: [
        {
            title: 'Salute mentale: nuovi metodi di trattamento',
            description: 'La ricerca medica scopre approcci innovativi per le malattie mentali con tassi di guarigione più alti.',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop',
            url: 'https://www.salute.gov.it',
            source: 'Health Plus',
            date: Date.now()
        }
    ],
    science: [
        {
            title: 'Scoperta di una nuova specie nel profondo oceano',
            description: 'Biologi marini trovano una creatura mai vista prima nelle fosse oceaniche a 6000 metri di profondità.',
            image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200&fit=crop',
            url: 'https://www.nationalgeographic.it',
            source: 'Science Magazine',
            date: Date.now()
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    loadNews('top');
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            searchInput.value = '';
            loadNews(currentCategory);
        });
    });
}

function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        loadNews('top', query);
    }
}

function loadNews(category, query = '') {
    showLoading(true);
    hideError();
    hideNoResults();

    setTimeout(() => {
        try {
            let articles = [...(newsDatabase[category] || newsDatabase.top)];

            if (query) {
                const queryLower = query.toLowerCase();
                articles = articles.filter(article =>
                    article.title.toLowerCase().includes(queryLower) ||
                    article.description.toLowerCase().includes(queryLower)
                );
            }

            if (articles.length === 0) {
                showNoResults();
            } else {
                currentArticles = articles;
                displayNews(articles);
            }
        } catch (err) {
            console.error('Errore:', err);
            showError('Errore nel caricamento delle notizie.');
        } finally {
            showLoading(false);
        }
    }, 500);
}

function displayNews(articles) {
    newsList.innerHTML = '';

    articles.forEach(article => {
        const card = createNewsCard(article);
        newsList.appendChild(card);
    });
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';

    const imageUrl = article.image || 'https://via.placeholder.com/100?text=No+Image';
    const title = article.title || 'Senza titolo';
    const description = article.description || 'Nessuna descrizione disponibile';
    const source = article.source || 'Fonte sconosciuta';
    const time = formatTime(article.date);
    const url = article.url || '#';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="news-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%231f2937%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 font-size=%2240%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E📰%3C/text%3E%3C/svg%3E'">
        <div class="news-content">
            <div>
                <div class="news-title">${escapeHtml(title)}</div>
                <div class="news-description">${escapeHtml(description)}</div>
            </div>
            <div class="news-meta">
                <span class="news-source">${escapeHtml(source)}</span>
                <span class="news-time">${time}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        openInBraveBrowser(url);
    });

    return card;
}

function openInBraveBrowser(url) {
    console.log('Apertura URL:', url);

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');

    if (isAndroid) {
        try {
            const braveUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.brave.browser;S.browser_fallback_url=${encodeURIComponent(url)};end`;
            window.location.href = braveUrl;

            setTimeout(() => {
                window.open(url, '_blank');
            }, 2000);
        } catch (err) {
            window.open(url, '_blank');
        }
    } else {
        window.open(url, '_blank');
    }
}

function formatTime(timestamp) {
    if (!timestamp) return 'Recente';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Ora';
    if (diff < 3600) return Math.floor(diff / 60) + 'm fa';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h fa';
    if (diff < 604800) return Math.floor(diff / 86400) + 'g fa';

    return date.toLocaleDateString('it-IT');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    error.innerHTML = `<p>⚠️ ${message}</p>`;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showNoResults() {
    noResults.classList.remove('hidden');
}

function hideNoResults() {
    noResults.classList.add('hidden');
}

window.addEventListener('online', () => {
    console.log('Connessione online ripristinata');
});

window.addEventListener('offline', () => {
    console.log('Modalità offline attivata');
    showError('⚠️ Modalità offline - visualizzazione notizie salvate');
});