const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const model = sequelize.define(
      'viewDashboard',
      {
        welfare_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        reim_number: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        fund_sum_request: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        request_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sub_category_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        created_by_user_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        category_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sub_category_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_by_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        employee_types_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        employee_types_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        tableName: 'view_dashboard',
        timestamps: false,
      }
    );
  
    return model;
  };
  