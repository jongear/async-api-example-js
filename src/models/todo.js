const Sequelize = require('sequelize');

class Todo extends Sequelize.Model {
  static get name() {
    return 'Todos';
  }

  static init(sequelize) {
    return super.init(
      {
        text: Sequelize.STRING,
        complete: Sequelize.BOOLEAN
      },
      {
        timestamps: false,
        freezeTableName: true,
        sequelize
      }
    );
  }

  static associate(models) {}
}

module.exports = Todo;
