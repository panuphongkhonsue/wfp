const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('categories', {
    id: {
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
    welfare_types_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'welfare_types',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'categories',
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
        name: "fk_categories_welfare_types1_idx",
        using: "BTREE",
        fields: [
          { name: "welfare_types_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};