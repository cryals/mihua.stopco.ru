// Загрузка и отображение диет
async function loadDiets() {
  try {
    const response = await fetch('data/diets.json');
    const diets = await response.json();
    displayDiets(diets);
  } catch (error) {
    console.error('Ошибка загрузки диет:', error);
    showToast('Ошибка загрузки данных о диетах', 'exclamation-triangle');
  }
}

function displayDiets(diets) {
  const container = document.getElementById('diets-container');
  container.innerHTML = '';
  
  diets.forEach(diet => {
    const card = document.createElement('div');
    card.className = 'diet-card';
    
    const iconMap = {
      'Обычное здоровое питание': 'user-friends',
      'Диабет 2 типа': 'heartbeat',
      'Похудение': 'weight',
      'Набор массы': 'dumbbell',
      'Спортивное питание': 'running'
    };
    
    card.innerHTML = `
      <h3><i class="fas fa-${iconMap[diet.name] || 'utensils'}"></i> ${diet.name}</h3>
      <p>${diet.description}</p>
      
      <div class="diet-info">
        <div><i class="fas fa-fire"></i> <strong>Калории:</strong> ${diet.calories} ккал/день</div>
        <div><i class="fas fa-drumstick-bite"></i> <strong>Белки:</strong> ${diet.protein}</div>
        <div><i class="fas fa-oil-can"></i> <strong>Жиры:</strong> ${diet.fats}</div>
        <div><i class="fas fa-bread-slice"></i> <strong>Углеводы:</strong> ${diet.carbs}</div>
        <div><i class="fas fa-clock"></i> <strong>Приёмов пищи:</strong> ${diet.meals}</div>
      </div>
      
      <div style="margin-top: 12px;">
        <strong><i class="fas fa-list"></i> Основные правила:</strong>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 13px;">
          ${diet.rules.map(rule => `<li>${rule}</li>`).join('')}
        </ul>
      </div>
      
      <div style="margin-top: 12px;">
        <strong><i class="fas fa-check-circle"></i> Приоритетные продукты:</strong>
        <p style="font-size: 13px; margin-top: 6px;">${diet.priority_products.join(', ')}</p>
      </div>
    `;
    
    container.appendChild(card);
  });
}
