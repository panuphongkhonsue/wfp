const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('subCategories', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fund: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    per_times: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    per_years: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    per_users: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    categories_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'sub_categories',
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
      {
        name: "fk_sub_categories_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "categories_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};