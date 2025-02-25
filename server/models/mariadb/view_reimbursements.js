const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('viewReimbursements', {
    welfare_type: {
      type: DataTypes.STRING(33),
      allowNull: true
    },
    reim_number: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ""
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    status: {
      type: DataTypes.STRING(14),
      allowNull: false,
      defaultValue: ""
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sub_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    created_by_user_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sub_category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'view_reimbursements',
    timestamps: false
  });

  sequelizePaginate.paginate(model);
  return model;
};