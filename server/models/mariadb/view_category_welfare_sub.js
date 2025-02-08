const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('viewCategoryWelfareSub', {
    welfare_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    welfare_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_per_times: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    category_per_years: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category_fund: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    sub_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    sub_category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sub_category_per_times: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    sub_category_per_years: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sub_category_fund: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    }
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