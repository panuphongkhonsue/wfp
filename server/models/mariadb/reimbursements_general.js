const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
module.exports = function(sequelize, DataTypes) {
  const reimbursementsGeneral = sequelize.define('reimbursementsGeneral', {
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
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT','WAIT_VERIFY','APPROVED'),
      allowNull: false
    },
    fund_decree: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    fund_university: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    fund_other: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    date_receipt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    draft_date: {
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
    created_by_children: {
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
    categories_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    sub_categories_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'sub_categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_general',
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
        name: "fk_reimbursements_general_users1_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
          { name: "created_by_children" },
        ]
      },
      {
        name: "fk_reimbursements_general_sub_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_general_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "categories_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(reimbursementsGeneral);

  return reimbursementsGeneral;
};
