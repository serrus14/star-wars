const $charList = document.querySelector('#charList');
const $charsLoader = document.querySelector('#charsLoader');
const $loadMoreBtn = document.querySelector('#loadMoreBtn');

const charIds = charUrls.split(',').map(char => char.replace(/[^\d]/g, ''));
const loadedChars = [];

const loadChars = async () => {
  $charsLoader.classList.remove('d-none');
  $loadMoreBtn.setAttribute('disabled', '');
  for (let charId of charIds.slice(loadedChars.length, loadedChars.length + 10))
    loadedChars.push(await (await fetch(`https://star--wars.herokuapp.com/people/${charId}`)).json());
  $charsLoader.classList.add('d-none');
  $loadMoreBtn.removeAttribute('disabled');
};

const renderChar = char => `<div class="char-card default-bg-colors">
  <div class="d-flex">
    <img class="char-card__img default-bg-colors" style="background-image: url(${char.image})" />
    <div class="char-card__body">
      <h6>${char.name}</h6>
      <a href="${char.wiki}" target="_blank">
        <span>WIKI</span>
        <i class="bi bi-box-arrow-up-right"></i>
      </a>
    </div>
  </div>
</div>`;

const renderChars = async () => {
  await loadChars();
  $charList.innerHTML = loadedChars.map(c => renderChar(c)).join('');
  if (loadedChars.length < charIds.length) {
    $loadMoreBtn.classList.remove('d-none');
    $loadMoreBtn.addEventListener('click', renderChars);
  } else {
    $loadMoreBtn.removeEventListener('click', renderChars);
    $loadMoreBtn.classList.add('d-none');
  }
};

renderChars();
