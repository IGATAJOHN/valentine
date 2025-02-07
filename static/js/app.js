async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button');
  submitBtn.classList.add('loading');

  // Prepare JSON payload
  const requestData = {
    partnerName: document.querySelector('#partnerName').value,
    interests: document.querySelector('#interests').value,
    hobbies: document.querySelector('#hobbies').value,
    budget: document.querySelector('#budget').value
  };

  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)  // Ensure JSON data is sent properly
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage.error || "API error");
    }

    const { gifts } = await response.json();
    displayResults(gifts);
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    submitBtn.classList.remove('loading');
  }
}

document.getElementById('giftForm').addEventListener('submit', handleSubmit);

function displayResults(gifts) {
  const container = document.getElementById('results');
  container.innerHTML = gifts.map((gift, index) => `
    <div class="gift-card bg-white p-6 rounded-2xl shadow-md flex gap-6" style="animation-delay: ${index * 0.1}s">
      <div class="gift-image w-32 h-32 bg-amber-100 rounded-lg flex items-center justify-center text-4xl">
        🎁
      </div>
      <div class="gift-details flex-1">
        <h3 class="text-xl font-bold text-pink-600 mb-2">${gift.title}</h3>
        <p class="text-gray-700 mb-3">${gift.description}</p>
        <div class="text-indigo-600 font-bold mb-2">${gift.price}</div>
        <div class="text-gray-600 mb-3">${gift.retailer}</div>
        <a href="${gift.link}" target="_blank" class="inline-block bg-indigo-600 text-white py-2 px-5 rounded-full hover:translate-y-[-2px] transition-transform">
          View Deal
        </a>
      </div>
    </div>
  `).join('');
}

// Initialize floating hearts animation
function createFloatingHearts() {
  const container = document.querySelector('.heart-animation');
  const heartCount = 15;
  
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heart.style.opacity = Math.random();
    container.appendChild(heart);
  }
}

document.getElementById('giftForm').addEventListener('submit', handleSubmit);
window.addEventListener('DOMContentLoaded', createFloatingHearts);