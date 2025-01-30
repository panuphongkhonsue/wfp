const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelizePaginate = require('sequelize-paginate');
module.exports = function (sequelize, DataTypes) {
  const reimbursementsEmployeeDeceasedHasSubCategories = sequelize.define('reimbursementsEmployeeDeceasedHasSubCategories', {
    reimbursements_employee_deceased_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reimbursements_employee_deceased',
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
    tableName: 'reimbursements_employee_deceased_has_sub_categories',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reimbursements_employee_deceased_id" },
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_employee_deceased_has_sub_categories_sub__idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_employee_deceased_has_sub_categories_reim_idx",
        using: "BTREE",
        fields: [
          { name: "reimbursements_employee_deceased_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(reimbursementsEmployeeDeceasedHasSubCategories);

  return reimbursementsEmployeeDeceasedHasSubCategories;
};
