const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
module.exports = function (sequelize, DataTypes) {
  const reimbursementsEmployeeDeceasedHasCategories = sequelize.define('reimbursementsEmployeeDeceasedHasCategories', {
    reimbursements_employee_deceased_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reimbursements_employee_deceased',
        key: 'id'
      }
    },
    categories_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_employee_deceased_has_categories',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reimbursements_employee_deceased_id" },
          { name: "categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_employee_deceased_has_categories_categori_idx",
        using: "BTREE",
        fields: [
          { name: "categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_employee_deceased_has_categories_reimburs_idx",
        using: "BTREE",
        fields: [
          { name: "reimbursements_employee_deceased_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(reimbursementsEmployeeDeceasedHasCategories);

  return reimbursementsEmployeeDeceasedHasCategories;
};
