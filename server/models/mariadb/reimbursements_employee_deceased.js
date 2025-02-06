const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('reimbursementsEmployeeDeceased', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    reim_number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fund_receipt: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_eligible: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_wreath_university: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    fund_wreath_arrange: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    fund_vehicle: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('DRAFT','WAIT_VERIFY','APPROVED'),
      allowNull: false
    },
    organizer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    deceased: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    request_date: {
      type: DataTypes.DATEONLY,
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
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_employee_deceased',
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
        name: "fk_reimbursements_employee_deceased_users1_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};