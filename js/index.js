const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    searchUsers(searchTerm);
  }
});

async function searchUsers(searchTerm) {
  const url = `https://api.github.com/search/users?q=${searchTerm}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    displayUsers(data.items);
  } catch (error) {
    console.log('Error searching users:', error);
  }
}

function displayUsers(users) {
  resultsContainer.innerHTML = '';

  if (users.length === 0) {
    resultsContainer.innerHTML = '<p>No users found.</p>';
    return;
  }

  const userList = document.createElement('ul');
  userList.classList.add('user-list');

  users.forEach(user => {
    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}">
      <div>
        <h3>${user.login}</h3>
        <a href="${user.html_url}" target="_blank">Profile</a>
      </div>
    `;
    listItem.addEventListener('click', () => {
      getUserRepos(user.login);
    });
    userList.appendChild(listItem);
  });

  resultsContainer.appendChild(userList);
}

async function getUserRepos(username) {
  const url = `https://api.github.com/users/${username}/repos`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    displayRepos(data);
  } catch (error) {
    console.log('Error fetching user repositories:', error);
  }
}

function displayRepos(repos) {
  resultsContainer.innerHTML = '';

  if (repos.length === 0) {
    resultsContainer.innerHTML = '<p>No repositories found.</p>';
    return;
  }

  const repoList = document.createElement('ul');
  repoList.classList.add('repo-list');

  repos.forEach(repo => {
    const listItem = document.createElement('li');
    listItem.classList.add('repo-item');
    listItem.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description}</p>
      <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
    repoList.appendChild(listItem);
  });

  resultsContainer.appendChild(repoList);
}
