let allProducts = [];

// Загрузка продуктов
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    allProducts = await response.json();
    displayProducts(allProducts);
    initProductSearch();
  } catch (error) {
    console.error('Ошибка загрузки продуктов:', error);
    showToast('Ошибка загрузки базы продуктов', 'exclamation-triangle');
  }
}

function displayProducts(products) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';
  
  // Группируем по категориям
  const categories = {};
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  });
  
  // Иконки для категорий
  const iconMap = {
    'Мясо и птица': 'drumstick-bite',
    'Рыба и морепродукты': 'fish',
    'Молочные продукты': 'cheese',
    'Яйца': 'egg',
    'Овощи': 'carrot',
    'Фрукты': 'apple-alt',
    'Злаки и хлеб': 'bread-slice',
    'Масла и жиры': 'oil-can',
    'Орехи и семена': 'seedling',
    'Напитки': 'mug-hot'
  };
  
  // Отображаем каждую категорию
  Object.keys(categories).forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'product-category';
    
    // Заголовок (один раз)
    const headerHTML = `
      <h3><i class="fas fa-${iconMap[category] || 'utensils'}"></i> ${category}</h3>
    `;
    
    // Таблица для ПК
    const tableHTML = `
      <table class="product-table">
        <thead>
          <tr>
            <th>Продукт</th>
            <th>Вес (г)</th>
            <th>Калории</th>
            <th>Белки (г)</th>
            <th>Жиры (г)</th>
            <th>Углеводы (г)</th>
          </tr>
        </thead>
        <tbody>
          ${categories[category].map(p => `
            <tr>
              <td>${p.name}</td>
              <td>${p.weight}</td>
              <td>${p.calories}</td>
              <td>${p.protein}</td>
              <td>${p.fat}</td>
              <td>${p.carbs}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    // Карточки для мобильных (без заголовка)
    const cardsHTML = `
      <div class="product-cards">
        ${categories[category].map(p => `
          <div class="product-card-item">
            <div class="product-card-name">
              <i class="fas fa-${iconMap[category] || 'utensils'}"></i>
              <span>${p.name}</span>
            </div>
            <div class="product-card-info">
              <div class="product-card-info-item">
                <span class="product-card-label">Вес</span>
                <span class="product-card-value">${p.weight} г</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Калории</span>
                <span class="product-card-value">${p.calories} ккал</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Белки</span>
                <span class="product-card-value">${p.protein} г</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Жиры</span>
                <span class="product-card-value">${p.fat} г</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Углеводы</span>
                <span class="product-card-value">${p.carbs} г</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Собираем всё вместе
    categoryDiv.innerHTML = headerHTML + tableHTML + cardsHTML;
    container.appendChild(categoryDiv);
  });
}

function initProductSearch() {
  const searchInput = document.getElementById('product-search');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
      displayProducts(allProducts);
      return;
    }
    
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
    
    displayProducts(filtered);
    
    if (filtered.length === 0) {
      document.getElementById('products-container').innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--muted);">
          <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px;"></i>
          <p>Продукты не найдены. Попробуйте другой запрос.</p>
        </div>
      `;
    }
  });
}

// Загрузка макронутриентов
async function loadMacros() {
  try {
    const response = await fetch('data/macros.json');
    const macros = await response.json();
    displayMacros(macros, 'all');
    initMacroFilters(macros);
  } catch (error) {
    console.error('Ошибка загрузки макронутриентов:', error);
  }
}

function displayMacros(macros, filter = 'all') {
  const container = document.getElementById('macros-container');
  
  let filtered = macros;
  if (filter !== 'all') {
    filtered = macros.filter(item => item.type === filter);
  }
  
  // Группируем по подкатегориям
  const groups = {};
  filtered.forEach(item => {
    if (!groups[item.subcategory]) {
      groups[item.subcategory] = [];
    }
    groups[item.subcategory].push(item);
  });
  
  container.innerHTML = '';
  
  Object.keys(groups).forEach(subcategory => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'product-category';
    
    // Заголовок (один раз)
    const headerHTML = `
      <h3><i class="fas fa-list"></i> ${subcategory}</h3>
    `;
    
    // Таблица для ПК
    const tableHTML = `
      <table class="product-table">
        <thead>
          <tr>
            <th>Продукт</th>
            <th>Вес</th>
            <th>Калории</th>
            <th>Белки (г)</th>
            <th>Жиры (г)</th>
            <th>Углеводы (г)</th>
          </tr>
        </thead>
        <tbody>
          ${groups[subcategory].map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.weight}</td>
              <td>${item.calories}</td>
              <td>${item.protein}</td>
              <td>${item.fat}</td>
              <td>${item.carbs}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    // Карточки для мобильных (без заголовка)
    const cardsHTML = `
      <div class="product-cards">
        ${groups[subcategory].map(item => `
          <div class="product-card-item">
            <div class="product-card-name">
              <i class="fas fa-utensils"></i>
              <span>${item.name}</span>
            </div>
            <div class="product-card-info">
              <div class="product-card-info-item">
                <span class="product-card-label">Вес</span>
                <span class="product-card-value">${item.weight}</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Калории</span>
                <span class="product-card-value">${item.calories} ккал</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Белки</span>
                <span class="product-card-value">${item.protein} г</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Жиры</span>
                <span class="product-card-value">${item.fat} г</span>
              </div>
              <div class="product-card-info-item">
                <span class="product-card-label">Углеводы</span>
                <span class="product-card-value">${item.carbs} г</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Собираем всё вместе
    categoryDiv.innerHTML = headerHTML + tableHTML + cardsHTML;
    container.appendChild(categoryDiv);
  });
}

function initMacroFilters(macros) {
  const buttons = document.querySelectorAll('.macro-controls .btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Убираем accent у всех кнопок
      buttons.forEach(btn => btn.classList.remove('accent'));
      // Добавляем accent к нажатой
      button.classList.add('accent');
      
      const category = button.getAttribute('data-category');
      displayMacros(macros, category);
    });
  });
}

// Загрузка меню
async function loadMealPlans() {
  try {
    const response = await fetch('data/meal-plans.json');
    const mealPlans = await response.json();
    displayMealCalendar(mealPlans.normal);
    initMealSelector(mealPlans);
  } catch (error) {
    console.error('Ошибка загрузки меню:', error);
  }
}

function displayMealCalendar(plan) {
  const container = document.getElementById('meals-container');
  
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const dayIcons = ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌙', '✨'];
  
  // Заголовок календаря
  const header = `
    <div class="calendar-header">
      <h2><i class="fas fa-calendar-week"></i> ${plan.name}</h2>
      <div class="calendar-info">
        <div><i class="fas fa-fire"></i> ${plan.calories} ккал/день</div>
        <div><i class="fas fa-utensils"></i> 5 приёмов пищи</div>
      </div>
    </div>
    
    <div class="meal-legend">
      <div class="legend-item breakfast">
        <div class="legend-color"></div>
        <span><i class="fas fa-sunrise"></i> Завтрак</span>
      </div>
      <div class="legend-item snack1">
        <div class="legend-color"></div>
        <span><i class="fas fa-cookie-bite"></i> Перекус</span>
      </div>
      <div class="legend-item lunch">
        <div class="legend-color"></div>
        <span><i class="fas fa-sun"></i> Обед</span>
      </div>
      <div class="legend-item snack2">
        <div class="legend-color"></div>
        <span><i class="fas fa-coffee"></i> Полдник</span>
      </div>
      <div class="legend-item dinner">
        <div class="legend-color"></div>
        <span><i class="fas fa-moon"></i> Ужин</span>
      </div>
    </div>
  `;
  
  // Создаём календарь
  let calendarHTML = '<div class="meal-calendar">';
  
  plan.days.forEach((day, index) => {
    const dayName = daysOfWeek[index] || `День ${index + 1}`;
    const dayIcon = dayIcons[index] || '📅';
    const dayDate = `День ${index + 1}`;
    
    calendarHTML += `
      <div class="calendar-day">
        <div class="calendar-day-header">
          <div class="calendar-day-name">
            <span>${dayIcon}</span>
            <span>${dayName}</span>
          </div>
          <div class="calendar-day-date">${dayDate}</div>
        </div>
        
        <div class="calendar-meals">
          <div class="calendar-meal breakfast">
            <div class="calendar-meal-title">
              <i class="fas fa-sunrise"></i>
              <span>Завтрак (7:00)</span>
            </div>
            <div class="calendar-meal-items">${day.breakfast.items.join(', ')}</div>
            <div class="calendar-meal-calories"><i class="fas fa-fire"></i> ${day.breakfast.calories} ккал</div>
          </div>
          
          <div class="calendar-meal snack1">
            <div class="calendar-meal-title">
              <i class="fas fa-cookie-bite"></i>
              <span>Перекус (10:00)</span>
            </div>
            <div class="calendar-meal-items">${day.snack1.items.join(', ')}</div>
            <div class="calendar-meal-calories"><i class="fas fa-fire"></i> ${day.snack1.calories} ккал</div>
          </div>
          
          <div class="calendar-meal lunch">
            <div class="calendar-meal-title">
              <i class="fas fa-sun"></i>
              <span>Обед (13:00)</span>
            </div>
            <div class="calendar-meal-items">${day.lunch.items.join(', ')}</div>
            <div class="calendar-meal-calories"><i class="fas fa-fire"></i> ${day.lunch.calories} ккал</div>
          </div>
          
          <div class="calendar-meal snack2">
            <div class="calendar-meal-title">
              <i class="fas fa-coffee"></i>
              <span>Полдник (16:00)</span>
            </div>
            <div class="calendar-meal-items">${day.snack2.items.join(', ')}</div>
            <div class="calendar-meal-calories"><i class="fas fa-fire"></i> ${day.snack2.calories} ккал</div>
          </div>
          
          <div class="calendar-meal dinner">
            <div class="calendar-meal-title">
              <i class="fas fa-moon"></i>
              <span>Ужин (19:00)</span>
            </div>
            <div class="calendar-meal-items">${day.dinner.items.join(', ')}</div>
            <div class="calendar-meal-calories"><i class="fas fa-fire"></i> ${day.dinner.calories} ккал</div>
          </div>
        </div>
        
        <div class="calendar-day-total">
          <i class="fas fa-calculator"></i>
          <span>Итого: ${day.total} ккал</span>
        </div>
      </div>
    `;
  });
  
  // Добавляем пустые дни если их меньше 7
  for(let i = plan.days.length; i < 7; i++) {
    const dayName = daysOfWeek[i];
    const dayIcon = dayIcons[i];
    
    calendarHTML += `
      <div class="calendar-day empty">
        <div class="calendar-day-header">
          <div class="calendar-day-name">
            <span>${dayIcon}</span>
            <span>${dayName}</span>
          </div>
          <div class="calendar-day-date">День ${i + 1}</div>
        </div>
        <div class="empty-message">
          <i class="fas fa-calendar-plus"></i>
          <span>Меню в разработке</span>
        </div>
      </div>
    `;
  }
  
  calendarHTML += '</div>';
  
  container.innerHTML = header + calendarHTML;
}

function initMealSelector(mealPlans) {
  const buttons = document.querySelectorAll('.meal-type-selector .btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('accent'));
      button.classList.add('accent');
      
      const dietType = button.getAttribute('data-diet');
      displayMealCalendar(mealPlans[dietType]);
    });
  });
}
