const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('reimbursementsChildrenEducationHasChildrenInfomation', {
    reimbursements_children_education_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reimbursements_children_education',
        key: 'id'
      }
    },
    children_infomation_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'children_infomation',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_children_education_has_children_infomation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reimbursements_children_education_id" },
          { name: "children_infomation_id" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_has_children_infomatio_idx",
        using: "BTREE",
        fields: [
          { name: "children_infomation_id" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_has_children_infomatio_idx1",
        using: "BTREE",
        fields: [
          { name: "reimbursements_children_education_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};