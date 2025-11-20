// Инициализация космического фона
function initSpace() {
  const space = document.getElementById('space');
  
  // Создаём звёзды
  for(let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'stars';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    star.style.animationDelay = Math.random() * 3 + 's';
    space.appendChild(star);
  }
  
  // Создаём падающие линии
  for(let i = 0; i < 30; i++) {
    const line = document.createElement('div');
    line.className = 'lines';
    line.style.left = Math.random() * 100 + '%';
    line.style.animationDuration = (2 + Math.random() * 4) + 's';
    line.style.animationDelay = Math.random() * 2 + 's';
    line.style.opacity = Math.random() * 0.7;
    space.appendChild(line);
  }
}

// Навигация между секциями
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav a[data-section]');
  const sections = document.querySelectorAll('.card');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Убираем активный класс у всех секций
      sections.forEach(section => section.classList.remove('active-section'));
      
      // Убираем accent у всех кнопок навигации
      navLinks.forEach(l => l.classList.remove('accent'));
      
      // Добавляем accent к текущей кнопке
      link.classList.add('accent');
      
      // Показываем нужную секцию
      const targetSection = link.getAttribute('data-section');
      const section = document.getElementById(targetSection);
      if(section) {
        section.classList.add('active-section');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Закрываем мобильное меню
      closeMobileMenu();
    });
  });
}

// Мобильное меню
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const panel = document.querySelector('.panel');
  const overlay = document.getElementById('mobile-overlay');
  
  if (!menuToggle || !panel || !overlay) return;
  
  // Открытие меню
  menuToggle.addEventListener('click', () => {
    panel.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  });
  
  // Закрытие по клику на оверлей
  overlay.addEventListener('click', () => {
    closeMobileMenu();
  });
  
  // Закрытие по свайпу влево
  let touchStartX = 0;
  let touchEndX = 0;
  
  panel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  panel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      closeMobileMenu();
    }
  }
}

function closeMobileMenu() {
  const panel = document.querySelector('.panel');
  const overlay = document.getElementById('mobile-overlay');
  
  if (panel) panel.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

// Toast уведомления
function showToast(message, icon = 'check-circle') {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Функция для создания эффекта падающих эмоджи
function createEmojiEffect(event) {
  const emojis = ['🥗', '🥑', '🍎', '🥕', '🥦', '🍇', '🥤', '💪'];
  const buttonRect = event.currentTarget.getBoundingClientRect();
  const emojiCount = 1;
  
  for (let i = 0; i < emojiCount; i++) {
    const emoji = document.createElement('div');
    emoji.style.cssText = `
      position: fixed;
      font-size: 24px;
      pointer-events: none;
      z-index: 1000;
    `;
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    const xPos = Math.random() * buttonRect.width;
    emoji.style.left = `${buttonRect.left + xPos}px`;
    emoji.style.top = `${buttonRect.top}px`;
    
    const duration = 1 + Math.random() * 1.5;
    emoji.style.animation = `emojiFall ${duration}s forwards`;
    
    document.body.appendChild(emoji);
    
    setTimeout(() => {
      if (emoji.parentNode) {
        emoji.parentNode.removeChild(emoji);
      }
    }, duration * 1000);
  }
}

// Добавляем анимацию падения эмоджи
const style = document.createElement('style');
style.textContent = `
  @keyframes emojiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100px) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initSpace();
  initNavigation();
  initMobileMenu();
  
  // Добавляем эффект эмоджи ко всем кнопкам навигации
  document.querySelectorAll('.nav .btn').forEach(button => {
    button.addEventListener('click', createEmojiEffect);
  });
  
  // Загружаем данные
  loadDiets();
  loadProducts();
  loadMacros();
  loadMealPlans();
});

// Утилиты для форматирования
function formatNumber(num) {
  return num.toFixed(1).replace('.', ',');
}
