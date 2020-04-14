const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function queryCurrencyExchange() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

// Запрашиваем курс валют каждую минуту
const intervalIdForCurrencyExchange = setInterval(
  queryCurrencyExchange(),
  60000
);

// Операции с деньгами
const moneyManager = new MoneyManager();

// Пополнение баланса
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, "Баланс успешно пополнен.");
    } else {
      moneyManager.setMessage(true, response.data);
    }
  });
};

// Конвертация валюты
moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, "Конвертация прошла успешна.");
    } else {
      moneyManager.setMessage(true, response.data);
    }
  });
};

// Перевод валюты
moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, "Трансфер прошёл успешно.");
    } else {
      moneyManager.setMessage(true, response.data);
    }
  });
};

// Работа с избранными
const favoritesWidget = new FavoritesWidget();

// Заполняем Адресную книгу и выпадающий список в блоке "Перевод средств."
ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

// Добавление пользователя в список избранных
favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(
        false,
        "Контакт успешно добавлен в адресную книгу."
      );
    } else {
      favoritesWidget.setMessage(true, response.data);
    }
  });
};

// Удаление пользователя из адресной книги.
favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(
        false,
        "Контакт успешно удалён из адресной книги."
      );
    } else {
      favoritesWidget.setMessage(true, response.data);
    }
  });
};
