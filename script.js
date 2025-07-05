// Словари для игры
const dictionaries = {
    standard: {
        name: 'Стандартный',
        words: [
            'САМОЛЁТ', 'КОФЕ', 'МУЗЫКА', 'ДОЖДЬ', 'СМЕХ', 'КНИГА', 'СОЛНЦЕ', 'МОРОЖЕНОЕ',
            'ТЕЛЕФОН', 'РАДУГА', 'ПЛЯЖ', 'ФОТОГРАФИЯ', 'ТАНЕЦ', 'ШОКОЛАД', 'МЕЧТА', 'ОКЕАН',
            'ПРАЗДНИК', 'ЦВЕТОК', 'ЗВЕЗДА', 'ПУТЕШЕСТВИЕ', 'ДРУЖБА', 'СЕМЬЯ', 'ЛЮБОВЬ', 'СЧАСТЬЕ',
            'КОТЁНОК', 'ПЕСНЯ', 'УЛЫБКА', 'ЗАКАТ', 'ВЕЛОСИПЕД', 'ПИЦЦА', 'КИНО', 'ИГРА',
            'ЛЕТО', 'ЗИМА', 'ВЕСНА', 'ОСЕНЬ', 'ДЕРЕВО', 'ГОРА', 'РЕКА', 'МОСТ',
            'ЗАМОК', 'ПИРАТСТВО', 'КОСМОС', 'РОБОТ', 'МАГИЯ', 'ПРИНЦЕССА', 'ДРАКОН', 'СОКРОВИЩЕ',
            'ХУДОЖНИК', 'ВРАЧ', 'УЧИТЕЛЬ', 'ПОВАР', 'ПОЛИЦЕЙСКИЙ', 'АКТЁР', 'МУЗЫКАНТ', 'ПИЛОТ',
            'ФУТБОЛ', 'БАСКЕТБОЛ', 'ТЕННИС', 'ПЛАВАНИЕ', 'БЕГ', 'ЙОГА', 'ТАНЦЫ', 'ШАХМАТЫ',
            'КОМПЬЮТЕР', 'ИНТЕРНЕТ', 'ПРОГРАММА', 'КЛАВИАТУРА', 'МЫШКА', 'МОНИТОР', 'ПЛАНШЕТ', 'ИГРУШКА',
            'АВТОМОБИЛЬ', 'ПОЕЗД', 'АВТОБУС', 'МОТОЦИКЛ', 'КОРАБЛЬ', 'ВЕРТОЛЁТ', 'РАКЕТА', 'МЕТРО',
            'ШКОЛА', 'УНИВЕРСИТЕТ', 'БИБЛИОТЕКА', 'МУЗЕЙ', 'ТЕАТР', 'ЦИРК', 'ЗООПАРК', 'ПАРК',
            'БОЛЬНИЦА', 'АПТЕКА', 'МАГАЗИН', 'РЕСТОРАН', 'КАФЕ', 'ОТЕЛЬ', 'БАНК', 'ПОЧТА'
        ]
    },
    advanced: {
        name: 'Сложный',
        words: [
            'АРГУМЕНТ', 'ФИЛОСОФИЯ', 'ДЕМОКРАТИЯ', 'ИРОНИЗИРОВАТЬ', 'МЕТАФОРА', 'АНАЛИЗ', 'КОНЦЕПЦИЯ', 'ПАРАДОКС',
            'КАТЕГОРИЯ', 'КРИТЕРИЙ', 'ДИЛЕММА', 'ГИПОТЕЗА', 'КОМПРОМИСС', 'ИНТУИЦИЯ', 'СПЕЦИФИКА', 'СТРАТЕГИЯ',
            'ЭВОЛЮЦИЯ', 'ТРАДИЦИЯ', 'ИННОВАЦИЯ', 'АЛЬТЕРНАТИВА', 'ПРИОРИТЕТ', 'ПЕРСПЕКТИВА', 'ЭФФЕКТИВНОСТЬ', 'ОПТИМИЗАЦИЯ',
            'АРХИТЕКТУРА', 'СИММЕТРИЯ', 'ПРОПОРЦИЯ', 'КОМПОЗИЦИЯ', 'СТИЛИСТИКА', 'ЭСТЕТИКА', 'ГАРМОНИЯ', 'РИТМ',
            'ПСИХОЛОГИЯ', 'ЭМПАТИЯ', 'МОТИВАЦИЯ', 'ИНТРОВЕРТ', 'ЭКСТРАВЕРТ', 'ХАРАКТЕР', 'ТЕМПЕРАМЕНТ', 'ЛИЧНОСТЬ',
            'ЭКОНОМИКА', 'ИНФЛЯЦИЯ', 'ИНВЕСТИЦИЯ', 'КРЕДИТ', 'ДИВИДЕНД', 'АКЦИЯ', 'ВАЛЮТА', 'БЮДЖЕТ',
            'ТЕХНОЛОГИЯ', 'АЛГОРИТМ', 'ИНТЕРФЕЙС', 'БАЗА ДАННЫХ', 'СЕРВЕР', 'ПРОТОКОЛ', 'АРХИВ', 'BACKUP',
            'БИОЛОГИЯ', 'ГЕНЕТИКА', 'ЭВОЛЮЦИЯ', 'МУТАЦИЯ', 'АДАПТАЦИЯ', 'ЭКОСИСТЕМА', 'БИОТОП', 'СИМБИОЗ',
            'ФИЗИКА', 'ГРАВИТАЦИЯ', 'ИНЕРЦИЯ', 'ЭНЕРГИЯ', 'ИМПУЛЬС', 'РЕЗОНАНС', 'ЧАСТОТА', 'АМПЛИТУДА',
            'ХИМИЯ', 'РЕАКЦИЯ', 'КАТАЛИЗАТОР', 'КИСЛОТА', 'ЩЁЛОЧЬ', 'МОЛЕКУЛА', 'АТОМ', 'СОЕДИНЕНИЕ'
        ]
    }
};

let currentDictionary = 'standard';

// Случайные имена команд
const teamNames = [
    ['🦁 Львы', '🐺 Волки', '🦅 Орлы', '🐯 Тигры', '🦈 Акулы', '🔥 Пламя', '⚡ Молнии', '🌟 Звёзды'],
    ['🚀 Ракеты', '💎 Алмазы', '🌪️ Вихри', '🎯 Снайперы', '🗿 Титаны', '❄️ Айсберги', '🌈 Радуги', '🎭 Актёры']
];

function generateRandomTeamNames() {
    const team1Names = [...teamNames[0]];
    const team2Names = [...teamNames[1]];
    
    const team1Name = team1Names[Math.floor(Math.random() * team1Names.length)];
    let team2Name = team2Names[Math.floor(Math.random() * team2Names.length)];
    
    // Убеждаемся, что имена разные
    while (team1Name === team2Name) {
        team2Name = team2Names[Math.floor(Math.random() * team2Names.length)];
    }
    
    return [team1Name, team2Name];
}

function generateNewTeamNames() {
    const [name1, name2] = generateRandomTeamNames();
    gameState.teams[0].name = name1;
    gameState.teams[1].name = name2;
    
    // Обновляем заголовки команд в интерфейсе только если элементы существуют
    const team1Header = document.querySelector('.team h3');
    const team2Header = document.querySelector('.team.team2 h3');
    
    if (team1Header) {
        team1Header.textContent = name1;
    }
    if (team2Header) {
        team2Header.textContent = name2;
    }
}

function getCurrentWords() {
    return dictionaries[currentDictionary].words;
}

// Звуковые эффекты
let sounds = null;

// Инициализация звуков
async function initSounds() {
    if (!sounds) {
        sounds = {
            correct: new Tone.Oscillator(800, "triangle"),
            skip: new Tone.Oscillator(400, "sawtooth"),
            timeWarning: new Tone.Oscillator(600, "sine"),
            endRound: new Tone.Oscillator(300, "square"),
            victory: new Tone.Oscillator(1000, "triangle")
        };
    }
}

// Проигрывание звуков
async function playSound(soundType) {
    try {
        await Tone.start();
        await initSounds();
        
        const sound = sounds[soundType];
        if (sound) {
            sound.toDestination();
            sound.start();
            sound.stop(Tone.now() + 0.2);
        }
    } catch (error) {
        // Звук не может быть воспроизведен - игнорируем ошибку
    }
}

// Хранение имен игроков (в памяти сессии)
let savedNames = {
    team1: ['Анна', 'Борис'],
    team2: ['Вера', 'Глеб']
};

// Загрузка сохраненных имен
function loadSavedNames() {
    document.getElementById('team1_player1').value = savedNames.team1[0];
    document.getElementById('team1_player2').value = savedNames.team1[1];
    document.getElementById('team2_player1').value = savedNames.team2[0];
    document.getElementById('team2_player2').value = savedNames.team2[1];
}

// Сохранение имен
function saveNames() {
    savedNames.team1[0] = document.getElementById('team1_player1').value;
    savedNames.team1[1] = document.getElementById('team1_player2').value;
    savedNames.team2[0] = document.getElementById('team2_player1').value;
    savedNames.team2[1] = document.getElementById('team2_player2').value;
}

let gameState = {
    teams: [
        { name: '🦁 Львы', players: [], score: 0 },
        { name: '🚀 Ракеты', players: [], score: 0 }
    ],
    currentTeam: 0,
    currentPlayer: 0,
    roundTime: 60,
    targetScore: 30,
    timer: null,
    timeLeft: 0,
    roundActive: false,
    usedWords: [],
    currentWord: '',
    roundStats: { correct: 0, skipped: 0 },
    round: 1,
    lastWordMode: false // Режим "последнее слово для всех"
};

function startGame() {
    // Сохраняем и собираем имена игроков
    saveNames();
    
    gameState.teams[0].players = [
        document.getElementById('team1_player1').value || 'Игрок 1',
        document.getElementById('team1_player2').value || 'Игрок 2'
    ];
    
    gameState.teams[1].players = [
        document.getElementById('team2_player1').value || 'Игрок 1',
        document.getElementById('team2_player2').value || 'Игрок 2'
    ];

    currentDictionary = document.getElementById('dictionary').value;
    gameState.roundTime = parseInt(document.getElementById('roundTime').value);
    gameState.targetScore = parseInt(document.getElementById('targetScore').value);
    gameState.timeLeft = gameState.roundTime;
    gameState.lastWordMode = false;

    showScreen('game');
    updateDisplay();
    playSound('correct'); // Звук начала игры
}

function showScreen(screenName) {
    // Скрываем все экраны
    document.getElementById('menuScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('rulesScreen').style.display = 'none';
    document.getElementById('aboutScreen').style.display = 'none';
    
    // Показываем нужный экран
    document.getElementById(screenName + 'Screen').style.display = 'block';
}

function showMenu() {
    showScreen('menu');
}

function showSetup() {
    showScreen('setup');
}

function showRules() {
    showScreen('rules');
}

function showAbout() {
    showScreen('about');
}

function updateDisplay() {
    const currentTeamName = gameState.lastWordMode ? 
        "🔥 ПОСЛЕДНЕЕ СЛОВО - ВСЕ КОМАНДЫ!" : 
        gameState.teams[gameState.currentTeam].name;
        
    // Безопасное обновление элементов
    const currentTeamEl = document.getElementById('currentTeam');
    const team1ScoreEl = document.getElementById('team1Score');
    const team2ScoreEl = document.getElementById('team2Score');
    const timerEl = document.getElementById('timer');
    const roundInfoEl = document.getElementById('roundInfo');
    const roundCorrectEl = document.getElementById('roundCorrect');
    const roundSkippedEl = document.getElementById('roundSkipped');
    
    if (currentTeamEl) currentTeamEl.textContent = currentTeamName;
    if (team1ScoreEl) team1ScoreEl.textContent = gameState.teams[0].score;
    if (team2ScoreEl) team2ScoreEl.textContent = gameState.teams[1].score;
    if (timerEl) timerEl.textContent = gameState.lastWordMode ? '∞' : gameState.timeLeft;
    if (roundCorrectEl) roundCorrectEl.textContent = gameState.roundStats.correct;
    if (roundSkippedEl) roundSkippedEl.textContent = gameState.roundStats.skipped;
    
    if (roundInfoEl) {
        if (gameState.lastWordMode) {
            roundInfoEl.innerHTML = `Раунд ${gameState.round} • <span style="color: #ff6b6b; font-weight: bold;">ПОСЛЕДНЕЕ СЛОВО ДЛЯ ВСЕХ!</span>`;
        } else {
            roundInfoEl.innerHTML = `Раунд ${gameState.round} • Объясняет: <span>${gameState.teams[gameState.currentTeam].players[gameState.currentPlayer]}</span>`;
        }
    }

    if (timerEl) {
        if (gameState.timeLeft <= 10 && !gameState.lastWordMode) {
            timerEl.classList.add('warning');
        } else {
            timerEl.classList.remove('warning');
        }
    }

    // Безопасное обновление кнопок в режиме последнего слова
    const correctBtn = document.getElementById('correctBtn');
    const skipBtn = document.getElementById('skipBtn');
    const endRoundBtn = document.getElementById('endRoundBtn');
    
    if (gameState.lastWordMode && gameState.roundActive) {
        if (correctBtn) {
            correctBtn.textContent = `✅ ${gameState.teams[0].name}`;
            correctBtn.classList.remove('hidden');
        }
        if (skipBtn) {
            skipBtn.textContent = `✅ ${gameState.teams[1].name}`;
            skipBtn.classList.remove('hidden');
        }
        if (endRoundBtn) endRoundBtn.classList.add('hidden');
    } else if (gameState.roundActive) {
        if (correctBtn) correctBtn.textContent = '✅ Угадали';
        if (skipBtn) skipBtn.textContent = '⏭️ Пропустить';
        if (endRoundBtn) endRoundBtn.classList.remove('hidden');
    }
}

function getRandomWord() {
    const words = getCurrentWords();
    let availableWords = words.filter(word => !gameState.usedWords.includes(word));
    if (availableWords.length === 0) {
        gameState.usedWords = [];
        availableWords = words;
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    gameState.usedWords.push(word);
    return word;
}

function startRound() {
    gameState.roundActive = true;
    gameState.timeLeft = gameState.roundTime;
    gameState.roundStats = { correct: 0, skipped: 0 };
    
    document.getElementById('startRoundBtn').classList.add('hidden');
    document.getElementById('correctBtn').classList.remove('hidden');
    document.getElementById('skipBtn').classList.remove('hidden');
    document.getElementById('endRoundBtn').classList.remove('hidden');
    document.getElementById('roundStats').classList.remove('hidden');

    nextWord();
    startTimer();
}

function startTimer() {
    gameState.timer = setInterval(() => {
        if (gameState.lastWordMode) {
            // В режиме последнего слова таймер не тикает
            return;
        }
        
        gameState.timeLeft--;
        
        // Включаем режим "последнее слово" в последние 10 секунд
        if (gameState.timeLeft === 10 && !gameState.lastWordMode) {
            gameState.lastWordMode = true;
            playSound('timeWarning');
            nextWord(); // Новое слово для всех команд
            updateDisplay();
            return; // Таймер останавливается
        }
        
        // Звуковое предупреждение каждую секунду в последние 5 секунд
        if (gameState.timeLeft <= 5 && gameState.timeLeft > 0) {
            playSound('timeWarning');
        }
        
        updateDisplay();
        
        if (gameState.timeLeft <= 0) {
            endRound();
        }
    }, 1000);
}

function nextWord() {
    gameState.currentWord = getRandomWord();
    document.getElementById('currentWord').textContent = gameState.currentWord;
}

function correctWord() {
    if (!gameState.roundActive) return;
    
    playSound('correct');
    
    if (gameState.lastWordMode) {
        // В режиме последнего слова очко получает команда 1
        gameState.teams[0].score++;
        gameState.roundStats.correct++;
    } else {
        // Обычный режим - очко получает активная команда
        gameState.teams[gameState.currentTeam].score++;
        gameState.roundStats.correct++;
    }
    
    updateDisplay();
    
    if (gameState.teams[0].score >= gameState.targetScore || gameState.teams[1].score >= gameState.targetScore) {
        endGame();
        return;
    }
    
    if (!gameState.lastWordMode) {
        nextWord();
    } else {
        // В режиме последнего слова раунд заканчивается после угадывания
        endRound();
    }
}

function skipWord() {
    if (!gameState.roundActive) return;
    
    if (gameState.lastWordMode) {
        // В режиме последнего слова это кнопка для команды 2
        playSound('correct');
        gameState.teams[1].score++;
        gameState.roundStats.correct++;
        
        updateDisplay();
        
        if (gameState.teams[1].score >= gameState.targetScore) {
            endGame();
            return;
        }
        
        endRound();
    } else {
        // Обычный режим - пропуск слова
        playSound('skip');
        gameState.roundStats.skipped++;
        updateDisplay();
        nextWord();
    }
}

function endRound() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    gameState.roundActive = false;
    gameState.lastWordMode = false; // Сбрасываем режим последнего слова
    
    playSound('endRound');
    
    document.getElementById('startRoundBtn').classList.remove('hidden');
    document.getElementById('correctBtn').classList.add('hidden');
    document.getElementById('skipBtn').classList.add('hidden');
    document.getElementById('endRoundBtn').classList.add('hidden');
    document.getElementById('roundStats').classList.add('hidden');
    
    document.getElementById('currentWord').textContent = 'Раунд окончен';
    
    // Переход к следующей команде
    gameState.currentTeam = (gameState.currentTeam + 1) % 2;
    
    // Если прошли обе команды, переходим к следующему игроку в командах
    if (gameState.currentTeam === 0) {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % 2;
        gameState.round++;
    }
    
    updateDisplay();
}

function endGame() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    playSound('victory');
    
    showScreen('results');
    
    // Безопасное обновление финальных результатов
    const finalScore1 = document.getElementById('finalScore1');
    const finalScore2 = document.getElementById('finalScore2');
    const winnerElement = document.getElementById('winner');
    
    if (finalScore1) finalScore1.textContent = gameState.teams[0].score;
    if (finalScore2) finalScore2.textContent = gameState.teams[1].score;
    
    const winner = gameState.teams[0].score >= gameState.targetScore ? 
        gameState.teams[0].name : gameState.teams[1].name;
    if (winnerElement) winnerElement.textContent = `${winner} победила!`;
}

function newGame() {
    gameState = {
        teams: [
            { name: 'Команда 1', players: gameState.teams[0].players, score: 0 },
            { name: 'Команда 2', players: gameState.teams[1].players, score: 0 }
        ],
        currentTeam: 0,
        currentPlayer: 0,
        roundTime: gameState.roundTime,
        targetScore: gameState.targetScore,
        timer: null,
        timeLeft: gameState.roundTime,
        roundActive: false,
        usedWords: [],
        currentWord: '',
        roundStats: { correct: 0, skipped: 0 },
        round: 1,
        lastWordMode: false
    };
    
    showScreen('game');
    document.getElementById('currentWord').textContent = 'Нажмите "Начать раунд"';
    updateDisplay();
}

function backToSetup() {
    showScreen('setup');
}

function backToMenu() {
    showScreen('menu');
}

// Инициализация
window.addEventListener('load', () => {
    loadSavedNames();
    generateNewTeamNames(); // Устанавливаем случайные имена команд при загрузке
    updateDisplay();
    showMenu(); // Показываем меню при загрузке
});