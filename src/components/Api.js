class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _returnResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._returnResponse);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._returnResponse);
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-12',
  headers: {
    authorization: '71b91625-ec4b-4170-b042-4d00aa6f06b7',
    'Content-Type': 'application/json',
  },
});

export { api };
