let container = document.getElementById('results');
let animationId = null;
let currentUserToken = ""; 
const secret = "52";

let charData;

window.addEventListener('DOMContentLoaded', async () => {
  try {
    currentUserToken = localStorage.getItem('token');
    updateAuthButtons();
    const response = await fetch('/allChars');
    if (!response.ok) throw new Error('Ошибка загрузки');

    charData = await response.json();

    const allVaks = charData.runners.sort((a, b) => Number(b.speed) - Number(a.speed));
    allVaks.forEach((vak4, index)=>
    {
    if(index > 99)
    {
        return;
    }

    const formData = new FormData();
    formData.append("token", vak4.owner);
    fetch('/getUsernameByToken', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const username = data.username;
            const cardDiv = document.createElement('div');

            cardDiv.style.background = "#363B49";
            cardDiv.style.borderRadius = "10px";
            cardDiv.style.padding = "1%";
            cardDiv.style.width = "98%";
            cardDiv.style.height = "150px";
            cardDiv.style.margin = "auto";
            cardDiv.style.marginBottom = '10px';
            cardDiv.style.marginLeft = "-1px";
            cardDiv.style.border = "1px solid #85878F";
            cardDiv.style.display = "flex";

            const charImage = document.createElement('img');
            charImage.src = vak4.url; 
            charImage.alt = vak4.name;
            charImage.style.width = '123px';
            charImage.style.height = '120px';
            charImage.style.objectFit = 'cover';
            charImage.style.borderRadius = '10px';
            charImage.style.marginBottom = '10px';
            charImage.style.border = "1px solid #85878F";

            const indexText = document.createElement('div');
            indexText.textContent = `№${index+1}`;
            indexText.style.marginRight = '20px';
            indexText.style.background = '#363B49';
            indexText.style.border = "1px solid #96979ED1";
            indexText.style.borderRadius = '10px';
            indexText.style.alignContent = 'center';
            indexText.style.height = '30px';
            indexText.style.width = '31px';
            indexText.style.textAlign = 'center';
            indexText.style.fontSize = '18px';
            
            const nameText = document.createElement('div');
            nameText.textContent = `Имя БОЙЦА: ${vak4.name}\n Владелец: ${username}`;
            nameText.style.whiteSpace = 'pre-line';
            nameText.style.marginBottom = '10px';
            nameText.style.paddingLeft = '10px';
            nameText.style.fontSize = 'xx-large';

            container.appendChild(cardDiv);
            cardDiv.appendChild(indexText);
            cardDiv.appendChild(charImage);
            cardDiv.appendChild(nameText);

        } else {
            errorDiv.textContent = data.message || 'Ошибка четотам';
        }
    })
    .catch(error => {
        console.log(error);
    });

    
    });
  } catch (err) {
    console.error(err);
  }
});

const userPanelContainer = document.createElement('div');
userPanelContainer.className = 'user-panel-container';

const userPanel = document.createElement('div');
userPanel.className = 'user-panel';
userPanel.innerHTML = `
    <div class="user-avatar">
        <img src="https://i.imgur.com/Mk9hgo0_d.jpeg?maxwidth=520&shape=thumb&fidelity=high" alt="" class="avatar-img" style="object-fit: cover;width: 100%; height: 100%;">
    </div>
    <div class="user-info">
        <span class="user-name">Игрок</span>
    </div>
`;

const blocker = document.createElement('div');
blocker.className = 'blocker';
const ButtonOut = document.createElement('div');
ButtonOut.className = 'ButtonOut';
const ButtonIn = document.createElement('div');
ButtonIn.className = 'ButtonIn';

userPanelContainer.appendChild(ButtonOut);
userPanelContainer.appendChild(userPanel);
userPanelContainer.appendChild(blocker);
document.body.appendChild(userPanelContainer);

let isAnimating = false;
let isShifted = false;

userPanel.addEventListener('mouseenter', function() {
    if (!isShifted && !isAnimating) {
        isAnimating = true;
        userPanel.classList.remove('returning');
        userPanel.classList.add('shifted');
    }
});

userPanel.addEventListener('transitionend', function(e) {
    if (e.propertyName === 'transform') {
        isAnimating = false;
        
        if (userPanel.classList.contains('shifted')) {
            isShifted = true;
          setTimeout(() => {
            isAnimating = true;
            userPanel.classList.remove('shifted');
            userPanel.classList.add('returning');
          },3000);
        } else if (userPanel.classList.contains('returning')) {
            isShifted = false;
            blocker.classList.remove('active');
        }
    }
});

userPanel.addEventListener('mouseleave', function() {
});

window.addEventListener('load', () => {
if (currentUserToken) {
  const formData = new FormData();
  formData.append("token", currentUserToken);
  fetch('/login', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      if (document.querySelector('.user-name')) {
        document.querySelector('.user-name').textContent = data.username;
      }

      const formData = new FormData();
      formData.append('token', currentUserToken);
      fetch('/chars', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          charData = data.data;
          charData.forEach((char, index) => {
            char.id = index + 1;
          });
          errorDiv.textContent = 'Все ок.';
        } else {
          errorDiv.textContent = data.message || 'Ошибка получения бойцов';
        }
      })
      .catch(error => {
        console.log(error);
        errorDiv.textContent = 'Ошибка соединения';
      });
    }
  });
}
});

// тут кнопка выхода
ButtonOut.addEventListener('click', function() {
    const exitContainer = document.createElement('div');
    exitContainer.classList.add('exitContainer');
    const shadowing = document.createElement('div');
    shadowing.classList.add('shadowing');
    
    exitContainer.innerHTML = `
        <div class="exit-content">
            <h3>Вы действительно хотите выйти?</h3>
            <div class="exit-buttons">
                <button id="confirmExit" class="exit-confirm">Да</button>
                <button id="cancelExit" class="exit-cancel">Нет</button>
            </div>
        </div>
    `;
    document.body.appendChild(shadowing);
    document.body.appendChild(exitContainer);
    
    document.getElementById('confirmExit').addEventListener('click', function() {
        if (document.querySelector('.user-name')) {
            document.querySelector('.user-name').textContent = "Игрок";
        }
        currentUserToken = "";
        localStorage.setItem('token', currentUserToken);
        updateAuthButtons();
        document.body.removeChild(exitContainer);
        document.body.removeChild(shadowing);
        showAuthModal();
    });
    
    document.getElementById('cancelExit').addEventListener('click', function() {
        document.body.removeChild(exitContainer);
        document.body.removeChild(shadowing);
    });

});
ButtonIn.addEventListener('click',function()
{
  showAuthModal();
});
function updateAuthButtons() {
    if(!currentUserToken) {
        if (document.body.contains(ButtonOut)) {
            ButtonOut.replaceWith(ButtonIn);
        }
    } else {
        if (document.body.contains(ButtonIn)) {
            ButtonIn.replaceWith(ButtonOut);
        }
    }
}
function showAuthModal() {
        if(currentUserToken)
        {
            return;
        }
        const shadowing = document.createElement('div');
        shadowing.classList.add('shadowing');
        shadowing.id = 'authShadowing';
        
        const authContainer = document.createElement('div');
        authContainer.classList.add('authContainer');
        authContainer.id = 'authContainer';
        
        authContainer.innerHTML = `
            <div class="auth-switch" data-active="left">
            <button class="auth-switch-btn" data-side="left">Авторизация</button>
            <button class="auth-switch-btn" data-side="right">Регистрация</button>
           </div>            
            <div class="auth-content">
                <div id="loginForm" class="auth-form active">
                    <h3>Авторизация</h3>
                    <input type="text" id="loginUsername" class="auth-input" placeholder="Логин">
                    <input type="password" id="loginPassword" class="auth-input" placeholder="Пароль">
                    <button id="loginSubmit" class="auth-submit">Войти</button>
                    <div id="loginError" class="auth-error"></div>
                </div>
                
                <div id="signupForm" class="auth-form">
                    <h3>Регистрация</h3>
                    <input type="text" id="signupUsername" class="auth-input" placeholder="Логин">
                    <input type="password" id="signupPassword" class="auth-input" placeholder="Пароль">
                    <button id="signupSubmit" class="auth-submit">Зарегистрироваться</button>
                    <div id="signupError" class="auth-error"></div>
                </div>
            </div>
            
            <button id="authSkip" class="auth-skip">Пропустить</button>
        `;
        
        document.body.appendChild(shadowing);
        document.body.appendChild(authContainer);
        
       const switchEl = document.querySelector('.auth-switch');
        const buttons = document.querySelectorAll('.auth-switch-btn');

        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        function updateForms() {
          const active = switchEl.dataset.active;
          const isLeft = active === 'left';
          
          loginForm.classList.toggle('active', isLeft);
          signupForm.classList.toggle('active', !isLeft);
          
          const loginTitle = loginForm.querySelector('h3');
          const signupTitle = signupForm.querySelector('h3');
          
          if (isLeft) {
            loginTitle.textContent = 'Авторизация';
            signupTitle.textContent = 'Регистрация';
          } else {
            loginTitle.textContent = 'Вход';
            signupTitle.textContent = 'Создать аккаунт';
          }
        }

        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            const side = btn.dataset.side;
            switchEl.dataset.active = side;
            updateForms();
          });
        });

        updateForms();
        
        document.getElementById('loginSubmit').addEventListener('click', function() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const errorDiv = document.getElementById('loginError');
            
            if (!username || !password) {
                errorDiv.textContent = 'Заполните все поля';
                return;
            }
            hs256(username + password, secret).then(token => {
            currentUserToken = token;
            localStorage.setItem('token', currentUserToken);
            const formData = new FormData();
            formData.append("token", currentUserToken);
            fetch('/login', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    closeAuthModal();
                    if (document.querySelector('.user-name')) {
                        document.querySelector('.user-name').textContent = username;
                    }
                    // currentUserToken = await hs256(username+password, secret);
                    const formData = new FormData();
                    formData.append('token', currentUserToken);
                    fetch('/chars', {
                      method: 'POST',
                      body: formData
                    }).then(response => response.json())
            .       then(data => {
                    if (data.success) {
                        charData = data.data;
                        // charData.sort((a, b) => a.id - b.id);
                        charData.forEach((char, index) => {
                          char.id = index + 1;
                        });
                        errorDiv.textContent = 'Все ок.';
                    } else {
                        errorDiv.textContent = data.message || 'Ошибка получения бойцов';
                    }
                    updateAuthButtons();
            })
            .catch(error => {
                console.log(error);
                errorDiv.textContent = 'Ошибка соединения';
            });
                    }});
            })
            .catch(error => {
                errorDiv.textContent = 'Ошибка соединения';
            });
        });
        
        document.getElementById('signupSubmit').addEventListener('click', function() {
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            // const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
            const errorDiv = document.getElementById('signupError');
            
            if (!username || !password) {
                errorDiv.textContent = 'Заполните все поля';
                return;
            }

            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password); 
            fetch('/signup', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    errorDiv.textContent = 'Регистрация успешна! Теперь войдите.';
                    tabs[0].click();
                } else {
                    errorDiv.textContent = data.message || 'Ошибка регистрации';
                }
            })
            .catch(error => {
                console.log(error);
                errorDiv.textContent = 'Ошибка соединения';
            });
        });
        
        document.getElementById('authSkip').addEventListener('click', function() {
            closeAuthModal();
        });
        
        function closeAuthModal() {
            document.body.removeChild(shadowing);
            document.body.removeChild(authContainer);
        }
    }
async function hs256(message, secret) {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);

  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}