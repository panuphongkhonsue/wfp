const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('reimbursementsGeneralHasSubCategories', {
    reimbursements_general_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reimbursements_general',
        key: 'id'
      }
    },
    sub_categories_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'sub_categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_general_has_sub_categories',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reimbursements_general_id" },
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_general_has_sub_categories_sub_categories_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_general_has_sub_categories_reimbursements_idx",
        using: "BTREE",
        fields: [
          { name: "reimbursements_general_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};