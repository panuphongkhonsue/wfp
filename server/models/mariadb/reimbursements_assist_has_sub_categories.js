const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('reimbursementsAssistHasSubCategories', {
    reimbursements_assist_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reimbursements_assist',
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
    tableName: 'reimbursements_assist_has_sub_categories',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reimbursements_assist_id" },
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_assist_has_sub_categories_sub_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_assist_has_sub_categories_reimbursements__idx",
        using: "BTREE",
        fields: [
          { name: "reimbursements_assist_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};