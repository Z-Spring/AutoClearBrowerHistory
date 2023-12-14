document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.getElementById('addButton');
  const newWebsiteInput = document.getElementById('newWebsite');
  const websiteListElement = document.getElementById('websiteList');

  function saveWebsites(websites) {
    chrome.storage.sync.set({ 'websitesToClear': websites }, function () {
      console.log('网站列表已保存。');
    });
  }

  function removeWebsite(website) {
    chrome.storage.sync.get('websitesToClear', function (data) {
      const websites = data.websitesToClear || [];
      const newWebsites = websites.filter(w => w !== website);
      saveWebsites(newWebsites);
      renderWebsites(newWebsites);
    });
  }

  function renderWebsites(websites) {
    websiteListElement.innerHTML = ''; // 清空当前列表
    websites.forEach(website => {
      const div = document.createElement('div');
      div.className = 'website-item';
      div.textContent = website;
      const removeButton = document.createElement('button');
      removeButton.textContent = '移除';
      removeButton.onclick = function () { removeWebsite(website); };
      div.appendChild(removeButton);
      websiteListElement.appendChild(div);
    });
  }

  // 加载已保存的网站列表并渲染
  chrome.storage.sync.get('websitesToClear', function (data) {
    if (data.websitesToClear) {
      renderWebsites(data.websitesToClear);
    }
  });

  // 添加按钮点击事件
  addButton.addEventListener('click', function () {
    const website = newWebsiteInput.value.trim();
    if (website) {
      chrome.storage.sync.get('websitesToClear', function (data) {
        const websites = data.websitesToClear || [];
        if (!websites.includes(website)) {
          websites.push(website);
          saveWebsites(websites);
          renderWebsites(websites);
        }
        newWebsiteInput.value = ''; // 清空输入框
      });
    }
  });
});
