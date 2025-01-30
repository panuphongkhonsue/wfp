const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
module.exports = function (sequelize, DataTypes) {
  const reimbursementsEmployeeDeceased = sequelize.define('reimbursementsEmployeeDeceased', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    reim_number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fund_receipt: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false
    },
    fund_eligible: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'WAIT_VERIFY', 'APPROVED'),
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
    daft_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approve_date: {
      type: DataTypes.DATE,
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
    },
    created_by_children: {
      type: DataTypes.BIGINT,
      allowNull: false
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
          { name: "created_by_children" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(reimbursementsEmployeeDeceased);

  return reimbursementsEmployeeDeceased;
};
