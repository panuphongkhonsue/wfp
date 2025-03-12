const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('logSubCategory', {
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
    fund_old: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    fund_new: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    per_times_old: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    per_times_new: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    per_years_old: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    per_years_new: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    per_users_old: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    per_users_new: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false
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
    sub_categories_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'sub_categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'log_sub_category',
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
        name: "fk_log_sub_category_sub_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};