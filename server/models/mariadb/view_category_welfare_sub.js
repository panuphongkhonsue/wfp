const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('viewCategoryWelfareSub', {
      welfare_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
      },
      welfare_name: {
          type: DataTypes.STRING(255),
          allowNull: false
      },
      category_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      category_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      category_fund: {
          type: DataTypes.DECIMAL(10, 0),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      category_per_times: {
          type: DataTypes.DECIMAL(10, 0),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      category_per_years: {
          type: DataTypes.DECIMAL(10, 0),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      sub_category_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      sub_category_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      sub_category_fund: {
          type: DataTypes.DECIMAL(10, 0),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      sub_category_per_times: {
          type: DataTypes.DECIMAL(10, 0),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
      sub_category_per_years: {
          type: DataTypes.DECIMAL(10, 0),
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp')
      },
  }, {
      sequelize,
      tableName: 'view_category_welfare_sub',
      timestamps: false,
      indexes: [
          {
              name: "PRIMARY",
              unique: true,
              using: "BTREE",
              fields: [
                  { name: "id" },
              ]
          },
      ]
  });
  sequelizePaginate.paginate(model);
  return model;
};