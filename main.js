const body = $0;
const container = document.createElement('div');
container.style.height = '500px';
container.style.overflowY = 'scroll';
container.style.border = '1px solid red';
container.style.marginTop = '20px';
body.appendChild(container);

const itemHeight = 50;
const totalItems = 1000;
const buffer = 5; // Number of items to render above and below the viewport

let start = 0;
let end = 0;

const renderItems = () => {
  const scrollTop = container.scrollTop;
  const visibleItems = Math.ceil(container.clientHeight / itemHeight);
  start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  end = Math.min(totalItems, start + visibleItems + 2 * buffer);

  container.innerHTML = ''; // Clear existing items

  for (let i = start; i < end; i++) {
    const item = document.createElement('div');
    item.style.height = `${itemHeight}px`;
    item.style.borderBottom = '1px solid #ccc';
    item.textContent = `Item ${i + 1}`;
    container.appendChild(item);
  }
};

container.addEventListener('scroll', renderItems);

// Initial render
renderItems();

const data = {
  message: 'Virtual scrolling implemented',
};
