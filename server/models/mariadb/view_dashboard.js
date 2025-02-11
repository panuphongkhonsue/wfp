const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('viewDashboard', {
    welfare_type: {
      type: DataTypes.STRING(33),
      allowNull: true
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    reim_number: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ""
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false,
      defaultValue: 0
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
    },
    created_by_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    employee_types_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    employee_types_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'view_dashboard',
    timestamps: false
  });
  sequelizePaginate.paginate(model);
  return model;
};