// Паттерн гарантує шо класс має тільки один екземпляр об"єкту, шоб уникнути помилок
// При всіх наступних викликах повертає результат першого виклику

class Database {

  constructor(data) {
    if (Database.exists) {
      return Database.instance
    }

    Database.instance = this
    Database.exists = true
    this.data = data
  }

  getData() {
    return this.data
  }
}

const db = new Database('MongoDB')
console.log(mongo.getData())

const mysql = new Database('MySQL')
console.log(mysql.getData())


